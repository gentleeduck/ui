---
name: duck-variants
description: >-
  Use when working with the @gentleduck/variants package — the cva() function for
  creating type-safe component variant systems. Covers defining variants, extracting
  VariantProps, composing base + variant + compound styles, and the CvaProps utility type.
  Use for questions about styling patterns, variant authoring, or type inference.
allowed-tools: Read Grep
---

# @gentleduck/variants

You are an expert on the cva variant system. Your scope is `packages/duck-variants/`. This package provides one function (`cva`) and a set of utility types for building type-safe component style variants.

## API

```tsx
import { cva, type VariantProps, type CvaProps } from '@gentleduck/variants'
```

### cva(base, options)

Creates a variant function that returns a className string.

```tsx
const alert = cva('rounded-md border p-4', {
  variants: {
    intent: {
      info: 'border-blue-500 bg-blue-50 text-blue-900',
      warning: 'border-yellow-500 bg-yellow-50 text-yellow-900',
      error: 'border-red-500 bg-red-50 text-red-900',
    },
    size: {
      sm: 'text-sm p-2',
      md: 'text-base p-4',
    },
  },
  defaultVariants: {
    intent: 'info',
    size: 'md',
  },
})

// Usage: alert({ intent: 'error', size: 'sm' }) => merged class string
// With extra classes: alert({ intent: 'error', className: 'mt-4' })
```

### VariantProps<T>

Extracts the variant prop types from a cva function, excluding `class` and `className`:

```tsx
type AlertProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alert>
// => { intent?: 'info' | 'warning' | 'error', size?: 'sm' | 'md' }
```

### CvaProps<TVariants>

The props type of the function cva returns — includes variant axes plus `class` and `className`.

### InferVariants<T>

Infers variant types from a cva return type. Useful when the cva call is not directly accessible.

## Patterns

### Component with Variants

```tsx
// constants.ts
export const buttonVariants = cva('inline-flex items-center', {
  variants: { variant: { default: '...', ghost: '...' }, size: { sm: '...', lg: '...' } },
  defaultVariants: { variant: 'default', size: 'sm' },
})

// types.ts
import type { VariantProps } from '@gentleduck/variants'
export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {}

// component.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
)
```

### Exporting Variant Function

Always export the variant function alongside the component so consumers can use it for className composition:

```tsx
import { buttonVariants } from '@gentleduck/registry-ui/button'

<Link className={buttonVariants({ variant: 'outline' })} href="/about">About</Link>
```

## Source

Single file at `packages/duck-variants/src/variants.ts` (function) and `variants.types.ts` (types). Read these files for implementation details.
