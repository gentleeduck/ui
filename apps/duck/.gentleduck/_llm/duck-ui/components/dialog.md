```tsx title="components/dialog-1.tsx"
// import from your project: import Demo from '@/components/dialog-1'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui/dialog'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <Dialog>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <Button variant={'outline'}>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input defaultValue="Pedro Duarte" id="name-1" name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input defaultValue="@peduarte" id="username-1" name="username" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
```

## Philosophy

Dialogs demand attention and block interaction  -  use them when the user *must* make a decision before continuing. We split the anatomy into DialogTrigger, DialogContent, DialogHeader, etc. because every dialog has different needs but the same accessibility requirements: focus trapping, escape dismissal, and return focus.

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add dialog
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs @gentleduck/hooks lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
```

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Examples

### Controlled Dialog

```tsx title="components/dialog-2.tsx"
// import from your project: import Demo from '@/components/dialog-2'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui/dialog'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <Button variant={'outline'}>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input defaultValue="Pedro Duarte" id="name-1" name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input defaultValue="@peduarte" id="username-1" name="username" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
```

### Active Trigger on Open

Style the trigger to appear active while the dialog is open using `data-[state=open]`:

```tsx title="components/dialog-4.tsx"
// import from your project: import Demo from '@/components/dialog-4'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui/dialog'
import { Pencil } from 'lucide-react'

export default function Demo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="data-[state=open]:bg-primary data-[state=open]:text-primary-foreground data-[state=open]:ring-2 data-[state=open]:ring-primary/50">
          <Pencil className="mr-2 h-4 w-4" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Notice the trigger button stays highlighted while this dialog is open. Use{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">data-[state=open]</code> on the trigger to style its
            active state.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Component Composition

## Notes

To use the `Dialog` component from within a `Context Menu` or `Dropdown Menu`, you must encase the `Context Menu` or
`Dropdown Menu` component in the `Dialog` component.

```tsx {1, 26}
<Dialog>
  <ContextMenu>
    <ContextMenuTrigger>Right click</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Open</ContextMenuItem>
      <ContextMenuItem>Download</ContextMenuItem>
      <DialogTrigger asChild>
        <ContextMenuItem>
          <span>Delete</span>
        </ContextMenuItem>
      </DialogTrigger>
    </ContextMenuContent>
  </ContextMenu>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Are you sure you want to permanently
        delete this file from our servers?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="submit">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## RTL Support

Set `dir="rtl"` on `Dialog` for a local override, or set `DirectionProvider` once at app/root level for global direction. Dialog content parts inherit direction automatically.

```tsx
<Dialog dir="rtl">
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>عنوان الحوار</DialogTitle>
      <DialogDescription>وصف الحوار هنا.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

```tsx title="components/dialog-3.tsx"
// import from your project: import Demo from '@/components/dialog-3'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui/dialog'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <Dialog>
        <form onSubmit={(e) => e.preventDefault()}>
          <DialogTrigger asChild>
            <Button variant={'outline'}>فتح النافذة</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>تعديل الملف الشخصي</DialogTitle>
              <DialogDescription>قم باجراء التعديلات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">الاسم</Label>
                <Input defaultValue="احمد خالد" id="name-1" name="name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">اسم المستخدم</Label>
                <Input defaultValue="@ahmad" id="username-1" name="username" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={'outline'}>الغاء</Button>
              </DialogClose>
              <Button type="submit">حفظ التغييرات</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </DirectionProvider>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionDialog` and `MotionDialogContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The dialog scales and fades in with a blur effect, and reverses on exit.

```tsx title="components/dialog-5.tsx"
// import from your project: import Demo from '@/components/dialog-5'
'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  MotionDialog,
  MotionDialogContent,
} from '@gentleduck/registry-ui/dialog'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <MotionDialog>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <MotionButton variant={'outline'}>Open Dialog</MotionButton>
        </DialogTrigger>
        <MotionDialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-5">Name</Label>
              <Input defaultValue="Pedro Duarte" id="name-5" name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-5">Username</Label>
              <Input defaultValue="@peduarte" id="username-5" name="username" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <MotionButton variant={'outline'}>Cancel</MotionButton>
            </DialogClose>
            <MotionButton type="submit">Save changes</MotionButton>
          </DialogFooter>
        </MotionDialogContent>
      </form>
    </MotionDialog>
  )
}
```

}>
  Requires the `motion` package. Use `MotionDialog` instead of `Dialog` and `MotionDialogContent` instead of `DialogContent`. All other sub-components (`DialogTrigger`, `DialogHeader`, etc.) stay the same.

## API Reference

### Dialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean` | `true` | Enables modal focus/interaction behavior (focus trapping, scroll blocking) |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `children` | `React.ReactNode` | - | Dialog sub-components (`DialogTrigger`, `DialogContent`, etc.) |
| `...props` | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>` | - | Additional props inherited from `DialogPrimitive.Root` |

### DialogTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Trigger content |
| `...props` | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>` | - | Additional props inherited from `DialogPrimitive.Trigger` |

