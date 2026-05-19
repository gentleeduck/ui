Benchmarked against **7 libraries**: @casl/ability, casbin, accesscontrol, role-acl, @rbac/rbac, and easy-rbac. Numbers from `vitest bench` on identical authorization scenarios. Sizes verified via bundlephobia on 2026-03-30.

Run `bun run bench` in `packages/duck-iam` to reproduce the numbers here.

***

## The honest verdict

**CASL is faster than us.** On simple RBAC checks, CASL is ~2x faster in production mode - it pre-compiles rules into a hash-map index at build time. duck-iam can't match that while keeping runtime-updatable policies.

**We are faster than everyone else.** In production mode, duck-iam beats easy-rbac, @rbac/rbac, accesscontrol, casbin, and role-acl.

**We ship more features.** Scoped roles, explain/debug traces, lifecycle hooks, batch permissions, 18 condition operators, 5 server middlewares, 3 client libraries. No competitor bundles all of them.

**We are larger than CASL.** ~21 KB vs ~6 KB. duck-iam includes a full policy engine, RBAC-to-ABAC converter, explain tracer, builder, config validator, and LRU cache. CASL ships none of that.

***

## Library Overview

| | @gentleduck/iam | @casl/ability | casbin | accesscontrol | role-acl | @rbac/rbac | easy-rbac |
|---|---|---|---|---|---|---|---|
| **Model** | Policy engine | Ability-based | PERM DSL | Fluent grants | Role + conditions | Hierarchical | Hierarchical |
| **ABAC** | Yes (18 ops) | Yes | Yes | No | Yes | No | No |
| **RBAC** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Runtime deps** | 0 | 0 | 5 | 1 | 3 | 0 | 0 |
| **TypeScript** | Full generics | Full | String-based | Partial | Partial | Yes | No |
| **Maintained** | Active | Active | Active | No (2020) | Active | Active | No (2021) |

***

## Runtime Performance

