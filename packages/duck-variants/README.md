<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/variants

Type-safe component variants with `cva()`.

Define variant-driven class names with full TypeScript inference, compound variants, and default values. Zero dependencies.

## Quick start

```bash
npm install @gentleduck/variants
```

```ts
import { cva, type VariantProps } from '@gentleduck/variants'

const button = cva('px-4 py-2 rounded font-medium', {
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-100 text-gray-800',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
  compoundVariants: [
    { intent: 'primary', size: 'lg', className: 'uppercase tracking-wide' },
  ],
})

button()                          // default: primary + md
button({ intent: 'secondary' })  // secondary + md
button({ size: 'lg' })           // primary + lg + compound applied

type ButtonVariants = VariantProps<typeof button>
```

## Features

- **Compound variants** -- apply classes when multiple variant values match
- **Default variants** -- fallback values when no prop is passed
- **Type inference** -- `VariantProps<typeof fn>` extracts variant props for component interfaces
- **Composable** -- pass a `cva()` result as the base of another `cva()` call
- **Arrays and objects** -- nested class arrays and conditional objects supported
- **Zero dependencies** -- no runtime deps, `"sideEffects": false`

## Docs

[gentleduck.org](https://gentleduck.org)

## License

[MIT](./LICENSE)
