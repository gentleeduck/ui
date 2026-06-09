## Quick comparison

| Adapter | Use case | Persistence | Peer dep | Idempotent assign | Native scoped roles |
| --- | --- | --- | --- | --- | --- |
| [Memory](/duck-iam/integrations/adapters/memory) | Dev, testing | None | None | yes (in-memory check) | yes |
| [File](/duck-iam/integrations/adapters/file) | CLIs, dev fixtures, single-process | JSON on disk | `node:fs/promises` (pluggable) | yes (in-memory check) | yes |
| [Prisma](/duck-iam/integrations/adapters/prisma) | Prisma apps | Any DB | `@prisma/client` | **no** (throws on dup) | yes |
| [Drizzle](/duck-iam/integrations/adapters/drizzle) | Drizzle apps | PG/MySQL/SQLite | `drizzle-orm` | yes (`onConflictDoNothing`) | yes |
| [Redis](/duck-iam/integrations/adapters/redis) | Distributed deploys | Redis | `ioredis` or `redis` | yes (set semantics) | yes |
| [HTTP](/duck-iam/integrations/adapters/http) | Microservice split | Remote API | None | depends on backend | yes |

All adapters are interchangeable. Engine, builder, and middleware code stays the same - migration is data movement only.

***

## Decision tree

```
Are you in production?
|
+- No
|  +- Need persistence between runs? -> IamFileAdapter
|  +- Otherwise                      -> IamMemoryAdapter
|
+- Yes
   |
   +- CLI / single-process daemon? -> IamFileAdapter
   +- Already use Prisma?           -> IamPrismaAdapter
   +- Already use Drizzle?          -> IamDrizzleAdapter
   +- Need distributed cache + multi-instance? -> IamRedisAdapter
   +- Splitting auth across services? -> IamHttpAdapter (consume centrally)
   +- Custom backend?               -> Implement IamAdapter.IAdapter (see "Custom" doc)
```

***

## FAQ

What does an adapter actually do in duck-iam?

An adapter is the persistence layer. It loads and stores policies, roles, role assignments, scoped assignments,
and subject attributes. The engine owns evaluation, policy combination, explain traces, and decision logic.

Does IamMemoryAdapter persist anything?

No. It stores everything in process memory. Restarting the process resets policies, roles, assignments, and
attributes, which is why it is best for tests, demos, and local development.

Can I seed scoped assignments in IamMemoryAdapter constructor input?

Not directly. Constructor assignment seeding is unscoped. For scoped assignments, create the adapter first and then
call <code className="rounded bg-muted px-2 py-1">assignRole(subjectId, roleId, scope)</code>.

Can I use my existing database instead of a dedicated auth database?

Yes. duck-iam only needs four storage areas for policies, roles, assignments, and subject attributes. Those can live
alongside the rest of your application schema.

How do IamPrismaAdapter and IamDrizzleAdapter differ in practice?

Prisma expects named models and lets Prisma handle JSON columns natively. Drizzle expects you to wire the tables and
query operators explicitly, and the adapter serializes or parses JSON fields for you. Drizzle ships pre-built
schema modules for Postgres, MySQL, and SQLite - Prisma ships a single reference <code>schema.prisma</code> snippet.

When should I pick IamRedisAdapter over Prisma or Drizzle?

Redis is best when you need distributed cache semantics - multiple app instances reading the same authorization
state with sub-millisecond latency. For tens of thousands of policies or complex audit/history requirements,
relational adapters scale better. Many production deployments use both: Redis as the engine adapter for hot reads,
Postgres as a separate audit/source-of-truth store synced via background jobs.

Do adapters merge subject attributes or replace them?

The built-in adapters merge incoming attributes into the current subject attribute map. This lets you patch a few
attributes without rewriting the entire stored object.

How are duplicate role assignments handled?

Memory and Redis are idempotent (in-memory check / set semantics). Drizzle uses <code>onConflictDoNothing</code>.
Prisma currently uses <code>create</code> and will throw on a duplicate against the unique constraint - wrap in a
try/catch or check existence first if you can't guarantee unique calls.

Does IamHttpAdapter move policy evaluation to the server?

No. IamHttpAdapter fetches authorization data over HTTP, but the consuming engine still evaluates permissions locally.
Use it when you want shared storage behind a service boundary, not when you want to outsource evaluation entirely.

Can IamHttpAdapter attach auth headers dynamically?

Yes. The <code className="rounded bg-muted px-2 py-1">headers</code> option can be a static object or an async
function, which makes it suitable for short-lived bearer tokens and per-request auth state.

Can I start with IamMemoryAdapter and move to Prisma, Drizzle, Redis, or HTTP later?

Yes. That is one of the intended adoption paths. The engine and builder APIs stay the same; the main migration work
is moving your persisted roles, policies, assignments, and subject attributes into the new adapter's storage shape.

What should a scoped-role capable adapter guarantee?

It should keep global role assignments and scoped assignments conceptually separate. Global assignments belong in
<code className="rounded bg-muted px-2 py-1">getSubjectRoles()</code>. Scope-bound assignments belong in
<code className="rounded bg-muted px-2 py-1">getSubjectScopedRoles()</code> so the engine can merge them only for
matching request scopes.

What exactly should getSubjectRoles() return when a subject has both global and scoped assignments?

It should return the subject's global role IDs only. Scoped assignments should be surfaced through
<code className="rounded bg-muted px-2 py-1">getSubjectScopedRoles()</code> so the engine can merge them only when
the request scope matches.

Can I implement only unscoped roles first and add multi-tenant support later?

Yes. A custom adapter can omit <code className="rounded bg-muted px-2 py-1">getSubjectScopedRoles()</code> and still
support the core engine. Add that method and scoped assignment storage once your application needs
tenant-aware role resolution.

Does the Express admin router fully satisfy IamHttpAdapter?

No. The admin router exposes <code>/policies</code>, <code>/roles</code>, and subject role-assignment endpoints, but
IamHttpAdapter also expects subject-attribute reads (<code>/subjects/:id/attributes</code>) and scoped-role reads
(<code>/subjects/:id/scoped-roles</code>). Treat the router as a starting point and add the remaining endpoints
yourself. Same applies to the Hono <code>bindAdminRouter</code>, Next.js <code>createAdminHandlers</code>, and
NestJS <code>createAdminOperations</code> factories.

Does IamRedisAdapter set a TTL on stored keys?

No. Stored values are persistent. Engine-level caching is handled by the in-process LRU with its <code>cacheTTL</code>
option - Redis is the source of truth, not a TTL cache. Configure Redis persistence (AOF/RDB) if you don't want
data loss on restart.

How do I isolate tenants in a shared Redis?

Use <code className="rounded bg-muted px-2 py-1">keyPrefix</code> per tenant. Two adapters with different prefixes
cannot read each other's keys. Combine with separate Redis logical databases (<code>SELECT n</code>) for stronger
isolation.