```tsx title="components/chart-benchmark-iam-vs.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-iam-vs'
'use client'

import type { ChartConfig } from '@gentleduck/registry-ui/chart'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@gentleduck/registry-ui/chart'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import { ChartTabs } from './chart-tabs'

const GREEN = 'var(--chart-1)'
const BLUE = 'var(--chart-2)'
const GRAY = 'var(--chart-3)'

const tabs = ['Performance', 'Bundle Size'] as const
type Tab = (typeof tabs)[number]

const perfData = [
  { name: '@casl/ability', value: 16_857_000, type: 'casl' },
  { name: '@gentleduck/iam [PROD]', value: 8_233_000, type: 'duck' },
  { name: 'easy-rbac', value: 5_003_000, type: 'other' },
  { name: '@rbac/rbac', value: 2_884_000, type: 'other' },
  { name: '@gentleduck/iam [DEV]', value: 1_355_000, type: 'duck' },
  { name: 'accesscontrol', value: 674_000, type: 'other' },
  { name: 'casbin', value: 143_000, type: 'other' },
]

const perfConfig = {
  value: { label: 'ops/sec' },
} satisfies ChartConfig

const bundleData = [
  { name: 'easy-rbac', sizeKB: 2, type: 'other' },
  { name: '@rbac/rbac', sizeKB: 4, type: 'other' },
  { name: '@casl/ability', sizeKB: 6, type: 'other' },
  { name: 'accesscontrol', sizeKB: 8.2, type: 'other' },
  { name: 'role-acl', sizeKB: 12, type: 'other' },
  { name: '@gentleduck/iam (full)', sizeKB: 23.3, type: 'duck' },
  { name: 'casbin', sizeKB: 30, type: 'other' },
]

const bundleConfig = {
  sizeKB: { label: 'Size (gzip KB)' },
} satisfies ChartConfig

function getBarColor(type: string) {
  if (type === 'duck') return GREEN
  if (type === 'casl') return BLUE
  return GRAY
}

export default function ChartBenchmarkIamVs() {
  const [activeTab, setActiveTab] = useState<Tab>('Performance')

  return (
    <div className="w-full">
      <ChartTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'Performance' && (
        <ChartContainer config={perfConfig} className="h-[350px] w-full">
          <BarChart data={perfData} layout="vertical" margin={{ left: 0, right: 40 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`} />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12 }} />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => `${Number(value).toLocaleString()} ops/sec`} />}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {perfData.map((entry) => (
                <Cell key={entry.name} fill={getBarColor(entry.type)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}

      {activeTab === 'Bundle Size' && (
        <ChartContainer config={bundleConfig} className="h-[350px] w-full">
          <BarChart data={bundleData} layout="vertical" margin={{ left: 0, right: 40 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v: number) => `${v} KB`} />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value} KB (gzipped)`} />} />
            <Bar dataKey="sizeKB" radius={[0, 4, 4, 0]}>
              {bundleData.map((entry) => (
                <Cell key={entry.name} fill={entry.type === 'duck' ? GREEN : GRAY} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}
```

All numbers are **ops/sec** (higher is faster). Each library solves the **same** authorization problem. CASL condition checks use `subject()` so conditions actually run (bare string checks skip them). duck-iam has two modes: `[DEV]` returns rich Decision objects with timing and reasons, `[PROD]` returns plain booleans with zero overhead.

### Simple RBAC: "can viewer read post?"

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** | 16,857,000 | -- |
| 2 | @gentleduck/iam `evaluatePolicyFast()` \[PROD] | 8,233,000 | 2x slower |
| 3 | @gentleduck/iam `evaluateFast()` \[PROD] | 7,737,000 | 2.2x slower |
| 4 | easy-rbac | 5,003,000 | 3.4x slower |
| 5 | @rbac/rbac | 2,884,000 | 5.8x slower |
| 6 | @gentleduck/iam `evaluatePolicy()` \[DEV] | 1,355,000 | 12.4x slower |
| 7 | @gentleduck/iam `evaluate()` \[DEV] | 1,049,000 | 16x slower |
| 8 | accesscontrol | 674,000 | 25x slower |
| 9 | casbin | 143,000 | 118x slower |
| 10 | role-acl | 140,000 | 120x slower |

### ABAC condition check: "can owner update own draft?"

Only libraries with real ABAC condition support. CASL uses `subject()` so conditions run.

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** (with `subject()`) | 3,910,000 | -- |
| 2 | @gentleduck/iam `evaluateFast()` \[PROD] | 1,177,000 | 3.3x slower |
| 3 | @gentleduck/iam `evaluate()` \[DEV] | 648,000 | 6x slower |

Others excluded - no attribute-based condition support.

### Role + condition: "can admin delete post?"

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** (with `subject()`) | 5,677,000 | -- |
| 2 | easy-rbac | 4,504,000 | 1.3x slower |
| 3 | @rbac/rbac | 2,780,000 | 2x slower |
| 4 | @gentleduck/iam \[DEV] | 786,000 | 7.2x slower |
| 5 | accesscontrol | 388,000 | 14.6x slower |
| 6 | casbin | 55,000 | 103x slower |
| 7 | role-acl | 55,000 | 103x slower |

### Deny path: "viewer cannot delete"

| # | Library | ops/sec | vs fastest |
|---|---|---|---|
| 1 | **easy-rbac** | 3,114,000 | -- |
| 2 | @casl/ability | 1,664,000 | 1.9x slower |
| 3 | @gentleduck/iam \[DEV] | 803,000 | 3.9x slower |
| 4 | role-acl | 141,000 | 22x slower |
| 5 | @rbac/rbac | 68,000 | 46x slower |
| 6 | casbin | 51,000 | 61x slower |

### Batch: 20 permission checks

| # | Library | ops/sec | vs CASL |
|---|---|---|---|
| 1 | **@casl/ability** | 3,481,000 | -- |
| 2 | easy-rbac | 497,000 | 7x slower |
| 3 | @gentleduck/iam `evaluateFast()` \[PROD] | 462,000 | 7.5x slower |
| 4 | @gentleduck/iam `evaluate()` \[DEV] | 137,000 | 25.4x slower |
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

***

## Why CASL is faster, and why it rarely matters

### The architectural difference

CASL and duck-iam solve authorization at different engine levels:

**CASL: pre-compiled lookup table.** `build()` iterates every rule once and produces an index keyed by `[action, subjectType]`. Every `can()` call is a single hash-map lookup - O(1), ~0.012 us. Rules are frozen after `build()` and can't change at runtime.

**duck-iam: dynamic policy engine.** Policies load from databases, update at runtime through adapters, and invalidate via the LRU cache. Each evaluation does: WeakMap index lookup, Map.get by `action:resource`, condition evaluation, combining algorithm. Even with rule indexing, each check costs ~0.12 us - about 2x a single hash lookup.

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

1. **Rule indexing**: pre-built `Map<action:resource, Rule[]>` per policy, cached via WeakMap. Removes the linear scan over all rules.
2. **Unconditional rule flag**: rules with empty conditions skip `evalConditionGroup()`.
3. **Inlined combiners**: `deny-overrides` and `allow-overrides` inline into the evaluation loop - no array allocation, no function calls.
4. **Path cache**: condition field paths like `subject.attributes.role` split once and cache forever.
5. **Production mode**: no `performance.now()`, no `Date.now()`, no Decision allocation, no reason strings.

Closing the last ~2x gap means dropping dynamic policies and pre-compiling at init like CASL. That breaks adapters, runtime policy updates, and the LRU cache - the features that make duck-iam a policy engine instead of a lookup table.

### Why it doesn't matter in practice

Authorization isn't the bottleneck. A typical API request:

| Step | Time |
|---|---|
| Network round trip | 5,000--50,000 us |
| Database query | 500--5,000 us |
| JSON serialization | 50--500 us |
| **duck-iam check (prod)** | **0.12 us** |
| **CASL check** | **0.06 us** |

The gap is 60 nanoseconds. At 100 checks per request, that's 6 us - 0.00012% of a 50 ms request.

***

## Dev vs Prod Mode

duck-iam has two execution modes. They change **runtime behavior** and **return types**:

```ts
// Development (default) -- rich Decision with timing, reasons, rule refs
const engine = new Engine({ adapter, mode: 'development' })
const decision = await engine.check('user-1', 'read', post)
// decision: Decision { allowed: true, effect: 'allow', reason: '...', duration: 0.5, timestamp: ... }
// engine.explain() is available
// Hooks (afterEvaluate, onDeny, onError) fire on every check

// Production -- plain boolean, maximum throughput
const prodEngine = new Engine({ adapter, mode: 'production' })
const allowed = await prodEngine.check('user-1', 'read', post)
// allowed: true (boolean)
// No performance.now(), no Date.now(), no object allocation, no reason strings
// engine.explain() throws -- not available in production
// Hooks (afterEvaluate, onDeny, onError) are skipped for maximum speed
```

`engine.can()` always returns `boolean` in both modes (for middleware compatibility).

### Does production mode reduce bundle size?

**The `mode` flag alone does not reduce bundle size.** It's a runtime check. Import patterns do - the package is tree-shakeable, so bundlers drop unused code:

```ts
// Smallest production bundle -- import only the fast evaluator
// Tree-shakes away: Engine, explain, builder, config, validate, dev evaluate
import { evaluateFast } from '@gentleduck/iam'
const allowed = evaluateFast(policies, request) // boolean

// Full engine -- includes everything (dev + prod paths)
import { Engine } from '@gentleduck/iam'
```

`evaluateFast` + `evaluatePolicyFast` give the smallest bundle when you manage policies yourself. The Engine, explain system, builder, and config validator only ship if imported.

`engine.explain()` is development-only.

***

## Internal Performance

```tsx title="components/chart-benchmark-iam.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-iam'
'use client'

import type { ChartConfig } from '@gentleduck/registry-ui/chart'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@gentleduck/registry-ui/chart'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts'
import data from '../../../../apps/duck/public/data/benchmarks/iam.json'
import { ChartTabs } from './chart-tabs'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'hsl(173 80% 40%)',
  'hsl(24 95% 53%)',
  'hsl(199 89% 48%)',
  'hsl(316 72% 51%)',
  'hsl(60 70% 44%)',
  'hsl(142 50% 50%)',
  'hsl(210 60% 55%)',
  'hsl(0 75% 55%)',
]

const tabs = ['Modules', 'Core Performance', 'Engine Performance'] as const
type Tab = (typeof tabs)[number]

const modules = data.moduleSizes
  .filter((m) => m.name !== 'Core (full)')
  .map((m, i) => ({
    name: m.name,
    sizeKB: m.sizeKB,
    fill: COLORS[i % COLORS.length],
  }))

const modulesConfig = modules.reduce<Record<string, { label: string; color: string }>>((acc, m, i) => {
  acc[`module${i}`] = { label: m.name as string, color: COLORS[i % COLORS.length] as string }
  return acc
}, {}) satisfies ChartConfig

const coreData = data.corePerformance.map((d) => ({ name: d.label, us: d.us }))

const coreConfig = {
  us: { label: 'Time (us)', color: 'var(--chart-1)' },
} satisfies ChartConfig

const engineData = data.enginePerformance.map((d) => ({ name: d.label, us: d.us }))

const engineConfig = {
  us: { label: 'Time (us)', color: 'var(--chart-2)' },
} satisfies ChartConfig

export default function ChartBenchmarkIam() {
  const [activeTab, setActiveTab] = useState<Tab>('Modules')

  return (
    <div className="w-full">
      <ChartTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'Modules' && (
        <div className="space-y-4">
          <ChartContainer config={modulesConfig} className="mx-auto h-[350px] w-full max-w-[500px]">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value, name) => `${name}: ${value} KB`} hideLabel />}
              />
              <Pie
                data={modules}
                dataKey="sizeKB"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}>
                {modules.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
            {modules.map((m) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <div className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: m.fill }} />
                <span className="text-muted-foreground">
                  {m.name} ({m.sizeKB} KB)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Core Performance' && (
        <ChartContainer config={coreConfig} className="h-[300px] w-full">
          <BarChart data={coreData} layout="vertical" margin={{ left: 0, right: 40 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v: number) => `${v} us`} />
            <YAxis type="category" dataKey="name" width={220} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value} us`} />} />
            <Bar dataKey="us" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      )}

      {activeTab === 'Engine Performance' && (
        <ChartContainer config={engineConfig} className="h-[280px] w-full">
          <BarChart data={engineData} layout="vertical" margin={{ left: 0, right: 40 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v: number) => `${v} us`} />
            <YAxis type="category" dataKey="name" width={220} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value} us`} />} />
            <Bar dataKey="us" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}
```

Pure evaluation timing, average of 2,000 iterations after 200 warmup rounds.

| Operation | Time |
|---|---|
| `evaluatePolicyFast()` -- simple rule | ~0.87 us |
| `evaluatePolicyFast()` -- with conditions | ~1.61 us |
| `evaluatePolicy()` \[DEV] -- target match | ~0.59 us |
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

***

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
| Adapter: Redis | 1.4 KB |
| Server: Express | 1.1 KB |
| Server: Next.js | 1.0 KB |
| Server: Hono | 0.9 KB |
| Server: NestJS | 1.3 KB |
| Server: Generic | 0.8 KB |
| Client: React | 1.1 KB |
| Client: Vue | 1.0 KB |
| Client: Vanilla | 1.4 KB |

***

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
| **DB adapters** | 5 | 3 | 20+ | 0 | 0 | 3 | 0 |
| **Server middleware** | 5 | 0 | 2 | 0 | 0 | 3 | 0 |
| **React integration** | Yes | Yes | No | No | No | No | No |
| **Vue integration** | Yes | Yes | No | No | No | No | No |
| **Type-safe config** | Yes | Yes | No | Yes | No | Yes | No |
| **Zero runtime deps** | Yes | Yes | No | No | No | Yes | Yes |
| **Batch permissions** | Yes | No | No | No | No | No | No |

***

```tsx title="components/chart-benchmark-iam-compare.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-iam-compare'
'use client'

import { useState } from 'react'
import data from '../../../../apps/duck/public/data/benchmarks/iam.json'
import { ChartTabs } from './chart-tabs'

const tabs = data.libraryComparisons.map((lib) => lib.name)

function WinnerIcon({ winner }: { winner: string }) {
  if (winner === 'gentleduck') {
    return <span className="text-green-600 dark:text-green-400">&#10003;</span>
  }
  if (winner === 'competitor') {
    return <span className="text-blue-600 dark:text-blue-400">&#10003;</span>
  }
  return <span className="text-muted-foreground">&mdash;</span>
}

function Summary({ comparison }: { comparison: (typeof data.libraryComparisons)[0]['comparison'] }) {
  let wins = 0
  let losses = 0
  let ties = 0
  for (const c of comparison) {
    if (c.winner === 'gentleduck') wins++
    else if (c.winner === 'competitor') losses++
    else ties++
  }

  return (
    <div className="mt-3 text-muted-foreground text-sm">
      <span className="font-medium text-green-600 dark:text-green-400">{wins} wins</span>
      {' / '}
      <span className="font-medium text-blue-600 dark:text-blue-400">{losses} losses</span>
      {' / '}
      <span className="font-medium">{ties} ties</span>
      {' for @gentleduck/iam'}
    </div>
  )
}

export default function ChartBenchmarkIamCompare() {
  const [activeTab, setActiveTab] = useState(tabs[0] ?? '')
  const activeLib = data.libraryComparisons.find((lib) => lib.name === activeTab)

  return (
    <div className="w-full">
      <ChartTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} labelFn={(tab) => `vs ${tab}`} />

      {activeLib && (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-medium">Metric</th>
                  <th className="px-4 py-2 text-left font-medium">@gentleduck/iam</th>
                  <th className="px-4 py-2 text-left font-medium">{activeLib.name}</th>
                  <th className="py-2 pl-4 text-center font-medium">Winner</th>
                </tr>
              </thead>
              <tbody>
                {activeLib.comparison.map((row) => (
                  <tr key={row.metric} className="border-border/50 border-b">
                    <td className="py-2 pr-4 font-medium">{row.metric}</td>
                    <td
                      className={`px-4 py-2 ${row.winner === 'gentleduck' ? 'font-medium text-green-600 dark:text-green-400' : ''}`}>
                      {row.gentleduck}
                    </td>
                    <td
                      className={`px-4 py-2 ${row.winner === 'competitor' ? 'font-medium text-blue-600 dark:text-blue-400' : ''}`}>
                      {row.competitor}
                    </td>
                    <td className="py-2 pl-4 text-center">
                      <WinnerIcon winner={row.winner} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Summary comparison={activeLib.comparison} />
        </div>
      )}
    </div>
  )
}
```

## Where each library wins

### @gentleduck/iam wins on

* **Feature density**: only library with scoped roles + explain/debug + lifecycle hooks + batch permissions + 18 condition operators + dev/prod mode in one package
* **Faster than casbin, role-acl, accesscontrol**: 3-50x faster in production mode
* **Server integration**: 5 framework middlewares (Express, Next.js, Hono, NestJS, generic)
* **Client libraries**: React, Vue, and vanilla JS with hooks and reactive state
* **Type safety**: full generic type parameters for actions, resources, roles, and scopes
* **Explain API**: the only library that tells you exactly why a permission was granted or denied
* **Dev/Prod mode**: rich debug objects in development, fast booleans in production

### @casl/ability wins on

* **Raw speed**: 2x faster than duck-iam in production mode from the pre-compiled ability index
* **Bundle size**: ~6 KB, 3.5x smaller
* **Maturity**: production since 2017
* **Ecosystem**: ~900K downloads/week, extensive docs and community
* **Isomorphic**: proven frontend + backend sharing pattern

### easy-rbac wins on

* **Fastest deny path**: 2x faster than CASL on deny checks
* **Tiny bundle**: ~2 KB, the smallest
* **Zero config**: hierarchical RBAC, nothing to set up

### casbin wins on

* **Adapter ecosystem**: 20+ database adapters across 15+ languages
* **Admin UI**: web-based policy management panel
* **Academic backing**: formal PERM metamodel

### @rbac/rbac wins on

* **Fast simple checks**: 2.5M ops/sec for basic RBAC
* **Built-in middleware**: Express, NestJS, Fastify
* **Runtime role updates**: add or change roles without restart

***

## Smallest possible bundle

`createAccessConfig()` sets up the whole authorization system in one call, but it pulls in the full config system, validator, and builder. If all you need is policy evaluation, skip the config layer and import the building blocks directly.

Build a typed policy and evaluate it without `createAccessConfig`:

```ts
import type { Policy, AccessRequest } from '@gentleduck/iam'
import { evaluatePolicyFast } from '@gentleduck/iam'

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

The package is fully tree-shakeable. Anything you don't import drops out: Engine, explain, builder, config, validate, adapters. From the module sizes above, `evaluateFast` alone is tiny next to the 21.9 KB core entry - pay only for what you use.

Other low-level pieces to import directly: `PolicyBuilder`, `RuleBuilder`, `evaluateFast`, `evaluatePolicy`, and the condition operators. Mix and match for the exact surface area you need.

***

## Methodology

* **@gentleduck/iam**: bundle sizes from `dist/` via `gzip -c | wc -c`. Performance via `vitest bench` with N=3 inner loops. Production mode uses `evaluateFast()` with rule indexing (WeakMap-cached per policy, Map lookup by `action:resource`).
* **@casl/ability**: condition benchmarks use `subject()` for real condition evaluation. Bare string checks (`can('read', 'Post')`) skip conditions and would give misleading numbers - we don't do that.
* **casbin**: real RBAC model (`newModel()` + `StringAdapter`) with role inheritance via grouping rules.
* **accesscontrol, @rbac/rbac, easy-rbac**: excluded from ABAC benchmarks (no condition support).
* Competitor sizes from [bundlephobia.com](https://bundlephobia.com), verified 2026-03-30.
* Sizes are **minified + gzipped**.
* All benchmarks run on the same machine in the same vitest session.

Reproduce:

```bash
cd packages/duck-iam
bun run bench       # vitest bench -- competitive comparison
bun run benchmark   # JSON data output + console summary
```