## Philosophy

Checkboxes are deceptively complex. A simple checked/unchecked state becomes indeterminate for parent/child relationships, needs accessible labels, and must work in both controlled and uncontrolled modes. We handle all of this with native checkbox semantics and custom SVG indicators, so the visual design is yours while the behavior is correct.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add checkbox
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/motion @gentleduck/libs
```

Make sure you have the [`Label`](/duck-ui/components/label) component installed in your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

```

## Examples

### Basic uncontrolled checkbox

### Controlled checkbox

### Checkbox with label

### Indeterminate state

###  Checkbox group

### Custom indicator icons

### Form

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionCheckboxWithLabel` for staggered fade-up entrance animations powered by [motion](https://motion.dev). Pass `index` for stagger delay.

}>
Requires the `motion` package. Use `MotionCheckboxWithLabel` instead of `CheckboxWithLabel`, or `MotionCheckboxGroup` instead of `CheckboxGroup`. The `Checkbox` component stays the same.

## API Reference

### Checkbox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `indicator` | `React.ReactElement` | - | Custom SVG or icon for unchecked state indicator |
| `checkedIndicator` | `React.ReactElement` | - | Custom SVG or icon for checked state indicator |
| `checked` | `boolean \| 'indeterminate'` | - | Controlled checked state |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | Initial checked state if uncontrolled |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | - | Callback fired when checked state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes applied to the checkbox input |
| `style` | `React.CSSProperties` | - | Inline styles merged with internal indicator styles |
| `ref` | `React.Ref<HTMLInputElement>` | - | Ref forwarded to the native checkbox input |
| `...props` | `Omit<React.HTMLProps<HTMLInputElement>, 'checked' \| 'onChange' \| 'defaultChecked'>` | - | Additional props to spread to the input element |

### CheckboxWithLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | (required) | HTML `id` attribute to link checkbox and label |
| `checkbox` | `React.ComponentPropsWithoutRef<typeof Checkbox>` | (required) | Props passed to the internal `Checkbox` component |
| `label` | `React.ComponentPropsWithoutRef<typeof Label>` | (required) | Props passed to the internal `Label` component |
| `className` | `string` | - | Additional CSS classes applied to the wrapping div |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the wrapping div |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CheckboxGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `subtasks` | `CheckboxGroupSubtasks[]` | (required) | Array of subtasks to render as individual checkboxes with labels |
| `defaults` | `CheckboxWithLabelProps` | - | Default props applied to each checkbox and label in the group |
| `className` | `string` | - | Additional CSS classes applied to the wrapping div |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the wrapping div |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CheckboxGroupSubtasks

```tsx
type CheckboxGroupSubtasks = {
  id: string
  title: string
  checked?: boolean | 'indeterminate'
}
```

### MotionCheckbox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | - | Callback fired when checked state changes. Also triggers the bounce animation. |
| `...props` | `CheckboxProps` | - | All props from `Checkbox` are supported |

Wraps `Checkbox` with a bounce animation (scale + rotate) on check. Requires the `motion` package.

### MotionCheckboxWithLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `...props` | `CheckboxWithLabelProps` | - | All props from `CheckboxWithLabel` are supported |

Wraps `CheckboxWithLabel` with a staggered `scaleIn` entrance. Uses `MotionCheckbox` internally. Requires the `motion` package.

### MotionCheckboxGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `CheckboxGroupProps` | - | All props from `CheckboxGroup` are supported |

Same as `CheckboxGroup` but renders each item as `MotionCheckboxWithLabel` with automatic stagger index. Requires the `motion` package.

## See also

- [Radio Group](/duck-ui/components/radio-group)  -  Single selection from a set of options
- [Switch](/duck-ui/components/switch)  -  Toggle between on and off states