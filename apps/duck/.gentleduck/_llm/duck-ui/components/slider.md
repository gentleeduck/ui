```tsx title="components/slider-1.tsx"
// import from your project: import Demo from '@/components/slider-1'
import { Slider } from '@gentleduck/registry-ui/slider'

export default function Demo() {
  return <Slider defaultValue={[75]} max={100} step={1} className="mx-auto w-full max-w-xs" />
}
```

## Philosophy

Sliders let users select values within a range through direct manipulation. We build on Radix's accessible foundation (keyboard arrows, ARIA attributes, RTL support) and add the visual track/range/thumb styling. The Root/Track/Range/Thumb decomposition lets you restyle any part without rebuilding the interaction logic.

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add slider
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Slider } from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={[33]} max={100} step={1} />
```

## Examples

### Range

```tsx title="components/slider-2.tsx"
// import from your project: import Demo from '@/components/slider-2'
import { Slider } from '@gentleduck/registry-ui/slider'

export default function Demo() {
  return <Slider defaultValue={[25, 50]} max={100} step={5} className="mx-auto w-full max-w-xs" />
}
```

### Horizontal

```tsx title="components/slider-3.tsx"
// import from your project: import Demo from '@/components/slider-3'
import { cn } from '@gentleduck/libs/cn'
import { Slider } from '@gentleduck/registry-ui/slider'

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Slider className={cn('w-[60%]')} defaultValue={[33]} max={100} orientation="horizontal" />
    </div>
  )
}
```

### Vertical

```tsx title="components/slider-4.tsx"
// import from your project: import Demo from '@/components/slider-4'
import { Slider } from '@gentleduck/registry-ui/slider'

export default function Demo() {
  return (
    <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-6">
      <Slider defaultValue={[50]} max={100} step={1} orientation="vertical" className="h-40" />
      <Slider defaultValue={[25]} max={100} step={1} orientation="vertical" className="h-40" />
    </div>
  )
}
```

## Component Composition

## RTL Support

Set `dir="rtl"` on `Slider` for a local override, or set `DirectionProvider` once at app/root level for global direction.

```tsx title="components/slider-5.tsx"
// import from your project: import Demo from '@/components/slider-5'
import { Slider } from '@gentleduck/registry-ui/slider'

export default function Demo() {
  return <Slider defaultValue={[75]} max={100} step={1} className="mx-auto w-full max-w-xs" dir="rtl" />
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionSlider` for a smooth entrance animation powered by [motion](https://motion.dev). The slider fades in with scale and blur on mount using `springBouncy`.

```tsx title="components/slider-6.tsx"
// import from your project: import Demo from '@/components/slider-6'
import { MotionSlider } from '@gentleduck/registry-ui/slider'

export default function Demo() {
  return <MotionSlider defaultValue={[75]} max={100} step={1} className="mx-auto w-full max-w-xs" />
}
```

}>
  Requires the `motion` package. Use `MotionSlider` instead of `Slider`. Same props. The regular `Slider` is perfectly fine - this is an optional enhancement.

## API Reference

### Slider

A unified slider component that supports both single-thumb and multi-thumb (range) usage. Pass a single-element `defaultValue` array for a single thumb, or a multi-element array for a range slider. Internally composes `SliderPrimitive.Root`, `SliderPrimitive.Track`, `SliderPrimitive.Range`, and dynamically renders `SliderPrimitive.Thumb` elements based on the values array.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `defaultValue` | `number[]` | - | Uncontrolled initial values. When omitted (and `value` is also omitted), two thumbs are rendered at `[min, max]`. |
| `value` | `number[]` | - | Controlled values array |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`) and inherited by slider parts. |
| `min` | `number` | `0` | Minimum allowed value |
| `max` | `number` | `100` | Maximum allowed value |
| `...props` | `React.ComponentProps<typeof SliderPrimitive.Root>` | - | All other props from `SliderPrimitive.Root` |

### MotionSlider

`scaleIn` entrance with `springBouncy` transition on mount. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `SliderProps` | - | All props from `Slider` are supported |

### Primitive Sub-components

The following primitives are used internally by `Slider`:

#### SliderPrimitive.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | - | Name for form submission |
| `disabled` | `boolean` | `false` | Disables the slider |
| `min` | `number` | `0` | Minimum allowed value |
| `max` | `number` | `100` | Maximum allowed value |
| `step` | `number` | `1` | Increment step for values |
| `value` | `number[]` | - | Controlled values array |
| `defaultValue` | `number[]` | `[min]` | Uncontrolled initial values |
| `onValueChange` | `(value: number[]) => void` | - | Callback fired on every value change |
| `onValueCommit` | `(value: number[]) => void` | - | Callback fired when interaction ends (pointer up or key commit) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction for horizontal sliders. Uses the same `useDirection` resolution order. |
| `inverted` | `boolean` | `false` | Inverts the slider direction |
| `minStepsBetweenThumbs` | `number` | `0` | Minimum number of steps between thumbs |
| `form` | `string` | - | Associates with a form element by ID |

#### SliderPrimitive.Track

Renders a `<span>`. Accepts all standard span props.

#### SliderPrimitive.Range

Renders a `<span>`. Accepts all standard span props.

#### SliderPrimitive.Thumb

Renders a `<span>`. The thumb index is auto-detected from render order.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | - | Optional name override for this thumb's hidden input |