```tsx title="components/cva-1.tsx"
// import from your project: import Demo from '@/components/cva-1'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui/select'
import type { Variants } from '@gentleduck/variants'
import { cva } from '@gentleduck/variants'
import React from 'react'

export const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",

  {
    defaultVariants: {
      border: 'default',
      size: 'default',
      variant: 'default',
    },
    variants: {
      border: {
        default: '',
        destructive: 'border border-destructive/40 bg-destructive/40 hover:border-destructive hover:bg-destructive/65',
        primary: 'border border-border/40 hover:border-border/80',
        secondary: 'border border-secondary/40 bg-secondary/40 hover:border-secondary hover:bg-secondary/65',
        warning: 'border border-warning/40 bg-warning/40 hover:border-warning hover:bg-warning/65',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        icon: 'size-9',
        'icon-lg': 'size-10',
        'icon-sm': 'size-8',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
      },
      variant: {
        dashed:
          'border border-input border-dashed bg-background text-accent-foreground shadow-xs hover:bg-accent/50 hover:text-accent-foreground',
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive: 'bg-destructive/90 text-destructive-foreground shadow-xs hover:bg-destructive/70',
        expandIcon: 'group relative bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'text-accent-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        nothing: '',
        outline:
          'border border-input bg-background text-accent-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        warning: 'bg-warning/90 text-warning-foreground shadow-xs hover:bg-warning/70',
      },
    },
  },
)

type ButtonVariantProps = Variants.VariantProps<typeof buttonVariants>

export default function Demo() {
  const [variant, setVariant] = React.useState<ButtonVariantProps['variant']>('default')
  const [size, setSize] = React.useState<ButtonVariantProps['size']>('default')
  const [border, setBorder] = React.useState<ButtonVariantProps['border']>('default')

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      <div className="absolute top-0 left-0 flex flex-col gap-4">
        {/* Variant Select */}
        <Select onValueChange={(val) => setVariant(val as ButtonVariantProps['variant'])}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose Variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Variant</SelectLabel>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="link">Link</SelectItem>
              <SelectItem value="nothing">Nothing</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Size Select */}
        <Select onValueChange={(val) => setSize(val as ButtonVariantProps['size'])}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Size</SelectLabel>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="sm">SM</SelectItem>
              <SelectItem value="lg">LG</SelectItem>
              <SelectItem value="icon">Icon</SelectItem>
              <SelectItem value="icon-sm">Icon SM</SelectItem>
              <SelectItem value="icon-lg">Icon LG</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Border Select */}
        <Select onValueChange={(val) => setBorder(val as ButtonVariantProps['border'])}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose Border" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Border</SelectLabel>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Preview Button */}
      <Button border={border} size={size} variant={variant}>
        Button
      </Button>
    </div>
  )
}
```

## Philosophy

gentleduck/variants maps component variant props (size, color, state) to CSS classes with compile-time type checks. It replaces ad-hoc conditional class logic with a declarative schema that catches invalid combinations before the build runs.

***

## Installation

```bash
npm install @gentleduck/variants
```

## Usage

```tsx
import { cva } from '@gentleduck/variants'

const button = cva('btn', {
  variants: {
    size: { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3' },
    tone: { default: 'bg-blue-500 text-white', subtle: 'bg-gray-100 text-gray-800' }
  },
  defaultVariants: { size: 'md', tone: 'default' }
})

// Use it in JSX
<button className={button({ size: 'lg' })}>Click</button>
```

The output `className` is deduplicated and deterministic. Repeated calls with identical props are memoized.

***

## Core concepts

* **base** - classes always applied.
* **variants** - named axes of variation, such as `size` or `tone`.
* **defaultVariants** - values used when a prop is omitted.
* **compoundVariants** - classes added when multiple variant selections match.
* **ClassValue** - accepts strings, arrays, objects, and nested combinations.
* **Memoization** - results are cached by a deterministic key.

***

## How it works

## API reference

```ts
// Create a factory
const fn = cva(baseOrOptions, maybeOptions?)

// Call it to get a class string
fn(props?) // returns string
```

**Important types:** `Variants.VariantProps<typeof fn>`, `Variants.Props<TVariants>`,
`Variants.ClassValue`.

For complete signatures and the TypeScript definitions, see the Types
Reference section at the bottom.

***

## Examples

### 1) Button component

