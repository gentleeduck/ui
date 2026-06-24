```tsx title="components/dropdown-menu-1.tsx"
// import from your project: import Demo from '@/components/dropdown-menu-1'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'

export default function Demo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>More...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Philosophy

Dropdown menus are the Swiss Army knife of action UIs. They group related actions behind a single trigger, keeping interfaces clean while maintaining discoverability. Our implementation builds on `@gentleduck/primitives/dropdown-menu` which wraps the base Menu primitive, adding checkbox items, radio groups, sub-menus, and keyboard navigation. The wrapper adds design-system styling while the primitive handles all interaction logic.

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add dropdown-menu
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
```

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Examples

### Checkboxes

```tsx title="components/dropdown-menu-2.tsx"
// import from your project: import Demo from '@/components/dropdown-menu-2'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import * as React from 'react'

export default function Demo() {
  const [showStatusBar, setShowStatusBar] = React.useState(true)
  const [showActivityBar, setShowActivityBar] = React.useState(false)
  const [showPanel, setShowPanel] = React.useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showActivityBar} disabled onCheckedChange={setShowActivityBar}>
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Radio Group

```tsx title="components/dropdown-menu-3.tsx"
// import from your project: import Demo from '@/components/dropdown-menu-3'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import * as React from 'react'

export default function Demo() {
  const [position, setPosition] = React.useState('bottom')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup defaultValue="top" onValueChange={setPosition} value={position}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Active Trigger on Open

Style the trigger to appear active while the menu is open using `data-[state=open]`:

```tsx title="components/dropdown-menu-5.tsx"
// import from your project: import Demo from '@/components/dropdown-menu-5'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'

export default function Demo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:ring-2 data-[state=open]:ring-ring">
          Account
          <ChevronDown className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Arrow

Add a directional caret pointing at the trigger. Place `` anywhere inside `DropdownMenuContent` — it positions itself automatically.

```tsx title="components/dropdown-menu-7.tsx"
// import from your project: import Demo from '@/components/dropdown-menu-7'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'

export default function Demo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" arrowPadding={8} className="w-48">
        <DropdownMenuArrow />
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Component Composition

## RTL Support

Set `dir="rtl"` on `DropdownMenu` for a local override, or set `DirectionProvider` once at app/root level for global direction.

```tsx title="components/dropdown-menu-4.tsx"
// import from your project: import Demo from '@/components/dropdown-menu-4'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'

export default function Demo() {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="outline">فتح</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            الملف الشخصي
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            الفواتير
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            الاعدادات
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            اختصارات لوحة المفاتيح
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>الفريق</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>دعوة مستخدمين</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>البريد الالكتروني</DropdownMenuItem>
              <DropdownMenuItem>رسالة</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>المزيد...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            فريق جديد
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>الدعم</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          تسجيل الخروج
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionDropdownMenu` and `MotionDropdownMenuContent` for smooth enter/exit animations powered by [motion](https://motion.dev). For animated sub-menus, use `MotionDropdownMenuSub` and `MotionDropdownMenuSubContent`.

```tsx title="components/dropdown-menu-6.tsx"
// import from your project: import Demo from '@/components/dropdown-menu-6'
'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  MotionDropdownMenu,
  MotionDropdownMenuContent,
  MotionDropdownMenuSub,
  MotionDropdownMenuSubContent,
} from '@gentleduck/registry-ui/dropdown-menu'

export default function Demo() {
  return (
    <MotionDropdownMenu>
      <DropdownMenuTrigger asChild>
        <MotionButton variant="outline">Open</MotionButton>
      </DropdownMenuTrigger>
      <MotionDropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <MotionDropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <MotionDropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>More...</DropdownMenuItem>
            </MotionDropdownMenuSubContent>
          </MotionDropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </MotionDropdownMenuContent>
    </MotionDropdownMenu>
  )
}
```

}>
  Requires the `motion` package. Use `MotionDropdownMenu` instead of `DropdownMenu` and `MotionDropdownMenuContent` instead of `DropdownMenuContent`. For sub-menus, use `MotionDropdownMenuSub` and `MotionDropdownMenuSubContent`. All other sub-components stay the same.

## API Reference

### DropdownMenu

The root component that manages open/closed state and provides context to all children.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `modal` | `boolean` | `true` | When true, interaction with outside elements is disabled and only menu content is visible to screen readers |

### DropdownMenuTrigger

Button that toggles the dropdown menu. Renders a `<button>` with `aria-haspopup="menu"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as the child element instead of a `<button>` |
| `disabled` | `boolean` | `false` | Disables the trigger |

Sets `aria-expanded`, `aria-controls`, and `data-state` automatically.

### DropdownMenuContent

The dropdown content area. Handles positioning, focus management, keyboard navigation, and dismiss behavior. Automatically wrapped in a `Portal`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side relative to the trigger |
| `sideOffset` | `number` | `4` | Main-axis offset from trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Cross-axis alignment |
| `alignOffset` | `number` | - | Cross-axis offset |
| `avoidCollisions` | `boolean` | `true` | Flip to avoid viewport overflow |
| `collisionPadding` | `number` | - | Padding from viewport edges |
| `className` | `string` | - | Additional CSS class names |

Exposes `data-state="open"` / `data-state="closed"` and `data-side` for CSS animation.

When using popper positioning, the following CSS custom properties are available:

* `--gentleduck-dropdown-menu-content-transform-origin`
* `--gentleduck-dropdown-menu-content-available-width`
* `--gentleduck-dropdown-menu-content-available-height`
* `--gentleduck-dropdown-menu-trigger-width`
* `--gentleduck-dropdown-menu-trigger-height`

### DropdownMenuGroup

Groups related items together. Renders a `<div>` with `role="group"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### DropdownMenuLabel

A non-interactive label for grouping menu items.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | - | Adds start padding to align with items that have icons |
| `className` | `string` | - | Additional CSS class names |

### DropdownMenuItem

An individual menu action item. Renders a `<div>` with `role="menuitem"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive'` | `'default'` | Style variant for the item |
| `inset` | `boolean` | - | Adds start padding to align with items that have icons |
| `disabled` | `boolean` | - | Prevents interaction and styles the item as disabled |
| `onSelect` | `(event: Event) => void` | - | Called when the item is selected via click or keyboard |
| `textValue` | `string` | - | Text override for typeahead search |
| `className` | `string` | - | Additional CSS class names |

Exposes `data-highlighted` when focused and `data-disabled` when disabled.

### DropdownMenuCheckboxItem

A menu item with a toggleable checkbox indicator.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | - | Controlled checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked state changes |
| `disabled` | `boolean` | - | Prevents interaction |
| `className` | `string` | - | Additional CSS class names |

### DropdownMenuRadioGroup

Groups radio items together for single-selection behavior.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | The currently selected radio value |
| `onValueChange` | `(value: string) => void` | - | Callback when the selected value changes |

### DropdownMenuRadioItem

A radio-selectable menu item. Must be used inside `DropdownMenuRadioGroup`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | The value representing this radio item |
| `disabled` | `boolean` | - | Prevents interaction |
| `className` | `string` | - | Additional CSS class names |

### DropdownMenuSeparator

A visual divider between groups of menu items. Renders a styled `<div>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### DropdownMenuShortcut

Displays a keyboard shortcut hint next to a menu item.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### DropdownMenuSub

Wrapper for a submenu. Manages nested open state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |

### DropdownMenuSubTrigger

Trigger element for a submenu. Displays a chevron icon indicating a nested menu.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | - | Adds start padding to align with inset menu items |
| `disabled` | `boolean` | - | Disables the trigger |
| `className` | `string` | - | Additional CSS class names |

### DropdownMenuSubContent

Content container for a submenu. Positioned to the side of the sub-trigger.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sideOffset` | `number` | - | Main-axis offset from trigger |
| `alignOffset` | `number` | - | Cross-axis offset |
| `className` | `string` | - | Additional CSS class names |

Exposes the same `--gentleduck-dropdown-menu-*` CSS custom properties as `DropdownMenuContent`.

### MotionDropdownMenu

Same props as `DropdownMenu`. Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

### MotionDropdownMenuContent

Same props as `DropdownMenuContent`. Adds scale, blur, and opacity enter/exit animation with springBouncy transition. Requires the `motion` package.

### MotionDropdownMenuSub

Same props as `DropdownMenuSub`. Wraps sub-menu with `useMotionRoot` for exit animation support. Requires the `motion` package.

### MotionDropdownMenuSubContent

Same props as `DropdownMenuSubContent`. Adds scale and blur enter/exit animation in a Portal. Requires the `motion` package.