```tsx
import * as RovingFocusGroup from '@gentleduck/primitives/roving-focus'
```

## Usage

```tsx
<RovingFocusGroup.Root orientation="horizontal" loop>
  <RovingFocusGroup.Item asChild>
    <button>Item 1</button>
  </RovingFocusGroup.Item>
  <RovingFocusGroup.Item asChild>
    <button>Item 2</button>
  </RovingFocusGroup.Item>
  <RovingFocusGroup.Item asChild>
    <button>Item 3</button>
  </RovingFocusGroup.Item>
</RovingFocusGroup.Root>
```

## Props (Root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | - | Arrow key direction |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved with `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `loop` | `boolean` | `false` | Wrap at boundaries |
| `currentTabStopId` | `string \| null` | - | Controlled active tab stop ID |
| `defaultCurrentTabStopId` | `string` | - | Initial active tab stop ID (uncontrolled) |
| `onCurrentTabStopIdChange` | `(tabStopId: string \| null) => void` | - | Called when the active tab stop changes |
| `onEntryFocus` | `(event: Event) => void` | - | Called when focus enters the group. Call `event.preventDefault()` to prevent auto-focus. |
| `preventScrollOnEntryFocus` | `boolean` | `false` | Prevent scroll when focus enters the group |

## How it works

}>
  Only one item in the group is tabbable at a time (`tabIndex={0}`). All others have `tabIndex={-1}`. Arrow keys move focus between items. This follows the **WAI-ARIA roving tabindex** pattern.

}>
  Used internally by Menubar and other components that need arrow-key navigation.