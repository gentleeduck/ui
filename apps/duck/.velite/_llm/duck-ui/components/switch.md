## Philosophy

Switches represent immediate, binary state changes  -  unlike checkboxes, which defer action to a form submission. This semantic distinction matters for UX: a switch should take effect instantly. We support custom SVG indicators so the on/off metaphor can match your design language without sacrificing the accessible `role="switch"` foundation.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add switch
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/motion @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

```

## Examples

### Form

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionSwitch` for a physical-feeling toggle powered by [motion](https://motion.dev). The thumb slides with a bouncy spring, stretches in the direction of travel when pressed, and the track color crossfades between border and primary.

}>
Requires the `motion` package. Use `MotionSwitch` instead of `Switch`. The motion variant renders its own track + thumb so it does not support the `indicator` / `checkedIndicator` props — use the base `Switch` if you need custom SVG indicators.

## API Reference

### Switch

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional class names for the checkbox input |
| `indicator` | `React.ReactElement` | - | Custom element for the unchecked state indicator |
| `checkedIndicator` | `React.ReactElement` | - | Custom element for the checked state indicator |
| `onChange` | `(event: ChangeEvent) => void` | - | Native checkbox `change` event handler |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback with the new checked boolean when toggled |
| `ref` | `React.Ref<HTMLInputElement>` | - | Ref forwarded to the native checkbox input |
| `style` | `React.CSSProperties` | - | Inline styles applied to the input element |
| `...props` | `React.HTMLProps<HTMLInputElement>` | - | Additional props to spread to the input element |

### MotionSwitch

Renders its own motion-controlled track and thumb. The thumb slides with a bouncy spring, stretches in the direction of travel while pressed, and the track color crossfades between `border` and `primary`. Requires the `motion` package. Does **not** support the `indicator` / `checkedIndicator` props — use the base `Switch` for custom SVG indicators.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. In RTL the thumb starts on the right and the stretch origin flips. |
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Uncontrolled initial checked state |
| `disabled` | `boolean` | `false` | Disables interaction and lowers opacity |
| `onChange` | `(event: ChangeEvent) => void` | - | Native checkbox `change` event handler |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback with the new checked boolean when toggled |
| `className` | `string` | - | Additional class names for the outer track label |
| `style` | `React.CSSProperties` | - | Inline styles applied to the outer track label |
| `...props` | `React.HTMLProps<HTMLInputElement>` | - | Additional props spread onto the hidden input element |

## See also

- [Checkbox](/duck-ui/components/checkbox)  -  Multi-selection toggle control
- [Radio Group](/duck-ui/components/radio-group)  -  Single selection from a set of options