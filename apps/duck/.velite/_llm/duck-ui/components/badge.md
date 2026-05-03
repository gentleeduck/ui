## Features

- Supports multiple **styles**, **sizes**, and **borders** with Tailwind theming
- Built-in **hover**, **focus**, and **ring** states for accessibility
- **Icon-ready** with circular `icon` mode and smart sizing
- Lightweight, **ref-forwarding**, and easily composable
- Powered by `@gentleduck/variants` for scalable, consistent design

## Philosophy

A badge is metadata made visible. It labels, categorizes, and quantifies without demanding interaction. We deliberately keep badges non-interactive by default  -  if you need a clickable label, compose it with a button. This constraint keeps the component's purpose clear and its accessibility story simple.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add badge
```

Install the following dependencies:

```bash
npm install @gentleduck/variants @gentleduck/primitives @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

      <TooltipContent>Info Badge</TooltipContent>

  )
}
```

### Default

### Secondary 

### Destructive

### Warning

### Dashed

### Outline

### Icon

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionBadge` for a smooth fade-up entrance animation powered by [motion](https://motion.dev). The badge slides up with blur and opacity on mount.

}>
Requires the `motion` package. Use `MotionBadge` instead of `Badge`. Same props except `asChild` is not supported.

## API Reference

### Badge

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'warning' \| 'dashed' \| 'outline' \| 'nothing'` | `'default'` | Visual style of the badge |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Size of the badge |
| `border` | `'default' \| 'primary' \| 'secondary' \| 'destructive' \| 'warning'` | `'default'` | Border style variant |
| `asChild` | `boolean` | `false` | If `true`, renders using a `Slot` instead of a `span` element |
| `className` | `string` | `--` | Additional class names to apply |
| `...props` | `Omit<React.HTMLProps<HTMLSpanElement>, 'size'>` | - | Additional props to spread to the span element |

### MotionBadge

Fades up with blur on mount using the `fadeUp` preset and `contentTransition` (250ms expo-out). `asChild` is not supported. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `Omit<BadgeProps, 'asChild'>` | - | All props from `Badge` except `asChild` |