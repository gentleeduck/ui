```tsx

```

## Anatomy

```tsx

```

---

## Example

```tsx

function VolumeSlider() {
  return (

  )
}
```

### Range slider (multiple thumbs)

```tsx
function PriceRange() {
  return (

  )
}
```

---

## API

### `Slider.Root`

The root component that manages slider state, drag interactions, keyboard stepping, and provides context to all children. Renders a `<span>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | - | Name for hidden form inputs |
| `disabled` | `boolean` | `false` | Disables the slider |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction (horizontal only). Resolved with `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `min` | `number` | `0` | Minimum allowed value |
| `max` | `number` | `100` | Maximum allowed value |
| `step` | `number` | `1` | Increment step for values |
| `value` | `number[]` | - | Controlled values array |
| `defaultValue` | `number[]` | `[min]` | Uncontrolled initial values |
| `onValueChange` | `(value: number[]) => void` | - | Called on every value change during interaction |
| `onValueCommit` | `(value: number[]) => void` | - | Called when the user finishes an interaction (pointer up or key commit) |
| `inverted` | `boolean` | `false` | Inverts the slider direction |
| `minStepsBetweenThumbs` | `number` | `0` | Minimum number of steps required between thumbs |
| `form` | `string` | - | Associates hidden inputs with a form element by ID |

Exposes `data-disabled` and `data-orientation` attributes. Sets the CSS custom property `--gentleduck-slider-thumb-transform` for thumb positioning.

### `Slider.Track`

The track area the thumbs slide along. Renders a `<span>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |

Exposes `data-disabled` and `data-orientation` attributes.

### `Slider.Range`

The filled portion between thumbs (or from min to a single thumb). Renders a `<span>`. Positioned automatically via inline styles.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |

Exposes `data-disabled` and `data-orientation` attributes.

### `Slider.Thumb`

A draggable thumb. The thumb index is auto-detected from render order  -  you do not need to pass an `index` prop. Renders a `<span>` with `role="slider"`. Each thumb also renders a hidden `<input>` for form submission.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | - | Optional name override for this thumb's hidden input |
| `asChild` | `boolean` | - | Render as child element |

Sets `aria-valuemin`, `aria-valuenow`, `aria-valuemax`, and `aria-orientation` automatically. Exposes `data-disabled` and `data-orientation` attributes.

---

## Keyboard interactions

| Key | Action |
| --- | --- |
| <Kbd>ArrowRight</Kbd> | Increments by one step (horizontal LTR) |
| <Kbd>ArrowLeft</Kbd> | Decrements by one step (horizontal LTR) |
| <Kbd>ArrowUp</Kbd> | Increments by one step (vertical) |
| <Kbd>ArrowDown</Kbd> | Decrements by one step (vertical) |
| <Kbd>PageUp</Kbd> | Increments by ten steps |
| <Kbd>PageDown</Kbd> | Decrements by ten steps |
| <Kbd>Shift</Kbd> + <Kbd>ArrowKey</Kbd> | Increments/decrements by ten steps |
| <Kbd>Home</Kbd> | Sets the focused thumb to the minimum value |
| <Kbd>End</Kbd> | Sets the focused thumb to the maximum value |