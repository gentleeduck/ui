---
name: duck-variants
description: >-
  Use when working with the @gentleduck/variants package — the cva() function for
  creating type-safe component variant systems. Covers defining variants, extracting
  VariantProps, compound variants, the 'unset' escape hatch, and ClassValue types.
  Use for questions about styling patterns, variant authoring, or type inference.
allowed-tools: Read Grep
argument-hint: "[variant-name-or-topic]"
---

# @gentleduck/variants

Expert scope: `packages/duck-variants/src/`. One function (`cva`) and utility types for type-safe component style variants. Results are memoized via a props-keyed cache.

## Exports

```ts
import { cva, type VariantProps, type CvaProps, type VariantParams,
  type VariantsOptions, type InferVariants, type ClassValue } from '@gentleduck/variants'
```

## API

### cva() — two call signatures

```ts
// 1. Two-arg: base string + options object
const alert = cva('rounded-lg border px-4 py-3 text-sm', {
  variants: { variant: { default: 'bg-card text-card-foreground', destructive: '...' } },
  defaultVariants: { variant: 'default' },
})

// 2. Single-arg: options object with optional `base` key
const alert = cva({
  base: 'rounded-lg border px-4 py-3 text-sm', // optional — omit for no base classes
  variants: { variant: { default: 'bg-card text-card-foreground', destructive: '...' } },
  defaultVariants: { variant: 'default' },
})
```

Returns `(props?: CvaProps<TVariants>) => string`. Props accept `class` and `className` to append extra classes. Tokens are deduplicated (first occurrence wins).

Variant values can be a `string` or `string[]` (array of class strings) in the config.

### Compound variants

Apply extra classes when multiple variant values match simultaneously. Conditions can be a single value or an array of values:

```ts
const button = cva('btn', {
  variants: {
    intent: { primary: 'bg-blue-500', danger: 'bg-red-500' },
    size: { sm: 'text-sm', lg: 'text-lg' },
  },
  defaultVariants: { intent: 'primary', size: 'sm' },
  compoundVariants: [
    { intent: ['primary', 'danger'], size: 'lg', className: 'uppercase' },
    // ↑ matches when intent is 'primary' OR 'danger' AND size is 'lg'
  ],
})
```

Each compound entry uses variant keys as conditions plus `class` and/or `className` for emitted classes. Both are applied if present.

### The `'unset'` escape hatch

Passing `'unset'` as a variant value skips that variant entirely — no classes emitted, even if `defaultVariants` specifies a value.
### Key types

| Type | Purpose |
|---|---|
| `VariantProps<typeof fn>` | Variant props only (strips `class`/`className` and array types). Use with `typeof`. |
| `CvaProps<TVariants>` | Full props of the returned function: variant keys + `class` + `className`. |
| `InferVariants<typeof config>` | Extracts `variants` record from a `VariantsOptions` config object (NOT a cva return). |
| `ClassValue` | `string \| number \| boolean \| ClassDictionary \| ClassArray` — supports nested arrays and conditional dictionaries like `{ 'bg-red': isError }`. |
## Creating a variant component from scratch

```ts
// 1. card.constants.ts — define variants
export const cardVariants = cva('rounded-lg border shadow-sm', {
  variants: {
    padding: { none: '', sm: 'p-2', md: 'p-4', lg: 'p-6' },
    elevation: { flat: 'shadow-none', raised: 'shadow-md' },
  },
  defaultVariants: { padding: 'md', elevation: 'flat' },
})

// 2. card.types.ts — derive props
import type { VariantProps } from '@gentleduck/variants'
import type { cardVariants } from './card.constants'

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

// 3. card.tsx — component
import { cn } from '@gentleduck/libs/cn'
import { cardVariants } from './card.constants'
import type { CardProps } from './card.types'

export function Card({ padding, elevation, className, ...props }: CardProps) {
  return <div className={cn(cardVariants({ padding, elevation }), className)} {...props} />
}
```

## Composition patterns

### Compose two cva outputs at the call site

```ts
<div className={cn(layoutVariants({ direction: 'row' }), spacingVariants({ gap: 'md' }))} />
```

### Extend an existing component's variants without modifying it

```ts
import { buttonVariants } from '@gentleduck/registry-ui/button'

const fancyVariants = cva('', {
  variants: { glow: { on: 'shadow-lg shadow-blue-500/50', off: '' } },
  defaultVariants: { glow: 'off' },
})

export function FancyButton({ variant, size, glow, className, ...props }: FancyButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), fancyVariants({ glow }), className)} {...props} />
}
```

### Use variant function as a className utility (no component)

```ts
<Link className={buttonVariants({ variant: 'outline' })} href="/about">About</Link>
```

### Handling native `size` collisions

`Omit` the native HTML attribute when a variant is named `size`:

```ts
interface ButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'>,
  VariantProps<typeof buttonVariants> {}
```

## Error patterns

1. `VariantProps` returns `never` — pass `typeof myVariants`, not `myVariants`
2. `size` collision — native HTML `size` attribute conflicts; use `Omit<..., 'size'>`
3. Missing `defaultVariants` — all variant props become required in consumers
4. Using `class` in JSX — React requires `className`; `class` only works in plain objects
5. Passing `InferVariants` a cva function — it takes a `VariantsOptions` config, not a cva return

## Do not

- Use `type` alias for component props — use `interface` so it can be extended
- Inline variant definitions in the component — put them in `{name}.constants.ts`
- Forget to export the variant function — consumers need it for className composition
- Use `as const` on the cva call — it breaks type inference
- Omit `typeof` with `VariantProps` — it is `VariantProps<typeof x>`, not `VariantProps<x>`
- Wrap cva results in `cn()` at the definition site — cva already deduplicates; use `cn()` only in JSX
- Assume variants are required — with `defaultVariants`, all variant props are optional

## Source

`packages/duck-variants/src/variants.ts` (function) and `variants.types.ts` (types).
