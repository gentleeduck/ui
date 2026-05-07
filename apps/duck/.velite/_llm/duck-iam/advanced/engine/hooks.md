## Hook lifecycle

Hooks let you intercept and observe the evaluation lifecycle. All hooks are optional and can be synchronous or async.

```typescript
interface EngineHooks {
  beforeEvaluate?(request: AccessRequest): AccessRequest | Promise<AccessRequest>
  afterEvaluate?(request: AccessRequest, decision: Decision): void | Promise<void>
  onDeny?(request: AccessRequest, decision: Decision): void | Promise<void>
  onError?(error: Error, request: AccessRequest): void | Promise<void>
}
```

---

## beforeEvaluate

Runs before the evaluation. Receives the request and must return a (possibly modified) request. Use it to enrich the request with computed context.

```typescript
hooks: {
  beforeEvaluate: (request) => {
    return {
      ...request,
      environment: {
        ...request.environment,
        timestamp: Date.now(),
        dayOfWeek: new Date().getDay(),
        hour: new Date().getHours(),
      },
    }
  },
}
```

Common use cases:

- **Server-side timestamps** — clients can't be trusted with time
- **Computed environment** — derive `dayOfWeek`, `hour`, `isWeekend` from `Date.now()`
- **Geo-IP** — look up `country` / `region` from `ip`
- **Feature flags** — pull from a flag service before evaluation
- **Tenant resolution** — translate `subdomain` → `tenantId`

Keep hook work cheap. `beforeEvaluate` runs on every check — slow lookups should be cached or moved to subject resolution.

---

## afterEvaluate

Runs after every evaluation. Use it for logging and auditing:

```typescript
hooks: {
  afterEvaluate: async (request, decision) => {
    await db.insert(accessLog).values({
      subjectId: request.subject.id,
      action: request.action,
      resource: request.resource.type,
      resourceId: request.resource.id,
      allowed: decision.allowed,
      reason: decision.reason,
      duration: decision.duration,
      timestamp: new Date(decision.timestamp),
    })
  },
}
```

Fires for both allow and deny outcomes. For deny-specific logic, use `onDeny` instead.

---

## onDeny

Runs only when a request is denied. Use it for alerting and security monitoring:

```typescript
hooks: {
  onDeny: async (request, decision) => {
    metrics.increment('access.denied', {
      action: request.action,
      resource: request.resource.type,
    })

    // Alert on repeated denials from the same subject
    const recentDenials = await getRecentDenials(request.subject.id)
    if (recentDenials > 10) {
      await alertSecurityTeam(request.subject.id)
    }
  },
}
```

`onDeny` runs **after** `afterEvaluate`. The same `decision` object is passed to both.

---

## onError

Runs when the evaluation throws an error. Use it for error recovery and reporting. When an error occurs, the engine automatically returns a deny decision with the error message as the reason.

```typescript
hooks: {
  onError: (error, request) => {
    sentry.captureException(error, {
      extra: {
        subjectId: request.subject.id,
        action: request.action,
        resource: request.resource.type,
      },
    })
  },
}
```

Triggered on:

- Adapter throws (DB connection failure, missing role, etc.)
- `beforeEvaluate` throws
- Internal evaluation throws (rare, indicates a bug)

`onError` itself should never throw — see "Hook errors" below.

---

## Execution order

For `authorize()` / `can()` / `check()`:

```
beforeEvaluate → evaluate → afterEvaluate → onDeny (if denied) → onError (on exception)
```

For `permissions()` batch checks:

Each individual check in the batch runs through the **full** hook pipeline (`beforeEvaluate`, `afterEvaluate`, `onDeny`). Scoped roles are enriched per-check since each check can have a different scope.

For `explain()` traces:

Only `beforeEvaluate` is applied. `afterEvaluate`, `onDeny`, and `onError` are **not triggered**. Explain is a read-only diagnostic tool.

---

## Hook errors

Keep hooks side-effect-only. In the current implementation, a thrown `beforeEvaluate`, `afterEvaluate`, or `onDeny` hook enters the error path and produces a deny result for that check.

If `onError` itself throws, the surrounding call can reject. So:

- ✅ `try/catch` inside hooks if you don't want errors to affect the decision
- ✅ Use `Promise.resolve().then(() => doThing())` for fire-and-forget async work
- ❌ Don't `throw` from `afterEvaluate` to "abort" a request — use `beforeEvaluate` to modify the request shape instead
- ❌ Don't write blocking I/O in `beforeEvaluate` — every check pays the cost

```typescript
hooks: {
  afterEvaluate: async (request, decision) => {
    // Defensive: never crash the check
    try {
      await db.insert(accessLog).values({ /* ... */ })
    } catch (err) {
      console.error('audit log failed:', err)
    }
  },
}
```

---

## Common patterns

### Server-side time injection

```typescript
beforeEvaluate: (request) => ({
  ...request,
  environment: {
    ...request.environment,
    timestamp: Date.now(),
    dayOfWeek: new Date().getDay(),
    hour: new Date().getHours(),
  },
}),
```

### Audit logging

```typescript
afterEvaluate: async (request, decision) => {
  await auditQueue.publish({
    type: 'access',
    subject: request.subject.id,
    action: request.action,
    resource: request.resource.type,
    allowed: decision.allowed,
    reason: decision.reason,
    timestamp: decision.timestamp,
  })
}
```

### Rate limiting on denies

```typescript
onDeny: async (request, decision) => {
  const denials = await redis.incr(`denials:${request.subject.id}`)
  await redis.expire(`denials:${request.subject.id}`, 60)
  if (denials > 20) {
    await blockUser(request.subject.id)
  }
}
```

### Error monitoring

```typescript
onError: (error, request) => {
  sentry.captureException(error, {
    tags: {
      action: request.action,
      resource: request.resource.type,
    },
    user: { id: request.subject.id },
  })
}
```