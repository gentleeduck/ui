```tsx title="components/sheet-1.tsx"
// import from your project: import Demo from '@/components/sheet-1'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui/sheet'

const SHEET_SIDES = ['right'] as const

export default function Demo() {
  return (
    <div className="grid grid-cols-1 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant={'outline'}>{side}</Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col" side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input className="col-span-3" id="name" value="Pedro Duarte" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username">Username</Label>
                <Input className="col-span-3" id="username" value="@peduarte" />
              </div>
            </div>
            <SheetFooter className="mt-2">
              <SheetClose>
                <Button variant={'outline'}>Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
```

## Philosophy

Sheets are dialogs that slide in from the edge  -  they maintain spatial context better than centered modals. Use them for supplementary content (settings panels, detail views, mobile navigation) where the user needs to reference what's behind the overlay. The side prop makes the direction of information flow explicit.

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add sheet
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs @gentleduck/variants lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
```

```tsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Examples

### Side

Use the `side` property to `` to indicate the edge of the screen where the component will appear. The values can be `top`, `right`, `bottom` or `left`.

```tsx title="components/sheet-2.tsx"
// import from your project: import Demo from '@/components/sheet-2'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui/sheet'

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant={'outline'}>{side}</Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col" side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input className="col-span-3" id="name" value="Pedro Duarte" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username">Username</Label>
                <Input className="col-span-3" id="username" value="@peduarte" />
              </div>
            </div>
            <SheetFooter className="mt-2">
              <SheetClose>
                <Button variant={'outline'}>Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
```

### Size

You can adjust the size of the sheet using CSS classes:

```tsx {3}
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

### Active Trigger on Open

Style the trigger to appear active while the sheet is open using `data-[state=open]`:

```tsx title="components/sheet-4.tsx"
// import from your project: import Demo from '@/components/sheet-4'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui/sheet'
import { Menu } from 'lucide-react'

export default function Demo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:ring-2 data-[state=open]:ring-ring">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>The menu icon stays active while the sheet is open.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
```

## Component Composition

## RTL Support

```tsx title="components/sheet-3.tsx"
// import from your project: import Demo from '@/components/sheet-3'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui/sheet'

const SHEET_SIDES = ['right'] as const

export default function Demo() {
  return (
    <div className="grid grid-cols-1 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side} dir="rtl">
          <SheetTrigger asChild>
            <Button variant={'outline'}>{side}</Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col" side={side}>
            <SheetHeader>
              <SheetTitle>تعديل الملف الشخصي</SheetTitle>
              <SheetDescription>قم باجراء تغييرات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.</SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">الاسم</Label>
                <Input className="col-span-3" id="name" value="احمد محمد" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input className="col-span-3" id="username" value="@ahmad" />
              </div>
            </div>
            <SheetFooter className="mt-2">
              <SheetClose>
                <Button variant={'outline'}>حفظ التغييرات</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionSheet` and `MotionSheetContent` for smooth slide-in/out animations powered by [motion](https://motion.dev). The content slides from the edge based on the `side` prop while the overlay fades.

```tsx title="components/sheet-5.tsx"
// import from your project: import Demo from '@/components/sheet-5'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import {
  MotionSheet,
  MotionSheetContent,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui/sheet'

const SHEET_SIDES = ['right'] as const

export default function Demo() {
  return (
    <div className="grid grid-cols-1 gap-2">
      {SHEET_SIDES.map((side) => (
        <MotionSheet key={side}>
          <SheetTrigger asChild>
            <Button variant={'outline'}>{side}</Button>
          </SheetTrigger>
          <MotionSheetContent className="flex flex-col" side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="s5-name">Name</Label>
                <Input className="col-span-3" id="s5-name" value="Pedro Duarte" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="s5-username">Username</Label>
                <Input className="col-span-3" id="s5-username" value="@peduarte" />
              </div>
            </div>
            <SheetFooter className="mt-2">
              <SheetClose>
                <Button variant={'outline'}>Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </MotionSheetContent>
        </MotionSheet>
      ))}
    </div>
  )
}
```

}>
  Requires the `motion` package. Use `MotionSheet` instead of `Sheet` and `MotionSheetContent` instead of `SheetContent`. All other sub-components (`SheetTrigger`, `SheetHeader`, etc.) stay the same.

## API Reference

### Sheet

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean` | `true` | Enables modal focus/interaction behavior |
| `children` | `React.ReactNode` | - | Sheet sub-components (`SheetTrigger`, `SheetContent`, etc.) |
| `...props` | `React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>` | - | Additional props inherited from `SheetPrimitive.Root` |

### SheetTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | `false` | Renders child as trigger element instead of a default button |
| `children` | `React.ReactNode` | - | Trigger content |
| `...props` | `React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>` | - | Additional props inherited from `SheetPrimitive.Trigger` |

### SheetPortal

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `HTMLElement` | - | Optional portal container |
| `forceMount` | `true` | - | Forces mounted state for all portal children |
| `...props` | `React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>` | - | Additional props inherited from `SheetPrimitive.Portal` |

### SheetOverlay

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>` | - | Additional props inherited from `SheetPrimitive.Overlay` |

### SheetContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | The side from which the sheet slides in |
| `closeText` | `string` | `'Close'` | Screen-reader label for the built-in close button |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Sheet content |
| `...props` | `React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & VariantProps<typeof sheetVariants>` | - | Additional props inherited from `SheetPrimitive.Content` and the local `sheetVariants` |

`SheetContent` renders a built-in close button in the top-right corner.

### SheetHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the header container |

### SheetFooter

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the footer div |

### SheetTitle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>` | - | Additional props inherited from `SheetPrimitive.Title` |

### SheetDescription

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>` | - | Additional props inherited from `SheetPrimitive.Description` |

### SheetClose

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | `false` | Renders child as close control |
| `children` | `React.ReactNode` | - | Close control content |
| `...props` | `React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close>` | - | Additional props inherited from `SheetPrimitive.Close` |

## See also

* [Dialog](/duck-ui/components/dialog)  -  Centered modal overlay
* [Drawer](/duck-ui/components/drawer)  -  Bottom drawer overlay, great for mobile

### MotionSheet

Same props as `Sheet`. Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

### MotionSheetContent

Same props as `SheetContent`. Adds directional slide enter/exit animation with blur and opacity fade using tweenSlow (300ms). Requires the `motion` package.