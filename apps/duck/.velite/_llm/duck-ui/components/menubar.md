## Philosophy

Menubars bring desktop-application navigation patterns to the web. The keyboard model (arrow keys between menus, type-ahead navigation, submenu traversal) follows established platform conventions and is powered by `@gentleduck/primitives/menubar`.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add menubar
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/motion @gentleduck/primitives lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
```

```tsx showLineNumbers

      
      

## RTL Support

Set `dir="rtl"` on `Menubar` for a local override, or set `DirectionProvider` once at app/root level for global direction.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionMenubarContent` for a spring-powered enter animation with blur powered by [motion](https://motion.dev). Exit uses the primitive's built-in CSS animation.

}>
Requires the `motion` package. Use `MotionMenubarContent` instead of `MenubarContent`. All other sub-components stay the same.

## API Reference

Components in this file wrap `@gentleduck/primitives/menubar`.

### Menubar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Controlled currently-open menu value |
| `defaultValue` | `string` | `''` | Initial open menu value for uncontrolled usage |
| `onValueChange` | `(value: string) => void` | - | Callback when open menu value changes |
| `loop` | `boolean` | `true` | Loops roving focus across triggers |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>` | - | Additional props inherited from `MenubarPrimitive.Root` |

### MenubarMenu

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | auto-generated | Unique identifier for this menu |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when the menu opens or closes |
| `children` | `React.ReactNode` | - | Trigger and content elements for this menu |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu>` | - | Additional props inherited from `MenubarPrimitive.Menu` |

### MenubarTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Trigger label/content |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>` | - | Additional props inherited from `MenubarPrimitive.Trigger` |

### MenubarPortal

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `HTMLElement` | - | Optional portal container |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Portal>` | - | Additional props inherited from `MenubarPrimitive.Portal` |

### MenubarContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | - | Preferred side relative to the trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment on the chosen side |
| `sideOffset` | `number` | `8` | Main-axis offset from trigger |
| `alignOffset` | `number` | `-4` | Cross-axis offset from trigger |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>` | - | Additional props inherited from `MenubarPrimitive.Content` |

### MenubarItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | `false` | Adds start padding for alignment with indicators/icons |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>` | - | Additional props inherited from `MenubarPrimitive.Item` |

### MenubarCheckboxItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | - | Controlled checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked state changes |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>` | - | Additional props inherited from `MenubarPrimitive.CheckboxItem` |

### MenubarRadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled selected value |
| `onValueChange` | `(value: string) => void` | - | Callback when selected value changes |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioGroup>` | - | Additional props inherited from `MenubarPrimitive.RadioGroup` |

### MenubarRadioItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | Value represented by this radio item |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>` | - | Additional props inherited from `MenubarPrimitive.RadioItem` |

### MenubarLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | `false` | Adds start padding for alignment |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>` | - | Additional props inherited from `MenubarPrimitive.Label` |

### MenubarSeparator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>` | - | Additional props inherited from `MenubarPrimitive.Separator` |

### MenubarShortcut

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Shortcut hint content (for example, `⌘S`) |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Additional props to spread to the shortcut `<span>` |

### MenubarGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Group>` | - | Additional props inherited from `MenubarPrimitive.Group` |

### MenubarSub

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Sub-trigger and sub-content elements |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Sub>` | - | Additional props inherited from `MenubarPrimitive.Sub` |

### MenubarSubTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | `false` | Adds start padding for alignment |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>` | - | Additional props inherited from `MenubarPrimitive.SubTrigger` |

### MenubarSubContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | - | Preferred side relative to the sub-trigger |
| `align` | `'start' \| 'center' \| 'end'` | - | Alignment on the chosen side |
| `sideOffset` | `number` | - | Main-axis offset from sub-trigger |
| `alignOffset` | `number` | - | Cross-axis offset from sub-trigger |
| `...props` | `React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>` | - | Additional props inherited from `MenubarPrimitive.SubContent` |

### MotionMenubarContent

Same props as `MenubarContent`. Adds spring scaleIn+blur enter animation via motion. Exit uses the primitive's CSS animation. Requires the `motion` package.