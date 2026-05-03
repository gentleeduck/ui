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

  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
```

```tsx

## Notes

To use the `Dialog` component from within a `Context Menu` or `Dropdown Menu`, you must encase the `Context Menu` or
`Dropdown Menu` component in the `Dialog` component.

```tsx {1, 26}

    <ContextMenuTrigger>Right click</ContextMenuTrigger>

      <ContextMenuItem>Open</ContextMenuItem>
      <ContextMenuItem>Download</ContextMenuItem>

          <span>Delete</span>

      <DialogTitle>Are you absolutely sure?</DialogTitle>

        This action cannot be undone. Are you sure you want to permanently
        delete this file from our servers?

      <Button type="submit">Confirm</Button>

```

## RTL Support

Set `dir="rtl"` on `Dialog` for a local override, or set `DirectionProvider` once at app/root level for global direction. Dialog content parts inherit direction automatically.

```tsx

  <DialogTrigger>Open</DialogTrigger>

      <DialogTitle>عنوان الحوار</DialogTitle>
      <DialogDescription>وصف الحوار هنا.</DialogDescription>

```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionDialog` and `MotionDialogContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The dialog scales and fades in with a blur effect, and reverses on exit.

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

- [Sheet](/docs/components/sheet)  -  Side panel overlay, extends Dialog
- [Drawer](/docs/components/drawer)  -  Bottom drawer overlay, great for mobile
- [Alert Dialog](/docs/components/alert-dialog)  -  Confirmation dialog that requires user action