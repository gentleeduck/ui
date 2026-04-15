<p align="center">
  <img src="https://raw.githubusercontent.com/gentleeduck/duck-ui/master/public/logo-dark.svg" alt="gentleduck" width="80"/>
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

## Benchmarks

This package ships a benchmark script that compares `@gentleduck/variants` against `class-variance-authority`, `tailwind-variants`, and `clsx` across three axes:

- **Bundle size** (gzipped): `shipped` (raw file npm serves), `fullApi` (bundle `export *`, minified), `realImport` (bundle the main export with a side-effect sink, minified — what an app actually pays).
- **Runtime** (ns/op): four scenarios (defaults, one variant, variant + size, with className merge), each in `warm` mode (same props reused — favors memoizing libraries) and `cold` mode (unique className per call — defeats memoization). Reports median, p95, p99, stddev, and relative margin of error.
- **Features**: self-reported capability matrix.

### Running

```bash
# from this package
bun run benchmark

# from the monorepo root
bun run benchmark:variants
```

Output is written to `public/benchmarks/results.json` and mirrored to `apps/duck-ui-docs/public/data/benchmarks/variants.json`. Each JSON includes the host environment (CPU, node, bun, platform, git commit), wall-clock durations, and a `reproCommand` string for provenance.

### How to read the numbers

Memoization is a first-class feature of this library, so the `warm` mode reflects its best case. The `cold` mode is reported alongside to show the non-memoized cost honestly — that's a fairer number when comparing to libraries that don't memoize. Bundle sizes are static; runtime numbers depend on the machine and should be interpreted relative to the other libraries in the same run, not as absolute constants.

## Docs

[gentleduck.org](https://gentleduck.org)

## License

[MIT](./LICENSE)
