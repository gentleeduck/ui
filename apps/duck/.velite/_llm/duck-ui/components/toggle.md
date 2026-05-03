## Philosophy

Toggles represent a stateful action  -  not navigation, not form submission, but "turn this on or off." The distinction from buttons matters: toggles carry `aria-pressed` state and communicate their current value visually. Built on `@gentleduck/primitives/toggle` for proper keyboard and accessibility behavior, styled with `@gentleduck/variants` to keep visual states clean and type-safe.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add toggle
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/variants @gentleduck/libs
```

Add the `Toggle` component to your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx
<Toggle>Toggle</Toggle>
```

## Examples

### Default

### Outline

### With Text

### Small

### Large

### Disabled

## RTL Support

Set `dir="rtl"` on `Toggle` for a local override, or set `DirectionProvider` once at app/root level for global direction.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionToggle` for subtle press feedback powered by [motion](https://motion.dev). The toggle scales to 0.97 on tap for a physical press feel.

}>
Requires the `motion` package. Use `MotionToggle` instead of `Toggle`. Same props. The regular `Toggle` is perfectly fine - this is an optional enhancement.

## API Reference

### Toggle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names to apply |
| `pressed` | `boolean` | - | The controlled pressed state of the toggle |
| `defaultPressed` | `boolean` | `false` | The pressed state when initially rendered |
| `onPressedChange` | `(pressed: boolean) => void` | - | Event handler called when the pressed state changes |
| `variant` | `'default' \| 'outline'` | `'default'` | Visual style variant of the toggle |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Size variant of the toggle |
| `disabled` | `boolean` | `false` | Disables the toggle if set to `true` |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `children` | `React.ReactNode` | - | Content rendered inside the toggle button |
| `ref` | `React.Ref<HTMLButtonElement>` | - | Ref forwarded to the underlying button element |

### Data Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `data-state` | `"on" \| "off"` | The pressed state of the toggle |
| `data-disabled` | Present when disabled | Whether the toggle is disabled |

### MotionToggle

Adds `whileTap` press feedback and children fade-up animation on mount. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `Omit<ToggleProps, 'onDrag' \| 'onDragStart' \| 'onDragEnd' \| 'onAnimationStart'>` | - | All props from `Toggle` except motion event handlers |