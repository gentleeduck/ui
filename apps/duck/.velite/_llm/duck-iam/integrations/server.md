## Overview

duck-iam ships server integrations for Express, NestJS, Hono, and Next.js. Each one
follows the same pattern: extract the user identity, map the HTTP method to an
action, infer the resource from the route, and call `engine.can()`.

Every integration is a thin adapter over `engine.can()`. No runtime framework
dependency — duck-iam defines its own minimal type interfaces, so no extra packages
sneak in.

### HTTP method mapping

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

## Generic helpers

```typescript

  METHOD_ACTION_MAP,
  createSubjectCan,
  extractEnvironment,
  generatePermissionMap,
} from '@gentleduck/iam/server/generic'
```

Use the generic helpers when the framework wrappers are too opinionated, or when you
want the same access-control logic across multiple runtimes.

- `generatePermissionMap(engine, subjectId, checks, environment?)` wraps
  `engine.permissions()` for server-to-client hydration.
- `createSubjectCan(engine, subjectId, environment?)` returns a subject-bound
  `can(action, resource, resourceId?, scope?)` for handlers, jobs, and service
  objects.
- `extractEnvironment(req)` builds the default `{ ip, userAgent, timestamp }` from
  common request shapes.
- `METHOD_ACTION_MAP` is the same CRUD map every built-in integration uses.

```typescript
const can = createSubjectCan(engine, userId, extractEnvironment(req))

if (await can('delete', 'post', req.params.postId)) {
  await deletePost(req.params.postId)
}

const permissions = await generatePermissionMap(engine, userId, [
  { action: 'create', resource: 'post' },
  { action: 'manage', resource: 'team', scope: 'org-1' },
])
```

---

## Express

```

```

### Global middleware

Apply access control to every route under a path prefix.

```typescript

const middleware = accessMiddleware(engine, {
  // Extract user ID from your auth layer (passport, jwt, etc.)
  getUserId: (req) => req.user?.id,

  // Map HTTP method to action (defaults to METHOD_ACTION_MAP)
  getAction: (req) => METHOD_ACTION_MAP[req.method],

  // Infer resource from the URL path
  getResource: (req) => {
    const parts = req.path.split('/').filter(Boolean)
    return { type: parts[0] ?? 'root', id: parts[1], attributes: {} }
  },

  // Optional: extract scope from headers or query
  getScope: (req) => req.headers['x-org-id'] as string | undefined,

  // Optional: extract environment context (IP, user agent, timestamp)
  getEnvironment: (req) => ({
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: Date.now(),
  }),

  // Custom denial response
  onDenied: (req, res) => res.status(403).json({ error: 'Forbidden' }),

  // Custom error handler
  onError: (err, req, res) => res.status(500).json({ error: 'Internal server error' }),
})

app.use('/api', middleware)
```

### Per-route guard

Use `guard` on individual routes when the action and resource are known at definition time.

```typescript

// Basic guard -- action and resource are fixed
app.delete('/posts/:id', guard(engine, 'delete', 'post'), (req, res) => {
  // Only reached if engine.can() returns true
  res.json({ deleted: true })
})

// Scoped guard -- restrict to a specific scope
app.post('/admin/users', guard(engine, 'manage', 'user', { scope: 'admin' }), (req, res) => {
  res.json({ created: true })
})

// With custom environment
app.patch('/posts/:id', guard(engine, 'update', 'post', {
  getEnvironment: (req) => ({ ip: req.ip, timestamp: Date.now() }),
}), handler)

// Custom user ID extraction
app.get('/reports', guard(engine, 'read', 'report', {
  getUserId: (req) => req.headers['x-api-key'] as string,
}), handler)
```

The `guard` function catches errors and passes them to Express's `next(err)`, so they
reach your error-handling middleware. The `accessMiddleware` catches errors and calls
the `onError` option.

The Express `guard()` helper reads the resource instance ID from `req.params.id`. If your
route uses a different param name such as `:postId`, either use `accessMiddleware()` with a
custom `getResource`, or run `engine.can()` / `engine.check()` yourself inside the handler
once you have the real resource ID and attributes.

### Admin router

Mount a pre-built admin API for managing policies, roles, and assignments.

```typescript

const createRouter = adminRouter(engine)
app.use('/api/access-admin', createRouter(() => express.Router()))
```

  The built-in delete route revokes by `subjectId` + `roleId` only. If you store both global and
  scoped assignments for the same role and you need to revoke only one scoped assignment, expose a
  custom route that calls `engine.admin.revokeRole(subjectId, roleId, scope)` explicitly.

