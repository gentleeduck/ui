```tsx
import * as Toggle from '@gentleduck/primitives/toggle'
```

## Anatomy

```tsx
<Toggle.Root />
```

***

## Example

```tsx
import * as Toggle from '@gentleduck/primitives/toggle'
import { Bold } from 'lucide-react'

function BoldToggle() {
  return (
    <Toggle.Root aria-label="Toggle bold" className="rounded p-2 data-[state=on]:bg-accent">
      <Bold className="size-4" />
    </Toggle.Root>
  )
}
```

***

## API

### `Toggle.Root`

A button that toggles between on and off states. Renders a `<button>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` | - | Controlled pressed state |
| `defaultPressed` | `boolean` | `false` | Initial pressed state |
| `onPressedChange` | `(pressed: boolean) => void` | - | Called when pressed state changes |
| `disabled` | `boolean` | `false` | Disables the toggle |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction |
| `asChild` | `boolean` | - | Render as child element |

Exposes `aria-pressed`, `data-state` (`on` | `off`), and `data-disabled` attributes.