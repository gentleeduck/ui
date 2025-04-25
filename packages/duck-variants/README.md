# `@gentelduck/variants`

A lightweight utility for generating class names based on variant configurations. Inspired by Tailwind and `class-variance-authority`, `@gentelduck/variants` helps you manage and compose class names in a flexible, type-safe, and declarative way.

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

### Edge Case Example with Array Variants

If a variant accepts multiple values or classes, you can pass an array. `@gentelduck/variants` will merge them automatically.

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

### Combining with Compound Variants

You can also define compound variants that apply custom classes based on multiple conditions.

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
    { size: 'large', color: 'primary', class: 'card-large-primary' },
    { size: 'small', color: 'secondary', className: 'card-small-secondary' },
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

## Variants

Variants allow you to define configurable styles for your components. Each variant is tied to a set of class names, and you can choose different values for them.

### Declaring Variants

Define a set of variants with possible values and their associated class names:

```ts
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
```

### Default Variants

You can specify default values for each variant, which will be applied when no explicit value is passed in:

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
  defaultVariants: {
    size: 'small',
    color: 'primary',
  },
})
```

---

## TypeScript

### Type Safety

`@gentelduck/variants` comes with full TypeScript support. It ensures that you only pass valid values for each variant, and provides autocompletion for variant keys and values.

```ts
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

const className = button({ size: 'lg', color: 'secondary' })
// Autocompletion ensures valid variant values
```

### Type Definitions

Here are the types used by `@gentelduck/variants`:

```ts
import { buttonVariants } from './yourvariants'
import  { VariantsOptions } from '@gentelduck/variants'

interface VariantsOptions<TVariants> {
  variants: VariantsOptions<typeof buttonVariants>
}
```

---

## Extending Components

You can extend components and variants for reusability and flexibility.

```ts
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

const secondaryButton = button({ color: 'secondary' })
```

---

## Composing Components

You can compose multiple variant-driven components together.

```ts
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
  defaultVariants: {
    size: 'small',
    color: 'primary',
  },
})

const combinedClassName = `${button({ size: 'lg' })} ${card({ size: 'large', color: 'secondary' })}`
// => 'btn btn-lg btn-primary card card-lg card-secondary'
```

---

## API Reference

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

## Why Use `@gentelduck/variants`?

- 🛠 **Eliminate complex conditional logic for class names**: Build your components using a simple and declarative variant system.
- 🧼 **Keep your components clean and focused**: Keep your components modular and easy to maintain by separating style concerns.
- 🔒 **Gain TypeScript safety and autocompletion**: Ensure correctness in the class names used through a fully typed interface.
- ⚡ **Simplify class management with built-in defaults**: Set defaults for your variants to reduce repetitive code.

---

## Contributing

PRs and feedback are welcome! Please fork the repo and use a feature branch. Submit issues for bugs, feature requests, or improvements.

---

## License

[MIT © GentleDuck](./LICENSE)