This exposes:

| Method | Path | Description |
| --- | --- | --- |
| GET | /policies | List all policies |
| GET | /roles | List all roles |
| PUT | /policies | Create or update a policy |
| PUT | /roles | Create or update a role |
| POST | /subjects/:id/roles | Assign a role to a subject |
| DELETE | /subjects/:id/roles/:roleId | Revoke a role from a subject |

### Options reference

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `getUserId` | `(req) -> string or null` | `req.user?.id` | Extract the subject ID from the request |
| `getAction` | `(req) -> string` | HTTP method map | Map the request to an action |
| `getResource` | `(req) -> Resource` | Infer from URL path | Map the request to a resource |
| `getEnvironment` | `(req) -> Environment` | IP + user agent + timestamp | Extract environment context |
| `getScope` | `(req) -> string or undefined` | `undefined` | Extract scope (e.g. org ID, team ID) |
| `onDenied` | `(req, res) -> void` | 403 JSON | Custom denial response |
| `onError` | `(err, req, res, next) -> void` | 500 JSON | Custom error handler |

---

## NestJS

```

```

### Guard factory

Create a NestJS-compatible guard function. It reads metadata from the `@Authorize` decorator on each handler.

```typescript

const canAccess = nestAccessGuard(engine, {
  getUserId: (req) => req.user?.id ?? req.user?.sub,
  getScope: (req) => req.headers['x-org-id'] as string | undefined,
  getResourceId: (req) => req.params?.id,
  onError: (err, req) => false,
})

// Register as a global guard in your module:
// APP_GUARD -> { provide: APP_GUARD, useValue: { canActivate: canAccess } }
```

Handlers without an `@Authorize` decorator are allowed by default. The guard only activates when metadata is present.

### The Authorize decorator

Annotate controller methods with their required permissions.

```typescript

@Controller('posts')
export class PostsController {
  @Delete(':id')
  @Authorize({ action: 'delete', resource: 'post' })
  async deletePost(@Param('id') id: string) {
    return this.postsService.delete(id)
  }

  @Post()
  @Authorize({ action: 'create', resource: 'post' })
  async createPost(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto)
  }

  // Infer action from HTTP method, resource from route path
  @Get()
  @Authorize({ infer: true })
  async listPosts() {
    return this.postsService.list()
  }
}
```

### Scoped authorization

Attach a scope to restrict access to a specific context.

```typescript
@Authorize({ action: 'manage', resource: 'billing', scope: 'admin' })
async updateBilling() { ... }
```

If no scope is set on the decorator, the guard falls back to the `getScope` option from the guard factory.

### Type-safe decorator

`createTypedAuthorize` constrains the decorator to your application's exact action, resource, and scope types. Typos become compile-time errors.

```typescript

type Action = 'create' | 'read' | 'update' | 'delete' | 'manage'
type Resource = 'post' | 'user' | 'billing' | 'report'
type Scope = 'admin' | 'member'

const Auth = createTypedAuthorize}
      {canDelete && }

  )
}
```

### Permission map generation

Generate a `PermissionMap` on the server and pass it to the client.

```typescript

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const userId = session?.user?.id

  const permissions = userId
    ? await getPermissions(engine, userId, [
        { action: 'create', resource: 'post' },
        { action: 'delete', resource: 'post' },
        { action: 'manage', resource: 'team' },
        { action: 'read', resource: 'analytics' },
      ])
    : {}

  return (

          {children}

  )
}
```

### Edge middleware

Protect routes at the edge before they reach application code.

```typescript
// middleware.ts

const checkAccess = createNextMiddleware(engine, {
  getUserId: async (req) => {
    // Extract user ID from cookie/token at the edge
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    return token ? decodeUserId(token) : null
  },
  rules: [
    { pattern: '/api/admin', resource: 'admin', action: 'manage' },
    { pattern: '/api/posts', resource: 'post' },  // action inferred from HTTP method
    { pattern: /^\/api\/billing/, resource: 'billing', scope: 'admin' },
  ],
})

export async function middleware(req: Request) {
  const denied = await checkAccess(req)
  if (denied) return denied  // 401 or 403 Response
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
```

When no rule matches a request path, the middleware returns `null` and the request passes through.

### Options reference

**withAccess options:**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `getUserId` | `(req) -> string or null or Promise` | `x-user-id` header | Extract the subject ID |
| `getEnvironment` | `(req) -> Environment` | IP + user agent + timestamp | Extract environment context |
| `scope` | `string` | `undefined` | Fixed scope for this handler |
| `onError` | `(err, req) -> Response` | 500 JSON | Custom error handler |

