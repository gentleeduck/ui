## Install

```typescript
import {
  withAccess,
  checkAccess,
  getPermissions,
  createNextMiddleware,
} from '@gentleduck/iam/server/next'
```

Covers four protection layers in Next.js App Router: route handler wrappers, Server Component / Server Action checks, permission map generation for client hydration, and edge middleware.

***

## Route handler wrapper

Wrap App Router route handlers (GET, POST, DELETE, etc.).

```typescript
import { withAccess } from '@gentleduck/iam/server/next'
import { engine } from '@/lib/engine'
import { auth } from '@/lib/auth'

async function handler(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  await deletePost(id)
  return Response.json({ deleted: true })
}

export const DELETE = withAccess(engine, 'delete', 'post', handler, {
  getUserId: async (req) => {
    const session = await auth()
    return session?.user?.id ?? null
  },
})
```

The wrapper automatically reads `params.id` as the resource instance ID. `params` may be a Promise (Next.js 15+) or an object.

`withAccess()` only auto-binds `params.id`. If your route uses `params.postId` or another
name, keep the wrapper for coarse route gating and run a deeper `engine.can()` /
`engine.check()` inside the handler once you have the real instance identifier.

***

## Server component checks

Check a permission inside a React Server Component or Server Action:

```typescript
import { checkAccess } from '@gentleduck/iam/server/next'
import { engine } from '@/lib/engine'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const canDelete = await checkAccess(engine, userId, 'delete', 'post', id)
  const canEdit = await checkAccess(engine, userId, 'update', 'post', id)

  return (
    <article>
      <h1>Post {id}</h1>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </article>
  )
}
```

`checkAccess` is a thin wrapper around `engine.can()` with positional args matching common Next.js patterns (subjectId, action, resourceType, resourceId?, scope?).

***

## Permission map generation

Generate a `PermissionMap` on the server and pass it to the client for hydration:

```typescript
import { getPermissions } from '@gentleduck/iam/server/next'
import { engine } from '@/lib/engine'
import { AccessProvider } from '@/lib/access-client'

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
    <html>
      <body>
        <AccessProvider permissions={permissions}>{children}</AccessProvider>
      </body>
    </html>
  )
}
```

See [client/react](/docs/duck-iam/integrations/client/react) for the consuming side.

***

## Edge middleware

Protect routes at the edge before they reach application code:

```typescript
// middleware.ts
import { createNextMiddleware } from '@gentleduck/iam/server/next'
import { engine } from '@/lib/engine'
import { NextResponse } from 'next/server'

const checkAccess = createNextMiddleware(engine, {
  getUserId: async (req) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    return token ? decodeUserId(token) : null
  },
  rules: [
    { pattern: '/api/admin', resource: 'admin', action: 'manage' },
    { pattern: '/api/posts', resource: 'post' }, // action inferred from HTTP method
    { pattern: /^\/api\/billing/, resource: 'billing', scope: 'admin' },
  ],
})

export async function middleware(req: Request) {
  const denied = await checkAccess(req)
  if (denied) return denied // 401 or 403 Response
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
```

When no rule matches a request path, the middleware returns `null` and the request passes through.

### Rule patterns

* **String pattern** — simple prefix match (`/api/posts` matches `/api/posts`, `/api/posts/42`, `/api/posts/foo/bar`)
* **RegExp pattern** — full regex test against `pathname` (use for stricter matching, optional segments, glob-like behavior)

***

## Comparing the four entry points

| Helper | Where it runs | Granularity |
| --- | --- | --- |
| `createNextMiddleware` | Edge (before handler) | Route-shape gating |
| `withAccess` | Server (route handler) | Route-shape + resource ID |
| `checkAccess` | Server (RSC, Server Action) | Single check, full control |
| `getPermissions` | Server (Layout, RSC) | Batch generation for hydration |

`createNextMiddleware()` is the cheapest — it runs at the edge and never touches the database adapter unless you wire one in. `withAccess()` runs in the function context with full subject resolution. `checkAccess()` and `getPermissions()` are explicit calls inside server logic.

***

## Options reference

### `withAccess` options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `getUserId` | `(req) -> string or null or Promise` | `x-user-id` header | Extract the subject ID |
| `getEnvironment` | `(req) -> Environment` | IP + user agent + timestamp | Extract environment context |
| `scope` | `string` | `undefined` | Fixed scope for this handler |
| `onError` | `(err, req) -> Response` | 500 JSON | Custom error handler |

### `createNextMiddleware` options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `rules` | `Array<Rule>` | -- | Route rules. Required. |
| `getUserId` | `(req) -> string or null or Promise` | -- | Extract the subject ID. Required. |
| `onError` | `(err, req) -> Response` | 500 JSON | Custom error handler |

### Rule format

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `pattern` | `string or RegExp` | yes | String prefix match or regex pattern |
| `resource` | `string` | yes | Resource type for matched routes |
| `action` | `string` | no | Fixed action (defaults to HTTP method map) |
| `scope` | `string` | no | Required scope for matched routes |