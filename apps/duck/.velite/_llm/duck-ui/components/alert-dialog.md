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

## RTL Support

Set `dir="rtl"` on `AlertDialog` for a local override, or set `DirectionProvider` once at app/root level for global direction. `AlertDialog` extends `Dialog`, so direction is inherited by all child parts.

```tsx

  <AlertDialogTrigger>Open</AlertDialogTrigger>

      <AlertDialogTitle>هل انت متاكد؟</AlertDialogTitle>

        هذا الاجراء لا يمكن التراجع عنه.

      <AlertDialogCancel>الغاء</AlertDialogCancel>
      <AlertDialogAction>متابعة</AlertDialogAction>

```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionAlertDialog` and `MotionAlertDialogContent` for smooth enter/exit animations powered by [motion](https://motion.dev). Uses a stiffer spring to convey urgency compared to the regular dialog.

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