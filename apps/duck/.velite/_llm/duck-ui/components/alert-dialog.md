```tsx title="components/alert-dialog-1.tsx"
// import from your project: import Demo from '@/components/alert-dialog-1'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@gentleduck/registry-ui/alert-dialog'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone This will permanently delete your account and remove your data from our servers
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button>Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Philosophy

Alert dialogs are the nuclear option of UI interruption. Unlike regular dialogs, they can't be dismissed by clicking outside or pressing Escape  -  the user must explicitly choose an action. Reserve them for destructive operations where an accidental dismissal could mean data loss.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add alert-dialog
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs
```

Make sure you have the [`Button`](/duck-ui/components/button) component installed in your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
```

```tsx
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Examples

### Active Trigger on Open

Style the trigger to appear active while the alert dialog is open using `data-[state=open]`:

```tsx title="components/alert-dialog-3.tsx"
// import from your project: import Demo from '@/components/alert-dialog-3'
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@gentleduck/registry-ui/alert-dialog'
import { Button } from '@gentleduck/registry-ui/button'
import { Trash2 } from 'lucide-react'

export default function Demo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="data-[state=open]:opacity-90 data-[state=open]:ring-2 data-[state=open]:ring-destructive/50">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The trigger button is highlighted while this dialog is open.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Component Composition

## RTL Support

Set `dir="rtl"` on `AlertDialog` for a local override, or set `DirectionProvider` once at app/root level for global direction. `AlertDialog` extends `Dialog`, so direction is inherited by all child parts.

```tsx
<AlertDialog dir="rtl">
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>هل انت متاكد؟</AlertDialogTitle>
      <AlertDialogDescription>
        هذا الاجراء لا يمكن التراجع عنه.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>الغاء</AlertDialogCancel>
      <AlertDialogAction>متابعة</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

```tsx title="components/alert-dialog-2.tsx"
// import from your project: import Demo from '@/components/alert-dialog-2'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@gentleduck/registry-ui/alert-dialog'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <AlertDialog dir="rtl">
      <AlertDialogTrigger asChild>
        <Button variant="outline">فتح</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تماما؟</AlertDialogTitle>
          <AlertDialogDescription>
            لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيا وإزالة بياناتك من خوادمنا
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">إلغاء</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button>متابعة</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionAlertDialog` and `MotionAlertDialogContent` for smooth enter/exit animations powered by [motion](https://motion.dev). Uses a stiffer spring to convey urgency compared to the regular dialog.

```tsx title="components/alert-dialog-4.tsx"
// import from your project: import Demo from '@/components/alert-dialog-4'
'use client'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  MotionAlertDialog,
  MotionAlertDialogContent,
} from '@gentleduck/registry-ui/alert-dialog'
import { MotionButton } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <MotionAlertDialog>
      <AlertDialogTrigger asChild>
        <MotionButton variant="outline">Open</MotionButton>
      </AlertDialogTrigger>
      <MotionAlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone This will permanently delete your account and remove your data from our servers
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <MotionButton variant="outline">Cancel</MotionButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <MotionButton>Continue</MotionButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </MotionAlertDialogContent>
    </MotionAlertDialog>
  )
}
```

}>
Requires the `motion` package. Use `MotionAlertDialog` instead of `AlertDialog` and `MotionAlertDialogContent` instead of `AlertDialogContent`. All other sub-components (`AlertDialogTrigger`, `AlertDialogAction`, etc.) stay the same.

## API Reference

### AlertDialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `-` | Determines if the dialog should be open by default |
| `open` | `boolean` | `-` | Controls the visibility of the dialog |
| `onOpenChange` | `(open: boolean) => void` | `-` | Callback fired when the dialog opens or closes |
| `dir` | `'ltr' \| 'rtl'` | `-` | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). Inherited from the Dialog primitive. |
| `children` | `React.ReactNode` | (required) | Child elements (typically Trigger and Content) |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>` | - | Additional props inherited from `AlertDialogPrimitive.Root` |

### AlertDialogTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | `false` | If `true`, renders using a `Slot` instead of a `button` element |
| `children` | `React.ReactNode` | `--` | Content of the trigger |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>` | - | Additional props inherited from `AlertDialogPrimitive.Trigger` |

### AlertDialogPortal

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `HTMLElement` | - | Optional portal container |
| `forceMount` | `true` | - | Forces mounted state for all portal children |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>` | - | Additional props inherited from `AlertDialogPrimitive.Portal` |

### AlertDialogOverlay

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names to apply |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>` | - | Additional props inherited from `AlertDialogPrimitive.Overlay` |

### AlertDialogContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `-` | Additional class names to apply |
| `children` | `React.ReactNode` | `-` | Content displayed inside the dialog |
| `forceMount` | `boolean` | `false` | If `true`, forces the content to stay mounted in the DOM |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>` | - | Additional props inherited from `AlertDialogPrimitive.Content` |

### MotionAlertDialog

Same props as `AlertDialog`. Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

### MotionAlertDialogContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | **Required.** Controlled open state for AnimatePresence enter/exit |
| `className` | `string` | `-` | Additional class names to apply |
| `children` | `React.ReactNode` | `-` | Content displayed inside the dialog |

Requires `motion` package installed. Uses a spring transition (stiffness 400, damping 30) for a snappier feel that conveys urgency. Automatically respects `prefers-reduced-motion`.

### AlertDialogHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional class names to apply |
| `children` | `React.ReactNode` | `--` | Header content (typically Title and Description) |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the header container |

### AlertDialogFooter

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional class names to apply |
| `children` | `React.ReactNode` | `--` | Footer content (typically Action and Cancel buttons) |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the content div |

### AlertDialogTitle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional class names to apply |
| `children` | `React.ReactNode` | `--` | Title text content |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>` | - | Additional props inherited from `AlertDialogPrimitive.Title` |

### AlertDialogDescription

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional class names to apply |
| `children` | `React.ReactNode` | `--` | Description text content |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>` | - | Additional props inherited from `AlertDialogPrimitive.Description` |

### AlertDialogAction

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names merged with default button styles |
| `children` | `React.ReactNode` | - | Action button content |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>` | - | Additional props inherited from `AlertDialogPrimitive.Action` |

### AlertDialogCancel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names merged with outline button styles |
| `children` | `React.ReactNode` | - | Cancel button content |
| `...props` | `React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>` | - | Additional props inherited from `AlertDialogPrimitive.Cancel` |