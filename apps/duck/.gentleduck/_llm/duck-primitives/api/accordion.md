```tsx
import * as Accordion from '@gentleduck/primitives/accordion'
```

## Anatomy

```tsx
<Accordion.Root>
  <Accordion.Item>
    <Accordion.Trigger />
    <Accordion.Content />
  </Accordion.Item>
</Accordion.Root>
```

***

## Example

```tsx
import * as Accordion from '@gentleduck/primitives/accordion'

function BasicAccordion() {
  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
        <Accordion.Content>
          Yes. It adheres to the WAI-ARIA design pattern.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Is it unstyled?</Accordion.Trigger>
        <Accordion.Content>
          Yes. It is unstyled by default, giving you full control over styling.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
```

***

## API

### `Accordion.Root`

The root container. Accepts either `type="single"` (one item open at a time) or `type="multiple"` (multiple items open simultaneously). Renders a `<div>`.

#### Single mode

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'single'` | `'single'` | Allows only one item to be open at a time |
| `value` | `string` | - | Controlled open item value |
| `defaultValue` | `string` | - | Initial open item value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Called when the open item changes |
| `collapsible` | `boolean` | `false` | Allow the open item to be closed by clicking its trigger again |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction |

#### Multiple mode

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'multiple'` | - | Allows multiple items to be open simultaneously |
| `value` | `string[]` | - | Controlled array of open item values |
| `defaultValue` | `string[]` | - | Initial array of open item values (uncontrolled) |
| `onValueChange` | `(value: string[]) => void` | - | Called when the open items change |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction |

Exposes `data-orientation` (`vertical`) on the root element.

***

### `Accordion.Item`

A single collapsible section. Must be a direct child of `Accordion.Root`. Renders a `<div>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Unique identifier for the item, used to control open state |
| `disabled` | `boolean` | `false` | Prevents the item from being opened or closed |

Exposes `data-state` (`open` | `closed`) and `data-disabled` attributes.

***

### `Accordion.Trigger`

The button that toggles the associated content panel. Must be a descendant of `Accordion.Item`. Renders a `<button>`.

Inherits all standard `<button>` props.

Exposes `data-state` (`open` | `closed`) and `data-disabled` attributes. Sets `aria-expanded` and `aria-controls` automatically.

***

### `Accordion.Content`

The collapsible panel that contains the item's content. Must be a descendant of `Accordion.Item`. Renders a `<div>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep the content mounted in the DOM even when closed |

Exposes `data-state` (`open` | `closed`) attributes. Sets `role="region"` and `aria-labelledby` automatically.

***

## Keyboard Interaction

| Key | Description |
| --- | --- |
| `Enter` | Toggles the focused item open or closed |
| `Space` | Toggles the focused item open or closed |
| `ArrowDown` | Moves focus to the next trigger |
| `ArrowUp` | Moves focus to the previous trigger |
| `Home` | Moves focus to the first trigger |
| `End` | Moves focus to the last trigger |