### DialogPortal

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `HTMLElement` | - | Optional portal container |
| `forceMount` | `true` | - | Forces mounted state for all portal children |
| `...props` | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>` | - | Additional props inherited from `DialogPrimitive.Portal` |

### DialogOverlay

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>` | - | Additional props inherited from `DialogPrimitive.Overlay` |

### DialogContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `true` | - | Force mounting for animation control |
| `closeText` | `string` | `'Close'` | Accessible label for the built-in close button |
| `hideClose` | `boolean` | `false` | When `true`, hides the built-in close button entirely |
| `className` | `string` | - | Additional CSS classes applied to the content panel |
| `children` | `React.ReactNode` | - | Dialog inner content |
| `...props` | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>` | - | Additional props inherited from `DialogPrimitive.Content` |

`DialogContent` renders a built-in close button in the top-right corner. Set `hideClose` to remove it when you handle closing via other UI (e.g. a custom header with its own close button).

### DialogHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the header |
| `children` | `React.ReactNode` | - | Header content (typically `DialogTitle` and `DialogDescription`) |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the header container |

### DialogFooter

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the footer |
| `children` | `React.ReactNode` | - | Footer content (typically action buttons) |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the footer container |

### DialogTitle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the title |
| `children` | `React.ReactNode` | - | Title text |
| `...props` | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>` | - | Additional props inherited from `DialogPrimitive.Title` |

### DialogDescription

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the description |
| `children` | `React.ReactNode` | - | Description text |
| `...props` | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>` | - | Additional props inherited from `DialogPrimitive.Description` |

### DialogClose

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Close control content |
| `...props` | `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>` | - | Additional props inherited from `DialogPrimitive.Close` |

### MotionDialog

Same props as `Dialog`. Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

### MotionDialogContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | **Required.** Controlled open state for AnimatePresence enter/exit |
| `closeText` | `string` | `'Close'` | Accessible label for the built-in close button |
| `hideClose` | `boolean` | `false` | When `true`, hides the built-in close button |
| `className` | `string` | - | Additional CSS classes applied to the content panel |
| `children` | `React.ReactNode` | - | Dialog inner content |

Requires `motion` package installed. Uses `AnimatePresence` + `m.div` for ~5KB bundle. Automatically respects `prefers-reduced-motion`.

### Responsive Variants

The following responsive components automatically render a `Dialog` on desktop (>=768px) and a `Drawer` on mobile. Each accepts the same props as its non-responsive counterpart.

| Component | Desktop renders | Mobile renders |
| --- | --- | --- |
| `DialogResponsive` | `Dialog` | `Drawer` |
| `DialogTriggerResponsive` | `DialogTrigger` | `DrawerTrigger` |
| `DialogContentResponsive` | `DialogContent` | `DrawerContent` |
| `DialogHeaderResponsive` | `DialogHeader` | `DrawerHeader` |
| `DialogFooterResponsive` | `DialogFooter` | `DrawerFooter` |
| `DialogTitleResponsive` | `DialogTitle` | `DrawerTitle` |
| `DialogDescriptionResponsive` | `DialogDescription` | `DrawerDescription` |
| `DialogCloseResponsive` | `DialogClose` | `DrawerClose` |

## See also

* [Sheet](/duck-ui/components/sheet)  -  Side panel overlay, extends Dialog
* [Drawer](/duck-ui/components/drawer)  -  Bottom drawer overlay, great for mobile
* [Alert Dialog](/duck-ui/components/alert-dialog)  -  Confirmation dialog that requires user action