Benchmarked against **7 libraries**: @casl/ability, casbin, accesscontrol, role-acl, @rbac/rbac, and easy-rbac. Numbers from `vitest bench` on identical authorization scenarios. Sizes verified via bundlephobia on 2026-03-30.

Run `bun run bench` in `packages/duck-iam` to reproduce the numbers here.

---

## The honest verdict

**CASL is faster than us.** On simple RBAC checks, CASL is ~2x faster in production mode — it pre-compiles rules into a hash-map index at build time. duck-iam can't match that while keeping runtime-updatable policies.

**We are faster than everyone else.** In production mode, duck-iam beats easy-rbac, @rbac/rbac, accesscontrol, casbin, and role-acl.

**We ship more features.** Scoped roles, explain/debug traces, lifecycle hooks, batch permissions, 18 condition operators, 5 server middlewares, 3 client libraries. No competitor bundles all of them.

**We are larger than CASL.** ~21 KB vs ~6 KB. duck-iam includes a full policy engine, RBAC-to-ABAC converter, explain tracer, builder, config validator, and LRU cache. CASL ships none of that.

---

## Library Overview

| | @gentleduck/iam | @casl/ability | casbin | accesscontrol | role-acl | @rbac/rbac | easy-rbac |
|---|---|---|---|---|---|---|---|
| **Model** | Policy engine | Ability-based | PERM DSL | Fluent grants | Role + conditions | Hierarchical | Hierarchical |
| **ABAC** | Yes (18 ops) | Yes | Yes | No | Yes | No | No |
| **RBAC** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Runtime deps** | 0 | 0 | 5 | 1 | 3 | 0 | 0 |
| **TypeScript** | Full generics | Full | String-based | Partial | Partial | Yes | No |
| **Maintained** | Active | Active | Active | No (2020) | Active | Active | No (2021) |

---

## Runtime Performance

All numbers are **ops/sec** (higher is faster). Each library solves the **same** authorization problem. CASL condition checks use `subject()` so conditions actually run (bare string checks skip them). duck-iam has two modes: `[DEV]` returns rich Decision objects with timing and reasons, `[PROD]` returns plain booleans with zero overhead.

### Simple RBAC: "can viewer read post?"

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** | 16,857,000 | -- |
| 2 | @gentleduck/iam `evaluatePolicyFast()` [PROD] | 8,233,000 | 2x slower |
| 3 | @gentleduck/iam `evaluateFast()` [PROD] | 7,737,000 | 2.2x slower |
| 4 | easy-rbac | 5,003,000 | 3.4x slower |
| 5 | @rbac/rbac | 2,884,000 | 5.8x slower |
| 6 | @gentleduck/iam `evaluatePolicy()` [DEV] | 1,355,000 | 12.4x slower |
| 7 | @gentleduck/iam `evaluate()` [DEV] | 1,049,000 | 16x slower |
| 8 | accesscontrol | 674,000 | 25x slower |
| 9 | casbin | 143,000 | 118x slower |
| 10 | role-acl | 140,000 | 120x slower |

### ABAC condition check: "can owner update own draft?"

Only libraries with real ABAC condition support. CASL uses `subject()` so conditions run.

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** (with `subject()`) | 3,910,000 | -- |
| 2 | @gentleduck/iam `evaluateFast()` [PROD] | 1,177,000 | 3.3x slower |
| 3 | @gentleduck/iam `evaluate()` [DEV] | 648,000 | 6x slower |

Others excluded — no attribute-based condition support.

### Role + condition: "can admin delete post?"

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** (with `subject()`) | 5,677,000 | -- |
| 2 | easy-rbac | 4,504,000 | 1.3x slower |
| 3 | @rbac/rbac | 2,780,000 | 2x slower |
| 4 | @gentleduck/iam [DEV] | 786,000 | 7.2x slower |
| 5 | accesscontrol | 388,000 | 14.6x slower |
| 6 | casbin | 55,000 | 103x slower |
| 7 | role-acl | 55,000 | 103x slower |

