## Philosophy

When multiple toggles share context, they become a group. ToggleGroup manages mutual exclusivity (single mode) or multi-selection, keeping the state logic out of your components. Built on `@gentleduck/primitives/toggle-group` with roving focus keyboard navigation  -  arrow keys move between items, Space/Enter toggles them.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add toggle-group
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/variants @gentleduck/libs
```

Add the [`Toggle`](/duck-ui/components/toggle) component to your project 

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
  <ToggleGroupItem value="c">C</ToggleGroupItem>

```

## Examples

### Default

### Outline

### Single

### Small

### Large

### Disabled

## Keyboard Navigation

| Key | Description |
| --- | --- |
| `Tab` | Moves focus into the toggle group (focuses the active or first item) |
| `ArrowRight` | Moves focus to the next item |
| `ArrowLeft` | Moves focus to the previous item |
| `ArrowDown` | Moves focus to the next item |
| `ArrowUp` | Moves focus to the previous item |
| `Home` | Moves focus to the first item |
| `End` | Moves focus to the last item |
| `Space` / `Enter` | Toggles the focused item |

## RTL Support

Set `dir="rtl"` on `ToggleGroup` for a local override, or set `DirectionProvider` once at app/root level for global direction.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionToggleGroup` and `MotionToggleGroupItem` for staggered entrance animations and tap press feedback powered by [motion](https://motion.dev). Each item fades in with scale and blur, and presses to 0.97 on tap.

}>
Requires the `motion` package. Use `MotionToggleGroup` + `MotionToggleGroupItem` instead of `ToggleGroup` + `ToggleGroupItem`. Same props. The regular components are perfectly fine - this is an optional enhancement.

## API Reference

### ToggleGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'single' \| 'multiple'` | (required) | Determines selection behavior. `'single'` allows one toggle at a time; `'multiple'` allows multiple |
| `value` | `string \| string[]` | - | Controlled selected value(s) |
| `defaultValue` | `string \| string[]` | - | Uncontrolled initial selected value(s) |
| `onValueChange` | `(value: string \| string[]) => void` | - | Callback invoked when the value changes |
| `variant` | `'default' \| 'outline'` | `'default'` | Visual style variant for the toggles (passed to items via context) |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Size variant for the toggles (passed to items via context) |
| `disabled` | `boolean` | `false` | Disables all items in the group |
| `rovingFocus` | `boolean` | `true` | Whether to use roving focus for keyboard navigation |
| `loop` | `boolean` | `true` | Whether keyboard navigation should loop at boundaries |
| `orientation` | `'horizontal' \| 'vertical'` | - | The orientation of the group for arrow key navigation |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS class names to apply |
| `children` | `React.ReactNode` | - | ToggleGroupItem elements to render inside the group |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the underlying div element |

### ToggleGroupItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | The unique value identifying this toggle item |
| `variant` | `'default' \| 'outline'` | - | Visual style variant for this item (overrides group context) |
| `size` | `'default' \| 'sm' \| 'lg'` | - | Size variant for this item (overrides group context) |
| `disabled` | `boolean` | `false` | Disables this specific item |
| `className` | `string` | - | Additional CSS class names to apply |
| `children` | `React.ReactNode` | - | Content rendered inside the toggle item |
| `ref` | `React.Ref<HTMLButtonElement>` | - | Ref forwarded to the underlying button element |

### Data Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `data-state` | `"on" \| "off"` | The pressed state of the item |
| `data-disabled` | Present when disabled | Whether the item is disabled |

### MotionToggleGroup

Staggered `scaleIn` entrance with `springBouncy` transition on each item. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `ToggleGroupProps` | - | All props from `ToggleGroup` are supported |

### MotionToggleGroupItem

Adds `whileTap` press feedback (scale 0.97). Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `Omit<ToggleGroupItemProps, 'onDrag' \| 'onDragStart' \| 'onDragEnd' \| 'onAnimationStart'>` | - | All props from `ToggleGroupItem` except motion event handlers |