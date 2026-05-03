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

  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
```

```tsx
` to indicate the edge of the screen where the component will appear. The values can be `top`, `right`, `bottom` or `left`.

### Size

You can adjust the size of the sheet using CSS classes:

```tsx {3}

## RTL Support

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionSheet` and `MotionSheetContent` for smooth slide-in/out animations powered by [motion](https://motion.dev). The content slides from the edge based on the `side` prop while the overlay fades.

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

- [Dialog](/docs/components/dialog)  -  Centered modal overlay
- [Drawer](/docs/components/drawer)  -  Bottom drawer overlay, great for mobile

### MotionSheet

Same props as `Sheet`. Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

### MotionSheetContent

Same props as `SheetContent`. Adds directional slide enter/exit animation with blur and opacity fade using tweenSlow (300ms). Requires the `motion` package.