### Deny path: "viewer cannot delete"

| # | Library | ops/sec | vs fastest |
|---|---|---|---|
| 1 | **easy-rbac** | 3,114,000 | -- |
| 2 | @casl/ability | 1,664,000 | 1.9x slower |
| 3 | @gentleduck/iam [DEV] | 803,000 | 3.9x slower |
| 4 | role-acl | 141,000 | 22x slower |
| 5 | @rbac/rbac | 68,000 | 46x slower |
| 6 | casbin | 51,000 | 61x slower |

### Batch: 20 permission checks

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** | 3,481,000 | -- |
| 2 | easy-rbac | 497,000 | 7x slower |
| 3 | @gentleduck/iam `evaluateFast()` [PROD] | 462,000 | 7.5x slower |
| 4 | @gentleduck/iam `evaluate()` [DEV] | 137,000 | 25.4x slower |
| 5 | accesscontrol | 68,000 | 51x slower |
| 6 | role-acl | 22,000 | 158x slower |
| 7 | @rbac/rbac | 14,200 | 245x slower |
| 8 | casbin | 9,800 | 354x slower |

### Cold start: build everything + first check

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** | 3,284,000 | -- |
| 2 | easy-rbac | 3,118,000 | 1.1x slower |
| 3 | accesscontrol | 830,000 | 4x slower |
| 4 | @gentleduck/iam | 311,000 | 10.6x slower |
| 5 | role-acl | 306,000 | 10.7x slower |
| 6 | @rbac/rbac | 183,000 | 17.9x slower |
| 7 | casbin | 62,000 | 53x slower |

---

## Why CASL is faster, and why it rarely matters

### The architectural difference

CASL and duck-iam solve authorization at different engine levels:

**CASL: pre-compiled lookup table.** `build()` iterates every rule once and produces an index keyed by `[action, subjectType]`. Every `can()` call is a single hash-map lookup — O(1), ~0.012 us. Rules are frozen after `build()` and can't change at runtime.

**duck-iam: dynamic policy engine.** Policies load from databases, update at runtime through adapters, and invalidate via the LRU cache. Each evaluation does: WeakMap index lookup, Map.get by `action:resource`, condition evaluation, combining algorithm. Even with rule indexing, each check costs ~0.12 us — about 2x a single hash lookup.

### Where the ~2x gap comes from (profiled)

Profiled operations in the production fast path:

| Operation | Cost | What it does |
|---|---|---|
| WeakMap index lookup | ~0.004 us | Retrieve cached rule index for the policy |
| String key concat | ~0.001 us | Build `"read\0post"` lookup key |
| Map.get | ~0.014 us | Find rules matching this action+resource |
| for loop (1 rule) | ~0.003 us | Iterate matched rules |
| Condition check | ~0.003 us | Skip (empty conditions) or evaluate |
| policyApplies | ~0.003 us | Check policy targets |
| Precomputed cache hit | ~0.080 us | Two nested Map.get calls (action -> resource) |
| **Total** | **~0.120 us** | |
| **CASL total** | **~0.060 us** | Single hash lookup + return |

The gap is not one big bottleneck. It's the sum of small costs a policy engine requires. CASL sidesteps them by freezing rules at build time.

### What we optimized (and what we can't)

Every optimization that keeps the dynamic policy model is applied:

