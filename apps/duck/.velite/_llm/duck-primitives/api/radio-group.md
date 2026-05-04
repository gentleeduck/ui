```tsx

```

## Anatomy

```tsx

```

## Example

```tsx

function DensityPicker() {
  return (

  )
}
```

## API

### `RadioGroup.Root`

Container for a single-selection radio set. Uses roving focus and form-compatible hidden radio inputs.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Initial selected value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Called when selected value changes |
| `disabled` | `boolean` | `false` | Disables all items in the group |
| `required` | `boolean` | `false` | Marks the group required for form validation |
| `name` | `string` | - | Name used for hidden native radio inputs |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved with `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `orientation` | `'horizontal' \| 'vertical'` | - | Limits arrow-key navigation axis |
| `loop` | `boolean` | `true` | Wraps focus from end to start (and reverse) |
| `...props` | `React.ComponentPropsWithoutRef<'div'>` | - | Additional props for the radiogroup container |

### `RadioGroup.Item`

A single radio control. Renders a `button` with `role="radio"` and associated state data attributes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | Unique value for the item |
| `textValue` | `string` | - | Optional text override used for typeahead matching |
| `disabled` | `boolean` | `false` | Disables this item |
| `...props` | `React.ComponentPropsWithoutRef<'button'>` | - | Additional props for the radio button element |

### `RadioGroup.Indicator`

Indicator content that mounts when the parent item is checked.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `true` | - | Force indicator to stay mounted for animation control |
| `...props` | `React.ComponentPropsWithoutRef<'span'>` | - | Additional props for the indicator element |

## Keyboard interactions

| Key | Action |
| --- | --- |
| <Kbd>ArrowUp</Kbd> / <Kbd>ArrowLeft</Kbd> | Move focus to previous item and select it |
| <Kbd>ArrowDown</Kbd> / <Kbd>ArrowRight</Kbd> | Move focus to next item and select it |
| <Kbd>Home</Kbd> / <Kbd>PageUp</Kbd> | Move to first item and select it |
| <Kbd>End</Kbd> / <Kbd>PageDown</Kbd> | Move to last item and select it |
| <Kbd>a-z</Kbd> | Typeahead jump to matching item and select it |
| <Kbd>g</Kbd> <Kbd>g</Kbd> | Jump to first item and select it |
| <Kbd>Shift</Kbd>+<Kbd>g</Kbd> (`G`) | Jump to last item and select it |
| <Kbd>Space</Kbd> | Select focused item |