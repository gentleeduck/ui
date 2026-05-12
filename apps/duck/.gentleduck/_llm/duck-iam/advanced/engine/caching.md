## Four caches

The engine maintains four LRU caches:

| Cache | Key | Stores | Purpose |
| --- | --- | --- | --- |
| Policy cache | `'all'` | All ABAC policies | Avoid re-fetching policies on every check |
| Role cache | `'all'` | All role definitions | Avoid re-fetching roles on every check |
| RBAC policy cache | `'rbac'` | The synthetic RBAC policy | Avoid recomputing role-to-policy conversion |
| Subject cache | subject ID | Resolved subjects | Avoid re-resolving the same user repeatedly |

Default: `cacheTTL: 60` seconds, `maxCacheSize: 1000` subjects.

***

## Why this shape?

Policies and roles are loaded as **whole collections**, so one cached entry per cache is enough. The engine reloads everything if any policy changes — this is fine because the cache key is just `'all'` and overwrites on save.

Subjects are resolved **individually**, so the engine keeps a separate cache entry per subject ID. This is what lets a hot user (e.g. a service account hitting 1000s of endpoints) avoid repeated DB hits.

***

## Invalidation methods

```typescript
// Clear everything
engine.invalidate()

// Clear a specific user's cached data (after role change, attribute update)
engine.invalidateSubject('user-1')

// Clear cached policies (after adding/removing/editing policies)
engine.invalidatePolicies()

// Clear cached roles and all subjects (subjects depend on roles)
engine.invalidateRoles()
```

`invalidateRoles()` clears the subject cache too because resolved subjects include role names from the role definitions — if a role is renamed/deleted, every cached subject is potentially stale.

***

## Automatic invalidation

The admin API methods automatically invalidate the relevant caches:

| Admin call | Invalidates |
| --- | --- |
| `admin.savePolicy()` / `admin.deletePolicy()` | Policy cache + RBAC policy cache |
| `admin.saveRole()` / `admin.deleteRole()` | Role cache + RBAC policy + all subjects |
| `admin.assignRole()` / `admin.revokeRole()` | Specific subject only |
| `admin.setAttributes()` | Specific subject only |

You only need to call invalidation methods manually if you modify data outside the admin API (e.g., direct database writes by another service).

***

## Multi-instance deployments

The LRU cache is **per-process**. In a multi-node deployment, when one node mutates via `engine.admin.*`, the other nodes don't know — they keep serving stale decisions until their TTL expires.

Solutions:

### Short TTL

Set `cacheTTL: 5` (or less) so stale data has a small window. Trade-off: more adapter hits.

### Pub/sub invalidation

Broadcast invalidation events on policy/role changes:

```typescript
// Node A — after a write
await engine.admin.saveRole(updatedRole)
await redis.publish('iam:invalidate', JSON.stringify({ kind: 'roles' }))

// Node B — listener
redis.subscribe('iam:invalidate', (msg) => {
  const { kind } = JSON.parse(msg)
  if (kind === 'roles') engine.invalidateRoles()
  if (kind === 'policies') engine.invalidatePolicies()
  if (kind === 'subject') engine.invalidateSubject(JSON.parse(msg).subjectId)
})
```

This pattern works with any pub/sub layer — Redis, NATS, Kafka, AMQP, etc.

### Versioned policies

Tag policies with a `version` number. Increment on writes. On read, compare versions and refetch if stale. duck-iam doesn't ship this — implement at the adapter layer if you need strong consistency.

***

## Tuning the cache

For high-traffic applications:

```typescript
const engine = new Engine({
  adapter,
  cacheTTL: 300, // 5 minutes — policies/roles change infrequently
  maxCacheSize: 10000, // 10k subjects in memory
})
```

For real-time permission changes:

```typescript
const engine = new Engine({
  adapter,
  cacheTTL: 5, // 5 seconds — near real-time
  maxCacheSize: 500,
})
```

For development:

```typescript
const engine = new Engine({
  adapter,
  cacheTTL: 0, // No caching — always hit the adapter
})
```

`cacheTTL: 0` means entries expire immediately — useful in tests where you want every check to see fresh adapter state without manual invalidation.

***

## Memory footprint

A rough rule:

* **Subject cache** — ~1 KB per cached subject (depends on attribute size)
* **Role cache** — ~500 B per role (depends on permissions count)
* **Policy cache** — ~2 KB per policy (depends on rules)
* **RBAC policy cache** — single entry, sized to N×M (roles × permissions)

For 10,000 subjects + 100 roles + 50 policies, expect ~12 MB of cache memory. The fast-path index for `evaluatePolicyFast` adds another ~5 MB depending on rule count.

If memory is tight, reduce `maxCacheSize` and rely on the LRU eviction. Hot subjects stay cached; cold ones get evicted.

***

## When to invalidate manually

You only need manual invalidation when:

* Another service writes to your shared adapter database directly (not through `engine.admin.*`)
* You're testing role logic and want to force a fresh load between cases
* You receive an external webhook that signals "permissions changed" (e.g. SCIM, IdP sync)
* You're implementing pub/sub invalidation across nodes

In single-node apps that always go through `engine.admin.*`, you should never need manual invalidation.