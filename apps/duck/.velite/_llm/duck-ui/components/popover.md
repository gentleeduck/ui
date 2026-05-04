## About

Popover built with [@floating-ui/react](https://floating-ui.com/) and Popper-based primitives for collision-aware positioning.

## Philosophy

Popovers bridge the gap between tooltips (hover, no interaction) and dialogs (heavy, blocking). They're the right choice for inline forms, color pickers, and contextual actions that need more space than a tooltip but shouldn't interrupt the user's flow. We handle positioning and collision detection so you can focus on content.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add popover
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
```

```tsx showLineNumbers

## RTL Support

Set `dir="rtl"` on `Popover` for a local override, or set `DirectionProvider` once at app/root level for global direction. In RTL mode, `side="left"` and `side="right"` are logically swapped.

```tsx

  <PopoverTrigger>افتح</PopoverTrigger>
  <PopoverContent>محتوى النافذة المنبثقة هنا.</PopoverContent>

```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionPopover` and `MotionPopoverContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The transform origin matches the placement side automatically.

}>
Requires the `motion` package. Use `MotionPopover` instead of `Popover` and `MotionPopoverContent` instead of `PopoverContent`. All other sub-components (`PopoverTrigger`, `PopoverClose`, etc.) stay the same.

## API Reference

### Popover

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | `-` | Popover sub-components (`PopoverTrigger`, `PopoverContent`) |
| `defaultOpen` | `boolean` | `-` | Initial open state for uncontrolled usage |
| `open` | `boolean` | `-` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | `-` | Callback when open state changes |
| `modal` | `boolean` | `false` | Enables modal focus/interaction behavior |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `...props` | `React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>` | - | Additional props inherited from `Popover.Root`. |

### PopoverTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | `--` | Use the child element as the trigger |
| `...props` | `React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>` | - | Additional props inherited from `Popover.Trigger`. |

### PopoverContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `-` | Keep content mounted for animation control |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side relative to the trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment on the chosen side |
| `sideOffset` | `number` | `4` | Main-axis offset from trigger |
| `alignOffset` | `number` | `0` | Cross-axis offset from trigger |
| `...props` | `React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>` | - | Additional props inherited from `Popover.Content`. |

### PopoverClose

Element that closes the popover when interacted with.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | `false` | Renders child as the close control |
| `children` | `React.ReactNode` | - | Close control content |
| `...props` | `React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>` | - | Additional props inherited from `PopoverPrimitive.Close` |

### PopoverAnchor

Optional custom anchor element for positioning.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>` | - | Additional props inherited from `Popover.Anchor`. |

### MotionPopover

Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `PopoverProps` | - | All props from `Popover` are supported |

### MotionPopoverContent

Adds scale, blur, and opacity enter/exit animation with `springBouncy` transition. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `PopoverContentProps` | - | All props from `PopoverContent` are supported |