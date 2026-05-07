## Philosophy

Command palettes are the power user's best friend  -  they surface every action in the app behind a single keyboard shortcut. The command primitive provides built-in search filtering, group visibility management, keyboard navigation, and typeahead with minimal API surface. The composable sub-components let you build anything from a simple search to a full IDE-style command center.

## About

This component is built on top of the [@gentleduck/primitives](https://github.com/gentleeduck/gentleduck/tree/master/packages/duck-primitives) command primitive, following the same Radix-style context/collection pattern used by Select and other primitives. The registry-layer components are thin styling wrappers around the primitives.

Direction (`dir`) is resolved once at the root `Command` primitive via `useDirection` and stored in context. Every child primitive  -  `CommandInput`, `CommandList`, `CommandItem`, `CommandGroup`, `CommandEmpty`, and `CommandSeparator`  -  reads `dir` from context and applies it to its DOM element automatically. Use local `dir` on `Command` when needed, or set `DirectionProvider` at app/root level for global direction.

**Features:**

* **Searchable Command Dialog:** Command palette with search and real-time filtering.
* **Groupable Command List:** Organize commands into logical groups with optional headings.
* **Selectable Items:** Items support click actions, focus-based highlighting, and selection via Enter/Space.
* **Keyboard Navigation:** Full keyboard support with arrow keys, Enter, Space, and vim-style bindings (gg/G).
* **Typeahead Search:** Type printable characters to jump to matching items in the list.
* **Custom Shortcuts:** Optional shortcut labels shown beside each command item.
* **Empty State Handling:** Automatically displays a fallback when no items match the query.
* **RTL Support:** Full right-to-left layout via local `dir` override or global `DirectionProvider`.
* **Accessible & Composable:** ARIA roles (`listbox`, `option`, `combobox`, `status`) and headless architecture for complete flexibility.
* **Responsive Design:** Adapts gracefully to different screen sizes and containers.
* **Dialog or Inline Support:** Can be used as a floating dialog or embedded inline.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add command
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs @gentleduck/vim lucide-react
```

Add the `Dialog` and `ScrollArea` components to your project.

The `Command` component uses the [`Dialog`](/duck-ui/components/dialog) and [`ScrollArea`](/duck-ui/components/scroll-area) components. Make sure you have them installed in your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui'
```

```tsx
<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Search GitHub</CommandItem>
      <CommandItem>Search Twitter</CommandItem>
      <CommandItem>Search Discord</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>General</CommandItem>
      <CommandItem>Profile</CommandItem>
      <CommandItem>Notifications</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Examples

### Dialog

```tsx title="components/command-2.tsx"
// import from your project: import Demo from '@/components/command-2'
'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gentleduck/registry-ui/command'
import { useKeyCommands } from '@gentleduck/vim/react'

import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)

  useKeyCommands(
    {
      'ctrl+j': {
        description: 'Open command menu',
        execute: () => {
          setOpen(true)
        },
        name: '⌘j',
      },
    },
    { preventDefault: true },
  )

  return (
    <>
      <p className="text-muted-foreground text-sm">
        Press{' '}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
```

To show the command menu in a dialog, use the `` component, or use the `` component with the `command` variant.

```tsx
import { useKeyCommands } from '@gentleduck/vim/react'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  useKeyCommands(
    {
      'ctrl+j': {
        description: 'Open command menu',
        execute: () => {
          setOpen(true)
        },
        name: 'ctrl+j',
      },
    },
    { preventDefault: true },
  )


  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Settings</CommandItem>
          <CommandItem>Messages</CommandItem>
          <CommandItem>Search</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

## Component Composition

## Types

**CommandContextValue**

Returned by `useCommandContext()`. Provides root command state.

| Property | Type | Description |
| --- | --- | --- |
| `search` | `string` | Current search query value. |
| `onSearchChange` | `(search: string) => void` | Callback to update the search query. |
| `dir` | `'ltr' \| 'rtl'` | Text direction for the command tree. Uses the same `useDirection` resolution order. |
| `listId` | `string` | Auto-generated id linking the input to the list via `aria-controls`. |
| `inputRef` | `React.RefObject<HTMLInputElement \| null>` | Search input field reference. |
| `typeaheadSearchRef` | `React.RefObject<string>` | Ref tracking the current typeahead search string. |

---

**CommandListContextValue**

Returned by `useCommandListContext()`. Provides list-level state.

| Property | Type | Description |
| --- | --- | --- |
| `onItemLeave` | `() => void` | Called when pointer leaves an item; returns focus to the input. |
| `listRef` | `React.RefObject<HTMLUListElement \| null>` | The `ul` element holding items. |
| `emptyRef` | `React.RefObject<HTMLDivElement \| null>` | The empty state div ref. |
| `selectedItem` | `HTMLLIElement \| null` | The first visible item after filtering. |

---

**CommandItemContextValue**

Per-item context. Available via `useCommandItemContext()`.

| Property | Type | Description |
| --- | --- | --- |
| `value` | `string` | The item's value. |
| `disabled` | `boolean` | Whether the item is disabled. |
| `textId` | `string` | Auto-generated id for the item's text label. |
| `onItemTextChange` | `(node: HTMLElement \| null) => void` | Callback to update the item's text value from the DOM. |

---

**CommandBadgeProps (CommandShortcut)**

| Property | Type | Description |
| --- | --- | --- |
| `keys` | `string` (optional) | Keyboard shortcut string (e.g. `'ctrl+K'`). |
| `onKeysPressed` | `() => void` (optional) | Called when the shortcut is triggered. |
| `variant` | `'default' \| 'secondary'` (optional) | Visual style. |
| `...props` | `React.HTMLProps<HTMLElement>` | Native `kbd` element props. |

## RTL Support

RTL is handled at the primitive layer. Set `dir="rtl"` on the root `Command` for a local override, or set `DirectionProvider` once at app/root level for global direction. Child primitives inherit direction automatically.

```tsx
<Command dir="rtl">
  <CommandInput placeholder="..." />
  <CommandList>
    <CommandGroup heading="...">
      <CommandItem>...</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

```tsx title="components/command-3.tsx"
// import from your project: import Demo from '@/components/command-3'
'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gentleduck/registry-ui/command'
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

export default function Demo() {
  return (
    <Command className="h-fit w-80 border pt-0" dir="rtl">
      <CommandInput placeholder="...اكتب امرا او ابحث" />
      <CommandList>
        <CommandEmpty>لا توجد نتائج.</CommandEmpty>
        <CommandGroup heading="اقتراحات">
          <CommandItem>
            <Calendar />
            <span>التقويم</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>بحث عن رموز تعبيرية</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>الالة الحاسبة</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="الاعدادات">
          <CommandItem>
            <User />
            <span>الملف الشخصي</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>الفواتير</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>الاعدادات</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionCommandItem` for staggered entrance animations powered by [motion](https://motion.dev). Each item fades in with scale and blur, staggered by 30ms via the `index` prop.

```tsx title="components/command-4.tsx"
// import from your project: import Demo from '@/components/command-4'
'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  MotionCommandItem,
} from '@gentleduck/registry-ui/command'
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

export default function Demo() {
  return (
    <Command className="h-fit w-80 border pt-0">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <MotionCommandItem index={0}>
            <Calendar />
            <span>Calendar</span>
          </MotionCommandItem>
          <MotionCommandItem index={1}>
            <Smile />
            <span>Search Emoji</span>
          </MotionCommandItem>
          <MotionCommandItem index={2} disabled>
            <Calculator />
            <span>Calculator</span>
          </MotionCommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <MotionCommandItem index={3}>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </MotionCommandItem>
          <MotionCommandItem index={4}>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </MotionCommandItem>
          <MotionCommandItem index={5}>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </MotionCommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

}>
Requires the `motion` package. Use `MotionCommandItem` instead of `CommandItem`. Same props plus `index` for stagger delay. All other sub-components stay the same.

## API Reference

### Command

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`) and inherited by children. |
| `className` | `string` | - | Additional CSS classes applied to the command container |
| `children` | `React.ReactNode` | - | Command content (`CommandInput`, `CommandList`, etc.) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the root div |

### CommandInput

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | `'Search...'` | Placeholder text in the input |
| `autoFocus` | `boolean` | `false` | Automatically focus input on mount |
| `wrapperClassName` | `string` | - | Additional CSS classes applied to the input wrapper div |
| `children` | `React.ReactNode` | - | Extra elements rendered inside the input wrapper (after the input), e.g. action buttons |
| `onChange` | `React.ChangeEventHandler` | - | Triggered when the input value changes. Also drives internal search filtering. |
| `...props` | `React.HTMLProps<HTMLInputElement>` | - | Additional props to spread to the input element |

### CommandList

Handles search filtering internally: items are hidden/shown based on the current search query. Groups and separators with no visible items are automatically hidden. The empty state element is toggled based on whether all items are filtered out.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the list |
| `children` | `React.ReactNode` | - | `CommandGroup`, `CommandItem`, `CommandEmpty`, and `CommandSeparator` elements |
| `...props` | `React.HTMLProps<HTMLUListElement>` | - | Additional props to spread to the ul element (`role="listbox"`) |

### CommandItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | The internal value for selection |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `textValue` | `string` | - | Optional text used for filtering/typeahead. Defaults to the item's text content. |
| `onSelect` | `(value: string) => void` | - | Called when the item is selected (via Enter, Space, or pointer) |
| `...props` | `React.HTMLProps<HTMLLIElement>` | - | Additional props to spread to the li element (`role="option"`) |

### CommandGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `React.ReactNode` | - | Optional heading for the group. Renders a div with `data-slot="command-group-heading"`. |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the group div (`role="group"`) |

### CommandEmpty

Renders a `div` with `role="status"` and `aria-live="polite"`. Hidden by default; the list's filtering logic shows it when all items are filtered out.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the empty state |
| `children` | `React.ReactNode` | - | Content shown when no items match the search query |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the div element |

### CommandShortcut

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `string` (optional) | - | Keyboard shortcut string (e.g. `"ctrl+K"`) |
| `onKeysPressed` | `() => void` (optional) | - | Triggered when shortcut is pressed |
| `variant` | `'default' \| 'secondary'` | `'default'` | Visual style variant |
| `...props` | `React.HTMLProps<HTMLElement>` | - | Additional props to spread to the kbd element |

### CommandSeparator

Renders a `div` with `role="separator"` and `aria-hidden`. Visibility is automatically managed by the list's filtering logic.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the separator |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the separator div |

### CommandDialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Command content rendered inside the dialog (typically `CommandInput`, `CommandList`, etc.) |
| `shouldFilter` | `boolean` | - | Whether the command primitive should filter items internally |
| `contentClassName` | `string` | - | Additional CSS classes applied to the inner `DialogContent`, useful for controlling dialog size |
| `...props` | `React.ComponentPropsWithRef<typeof Dialog>` | - | Additional props inherited from `Dialog`. |

### MotionCommandItem

Renders directly as `m.li` with a staggered `scaleIn` entrance using `springBouncy`. Drop-in replacement for `CommandItem`. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (30ms per index) for entrance animation |
| `value` | `string` | `''` | The internal value for selection |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `textValue` | `string` | - | Optional text used for filtering/typeahead. Defaults to the item's text content. |
| `onSelect` | `(value: string) => void` | - | Called when the item is selected (via Enter, Space, or pointer) |
| `...props` | `Omit<CommandItemProps, 'onDrag' \| 'onDragStart' \| 'onDragEnd' \| 'onAnimationStart'>` | - | All props from `CommandItem` except motion event handlers |