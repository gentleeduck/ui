## How it works

duck-iam ships server integrations for Express, NestJS, Hono, and Next.js. Every one follows the same pattern: extract the user identity, map the HTTP method to an action, infer the resource from the route, and call `engine.can()`.

Every integration is a thin adapter over `engine.can()`. No runtime framework dependency - duck-iam defines its own minimal type interfaces, so no extra packages sneak in.

***

## Pick a framework

| Framework | Doc | Subpath |
| --- | --- | --- |
| Express | [server/express](/duck-iam/integrations/server/express) | `@gentleduck/iam/server/express` |
| Hono | [server/hono](/duck-iam/integrations/server/hono) | `@gentleduck/iam/server/hono` |
| NestJS | [server/nest](/duck-iam/integrations/server/nest) | `@gentleduck/iam/server/nest` |
| Next.js App Router | [server/next](/duck-iam/integrations/server/next) | `@gentleduck/iam/server/next` |
| Generic helpers | [server/generic](/duck-iam/integrations/server/generic) | `@gentleduck/iam/server/generic` |

All five share the same building blocks: identity extraction, action mapping, resource inference, scope resolution, and decision callbacks. The framework-specific docs cover each one's idioms.

***

## HTTP method mapping

The default method-to-action map shared by every integration:

```typescript
const METHOD_ACTION_MAP = {
  GET: 'read',
  HEAD: 'read',
  OPTIONS: 'read',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'delete',
}
```

Override per-route or globally with the `getAction` option.

***

## Common patterns

### Combine global + per-route protection

Use global middleware for broad protection, then layer per-route guards for endpoints with different rules.

```typescript
// Express example
app.use('/api', accessMiddleware(engine, { getUserId: (req) => req.user?.id }))

// Override for a specific route that needs a different scope
app.delete('/api/admin/users/:id',
  guard(engine, 'manage', 'user', { scope: 'admin' }),
  deleteUserHandler
)
```

### Custom action mapping

Override the default HTTP method mapping for non-standard action patterns.

```typescript
const middleware = accessMiddleware(engine, {
  getUserId: (req) => req.user?.id,
  getAction: (req) => {
    // POST /api/posts/:id/publish -> "publish" action
    if (req.method === 'POST' && req.path.endsWith('/publish')) {
      return 'publish'
    }
    return METHOD_ACTION_MAP[req.method] ?? 'read'
  },
})
```

### Server-driven client permissions

1. Generate a `PermissionMap` on the server using `engine.permissions()` or `getPermissions()` (Next.js helper)
2. Pass the map to the client via props, response body, or server-rendered HTML
3. Hydrate `AccessProvider` (React), plugin (Vue), or `AccessClient` (vanilla) on the client
4. Client-side checks become instant lookups with no extra network requests

```typescript
const permissions = await engine.permissions(userId, [
  { action: 'create', resource: 'post' },
  { action: 'delete', resource: 'post' },
  { action: 'manage', resource: 'team' },
])
```

See [client integrations](/duck-iam/integrations/client) for hydration on the consumer side.

***

## Default failure responses

| Condition | Status | Override |
| --- | --- | --- |
| Missing user identity | 401 | None - fail closed |
| Engine returns deny | 403 | `onDenied` |
| Engine throws | 500 | `onError` |

The engine itself never throws from `authorize()`. It catches internal errors, calls the `onError` engine hook, and returns a deny decision. The server integration try/catch is an extra safety net for adapter connection failures during subject resolution.

***

## FAQ

Why should I override the default resource and action inference?

The defaults are optimized for CRUD-style demos: action comes from the HTTP method map, resource type usually comes
from the path, and resource attributes are empty. Real applications often need custom logic for nested routes,
record attributes, body-driven actions, query parameters, or tenant metadata.

What are the default auth failure responses in the server integrations?

Missing user identity fails closed with <code className="rounded bg-muted px-2 py-1">401</code>. A denied access
check returns <code className="rounded bg-muted px-2 py-1">403</code>. Unexpected integration or adapter errors
default to <code className="rounded bg-muted px-2 py-1">500</code>. Each integration exposes overrides for those handlers.

Can I protect routes in middleware and still do deeper checks later?

Yes. Middleware and route wrappers gate by route shape; handler-level checks enforce owner checks, attribute-based
restrictions, and other resource-instance rules.

When should I use the generic server helpers instead of the framework wrappers?

Use the framework wrappers when their defaults match your routing model. Use
<code className="rounded bg-muted px-2 py-1">server/generic</code> when you want to bind a subject once,
reuse the same environment extraction logic across frameworks, or build your own integration layer without
adopting the wrapper assumptions.

How should I handle routes that use postId, userId, or nested params instead of id?

Treat the built-in guards as coarse route gates only. The simple wrappers assume an
<code className="rounded bg-muted px-2 py-1">id</code> param for automatic resource IDs, so custom param
names are better handled with a custom resource extractor or an explicit
<code className="rounded bg-muted px-2 py-1">engine.can()</code> /
<code className="rounded bg-muted px-2 py-1">engine.check()</code> inside the handler.

Why can middleware know the route and user, but still not be enough for owner checks?

Ownership depends on resource attributes not present in the raw route shape. Middleware can tell you "this is a delete
on post 42," but it cannot know `ownerId`, status, or tenant metadata until your handler loads the actual record.
Record-level checks belong near the data fetch.

Which server integrations are edge-friendly?

The generic helpers and Next request helpers are the most edge-oriented surfaces. Whether the whole stack can run at
the edge still depends on your adapter choice. Memory and HTTP are the easiest fits; database adapters depend on the
runtime support of their ORM and driver stack.