**createNextMiddleware options:**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `rules` | `Array` | -- | Route rules (see below). Required. |
| `getUserId` | `(req) -> string or null or Promise` | -- | Extract the subject ID. Required. |
| `onError` | `(err, req) -> Response` | 500 JSON | Custom error handler |

**Rule format (each entry in `rules`):**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `pattern` | `string or RegExp` | yes | String prefix match or regex pattern |
| `resource` | `string` | yes | Resource type for matched routes |
| `action` | `string` | no | Fixed action (defaults to HTTP method map) |
| `scope` | `string` | no | Required scope for matched routes |

---

## Common patterns

### Combining global and per-route protection

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

### Error handling

All server integrations wrap `engine.can()` in try/catch. If the engine throws (adapter
failure, misconfigured policy, etc.), the default behavior is:

- **Express middleware**: calls `onError(err, req, res, next)`, defaults to 500 JSON.
- **Express guard**: passes the error to `next(err)` for Express error middleware.
- **Hono**: returns `onError(err, c)`, defaults to 500 JSON.
- **NestJS**: calls `onError(err, req)`, defaults to returning `false` (deny).
- **Next.js**: returns `onError(err, req)`, defaults to 500 JSON.

The engine itself never throws from `authorize()`. It catches internal errors, calls the
`onError` hook, and returns a deny decision. The server integration try/catch is an extra
safety net for edge cases like adapter connection failures during subject resolution.

### Server-driven client permissions

1. Generate a `PermissionMap` on the server using `getPermissions` or `engine.permissions()`
2. Pass the map to the client via props, response body, or server-rendered HTML
3. Hydrate an `AccessProvider` (React), plugin (Vue), or `AccessClient` (vanilla) on the client
4. Client-side checks are instant lookups with no additional network requests

```typescript
// Server: generate the permission map
const checks = [
  { action: 'create', resource: 'post' },
  { action: 'delete', resource: 'post' },
  { action: 'manage', resource: 'team' },
] as const

const permissions = await engine.permissions(userId, checks)

// Client: hydrate and use
// See the client libraries documentation for framework-specific setup
```

---

## Server Integration FAQ

  
    Why should I override the default resource and action inference?
    
      The defaults are optimized for CRUD-style demos: action comes from the HTTP method map, resource type usually comes
      from the path, and resource attributes are empty. Real applications often need custom logic for nested routes,
      record attributes, body-driven actions, query parameters, or tenant metadata.
    
  

  
    What are the default auth failure responses in the server integrations?
    
      Missing user identity fails closed with <code className="rounded bg-muted px-2 py-1">401</code>. A denied access
      check returns <code className="rounded bg-muted px-2 py-1">403</code>. Unexpected integration or adapter errors
      default to <code className="rounded bg-muted px-2 py-1">500</code>. Each integration exposes overrides for those handlers.
    
  

  
    Does the Express admin router secure itself?
    
      No. It is an admin surface for policy, role, and assignment management, but it does not automatically wrap itself in
      authorization. Mount it behind your own admin-only authentication and authorization controls.
    
  

  
    Does the NestJS integration require reflect-metadata?
    
      It uses reflect metadata when available and also stores metadata directly on the handler as a fallback. In a normal
      Nest application you should still load <code className="rounded bg-muted px-2 py-1">reflect-metadata</code>, but the
      integration is written defensively so the decorator metadata is not tied to a single mechanism.
    
  

  
    What is the difference between withAccess() and createNextMiddleware()?
    
      <code className="rounded bg-muted px-2 py-1">withAccess()</code> wraps an App Router route handler and can work with
      route params such as <code className="rounded bg-muted px-2 py-1">params.id</code>. <code className="rounded bg-muted px-2 py-1">createNextMiddleware()</code>
      is route-level filtering based on path rules, resource type, and scope. It is not a substitute for record-level checks.
    
  

  
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
    
  

  
    Do string patterns in createNextMiddleware() behave like globs?
    
      No. String patterns use simple prefix matching. For stricter matching, optional segments, or glob-like behavior,
      use a <code className="rounded bg-muted px-2 py-1">RegExp</code> instead.
    
  

  
    Which server integrations are edge-friendly?
    
      The generic helpers and Next request helpers are the most edge-oriented surfaces. Whether the whole stack can run at
      the edge still depends on your adapter choice. Memory and HTTP are the easiest fits; database adapters depend on the
      runtime support of their ORM and driver stack.