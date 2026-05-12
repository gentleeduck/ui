```tsx title="components/menubar-1.tsx"
// import from your project: import Demo from '@/components/menubar-1'
'use client'

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@gentleduck/registry-ui/menubar'

export default function Demo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

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
import {
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
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

## Component Composition

## RTL Support

Set `dir="rtl"` on `Menubar` for a local override, or set `DirectionProvider` once at app/root level for global direction.

```tsx title="components/menubar-2.tsx"
// import from your project: import Demo from '@/components/menubar-2'
'use client'

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@gentleduck/registry-ui/menubar'

export default function Demo() {
  return (
    <Menubar dir="rtl">
      <MenubarMenu>
        <MenubarTrigger>ملف</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            تبويب جديد
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            نافذة جديدة
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>نافذة تصفح خاص جديدة</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>مشاركة</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>رابط بريد الكتروني</MenubarItem>
              <MenubarItem>الرسائل</MenubarItem>
              <MenubarItem>الملاحظات</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            طباعة... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>تحرير</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            تراجع <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            اعادة <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>بحث</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>البحث في الويب</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>بحث...</MenubarItem>
              <MenubarItem>البحث عن التالي</MenubarItem>
              <MenubarItem>البحث عن السابق</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>قص</MenubarItem>
          <MenubarItem>نسخ</MenubarItem>
          <MenubarItem>لصق</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>عرض</MenubarTrigger>
        <MenubarContent className="w-60">
          <MenubarCheckboxItem>اظهار شريط المفضلة دائما</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>اظهار الروابط الكاملة دائما</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            اعادة تحميل <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            اعادة تحميل اجبارية <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>تبديل ملء الشاشة</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>اخفاء الشريط الجانبي</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>الملفات الشخصية</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="ahmad">
            <MenubarRadioItem value="ali">علي</MenubarRadioItem>
            <MenubarRadioItem value="ahmad">احمد</MenubarRadioItem>
            <MenubarRadioItem value="omar">عمر</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>تعديل</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>اضافة ملف شخصي</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionMenubarContent` for a spring-powered enter animation with blur powered by [motion](https://motion.dev). Exit uses the primitive's built-in CSS animation.

```tsx title="components/menubar-3.tsx"
// import from your project: import Demo from '@/components/menubar-3'
'use client'

import {
  Menubar,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MotionMenubarContent,
} from '@gentleduck/registry-ui/menubar'

export default function Demo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MotionMenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Print <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MotionMenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MotionMenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MotionMenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

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