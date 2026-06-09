## Install

```ts
import {
  METHOD_ACTION_MAP,
  createSubjectCan,
  defaultCsrfCheck,
  extractEnvironment,
  generatePermissionMap,
} from '@gentleduck/iam/server/generic'
```

Use the generic helpers when the framework wrappers are too opinionated, or when you want the same access-control logic across multiple runtimes.

***

## API

| Helper | Signature | Purpose |
| --- | --- | --- |
| `generatePermissionMap` | `(engine, subjectId, checks, environment?)` | Wraps `engine.permissions()` for server-to-client hydration |
| `createSubjectCan` | `(engine, subjectId, environment?)` | Returns a subject-bound `can(action, resource, resourceId?, scope?)` |
| `extractEnvironment` | `(req)` | Builds the default `{ ip, userAgent, timestamp }` from common request shapes |
| `defaultCsrfCheck` | `(req) -> boolean` | Built-in `Sec-Fetch-Site` predicate the admin routers use by default (SEC-103) |
| `METHOD_ACTION_MAP` | `Record<string, string>` | Read-only CRUD map (GET -> read, POST -> create, etc.) used by every built-in integration |

***

## Bind a subject

`createSubjectCan` is the workhorse - bind a user once, then run multiple checks without repeating the subject ID:

```typescript
import { createSubjectCan, extractEnvironment } from '@gentleduck/iam/server/generic'

const can = createSubjectCan(engine, userId, extractEnvironment(req))

if (await can('delete', 'post', req.params.postId)) {
  await deletePost(req.params.postId)
}

if (await can('read', 'analytics', undefined, 'org-1')) {
  return renderAnalytics()
}
```

Useful for handlers, background jobs, service objects, and tests.

***

## Generate permission maps

`generatePermissionMap` is a thin wrapper over `engine.permissions()` that fits server-to-client hydration patterns:

```typescript
const permissions = await generatePermissionMap(engine, userId, [
  { action: 'create', resource: 'post' },
  { action: 'manage', resource: 'team', scope: 'org-1' },
])

// Pass to client
return new Response(JSON.stringify({ permissions }), {
  headers: { 'content-type': 'application/json' },
})
```

The result is a `Record<string, boolean>` keyed by `${scope}:${action}:${resource}` (scope omitted when undefined). Hydrate it with the [client libraries](/duck-iam/integrations/client).

***

## Default environment

`extractEnvironment` reads common headers from any request shape with `headers` (object or `Headers`) and an optional `ip`:

```ts
const env = extractEnvironment(req)
// -> { ip, userAgent, timestamp }
```

* `ip` from `req.ip`, `x-forwarded-for`, or `x-real-ip` (in that order)
* `userAgent` from `user-agent` header
* `timestamp` is `Date.now()`

Override anywhere a `getEnvironment` option is exposed by passing your own extractor.

***

## Default CSRF predicate

`defaultCsrfCheck` is the `Sec-Fetch-Site` predicate every admin router uses
by default (SEC-103 / CAVEAT-2). It handles all four request shapes
(Express/Nest record headers, fetch-API `Headers.get`, Hono `c.req.header`).
Returns `true` when the request is allowed, `false` when it must be rejected.

```ts
import { defaultCsrfCheck } from '@gentleduck/iam/server/generic'

// Compose with your own check - accept default behaviour AND require Origin.
const allow = new Set(['https://admin.example.com'])
const csrfCheck = (req: Request) =>
  defaultCsrfCheck(req) && allow.has(req.headers.get('origin') ?? '')
```

`Sec-Fetch-Site` is populated by every modern browser; non-browser callers
(curl, server-to-server) omit it and pass - they must be gated by bearer /
mTLS auth at a layer the admin router can trust.

***

## When to use

* Multiple runtimes share auth logic (Edge + Node + Worker)
* Building a custom framework integration not covered by the four built-in wrappers
* Background jobs / queue consumers that need permission checks
* Tests where you want a quick `can()` without setting up middleware