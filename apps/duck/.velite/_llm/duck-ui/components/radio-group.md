## Philosophy

Radio groups enforce single selection from a set  -  the constraint is the feature. Unlike checkboxes (multi-select) or selects (dropdown), radio groups make all options visible simultaneously. The primitive layer handles keyboard navigation (arrow keys plus Home/End/PageUp/PageDown navigation, auto-selecting on focus), form integration via hidden native radio inputs, and RTL direction support.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add radio-group
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

## Keyboard Navigation

| Key | Description |
| --- | --- |
| `ArrowDown` | Move focus to next item and select it |
| `ArrowRight` | Move focus to next item and select it |
| `ArrowUp` | Move focus to previous item and select it |
| `ArrowLeft` | Move focus to previous item and select it |
| `Home` | Move focus to first item and select it |
| `End` | Move focus to last item and select it |
| `PageUp` | Move focus to first item and select it |
| `PageDown` | Move focus to last item and select it |
| `a-z` | Jump to next item matching typed characters and select it |
| `g` `g` | Jump to first item and select it |
| `G` | Jump to last item and select it |
| `Tab` | Move focus into/out of the radio group |
| `Space` | Select the focused item (if not already selected) |

## RTL Support

Set `dir="rtl"` on `RadioGroup` for a local override, or set `DirectionProvider` once at app/root level for global direction.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionRadioGroup` and `MotionRadioGroupItem` for staggered entrance animations powered by [motion](https://motion.dev). Each item fades in with scale and blur, staggered by 50ms.

}>
Requires the `motion` package. Use `MotionRadioGroup` + `MotionRadioGroupItem` instead of `RadioGroup` + `RadioGroupItem`. Same props. The regular components are perfectly fine - this is an optional enhancement.

## API Reference

### RadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled value of the selected radio item |
| `defaultValue` | `string` | - | Initial selected value when uncontrolled |
| `onValueChange` | `(value: string) => void` | - | Callback fired when selection changes |
| `disabled` | `boolean` | `false` | Whether the entire group is disabled |
| `required` | `boolean` | `false` | Whether the group is required in a form |
| `name` | `string` | - | The name used when submitting an HTML form |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `orientation` | `'horizontal' \| 'vertical'` | - | The orientation of the group for arrow key navigation |
| `loop` | `boolean` | `true` | Whether keyboard navigation should loop |
| `className` | `string` | - | Additional CSS classes |

### RadioGroupItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | Unique value for the radio item |
| `disabled` | `boolean` | `false` | Whether this item is disabled |
| `indicator` | `React.ReactElement` | - | Custom SVG or element for unchecked state indicator |
| `checkedIndicator` | `React.ReactElement` | - | Custom SVG or element for checked state indicator |
| `textValue` | `string` | - | Optional text used for keyboard typeahead matching (`a-z`). In the registry component, plain string/number children are inferred automatically. |
| `children` | `React.ReactNode` | - | Label content. When provided, a clickable label is rendered next to the control and selects the item on click. |
| `className` | `string` | - | Additional CSS classes for the radio button control |

### MotionRadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `RadioGroupProps` | - | All props from `RadioGroup` are supported |

Wraps `RadioGroup` and auto-injects stagger `index` into `MotionRadioGroupItem` children. Requires the `motion` package.

### MotionRadioGroupItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `...props` | `RadioGroupItemProps` | - | All props from `RadioGroupItem` are supported |

Wraps `RadioGroupItem` with a staggered `scaleIn` entrance animation and a bounce (scale + rotate) on the radio circle when clicked. Requires the `motion` package.

## See also

- [Checkbox](/docs/components/checkbox)  -  Multi-selection toggle control
- [Switch](/docs/components/switch)  -  Toggle between on and off states
- [Select](/docs/components/select)  -  Dropdown selection from a list
- [Radio Group Primitive API](/docs/packages/duck-primitives/api/radio-group)  -  Headless primitive reference (`Root`, `Item`, `Indicator`)