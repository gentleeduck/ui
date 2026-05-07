## Philosophy

Breadcrumbs answer "where am I?"  -  the most basic navigation question. We keep the API declarative (BreadcrumbList -> BreadcrumbItem -> BreadcrumbLink) rather than generating breadcrumbs from routes because not every route maps cleanly to a breadcrumb trail. The Separator and Ellipsis sub-components handle the visual connecting tissue.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add breadcrumb
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
```

```tsx showLineNumbers

    
    ` to create a custom separator.

```tsx showLineNumbers {1,10-12}

...

    ` with a `` to create a dropdown in the breadcrumb.

```tsx showLineNumbers {1-6,11-21}

  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

...

` component to show a collapsed state when the breadcrumb is too long.

```tsx showLineNumbers {1,9}

...

    {/* ... */}

```

---

### Link component

To use a custom link component from your routing library, you can use the `asChild` prop on ``.

```tsx showLineNumbers {1,8-10}

...

` with ``, ``, and ``.

It displays a dropdown on desktop and a drawer on mobile.

---

### Responsive with Ellipsis

A responsive breadcrumb that collapses intermediate items behind an ellipsis, displaying a dropdown on desktop and a drawer on mobile.

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionBreadcrumbItem` for staggered fade-up entrance powered by [motion](https://motion.dev). Each breadcrumb item cascades in from left to right.

}>
Requires the `motion` package. Use `MotionBreadcrumbItem` instead of `BreadcrumbItem` and pass the `index` prop for stagger delay. All other sub-components stay the same.

## API Reference

### Breadcrumb

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `separator` | `React.ReactNode` | `--` | Custom separator element between breadcrumb items |
| `className` | `string` | `--` | Additional class names to apply |
| `children` | `React.ReactNode` | `--` | Breadcrumb content (typically a `BreadcrumbList`) |
| `...props` | `React.HTMLProps` | Custom separator icon; defaults to a `ChevronRight` icon |
| `...props` | `React.ComponentPropsWithoutRef<'li'>` | - | Additional props to spread to the li element |

### BreadcrumbEllipsis

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `'More'` | Accessible label used for `aria-label` on the ellipsis element |
| `className` | `string` | `--` | Additional class names to apply |
| `...props` | `React.ComponentPropsWithoutRef<'span'>` | - | Additional props to spread to the span element |

### MotionBreadcrumbList

Wraps `BreadcrumbList` and auto-injects a stagger `index` into each `MotionBreadcrumbItem` and `MotionBreadcrumbSeparator` child. Items and separators share the same counter, so they cascade together across the whole trail. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.ComponentPropsWithoutRef<'ol'>` | - | All props from `BreadcrumbList` are supported |

### MotionBreadcrumbItem

Renders directly as `m.li` with a `scaleIn` entrance using `springSnappy` for a tight, responsive feel. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (35ms per index). Auto-injected when used inside `MotionBreadcrumbList`. |
| `...props` | `React.ComponentPropsWithoutRef<'li'>` | - | All props from `BreadcrumbItem` are supported |

### MotionBreadcrumbSeparator

Renders directly as `m.li` with a `slideFromLeft` entrance so the chevron slides in from the previous item. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (35ms per index). Auto-injected when used inside `MotionBreadcrumbList`. |
| `children` | `React.ReactNode` | `` | Custom separator content |
| `...props` | `React.ComponentPropsWithoutRef<'li'>` | - | All props from `BreadcrumbSeparator` are supported |