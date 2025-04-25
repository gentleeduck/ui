# `@gentelduck/variants`

A lightweight utility for generating class names based on variant configurations. Inspired by Tailwind and class-variance-authority, `@gentelduck/variants` helps you manage and compose class names in a flexible, type-safe, and declarative way.

## Features

- 🧠 **Declarative variant-based styling**
- 🎯 **Type-safe API with intelligent autocompletion**
- 🧱 **Composable and extendable utility**
- 🎨 **Supports default variants and custom class merging**
- 🪶 **Lightweight and zero dependencies**

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

## Usage

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

## API

### `cva(base, options)`

Creates a class name composer function based on variant configurations.

#### Parameters:

- `base: string`  
  The base class string (always included).

- `options: VariantsOptions<TVariants>`  
  Object containing:
  - `variants`: Map of variant names and value-to-class mappings.
  - `defaultVariants` *(optional)*: Default values for each variant.

#### Returns:

A function that takes props and returns a class string:
```ts
type CvaProps<TVariants> = {
  [K in keyof TVariants]?: keyof TVariants[K]
} & {
  className?: string
  class?: string
}
```

---

## Type Definitions

### `VariantProps<TVariants>`

Helper type for defining the accepted variant keys and values.

```ts
type VariantProps<TVariants> = {
  [K in keyof TVariants]?: keyof TVariants[K]
}
```

### `VariantsOptions<TVariants>`

The shape of the options object passed to `cva`.

```ts
interface VariantsOptions<TVariants> {
  variants: TVariants
  defaultVariants?: VariantProps<TVariants>
}
```

---

## Example with Tailwind CSS

```ts
const badge = cva('rounded px-2 py-1 text-sm', {
  variants: {
    color: {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    },
    outlined: {
      true: 'border',
      false: '',
    },
  },
  defaultVariants: {
    color: 'info',
    outlined: false,
  },
})
```

Usage:

```ts
badge({ color: 'error', outlined: true })
// => 'rounded px-2 py-1 text-sm bg-red-100 text-red-800 border'
```

---

## Why Use `@gentelduck/variants`?

- Eliminate complex conditional logic for class names
- Keep your components clean and focused
- Simplify class management with built-in defaults
- Gain TypeScript safety and autocompletion

---

## Contributing

PRs and feedback are welcome! Please fork the repo and use a feature branch. Submit issues for bugs, feature requests, or improvements.

---

## License

[MIT © GentleDuck](./LICENSE)