1. **Rule indexing**: pre-built `Map

Pure evaluation timing, average of 2,000 iterations after 200 warmup rounds.

| Operation | Time |
|---|---|
| `evaluatePolicyFast()` -- simple rule | ~0.87 us |
| `evaluatePolicyFast()` -- with conditions | ~1.61 us |
| `evaluatePolicy()` [DEV] -- target match | ~0.59 us |
| `evaluatePolicy()` -- target skip | ~0.37 us |
| `evaluate()` -- 2 policies | ~0.70 us |
| `evaluate()` -- deny path | ~0.96 us |

### Engine Performance (with LRU caching)

| Operation | Time |
|---|---|
| `engine.can()` -- cached | ~5.5 us |
| `engine.check()` -- cached | ~4.2 us |
| `engine.permissions()` -- 20 checks | ~21 us |
| `engine.explain()` -- full trace | ~5.7 us |

Times vary by machine. Run `bun run benchmark` for your hardware.

---

## Bundle Size

| Library | Size (gzip) | Runtime deps | Tree-shakeable |
|---|---|---|---|
| easy-rbac | ~2 KB | 0 | No |
| @rbac/rbac | ~4 KB | 0 | No |
| **@casl/ability** | ~6 KB | 0 | Yes |
| accesscontrol | ~8.2 KB | 1 | No |
| role-acl | ~12 KB | 3 | No |
| **@gentleduck/iam** (full) | ~21 KB | 0 | Yes |
| casbin (node-casbin) | ~30 KB | 5 | No |

**We are not the smallest.** At ~21 KB, duck-iam is 3.5x larger than CASL. The full package bundles: evaluation engine, RBAC-to-ABAC converter, conditions engine (18 operators), explain/debug tracer, type-safe builder, config validator, and LRU cache. CASL ships none of that.

**The package is tree-shakeable.** Import only `evaluateFast` and skip the engine, explain, and builder for a much smaller bundle. Each adapter and server middleware adds ~0.8-1.7 KB.

### Module Sizes

| Module | Size (gzip) |
|---|---|
| Core (full entry) | 21.9 KB |
| Adapter: Memory | 1.1 KB |
| Adapter: Prisma | 1.4 KB |
| Adapter: Drizzle | 1.7 KB |
| Adapter: HTTP | 1.2 KB |
| Server: Express | 1.1 KB |
| Server: Next.js | 1.0 KB |
| Server: Hono | 0.9 KB |
| Server: NestJS | 1.3 KB |
| Server: Generic | 0.8 KB |
| Client: React | 1.1 KB |
| Client: Vue | 1.0 KB |
| Client: Vanilla | 1.4 KB |

---

## Feature Comparison

| Feature | gentleduck | CASL | Casbin | accesscontrol | role-acl | @rbac/rbac | easy-rbac |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **RBAC** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **ABAC (conditions)** | 18 operators | Yes | Yes | No | Yes | No | No |
| **Policy engine** | Yes | No | Yes | No | No | No | No |
| **Dev/Prod mode** | Yes | No | No | No | No | No | No |
| **Deny-overrides** | Yes | No | Yes | No | No | No | No |
| **Combining algorithms** | 4 | 1 | Custom | 1 | 1 | 1 | 1 |
| **Scoped roles** | Yes | No | No | No | No | No | No |
| **Explain / debug** | Yes | No | No | No | No | No | No |
| **Lifecycle hooks** | Yes | No | No | No | No | No | No |
| **LRU caching** | Built-in | No | No | No | No | No | No |
| **Rule indexing** | Yes | Yes | No | No | No | No | No |
| **DB adapters** | 4 | 3 | 20+ | 0 | 0 | 3 | 0 |
| **Server middleware** | 5 | 0 | 2 | 0 | 0 | 3 | 0 |
| **React integration** | Yes | Yes | No | No | No | No | No |
| **Vue integration** | Yes | Yes | No | No | No | No | No |
| **Type-safe config** | Yes | Yes | No | Yes | No | Yes | No |
| **Zero runtime deps** | Yes | Yes | No | No | No | Yes | Yes |
| **Batch permissions** | Yes | No | No | No | No | No | No |

---

## Where each library wins

### @gentleduck/iam wins on

- **Feature density**: only library with scoped roles + explain/debug + lifecycle hooks + batch permissions + 18 condition operators + dev/prod mode in one package
- **Faster than casbin, role-acl, accesscontrol**: 3-50x faster in production mode
- **Server integration**: 5 framework middlewares (Express, Next.js, Hono, NestJS, generic)
- **Client libraries**: React, Vue, and vanilla JS with hooks and reactive state
- **Type safety**: full generic type parameters for actions, resources, roles, and scopes
- **Explain API**: the only library that tells you exactly why a permission was granted or denied
- **Dev/Prod mode**: rich debug objects in development, fast booleans in production

### @casl/ability wins on

- **Raw speed**: 2x faster than duck-iam in production mode from the pre-compiled ability index
- **Bundle size**: ~6 KB, 3.5x smaller
- **Maturity**: production since 2017
- **Ecosystem**: ~900K downloads/week, extensive docs and community
- **Isomorphic**: proven frontend + backend sharing pattern

### easy-rbac wins on

- **Fastest deny path**: 2x faster than CASL on deny checks
- **Tiny bundle**: ~2 KB, the smallest
- **Zero config**: hierarchical RBAC, nothing to set up

### casbin wins on

- **Adapter ecosystem**: 20+ database adapters across 15+ languages
- **Admin UI**: web-based policy management panel
- **Academic backing**: formal PERM metamodel

### @rbac/rbac wins on

- **Fast simple checks**: 2.5M ops/sec for basic RBAC
- **Built-in middleware**: Express, NestJS, Fastify
- **Runtime role updates**: add or change roles without restart

---

## Smallest possible bundle

`createAccessConfig()` sets up the whole authorization system in one call, but it pulls in the full config system, validator, and builder. If all you need is policy evaluation, skip the config layer and import the building blocks directly.

Build a typed policy and evaluate it without `createAccessConfig`:

```ts

