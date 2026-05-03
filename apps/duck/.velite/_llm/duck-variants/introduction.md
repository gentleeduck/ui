## Philosophy

gentleduck/variants maps component variant props (size, color, state) to CSS classes with compile-time type checks. It replaces ad-hoc conditional class logic with a declarative schema that catches invalid combinations before the build runs.

---

## Installation

```bash
npm install @gentleduck/variants
```

## Usage

```tsx

const button = cva('btn', {
  variants: {
    size: { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3' },
    tone: { default: 'bg-blue-500 text-white', subtle: 'bg-gray-100 text-gray-800' }
  },
  defaultVariants: { size: 'md', tone: 'default' }
})

// Use it in JSX

## API reference

```ts
// Create a factory
const fn = cva(baseOrOptions, maybeOptions?)

// Call it to get a class string
fn(props?) // returns string
```

**Important types:** `Variants.VariantProps
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

---

## Benchmarks

Real bundle size and runtime performance compared to class-variance-authority, tailwind-variants, and clsx:

Run `bun run benchmark` in `packages/duck-variants` to regenerate. Data in `public/data/benchmarks/variants.json`.

---

## Best practices

* Use `defaultVariants` for the common case to reduce caller verbosity.
* Use `compoundVariants` to encode rules that would otherwise repeat across components.
* Group classes with arrays for clearer organization in large variant maps.
* Pass runtime state via `className` as an object or array (`{ 'is-loading': isLoading }`).
* Results are memoized, so calling the CVA function inside list renderers is safe.

---

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

---

## Migration from class-variance-authority

* The API is close enough that most simple uses are drop-in.
* Type inference is stricter; some loose usages may need small adjustments.
* Memoization behavior differs. Test hot paths if you relied on CVA internals.

---

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