```tsx
import { cva, type Variants } from '@gentleduck/variants'
import { cn } from '@/lib/utils'

const buttonVariants = cva('inline-flex items-center justify-center rounded', {
  variants: {
    variant: {
      default: 'bg-primary text-white hover:bg-primary/90',
      ghost: 'bg-transparent hover:bg-accent'
    },
    size: { sm: 'h-8 px-3', md: 'h-10 px-4', lg: 'h-12 px-6' }
  },
  defaultVariants: { variant: 'default', size: 'md' }
})

type ButtonProps = Variants.VariantProps<typeof buttonVariants> & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

### 2) Compound variants for a card

```ts
const card = cva('rounded border p-4', {
  variants: {
    tone: { default: 'bg-white', success: 'bg-green-50', danger: 'bg-red-50' },
    size: { md: 'p-4', lg: 'p-6' },
    elevated: { true: 'shadow-lg', false: 'shadow-none' }
  },
  compoundVariants: [
    { tone: 'danger', elevated: true, className: 'ring-1 ring-red-200' },
    { size: 'lg', tone: ['default', 'success'], className: 'font-semibold' }
  ]
})
```

### 3) Passing conditional runtime classes

```tsx
const classes = card({ tone: 'success', className: [{ 'animate-pulse': isLoading }, custom] })
```

***

## Benchmarks

Real bundle size and runtime performance compared to class-variance-authority, tailwind-variants, and clsx:

```tsx title="components/chart-benchmark-variants.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-variants'
'use client'

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@gentleduck/registry-ui/chart'
import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import data from '../../../../apps/duck/public/data/benchmarks/variants.json'

const tabs = ['Bundle Size', 'Runtime', 'Features'] as const
type Tab = (typeof tabs)[number]

type BundleRow = {
  name: string
  shippedKB: number | null
  fullApiKB: number | null
  realImportKB: number | null
}

type RuntimeStats = {
  medianNs: number
  meanNs: number
  p95Ns: number
  p99Ns: number
  rmeP: number
  opsPerSec?: number
}

type RuntimeResult = {
  library: string
  warm: RuntimeStats
  cold: RuntimeStats
}

type RuntimeScenario = {
  scenario: string
  label: string
  warmNote: string
  coldNote: string
  results: RuntimeResult[]
}

type FeatureRow = {
  feature: string
  gentleduck: boolean
  cva: boolean
  tv: boolean
  clsx: boolean
}

const bundleRows = data.bundleSize.results as BundleRow[]
const runtimeScenarios = data.runtimePerformance as RuntimeScenario[]
const featureRows = data.features.rows as FeatureRow[]

const bundleConfig = {
  realImportKB: { label: 'real import (KB)', color: 'var(--chart-1)' },
} satisfies ChartConfig

const runtimeConfig = {
  warm: { label: 'warm (ns)', color: 'var(--chart-1)' },
  cold: { label: 'cold (ns)', color: 'var(--chart-3)' },
} satisfies ChartConfig

function formatEnv(env: typeof data.environment, generatedAt: string): string {
  const parts: string[] = []
  if (env.cpu) parts.push(`${env.cpu} × ${env.cpuCount}`)
  parts.push(`node ${env.node}`)
  if (env.bun) parts.push(`bun ${env.bun}`)
  if (env.commit) parts.push(`commit ${env.commit.slice(0, 7)}`)
  parts.push(new Date(generatedAt).toISOString().slice(0, 10))
  return parts.join(' · ')
}

