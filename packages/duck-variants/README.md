# `@gentelduck/variants`

A lightweight utility for generating class names based on variant configurations. Inspired by Tailwind and `class-variance-authority`, `@gentelduck/variants` helps you manage and compose class names in a flexible, type-safe, and declarative way.

## Features

- 🧠 **Declarative variant-based styling**
- 🎯 **Type-safe API with intelligent autocompletion**
- 🧱 **Composable and extendable utility**
- 🎨 **Supports default variants and compound variants**
- 🪶 **Lightweight and zero dependencies**

---

## Why `@gentelduck/variants`?

- ✅ **Zero dependencies**
- 🔐 **Type-safe and autocompletion ready**
- 🎨 **Composable styling**
- ⚡ **Minimal and fast**
- 🧠 **Powerful variant + compound variant system**

---

## Installation

```bash
npm install @gentelduck/variants
# or
yarn add @gentelduck/variants
# or
pnpm add @gentelduck/variants
```

---

## Getting Started

`@gentelduck/variants` allows you to define a set of variants for your components and automatically generate the appropriate class names for each combination.

### Basic Example

```ts
import { cva } from '@gentelduck/variants'

const button = cva('btn', {
  variants: {
    size: {
      sm: 'btn-sm',
      lg: 'btn-lg',
    },
    color: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'primary',
  },
})

const className = button({ size: 'lg', className: 'extra-class' })
// => 'btn btn-lg btn-primary extra-class'
```

---

## Advanced Usage

### Arrays & Multiple Classes

You can use arrays to define multiple classes for a single variant value.

```ts
const badge = cva('badge', {
  variants: {
    size: {
      sm: ['badge-sm', 'text-xs'],
      lg: ['badge-lg', 'text-lg'],
    },
    color: {
      primary: ['bg-blue-500', 'text-white'],
      secondary: ['bg-gray-200', 'text-gray-800'],
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'primary',
  },
})

const className = badge({ size: 'lg', color: 'secondary' })
// => 'badge badge-lg text-lg bg-gray-200 text-gray-800'
```

### Compound Variants

Compound variants let you apply classes based on a combination of variant values.

```ts
const card = cva('card', {
  variants: {
    size: {
      small: 'card-sm',
      large: 'card-lg',
    },
    color: {
      primary: 'card-primary',
      secondary: 'card-secondary',
    },
  },
  compoundVariants: [
    {
      variants: { size: 'large', color: 'primary' },
      class: 'card-large-primary',
    },
    {
      variants: { size: 'small', color: 'secondary' },
      className: 'card-small-secondary',
    },
  ],
  defaultVariants: {
    size: 'small',
    color: 'primary',
  },
})

const className = card({ size: 'large', color: 'primary' })
// => 'card card-lg card-primary card-large-primary'
```

---

## TypeScript Support

`@gentelduck/variants` is built with full TypeScript support and provides:

- Autocompletion for variant keys and values
- Strict checking of variant options
- Extensible and reusable types

### Type Inference

```ts
const alert = cva('alert', {
  variants: {
    severity: {
      info: 'alert-info',
      error: 'alert-error',
    },
  },
  defaultVariants: {
    severity: 'info',
  },
})

// Hovering over `alert` will give you autocompletion for `severity` values
alert({ severity: 'error' }) // ✅
alert({ severity: 'warning' }) // ❌ Type Error
```

---

## Composing and Extending

You can easily compose multiple components or extend variants.

### Extend with Different Defaults

```ts
const baseButton = cva('btn', {
  variants: {
    size: {
      sm: 'btn-sm',
      lg: 'btn-lg',
    },
    color: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'primary',
  },
})

const secondaryButton = baseButton({ color: 'secondary' })
```

### Compose Multiple CVAs

```ts
const button = cva('btn', { variants: { size: { sm: 'btn-sm' } } })
const icon = cva('icon', { variants: { type: { arrow: 'icon-arrow' } } })

const className = `${button({ size: 'sm' })} ${icon({ type: 'arrow' })}`
// => 'btn btn-sm icon icon-arrow'
```

---

## API Reference

### `cva(base, options)`

Creates a variant configuration function.

#### Parameters

- `base: string` – Base class name (always included)
- `options: CVAConfig` – Configuration object
  - `variants`: A dictionary of variant keys and value-to-class mappings
  - `defaultVariants` *(optional)*: Default values for variants
  - `compoundVariants` *(optional)*: Conditional variants based on multiple values

#### Return Type

```ts
type CvaFn<TVariants> = (
  props?: VariantProps<TVariants> & {
    class?: string
    className?: string
  }
) => string
```

#### Example

```ts
const button = cva('btn', {
  variants: {
    intent: {
      primary: 'btn-primary',
      danger: 'btn-danger',
    },
  },
  defaultVariants: {
    intent: 'primary',
  },
})

button({ intent: 'danger', className: 'rounded' })
// => 'btn btn-danger rounded'
```
---

## License

MIT © [GentleDuck](./LICENSE)
