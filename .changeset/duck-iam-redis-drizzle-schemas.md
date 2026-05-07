---
"@gentleduck/iam": minor
---

Add Redis adapter, Drizzle schemas, and full integration test coverage.

**New: `RedisAdapter`** at `@gentleduck/iam/adapters/redis`. Distributed key/value backend with idempotent `assignRole` (set semantics), multi-tenant `keyPrefix`, and a minimal `RedisLike` interface that ioredis, node-redis v4+, and Upstash all satisfy directly.

**New: pre-built Drizzle schemas** at `@gentleduck/iam/adapters/drizzle/schema/{pg,mysql,sqlite}`. Drop-in tables for all three SQL dialects with the right column types, FK cascade on `roleId`, unique index on `(subjectId, roleId, scope)`, and auto-managed `created_at`/`updated_at`. Generate migrations via `drizzle-kit generate`.

**Test coverage expansion**: every adapter, server middleware, and client integration now has dedicated tests. Total test count went from 309 to 498. New test files:

- `adapters/prisma`, `adapters/drizzle`, `adapters/http`, `adapters/redis`
- `server/express`, `server/hono`, `server/nest`, `server/next`
- `client/react`, `client/vue`

**Optional peer deps added**: `drizzle-orm`, `ioredis`, `redis` (all optional).
