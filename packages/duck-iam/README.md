# @gentleduck/iam

Type-safe authorization engine for TypeScript. RBAC + ABAC with a policy engine, condition evaluation, scoped roles, and integrations for Express, NestJS, Hono, Next.js, React, Vue, and vanilla JS.

Zero runtime dependencies. Tree-shakeable. 23 KB full, under 1 KB per module.

## Install

```bash
npm install @gentleduck/iam
# or
bun add @gentleduck/iam
```

## Quick start

```typescript
import { createAccessConfig } from '@gentleduck/iam'
import { MemoryAdapter } from '@gentleduck/iam/adapters/memory'

const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete'] as const,
  resources: ['post', 'comment', 'user'] as const,
  roles: ['viewer', 'editor', 'admin'] as const,
})

const viewer = access.defineRole('viewer').grant('read', 'post').grant('read', 'comment').build()
const editor = access.defineRole('editor').inherits('viewer').grant('update', 'post').build()
const admin = access.defineRole('admin').inherits('editor').grantCRUD('post').grantCRUD('comment').build()

const policy = access
  .policy('blog')
  .rule('owner-edit', (r) => r.allow().on('update').of('post').when((w) => w.isOwner()))
  .build()

const adapter = new MemoryAdapter({
  policies: [policy],
  roles: [viewer, editor, admin],
  assignments: { 'user-1': ['editor'] },
})

const engine = access.createEngine({ adapter })
const allowed = await engine.can('user-1', 'read', { type: 'post', attributes: {} })
// true
```

## Performance

Benchmarked against 7 JS authorization libraries using vitest bench. Simple RBAC check, ops/sec (higher is better):

| Library | ops/sec | vs CASL |
|---------|---------|---------|
| @casl/ability | 16,857,000 | baseline |
| **@gentleduck/iam** [PROD] | 8,233,000 | 2x slower |
| easy-rbac | 5,003,000 | 3.4x slower |
| @rbac/rbac | 2,884,000 | 5.8x slower |
| accesscontrol | 674,000 | 25x slower |
| casbin | 143,000 | 118x slower |
| role-acl | 140,000 | 120x slower |

CASL is faster on raw lookups because it pre-compiles rules into a hash table at build time. duck-iam supports dynamic policies that can change at runtime, which costs an extra Map lookup per check.

For the smallest bundle, import only the evaluator:

```typescript
import { evaluatePolicyFast } from '@gentleduck/iam'
const allowed = evaluatePolicyFast(policy, request) // boolean
```

## Features

- **RBAC + ABAC** combined in one engine
- **Policy engine** with 4 intra-policy algorithms (deny-overrides, allow-overrides, first-match, highest-priority) and 3 cross-policy combine modes (and / allow-overrides / first-applicable)
- **18 condition operators** (eq, neq, gt, lt, in, contains, starts_with, matches, exists, subset_of, and more)
- **Scoped roles** for multi-tenant systems
- **Dev/prod mode**: rich Decision objects in development, plain booleans in production
- **Explain API**: full evaluation trace showing exactly why a permission was granted or denied
- **Lifecycle hooks**: `beforeEvaluate`, `afterEvaluate`, `onDeny`, `onError`, `onPolicyError`, `onMetrics`
- **Type-safe config**: actions, resources, roles, and scopes are validated at compile time

### SRE primitives

