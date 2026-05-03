## Philosophy

Context menus are power-user shortcuts that surface relevant actions where the user already is. This implementation is built directly on the `@gentleduck/primitives/context-menu` primitives, so right-click behavior, keyboard interactions, and submenu semantics stay consistent.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add context-menu
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
```

```tsx showLineNumbers

## Behavior

- Right-click the trigger area to open the menu.
- Left-click does not open the menu.
- Right-clicking outside closes the menu and allows the native browser menu to appear.

## RTL Support

Set `dir="rtl"` on `ContextMenu` for a local override, or set `DirectionProvider` once at app/root level for global direction.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionContextMenu` and `MotionContextMenuContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The transform origin is fixed to top-left since the menu appears at the cursor position. For animated sub-menus, use `MotionContextMenuSub` and `MotionContextMenuSubContent`.

}>
Requires the `motion` package. Use `MotionContextMenu` instead of `ContextMenu` and `MotionContextMenuContent` instead of `ContextMenuContent`. For sub-menus, use `MotionContextMenuSub` and `MotionContextMenuSubContent`. All other sub-components stay the same.

## API Reference

Components in this file wrap `@gentleduck/primitives/context-menu`.

### ContextMenu

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Context menu content (trigger + menu content) |
| `modal` | `boolean` | `true` | Whether interaction outside the menu is blocked while open |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when open state changes |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>` | - | Additional props inherited from `ContextMenuPrimitive.Root` |

### ContextMenuTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Disables custom context-menu behavior and falls back to native behavior |
| `children` | `React.ReactNode` | - | Trigger area content |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>` | - | Additional props inherited from `ContextMenuPrimitive.Trigger` |

### ContextMenuPortal

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `HTMLElement` | - | Optional portal container |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Portal>` | - | Additional props inherited from `ContextMenuPrimitive.Portal` |

### ContextMenuContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Menu items and groups |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>` | - | Additional props inherited from `ContextMenuPrimitive.Content` |

`ContextMenuContent` is positioned by the primitive as `side="right"`, `align="start"`, and `sideOffset={2}`.

### ContextMenuItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | `false` | Adds start padding for alignment with items that render indicators/icons |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>` | - | Additional props inherited from `ContextMenuPrimitive.Item` |

### ContextMenuCheckboxItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | - | Controlled checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked state changes |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>` | - | Additional props inherited from `ContextMenuPrimitive.CheckboxItem` |

### ContextMenuRadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled selected value |
| `onValueChange` | `(value: string) => void` | - | Callback when selected value changes |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioGroup>` | - | Additional props inherited from `ContextMenuPrimitive.RadioGroup` |

### ContextMenuRadioItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | Value represented by this radio item |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>` | - | Additional props inherited from `ContextMenuPrimitive.RadioItem` |

### ContextMenuLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | `false` | Adds start padding for alignment with items |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>` | - | Additional props inherited from `ContextMenuPrimitive.Label` |

### ContextMenuSeparator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>` | - | Additional props inherited from `ContextMenuPrimitive.Separator` |

### ContextMenuShortcut

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Shortcut hint content (for example, `⌘K`) |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Additional props to spread to the shortcut `<span>` |

### ContextMenuGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Group content |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Group>` | - | Additional props inherited from `ContextMenuPrimitive.Group` |

### ContextMenuSub

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Sub-trigger and sub-content elements |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Sub>` | - | Additional props inherited from `ContextMenuPrimitive.Sub` |

### ContextMenuSubTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | `false` | Adds start padding for alignment |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger>` | - | Additional props inherited from `ContextMenuPrimitive.SubTrigger` |

### ContextMenuSubContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | - | Preferred side relative to the sub-trigger |
| `align` | `'start' \| 'center' \| 'end'` | - | Alignment on the chosen side |
| `sideOffset` | `number` | - | Main-axis offset from sub-trigger |
| `alignOffset` | `number` | - | Cross-axis offset from sub-trigger |
| `...props` | `React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>` | - | Additional props inherited from `ContextMenuPrimitive.SubContent` |

### MotionContextMenu

Same props as `ContextMenu`. Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

### MotionContextMenuContent

Same props as `ContextMenuContent`. Adds scale, blur, and opacity enter/exit animation with springBouncy transition. Transform origin fixed to top-left. Requires the `motion` package.

### MotionContextMenuSub

Same props as `ContextMenuSub`. Wraps sub-menu with `useMotionRoot` for exit animation support. Requires the `motion` package.

### MotionContextMenuSubContent

Same props as `ContextMenuSubContent`. Adds scale and blur enter/exit animation in a Portal. Requires the `motion` package.