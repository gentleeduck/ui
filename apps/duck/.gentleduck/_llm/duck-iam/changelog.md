## 3.0.0

### Breaking - Engine facet split (cache + stats)

Engine had 16 public methods on one class. Folded the cache-invalidation and observability clusters into two facets so the root surface stays focused on evaluation. Evaluation (`authorize`, `can`, `check`, `explain`, `permissions`) and lifecycle (`constructor`, `dispose`, `preload`, `healthCheck`) stay flat - hot path, single noun.

#### Migration

```ts
// Before (<= 2.x)                          // After (3.0)
engine.invalidate(opts)                    engine.cache.invalidate(opts)
engine.invalidateSubject(id, opts)         engine.cache.invalidateSubject(id, opts)
engine.invalidatePolicies(opts)            engine.cache.invalidatePolicies(opts)
engine.invalidateRoles(id?, opts)          engine.cache.invalidateRoles(id?, opts)
engine.stats()                             engine.stats.get()
engine.resetStats()                        engine.stats.reset()
engine.iamFlushSharedCaches()                 // REMOVED
                                           import { iamFlushSharedCaches } from '@gentleduck/iam'
```

Mechanical `sed` per call site - no behavior change. Codemod:

```sh
sed -i -E \
  -e 's/(engine[A-Za-z]*)\.invalidate\(/\1.cache.invalidate(/g' \
  -e 's/(engine[A-Za-z]*)\.invalidateSubject\(/\1.cache.invalidateSubject(/g' \
  -e 's/(engine[A-Za-z]*)\.invalidatePolicies\(/\1.cache.invalidatePolicies(/g' \
  -e 's/(engine[A-Za-z]*)\.invalidateRoles\(/\1.cache.invalidateRoles(/g' \
  -e 's/(engine[A-Za-z]*)\.stats\(\)/\1.stats.get()/g' \
  -e 's/(engine[A-Za-z]*)\.resetStats\(\)/\1.stats.reset()/g' \
  src/**/*.ts
```

#### Why 3.0 now

* `iamFlushSharedCaches` instance method was already scheduled for 3.0 removal - it was misleading (wiped process-globals, affecting every Engine in the process). Bundle the deprecation with the facet split: one major, one migration window.
* Flat surface drops from 16 -> 9 methods + 2 facet handles. Leaves room for future facet growth (`engine.cache.prewarm()`, `engine.stats.subscribe()`) without polluting the root.

#### What did not change

* `engine.authorize / can / check / explain / permissions` - identical signatures + semantics.
* `engine.preload / dispose / healthCheck` - unchanged.
* Bundle size stable at 41.6 KB (internal refactor, no shape change).
* 948/948 tests pass after bulk rename.

***

## 2.1.0

### Adversarial security audit cycle (21 rescans, ~60 fix commits)

A second multi-round audit pass after 2.0.0, run by independent adversarial security-auditor agents plus a silent-failure hunter and a code-smell scanner. **21 rescan cycles** uncovered 1 CRITICAL, 7 HIGH, 11 Medium, 12 Low, and 4 Info findings on top of the 2.0.0 hardening. Three consecutive clean rescans (Med+ free) declared the source tree exhausted: *"the package is genuinely hard to break."*

The change set is **mostly backward compatible** with three intentional default changes that close trivial auth-bypass / CSRF footguns.

### What the audit found

The audit was deliberately adversarial. After the 2.0.0 P0/P1 work, prior assumptions were re-attacked from fresh angles. A representative sampling:

* **Total silent fail-open** in `IamFileAdapter._loadState` - EACCES, EISDIR, EIO swallowed -> empty store -> `defaultEffect` decided every request. With `'allow'` that's "permit everything until restart" (SEC-054 CRITICAL).
* **Permanent data destruction** in `IamFileAdapter` - a single transient JSON parse failure silently populated `_cache = {}`, next `_flush()` overwrote the corrupt-but-recoverable file (SEC-064 HIGH).
* **Trivial auth bypass via spoofable header** in Hono `accessMiddleware` and Next `withAccess` - both defaulted `getUserId` to `x-user-id` request header. `curl -H 'X-User-Id: admin' ...` ran authorize() under the spoofed identity (SEC-101 HIGH).
* **Decision rewriting via throwing hooks** - `afterEvaluate`/`onDeny` inside `authorize`'s try caught and turned allow into deny; `onMetrics` could escape the fail-closed catch entirely (SEC-055/056 HIGH).
* **Silent fail-open in batch checks** - `permissions()` passed `undefined` for `onPolicyError`, so a per-policy throw vanished and UI gates silently allowed under `defaultEffect:'allow'` (SEC-057 HIGH).
* **Silent ABAC denial** - Redis/Drizzle `getSubjectAttributes` returned `{}` on corruption, conditions silently flipped to deny with no operator signal (SEC-058 HIGH).
* **SSRF via fetch redirect** - construction-time `allowedHosts` validator runs once on `baseUrl`; redirects to `169.254.169.254` or internal hosts followed silently. Now `redirect: 'error'` (SEC-042 HIGH).
* **Cross-backend authorization drift** - file/memory `getSubjectRoles` returned unscoped-only; redis/drizzle/prisma returned all collapsed. Same subject decided differently across adapters (SEC-059).
* **Permanent admin DoS** - symlink-escape rejection parked the rejected promise in `_loadInFlight` forever; every subsequent `_loadState()` returned the same rejection. Adapter unusable until process restart (SEC-063).
* **Validator error reflection** - `assertValidOrThrow` echoed `Invalid algorithm "subject.id) even without a custom context
  * AttrValue now strips undefined from optional properties - yearsExperience?: number correctly resolves to number instead of falling back to AttributeValue
  * StringConditionValue no longer includes (string & \{}) internally - the flexible string fallback is handled at the method signature level via FlexibleDollarPaths

## 1.3.2

### Patch Changes

* 2dd9f8b: feat: FlexibleDotPaths for DefaultContext autocomplete and strict ConditionValue type safety

  * DotPaths now bails to `never` (not `string`) for string-indexed types, preventing
    union pollution that killed IDE autocomplete.
  * New FlexibleDotPaths\<T> detects open-ended attribute bags (like DefaultContext) and
    adds `(string & {})` so known structural paths autocomplete while arbitrary strings
    are still accepted. Fully typed contexts remain strict.
  * ConditionValue correctly restricts non-string value types: `env('hour', 'lt', '')`
    now errors when `hour` is `number`, instead of accepting any AttributeValue.

## 1.3.1

### Patch Changes

* b62bb5b: fix: prevent DotPaths from recursing into array methods and functions

  DotPaths now treats arrays as leaf paths and skips function-valued properties,
  so autocomplete only shows real data properties instead of array methods like
  `length`, `push`, `toString`, etc.

## 1.3.0

### Minor Changes

* Add DollarPaths type for $-variable autocomplete in conditions, refactor core into modular folders, and add JSDoc and inline FAQs to documentation

## 1.2.0

### Minor Changes

* 7fe860f: Add TContext type parameter for typed dot-path intellisense and per-resource attribute narrowing. Split types.ts into modular types/ directory. Add JSDoc across all source files.

## 1.1.2

### Patch Changes

* 66608fe: Add publishConfig with public access for scoped npm package.

## 1.1.1

### Patch Changes

* 37339e8: Fix release workflow to skip redundant CI checks during publish.

## 1.1.0

### Minor Changes

* 29ed55d: Initial release of @gentleduck/iam: identity and access management utilities.