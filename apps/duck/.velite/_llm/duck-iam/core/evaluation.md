## The pipeline

When you call `engine.can()` or `engine.authorize()`:

---

## Step by step

### 1. Resolve the subject

Load the user's assigned roles from the adapter, walk inheritance chains for the effective set, then merge any scoped roles that match the request scope.

The result is cached per-subject in the engine LRU until invalidated by role/assignment writes or TTL expiry.

### 2. Convert roles to policy

`rolesToPolicy()` turns every role permission into an ABAC rule with a `subject.roles contains <roleId>` condition. The generated policy uses the `allow-overrides` algorithm.

This conversion is also cached — recomputed only when roles change.

### 3. Collect all policies

Prepend the RBAC-generated policy to the ABAC policies from the adapter:

```
[ __rbac__,  policy_1, policy_2, ..., policy_N ]
```

### 4. Evaluate each policy independently

Each policy:

- Checks targets — if `targets.actions/resources/roles` don't match, skip the policy
- Matches rules against the request's `action` + `resource`
- Evaluates conditions on matching rules
- Applies the combining algorithm to produce one effect (allow / deny / fall back to default)

### 5. AND-combine across policies

Walk policy results in order. **Any deny stops evaluation and denies the request.** All policies must allow.

This is fixed engine behavior — a restrictive policy cannot be overridden by a permissive one.

### 6. Return the decision

The `Decision` object holds:

- `allowed` — boolean for code use
- `effect` — winning `'allow'` or `'deny'`
- `rule` / `policy` — references to whichever rule/policy decided
- `reason` — human-readable explanation
- `duration` — evaluation time in milliseconds
- `timestamp` — when the check happened

In production mode the engine skips Decision construction and returns a plain boolean — see below.

---

## Dev vs production mode

The `mode` option chooses the evaluation path:

```typescript
const engine = new Engine({
  adapter,
  mode: 'production', // or 'development' (default)
})
```

| Mode | Path | Output | Use for |
| --- | --- | --- | --- |
| `'development'` (default) | `evaluate()` | Full `Decision` with timing, rule/policy refs, reason | Local dev, `explain()`, debugging |
| `'production'` | `evaluateFast()` | Plain `boolean` — no allocations | Deployed services |

Production mode uses pre-computed `Map`s for unconditional rules (CASL-style) and a combined action+resource index for conditional rules. Action + resource lookups are O(1) instead of linear.

The `explain()` method works only in development mode — calling it in production throws.

---

## Caching layers

Three caches are layered for speed:

```
[ in-process LRU cache (per engine) ]
      ↓ cache miss
[ adapter (Memory / Prisma / Drizzle / Redis / HTTP) ]
      ↓ persistent storage
[ database / Redis / remote API ]
```

| Cache | Scope | TTL |
| --- | --- | --- |
| `policyCache` | All policies | `cacheTTL` (default 60s) |
| `roleCache` | All roles | `cacheTTL` |
| `rbacPolicyCache` | Result of `rolesToPolicy()` | `cacheTTL` |
| `subjectCache` | Per-subject (`subjectId` → resolved roles + attrs) | `cacheTTL`, max `maxCacheSize` entries |

`engine.admin.*` writes invalidate the relevant caches automatically. Manual invalidation: `engine.invalidatePolicies()`, `engine.invalidateRoles()`, `engine.invalidateSubject(id)`, or `engine.invalidate()` for everything.

In multi-instance deploys, broadcast invalidation messages over Redis pub/sub or a cache-coherence protocol so each node clears its LRU when policies change. Without that, nodes may serve stale decisions for up to `cacheTTL`.

---

## Tracing with explain()

When you need to know **exactly why** a check decided a certain way, swap `engine.can()` for `engine.explain()`:

```typescript
const trace = await engine.explain('user-1', 'update', {
  type: 'post',
  attributes: { ownerId: 'user-1' },
})

console.log(trace.summary)
console.log(trace.policies) // per-policy breakdowns
console.log(trace.rules)    // per-rule match details
```

`explain()` runs the same pipeline but builds a richer trace object instead of a `Decision`. Side-effect hooks (`onDeny`, `afterEvaluate`) don't fire — it's read-only.

See [explain and debug](/docs/duck-iam/advanced/explain) for the full trace API.