export default function VariantsBenchmarkDashboard() {
  const [tab, setTab] = React.useState<Tab>('Bundle Size')
  const [scenarioId, setScenarioId] = React.useState<string>(runtimeScenarios[0]?.scenario ?? '')

  const scenario = runtimeScenarios.find((s) => s.scenario === scenarioId) ?? runtimeScenarios[0]
  const runtimeData = (scenario?.results ?? []).map((r) => ({
    library: r.library,
    warm: r.warm.medianNs,
    cold: r.cold.medianNs,
  }))

  return (
    <div className="w-full space-y-4" data-slot="variants-benchmark-dashboard">
      <p className="text-muted-foreground text-xs">{formatEnv(data.environment, data.generatedAt)}</p>

      <div className="flex w-fit gap-1 rounded-lg bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 font-medium text-xs transition-colors ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="min-h-[360px]">
        {tab === 'Bundle Size' && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">
              <strong className="text-foreground">Real-import cost</strong> — gzipped bundle of a single import of the
              main export, with all transitive dependencies inlined. The only apples-to-apples comparison.
            </p>
            <ChartContainer className="aspect-[2/1] min-h-[240px] w-full" config={bundleConfig}>
              <BarChart data={bundleRows} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" width={180} tickLine={false} axisLine={false} fontSize={11} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} unit=" KB" />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="realImportKB" fill="var(--color-realImportKB)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">library</th>
                    <th
                      className="px-3 py-2 text-right font-medium"
                      title="Gzipped raw file from node_modules — excludes transitive deps, not a fair comparison.">
                      shipped
                    </th>
                    <th
                      className="px-3 py-2 text-right font-medium"
                      title="Bundle `export *` with deps, minified, gzipped — full surface-area cost.">
                      full API
                    </th>
                    <th
                      className="px-3 py-2 text-right font-medium"
                      title="Bundle a single import with deps, minified, gzipped — what an app actually pays.">
                      real import
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bundleRows.map((r) => (
                    <tr key={r.name} className="border-t">
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                        {r.shippedKB ?? 'n/a'}
                      </td>
                      <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                        {r.fullApiKB ?? 'n/a'}
                      </td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums">{r.realImportKB ?? 'n/a'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Runtime' && (
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <p className="text-muted-foreground text-xs">
                Median ns/op per library — warm (same props) vs cold (unique className).
              </p>
              <select
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                className="ml-auto rounded-md border border-input bg-background px-2 py-1 text-xs">
                {runtimeScenarios.map((s) => (
                  <option key={s.scenario} value={s.scenario}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <ChartContainer className="aspect-[2/1] min-h-[280px] w-full" config={runtimeConfig}>
              <BarChart data={runtimeData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 20 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="library" type="category" width={180} tickLine={false} axisLine={false} fontSize={11} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} unit=" ns" />
                <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="warm" fill="var(--color-warm)" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="cold" fill="var(--color-cold)" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">library</th>
                    <th className="px-3 py-2 text-left font-medium">mode</th>
                    <th className="px-3 py-2 text-right font-medium">median (ns)</th>
                    <th className="px-3 py-2 text-right font-medium">p95</th>
                    <th className="px-3 py-2 text-right font-medium">p99</th>
                    <th className="px-3 py-2 text-right font-medium">rme%</th>
                    <th className="px-3 py-2 text-right font-medium">ops/sec</th>
                  </tr>
                </thead>
                <tbody>
                  {(scenario?.results ?? []).flatMap((r) =>
                    (['warm', 'cold'] as const).map((mode, i) => {
                      const s = r[mode]
                      return (
                        <tr key={`${r.library}-${mode}`} className="border-t">
                          <td className="px-3 py-2">{i === 0 ? r.library : ''}</td>
                          <td className="px-3 py-2 text-muted-foreground">{mode}</td>
                          <td className="px-3 py-2 text-right font-medium tabular-nums">{s.medianNs}</td>
                          <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">{s.p95Ns}</td>
                          <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">{s.p99Ns}</td>
                          <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">{s.rmeP}</td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {s.opsPerSec ? s.opsPerSec.toLocaleString() : '—'}
                          </td>
                        </tr>
                      )
                    }),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Features' && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">Self-reported feature matrix.</p>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">feature</th>
                    <th className="px-3 py-2 text-left font-medium">gentleduck</th>
                    <th className="px-3 py-2 text-left font-medium">cva</th>
                    <th className="px-3 py-2 text-left font-medium">tv</th>
                    <th className="px-3 py-2 text-left font-medium">clsx</th>
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map((row) => (
                    <tr key={row.feature} className="border-t">
                      <td className="px-3 py-2">{row.feature}</td>
                      <td className="px-3 py-2">{row.gentleduck ? '✓' : '·'}</td>
                      <td className="px-3 py-2">{row.cva ? '✓' : '·'}</td>
                      <td className="px-3 py-2">{row.tv ? '✓' : '·'}</td>
                      <td className="px-3 py-2">{row.clsx ? '✓' : '·'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

Run `bun run benchmark` in `packages/duck-variants` to regenerate. Data in `public/data/benchmarks/variants.json`.

***

## Best practices

* Use `defaultVariants` for the common case to reduce caller verbosity.
* Use `compoundVariants` to encode rules that would otherwise repeat across components.
* Group classes with arrays for clearer organization in large variant maps.
* Pass runtime state via `className` as an object or array (`{ 'is-loading': isLoading }`).
* Results are memoized, so calling the CVA function inside list renderers is safe.

***

## Troubleshooting & FAQ

**Q: Why aren't my compoundVariants applying?**

A: Ensure the compound object keys exactly match your variant names and that
values are either the exact allowed value or an array of allowed values.
Also confirm you did not pass `'unset'` (used to explicitly disable variant
application).

**Q: My classes are out of order or duplicated.**

A: The library deduplicates tokens and preserves the first-seen ordering where
possible. If ordering matters (rare), restructure base vs variant classes so
base-critical tokens appear first.

**Q: How do I completely disable a variant's default?**

A: Pass the literal string `'unset'` for that variant: e.g.
`button({ size: 'unset' })` will skip size classes.

***

## Migration from class-variance-authority

* The API is close enough that most simple uses are drop-in.
* Type inference is stricter; some loose usages may need small adjustments.
* Memoization behavior differs. Test hot paths if you relied on CVA internals.

***

## Types reference

All types are exported under the `Variants` namespace from `@gentleduck/variants`.

### 1. Variant Params (`Variants.VariantParams`)

Maps each variant key to a selected value or array of values.
Accepts either a single key or a `ReadonlyArray` of keys for each variant, or `null` to clear a default.

```tsx title="variants.types.ts"
export type VariantParams<TVariants extends VariantDefinitions> = {
  readonly [K in keyof TVariants]?: keyof TVariants[K] | ReadonlyArray<keyof TVariants[K]> | null
}
```

### 2. CVA Options (`Variants.Options`)

Options for creating a CVA function, without the `base` classes.

| Field | Description |
| --- | --- |
| `variants` | Base mapping of variants -> classes. |
| `defaultVariants` | Defaults applied when no value is passed. |
| `compoundVariants` | Conditional styles that apply when multiple variants match. |

```tsx title="variants.types.ts"
export type Options<TVariants extends VariantDefinitions> = {
  readonly variants?: TVariants
  readonly defaultVariants?: VariantParams<TVariants>
  readonly compoundVariants?: ReadonlyArray<
    VariantParams<TVariants> & {
      readonly class?: ClassValue
      readonly className?: ClassValue
    }
  >
}
```

### 3. CVA Config (`Variants.Config`)

Full configuration accepted by `cva()`: `Options` plus optional `base` classes.

```tsx title="variants.types.ts"
export type Config<TVariants extends VariantDefinitions> = Options<TVariants> & {
  readonly base?: ClassValue
}
```

### 4. CVA Props (`Variants.Props`)

Props that a **CVA-generated function** accepts.
Includes both **variant selections** and optional `class`/`className` overrides.

```tsx title="variants.types.ts"
export type Props<TVariants extends VariantDefinitions> = VariantParams<TVariants> & {
  readonly className?: ClassValue
  readonly class?: ClassValue
}
```

### 5. Variant Props (`Variants.VariantProps`)

Utility type to **extract only the variant-related props** from a CVA function, omitting `class` and `className`.

```tsx title="variants.types.ts"
export type VariantProps<T> = T extends (props?: infer P) => string
  ? Omit<NonNullable<P>, 'class' | 'className'>
  : never
```

### 6. Infer (`Variants.Infer`)

Infers the `variants` field from an `Options` object. Useful when you want to extract the variant map from a config constant.

```tsx title="variants.types.ts"
export type Infer<T extends Options<VariantDefinitions>> = T['variants']
```

### 7. Class Utility Types

Helper types that define the **shape of class names**:

| Type | Purpose |
| --- | --- |
| `Variants.ClassDictionary` | Conditional `{ 'class': boolean \| null \| undefined }`. Readonly. |
| `Variants.ClassArray` | Readonly nested arrays of class values. |
| `Variants.ClassValue` | Union of everything accepted as a class. |
| `Variants.ClassPrimitive` | Primitive scalar values (string, number, bigint, boolean, null, undefined). |

```tsx title="variants.types.ts"
export type ClassPrimitive = string | number | bigint | boolean | null | undefined

export type ClassDictionary = Readonly<Record<string, boolean | null | undefined>>

export type ClassArray = ReadonlyArray<ClassValue>

export type ClassValue = ClassPrimitive | ClassDictionary | ClassArray
```