// Define your action/resource types for type safety
type Action = 'read' | 'update' | 'delete'
type Resource = 'post' | 'comment'

const policy: Policy<Action, Resource> = {
  id: 'blog-policy',
  algorithm: 'deny-overrides',
  rules: [
    { id: 'allow-read', effect: 'allow', actions: ['read'], resources: ['post', 'comment'], conditions: {}, priority: 0 },
  ],
}

const request: AccessRequest<Action, Resource> = {
  subject: { id: 'user-1', roles: ['viewer'] },
  action: 'read',
  resource: { type: 'post', id: 'post-1' },
}

const allowed = evaluatePolicyFast(policy, request) // boolean
```

The package is fully tree-shakeable. Anything you don't import drops out: Engine, explain, builder, config, validate, adapters. From the module sizes above, `evaluateFast` alone is tiny next to the 21.9 KB core entry — pay only for what you use.

Other low-level pieces to import directly: `PolicyBuilder`, `RuleBuilder`, `evaluateFast`, `evaluatePolicy`, and the condition operators. Mix and match for the exact surface area you need.

---

## Methodology

- **@gentleduck/iam**: bundle sizes from `dist/` via `gzip -c | wc -c`. Performance via `vitest bench` with N=3 inner loops. Production mode uses `evaluateFast()` with rule indexing (WeakMap-cached per policy, Map lookup by `action:resource`).
- **@casl/ability**: condition benchmarks use `subject()` for real condition evaluation. Bare string checks (`can('read', 'Post')`) skip conditions and would give misleading numbers — we don't do that.
- **casbin**: real RBAC model (`newModel()` + `StringAdapter`) with role inheritance via grouping rules.
- **accesscontrol, @rbac/rbac, easy-rbac**: excluded from ABAC benchmarks (no condition support).
- Competitor sizes from [bundlephobia.com](https://bundlephobia.com), verified 2026-03-30.
- Sizes are **minified + gzipped**.
- All benchmarks run on the same machine in the same vitest session.

Reproduce:

```bash
cd packages/duck-iam
bun run bench       # vitest bench -- competitive comparison
bun run benchmark   # JSON data output + console summary
```