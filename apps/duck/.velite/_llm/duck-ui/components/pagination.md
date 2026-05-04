## Philosophy

Pagination is a navigation pattern, not a data-fetching pattern. We provide the visual components (page buttons, next/previous, ellipsis) and let you wire them to your data layer. This separation means the same pagination UI works whether you're paginating a client-side array, an API, or a database cursor. Under the hood, this component composes `@gentleduck/primitives/pagination` for semantic structure and direction-aware behavior.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add pagination
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives
```

Add the `Button` component to your project.

The `Pagination` component uses the [`Button`](/docs/components/button) component. Make sure you have it installed in your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

```tsx showLineNumbers

```

## Examples

### Next.js

By default the `` component will render an `` tag.

To use the Next.js `` component, make the following updates to `pagination.tsx`.

```diff showLineNumbers /typeof Link/ {1}
+ import Link from "next/link"

- type PaginationLinkProps = ... & React.ComponentPropsWithoutRef<"a">
+ type PaginationLinkProps = ... & React.ComponentProps

## RTL Support

Use the `text` prop on `PaginationPrevious`, `PaginationNext`, and `PaginationEllipsis` to provide translated labels. Set `dir="rtl"` on `Pagination` for a local override, or set `DirectionProvider` once at app/root level for global direction. Keep markup in logical order (`Previous`, pages, `Next`): visual mirroring is handled automatically.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionPagination` with `MotionPaginationLink`, `MotionPaginationPrevious`, and `MotionPaginationNext` for staggered entrance animations and tap feedback powered by [motion](https://motion.dev). Each link fades in with scale and blur, staggered by 50ms via the `index` prop.

}>
Requires the `motion` package. Use the `Motion*` variants instead of the base components. Same props plus `index` for stagger delay. The regular components are perfectly fine - this is an optional enhancement.

## API Reference

### Pagination

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional CSS classes for the `nav` element |
| `...props` | `React.ComponentPropsWithoutRef<'nav'>` | - | Additional props to spread to the nav element |

### PaginationContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the `ul` element |
| `...props` | `React.ComponentPropsWithoutRef<'ul'>` | - | Additional props to spread to the ul element |

### PaginationItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the `li` element |
| `...props` | `React.ComponentPropsWithoutRef<'li'>` | - | Additional props to spread to the li element |

### PaginationLink

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isActive` | `boolean` | - | Marks the link as active/current page (adds `aria-current="page"` and styles) |
| `size` | `'icon' \| 'default' \| 'sm'` | `'icon'` | Size variant for the button style |
| `...props` | `React.ComponentPropsWithoutRef<'a'>` | - | Additional props to spread to the a element |

### PaginationPrevious

Extends `PaginationLink` with `aria-label="Go to previous page"`, left arrow icon, and text "Previous". Uses `'default'` size.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `'Previous'` | Visible label text. Override for i18n / RTL support. |
| `className` | `string` | `--` | Additional CSS classes for the previous link |
| `...props` | `React.ComponentPropsWithoutRef
```

### MotionPagination

`scaleIn` entrance with `springBouncy` transition on mount. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `PaginationProps` | - | All props from `Pagination` are supported |

### MotionPaginationLink

Staggered `scaleIn` entrance + `whileTap` press feedback (scale 0.97). Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `...props` | `PaginationLinkProps` | - | All props from `PaginationLink` are supported |

### MotionPaginationPrevious

Uses `MotionPaginationLink` internally with preset icon and label. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `text` | `string` | `'Previous'` | Label text shown alongside the chevron |
| `...props` | `PaginationLinkProps` | - | All other props from `PaginationLink` are supported |

### MotionPaginationNext

Uses `MotionPaginationLink` internally with preset icon and label. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `text` | `string` | `'Next'` | Label text shown alongside the chevron |
| `...props` | `PaginationLinkProps` | - | All other props from `PaginationLink` are supported |