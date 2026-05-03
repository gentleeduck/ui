```tsx

```

## Anatomy

```tsx

```

---

## Example

### Single selection

```tsx

function TextAlign() {
  return (

  )
}
```

### Multiple selection

```tsx
function FormatOptions() {
  return (

      <ToggleGroup.Item value="bold" className="rounded p-2 data-[state=on]:bg-accent">B</ToggleGroup.Item>
      <ToggleGroup.Item value="italic" className="rounded p-2 data-[state=on]:bg-accent">I</ToggleGroup.Item>
      <ToggleGroup.Item value="underline" className="rounded p-2 data-[state=on]:bg-accent">U</ToggleGroup.Item>

  )
}
```

---

## API

### `ToggleGroup.Root`

The root container. Renders a `<div>`. Supports two modes: `single` and `multiple`.

#### Single mode

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'single'` | - | Only one item can be active |
| `value` | `string` | - | Controlled active value |
| `defaultValue` | `string` | - | Initial active value |
| `onValueChange` | `(value: string) => void` | - | Called when active value changes |

#### Multiple mode

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'multiple'` | - | Multiple items can be active |
| `value` | `string[]` | - | Controlled active values |
| `defaultValue` | `string[]` | - | Initial active values |
| `onValueChange` | `(value: string[]) => void` | - | Called when active values change |

#### Shared props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rovingFocus` | `boolean` | `true` | Enable roving focus keyboard navigation |
| `disabled` | `boolean` | `false` | Disables the entire group |
| `orientation` | `'horizontal' \| 'vertical'` | - | Arrow key navigation direction |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction |
| `loop` | `boolean` | `true` | Keyboard navigation wraps around |
| `asChild` | `boolean` | - | Render as child element |

Exposes `data-orientation` attribute.

### `ToggleGroup.Item`

An individual toggle button within the group. Renders a `<button>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | **Required.** Unique value for this item |
| `disabled` | `boolean` | - | Disables this item (inherits from group) |
| `asChild` | `boolean` | - | Render as child element |

Exposes `aria-pressed` (multiple mode), `role="radio"` (single mode), `data-state` (`on` | `off`), and `data-disabled` attributes.

---

## Keyboard interactions

| Key | Action |
| --- | --- |
| <Kbd>Tab</Kbd> | Moves focus into the group and to the active item |
| <Kbd>ArrowRight</Kbd> | Moves focus to the next item (horizontal) |
| <Kbd>ArrowLeft</Kbd> | Moves focus to the previous item (horizontal) |
| <Kbd>ArrowDown</Kbd> | Moves focus to the next item (vertical) |
| <Kbd>ArrowUp</Kbd> | Moves focus to the previous item (vertical) |
| <Kbd>Home</Kbd> | Moves focus to the first item |
| <Kbd>End</Kbd> | Moves focus to the last item |
| <Kbd>Space</Kbd> / <Kbd>Enter</Kbd> | Toggles the focused item |