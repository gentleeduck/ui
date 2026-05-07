```tsx
import * as ContextMenu from '@gentleduck/primitives/context-menu'
```

## Anatomy

```tsx
<ContextMenu.Root>
  <ContextMenu.Trigger />
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Label />
      <ContextMenu.Item />
      <ContextMenu.Group>
        <ContextMenu.Item />
      </ContextMenu.Group>
      <ContextMenu.CheckboxItem>
        <ContextMenu.ItemIndicator />
      </ContextMenu.CheckboxItem>
      <ContextMenu.RadioGroup>
        <ContextMenu.RadioItem>
          <ContextMenu.ItemIndicator />
        </ContextMenu.RadioItem>
      </ContextMenu.RadioGroup>
      <ContextMenu.Separator />
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger />
        <ContextMenu.SubContent />
      </ContextMenu.Sub>
      <ContextMenu.Arrow />
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

---

## Example

```tsx
import * as ContextMenu from '@gentleduck/primitives/context-menu'

function FileExplorer() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="w-64 h-64 border-2 border-dashed rounded flex items-center justify-center">
        Right-click here
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="bg-white shadow-lg rounded-md p-1 min-w-[180px] border">
          <ContextMenu.Item className="px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
            New File
          </ContextMenu.Item>
          <ContextMenu.Item className="px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
            New Folder
          </ContextMenu.Item>
          <ContextMenu.Separator className="h-px bg-gray-200 my-1" />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer flex justify-between">
              Sort by <span>></span>
            </ContextMenu.SubTrigger>
            <ContextMenu.SubContent className="bg-white shadow-lg rounded-md p-1 min-w-[140px] border">
              <ContextMenu.Item className="px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                Name
              </ContextMenu.Item>
              <ContextMenu.Item className="px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                Date
              </ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}
```

---

## Key components

### `ContextMenu.Root`

State manager. Opens on right-click on the trigger area.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onOpenChange` | `(open: boolean) => void` | - | Called when open state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction for keyboard navigation |
| `modal` | `boolean` | `true` | Enable modal behavior |

### `ContextMenu.Trigger`

The area that responds to right-click. Renders a `<span>` by default.

### `ContextMenu.Content`

The menu content. Positioned at the cursor location.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `true` | - | Keep mounted regardless of open state |
| `trapFocus` | `boolean` | `context.open` | Override whether focus is trapped inside the content |
| `disableOutsidePointerEvents` | `boolean` | `context.open` | Override whether pointer events outside are blocked |
| `disableOutsideScroll` | `boolean` | `true` | Override whether body scroll is locked while open |
| `onPointerDownOutside` | `(event) => void` | - | Called when clicking outside |
| `onFocusOutside` | `(event) => void` | - | Called when focus moves outside |
| `onEscapeKeyDown` | `(event) => void` | - | Called when Escape is pressed |

The `trapFocus`, `disableOutsidePointerEvents`, and `disableOutsideScroll` props default to sensible values. Override them when integrating with animation libraries like [motion](https://motion.dev) that need custom lifecycle control during exit animations.

### `ContextMenu.Item`

A menu item. Fires `onSelect` when activated.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Disable the item |
| `onSelect` | `(event) => void` | - | Called when item is selected |

### `ContextMenu.CheckboxItem`

A toggleable menu item with checked state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | - | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Called on toggle |

### `ContextMenu.RadioGroup` / `ContextMenu.RadioItem`

Mutually exclusive menu items.

### `ContextMenu.Sub` / `ContextMenu.SubTrigger` / `ContextMenu.SubContent`

Nested submenus.

### `ContextMenu.Separator`

Visual separator between groups.

### `ContextMenu.Label`

Non-interactive label for a group.

---

## Keyboard interactions

| Key | Action |
| --- | --- |
| <Kbd>ArrowDown</Kbd> | Highlight next item |
| <Kbd>ArrowUp</Kbd> | Highlight previous item |
| <Kbd>ArrowRight</Kbd> | Open submenu (on SubTrigger) |
| <Kbd>ArrowLeft</Kbd> | Close submenu |
| <Kbd>Enter</Kbd> / <Kbd>Space</Kbd> | Activate highlighted item |
| <Kbd>Escape</Kbd> | Close menu |