- **`engine.preload()`** - warm cache at boot
- **`engine.healthCheck()`** - `/healthz`-ready probe with adapter latency + cache hit rate
- **`engine.stats()` / `resetStats()`** - cache hit / miss counters per cache
- **`engine.admin.export()` / `import(snapshot, { mode })`** - schema-versioned policy + role snapshots for env promotion
- **`engine.dispose()`** - release the cross-instance invalidator subscription on shutdown
- **`IConfig.adapterTimeoutMs`** - `AbortController`-driven timeout on every adapter read (default 5 s)
- **`IConfig.maxPolicies` / `maxRoles`** - load-time caps that fail closed
- **`IConfig.allowFailOpen`** - explicit opt-in required to combine `mode: 'production'` with `defaultEffect: 'allow'`
- **`IConfig.invalidator`** - cross-instance cache-invalidation broadcaster
- **`createRedisInvalidator`** at `@gentleduck/iam/invalidators/redis` - pub/sub helper with self-echo filter
- **`createMetricsAggregator`** at `@gentleduck/iam/observability/metrics` - p50 / p95 / p99 over `onMetrics` events
- **HttpAdapter retry + per-request timeout + circuit breaker** (retries, backoff, threshold, cooldown)
- **Required `authorize` callback** on every admin router (Express, Hono, Next, Nest)

## Integrations

### Server middleware

```typescript
// Express
import { guard, adminRouter } from '@gentleduck/iam/server/express'
app.delete('/posts/:id', guard(engine, 'delete', 'post'), handler)
app.use('/admin', adminRouter(engine, { authorize: (req) => isAdmin(req) })(() => express.Router()))

// Hono
import { guard, bindAdminRouter } from '@gentleduck/iam/server/hono'
app.delete('/posts/:id', guard(engine, 'delete', 'post'), handler)
bindAdminRouter(adminApp, engine, { authorize: (c) => isAdmin(c) })

// NestJS
import { nestAccessGuard, Authorize, createAdminOperations } from '@gentleduck/iam/server/nest'
@Authorize({ action: 'delete', resource: 'post' })

// Next.js
import { withAccess, createAdminHandlers } from '@gentleduck/iam/server/next'
export const DELETE = withAccess(engine, 'delete', 'post', handler)
```

### Client libraries

```typescript
// React
import { createAccessControl } from '@gentleduck/iam/client/react'
const { AccessProvider, useAccess, Can, Cannot } = createAccessControl(React)

// Vue
import { createVueAccess } from '@gentleduck/iam/client/vue'
const { useAccess, Can, Cannot } = createVueAccess(vue)

// Vanilla JS
import { AccessClient } from '@gentleduck/iam/client/vanilla'
const client = await AccessClient.fromServer('/api/permissions')
client.can('read', 'post') // boolean
```

### Database adapters

```typescript
import { MemoryAdapter } from '@gentleduck/iam/adapters/memory'
import { FileAdapter } from '@gentleduck/iam/adapters/file'
import { PrismaAdapter } from '@gentleduck/iam/adapters/prisma'
import { DrizzleAdapter } from '@gentleduck/iam/adapters/drizzle'
import { RedisAdapter } from '@gentleduck/iam/adapters/redis'
import { HttpAdapter } from '@gentleduck/iam/adapters/http'
```

### Operability

```typescript
import { createRedisInvalidator } from '@gentleduck/iam/invalidators/redis'
import { createMetricsAggregator } from '@gentleduck/iam/observability/metrics'

const metrics = createMetricsAggregator()
const engine = new Engine({
  adapter,
  invalidator: createRedisInvalidator({ client: redis }),
  hooks: { onMetrics: metrics.record },
})

await engine.preload()
app.get('/healthz', async (_, res) => res.json(await engine.healthCheck()))
app.get('/metrics', (_, res) => res.json(metrics.snapshot()))
```

See the [production deployment guide](https://iam.gentleduck.org/duck-iam/guides/production) for cache TTL trade-offs, multi-node invalidation patterns, fail-closed defaults, and SLO targets.

## Module sizes (gzipped)

| Module | Size |
|--------|------|
| Core (full) | 23.3 KB |
| Each adapter | 0.9 - 1.7 KB |
| Each server middleware | 0.8 - 1.3 KB |
| Each client library | 1.0 - 1.4 KB |

## Documentation

Full docs, course, and API reference: [duck-iam docs](https://iam.gentleduck.org)

## License

MIT
