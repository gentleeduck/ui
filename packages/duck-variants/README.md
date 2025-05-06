
<p align="center">
  <img src="https://raw.githubusercontent.com/gentleeduck/ui/98ac7d1f4ec2fdead848d865445312f05bbbf24a/public/variants.png" alt="@gentleduck/variants" width="900"/>
</p>

# `@gentleduck/variants`

A lightweight utility for generating class names based on variant configurations. Inspired by Tailwind and `class-variance-authority`, `@gentleduck/variants` helps you manage and compose class names in a flexible, type-safe, and declarative way.  

## Philosophy

At **GentleDuck**, we believe that developer tools should be **fast**, **reliable**, and **actively maintained** — not abandoned. While `class-variance-authority` initially inspired the idea of variant-based class management, its situation has become unacceptable:  
despite having **over 6 million weekly downloads**, the project has been left **poorly maintained for more than 6 months**, with important pull requests and bug fixes sitting untouched.

Leaving a critical utility like this in a broken or half-maintained state is **unacceptable** to us at **GentleDuck**.  
So, we took action: we rewrote the library from scratch with our own vision and philosophy — making it **more modern**, **more reliable**, and **up to 7× faster**.  

Our goal with **@gentleduck/variants** is simple:  
to offer the community a **serious**, **well-maintained**, and **future-proof** alternative — one that developers can trust today and for the years to come.

---

## Features

- 🧠 **Declarative variant-based styling**  
- 🎯 **Type-safe API with intelligent autocompletion**  
- 🧱 **Composable and extendable utility**  
- 🎨 **Supports default variants and compound variants**  
- 🪶 **Lightweight, zero dependencies, blazing fast**  

---

## Why `@gentleduck/variants`?

- ✅ **Zero dependencies**, tiny bundle footprint. 
- 🔐 **Fully type-safe**, IDE-friendly autocompletion. 
- 🎨 **Flexible styling** via variants, nested arrays & conditionals.
- 🚀 **Minimal runtime & memoized** with zero runtime dependencies (just a few dozen lines of code).
- ⚡ **Blazing fast**: ~7× faster than the reference `(class-variance-authority)[https://www.npmjs.com/package/class-variance-authority]`.
- 🧠 **Powerful system** for defaults, compounds, and custom classes.

---

## Benchmark

### **Vitest Benchmark**
**@gentleduck/variants**: ~7x faster than `(class-variance-authority)[https://www.npmjs.com/package/class-variance-authority]`
<img src="https://github.com/gentleeduck/ui/blob/master/public/vite_benchmark.png" alt="Benchmark" />
<img src="https://raw.githubusercontent.com/gentleeduck/ui/3ae21ea9d8311c330fa85cde3e562fd213d83239/public/vite-bench-cases.png" alt="Benchmark" />

### **Duck Benchmark**
<img src="https://github.com/gentleeduck/ui/blob/master/public/duck_benchmark.png" alt="Benchmark" />



---

## Installation

```bash
npm install @gentleduck/variants
# or
yarn add @gentleduck/variants
# or
pnpm add @gentleduck/variants
```

---

## Getting Started

`@gentleduck/variants` lets you declare your style variants once and get back a function that produces perfectly composed class names, complete with defaults, compounds, nested arrays, and conditional objects.

### Basic Example

```ts
import { cva } from '@gentleduck/variants'

const button = cva('btn', {
  variants: {
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-100 text-gray-800',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
  compoundVariants: [
    { size: 'lg', color: 'primary', className: 'uppercase font-bold' },
  ],
})

button() 
// => 'btn px-4 py-2 text-base bg-blue-500 text-white uppercase font-bold'

button({ size: 'sm', class: ['rounded', 'shadow'] })
// => 'btn px-2 py-1 text-sm bg-blue-500 text-white rounded shadow'
```

---

## Advanced Usage

### Arrays & Multiple Classes

You can supply **arrays** of classes or nested arrays for fine-grained control:

```ts
const badge = cva('badge', {
  variants: {
    size: {
      sm: ['badge-sm', 'text-xs'],
      lg: ['badge-lg', 'text-lg'],
    },
    tone: {
      muted: ['opacity-50', ['italic']],
      loud: ['opacity-100', { 'font-bold': true }],
    },
  },
  defaultVariants: {
    size: 'sm',
    tone: 'muted',
  },
})

badge({ size: 'lg', tone: 'loud' })
// => 'badge badge-lg text-lg opacity-100 font-bold'
```

### Compound Variants

Apply extra classes when **multiple** variant values match:

```ts
const card = cva('card', {
  variants: {
    size: { small: 'card-sm', large: 'card-lg' },
    color: { primary: 'card-primary', secondary: 'card-secondary' },
  },
  defaultVariants: { size: 'small', color: 'primary' },
  compoundVariants: [
    { size: 'large', color: 'primary', class: 'shadow-xl' },
    { size: 'small', color: ['secondary', 'primary'], className: 'border-dashed' },
  ],
})

card({ size: 'large', color: 'primary' })
// => 'card card-lg card-primary shadow-xl'
```

---

## TypeScript Support

Built from the ground up with TypeScript:

- **Autocompletion** for variant keys & values  
- **Strict checks**: invalid variant names/values will error at compile time  
- **Utility types** like `VariantProps<>` to extract only variant-related props  

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

// ✅
alert({ severity: 'error' })

// ❌ TS Error: 'warning' is not a valid severity
alert({ severity: 'warning' })
```

---

## Composing and Extending

Compose one CVA function with another, or extend defaults:

```ts
const baseButton = cva('btn', {
  variants: { size: { sm: 'btn-sm', lg: 'btn-lg' } },
  defaultVariants: { size: 'sm' },
})

const largePrimary = cva(baseButton, {
  defaultVariants: { size: 'lg' },
})

largePrimary({ className: 'mx-2' })
// => 'btn btn-lg mx-2'
```

You can also simply concatenate:

```ts
const icon = cva('icon', { variants: { type: { arrow: 'icon-arrow' } } })

`${button()} ${icon({ type: 'arrow' })}`
// => 'btn px-4 py-2 text-base bg-blue-500 text-white uppercase font-bold icon icon-arrow'
```

---

## API Reference

### `cva(base, options)` / `cva(optionsWithBase)`

Creates your **CVA** function:

```ts
type CvaFn<T> = (
  props?: VariantProps<T> & {
    class?: ClassValue
    className?: ClassValue
  }
) => string
```

- **`base: string`** — always-included classes  
- **`variants`** — map of variant names → (value → class/string[])  
- **`defaultVariants?`** — fallback values  
- **`compoundVariants?`** — apply extra classes when multiple values match  

**Overloads**:

```ts
// Two-arg form
const fn = cva('base', { variants, defaultVariants, compoundVariants })

// Single-arg form
const fn = cva({ base: 'base', variants, defaultVariants, compoundVariants })
```

---

## License

MIT © [GentleDuck](./LICENSE)
