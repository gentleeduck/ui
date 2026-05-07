## What is an adapter?

Adapters are duck-iam's storage layer. They implement the `Adapter` interface, which combines three stores:

- **PolicyStore** — CRUD for access policies (rules, conditions, combining algorithms)
- **RoleStore** — CRUD for roles (permissions, inheritance, scopes)
- **SubjectStore** — role assignments, scoped roles, and subject attributes

Every adapter is fully typed against your app's action, resource, role, and scope unions.

```typescript
import { Engine } from '@gentleduck/iam'

const engine = new Engine({
  adapter: yourAdapter,
  defaultEffect: 'deny',
  cacheTTL: 60,
})
```

---

## Built-in adapters

| Adapter | Use case | Persistence | Peer dep |
| --- | --- | --- | --- |
| [**Memory**](/docs/duck-iam/integrations/adapters/memory) | Dev, testing, prototyping | None (in-process) | None |
| [**Prisma**](/docs/duck-iam/integrations/adapters/prisma) | Production w/ Prisma | Any Prisma-supported DB | `@prisma/client` |
| [**Drizzle**](/docs/duck-iam/integrations/adapters/drizzle) | Production w/ Drizzle | PG, MySQL, SQLite | `drizzle-orm` |
| [**Redis**](/docs/duck-iam/integrations/adapters/redis) | Distributed deploys | Redis-compatible KV | `ioredis` or `redis` |
| [**HTTP**](/docs/duck-iam/integrations/adapters/http) | Microservices split | Remote API | None (uses `fetch`) |
| [**Custom**](/docs/duck-iam/integrations/adapters/custom) | Any other backend | Your choice | Your choice |

All adapters are interchangeable. Start with `MemoryAdapter` during development and switch to a database adapter in production without changing engine, builder, or middleware code.

---

## How adapters fit in

```typescript
import { Engine } from '@gentleduck/iam'
import { MemoryAdapter } from '@gentleduck/iam/adapters/memory'

// 1. Pick a storage backend
const adapter = new MemoryAdapter({ /* seed */ })

// 2. Wrap it in an engine
const engine = new Engine({ adapter, defaultEffect: 'deny' })

// 3. Use the engine — same API regardless of adapter
const allowed = await engine.can('user-1', 'read', { type: 'post', attributes: {} })
```

The engine reads from the adapter on cache miss, then caches policies, roles, and resolved subjects in an LRU with the configured `cacheTTL`. Adapter writes via `engine.admin.*` automatically invalidate the relevant caches.

See [Comparison & FAQ](/docs/duck-iam/integrations/adapters/comparison) for selection guidance and answers to common adapter questions.