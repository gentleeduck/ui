## Philosophy

Buttons are the primary call to action in any interface. We ship an intentionally rich variant system because buttons carry the most visual weight in UI decisions  -  primary, destructive, ghost, and outline each communicate different levels of commitment. The `asChild` pattern lets you render any element as a button, because sometimes a link needs to look like one.

- Multiple **styles**, **sizes**, and **border** options out of the box
- Built-in **loading state** with spinner and auto-disable
- Supports **icons**, **dual icons**, and **collapsed icon-only mode**
- Flexible `asChild` rendering for links and custom wrappers
- Smooth **hover animations** with optional `AnimationIcon`
- Fully **typed**, **accessible**, and **responsive**
- Powered by `@gentleduck/variants` for scalable theming
- Clean, composable, and **Tailwind-optimized**

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add button
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/variants @gentleduck/libs lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx
` with `animate-spin`, disables interaction, and replaces the leading `icon` until loading completes.

### With Second Icon

### Collapsible

### Expand Icon

## RTL Support

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionButton` for subtle press feedback powered by [motion](https://motion.dev). The button scales to 0.97 on tap for a physical press feel.

}>
Requires the `motion` package. Use `MotionButton` instead of `Button`. Same props except `asChild` is not supported. The regular `Button` is perfectly fine - this is an optional enhancement.

## API Reference

### Button

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive' \| 'warning' \| 'outline' \| 'dashed' \| 'secondary' \| 'ghost' \| 'link' \| 'expandIcon' \| 'nothing'` | `'default'` | Visual style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-lg'` | `'default'` | Size of the button |
| `border` | `'default' \| 'primary' \| 'secondary' \| 'destructive' \| 'warning'` | `'default'` | Border style variant |
| `asChild` | `boolean` | `-` | If `true`, renders using a custom child element via `Slot` (e.g. a `Link`) |
| `loading` | `boolean` | `-` | If `true`, renders ``, disables the button, and temporarily overrides `icon` |
| `disabled` | `boolean` | `-` | Disables the button manually |
| `icon` | `React.ReactNode` | `-` | Primary icon displayed before the content (or centered if collapsed) |
| `secondIcon` | `React.ReactNode` | `-` | Secondary icon displayed after the content |
| `isCollapsed` | `boolean` | `-` | If `true`, renders icon-only button (hides children and secondIcon) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native HTML button type |
| `...props` | `Omit<React.HTMLProps<HTMLButtonElement>, 'size'>` | - | Additional props to spread to the button element |

### AnimationIcon

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | (required) | Content inside the animation icon wrapper |
| `animationIcon` | `{ icon?: React.ReactNode; iconPlacement?: 'left' \| 'right' }` | `-` | Animation icon configuration with icon element and placement direction |

### MotionButton

Adds `whileTap` press feedback (scale 0.97) and animated icon/text transitions via `AnimatePresence`. `asChild` is not supported. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `Omit<ButtonProps, 'asChild'>` | - | All props from `Button` except `asChild` |