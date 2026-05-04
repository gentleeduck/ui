## Philosophy

Collapsible is the simplest disclosure primitive  -  it shows and hides content. Unlike Accordion, it doesn't manage a group of items or enforce single-selection. Use it for individual expand/collapse needs like "show more" sections, advanced settings, or code blocks. It's the building block that Accordion is built on.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add collapsible
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives
```

Add the `Button` component to your project.

The `Collapsible` component uses the [`Button`](/duck-ui/components/button) component. Make sure you have it installed in your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
```

```tsx showLineNumbers

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionCollapsibleContent` for smooth height animations powered by [motion](https://motion.dev). The content animates from height 0 to auto with a blur fade.

}>
Requires the `motion` package. Replace `CollapsibleContent` with `MotionCollapsibleContent`. The `Collapsible` root and `CollapsibleTrigger` stay the same.

## API Reference

### Collapsible

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when open state changes |
| `defaultOpen` | `boolean` | `false` | Initial open state when uncontrolled |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CollapsibleTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ButtonVariant` | `'ghost'` | Button variant passed to the underlying `Button` component |
| `children` | `React.ReactNode` | - | Trigger content |
| `onClick` | `React.MouseEventHandler` | - | Additional click handler; open/close toggle is handled internally |
| `...props` | `React.ComponentPropsWithoutRef<typeof Button>` | - | Additional props inherited from `Button`. |

### CollapsibleContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | When `true`, content is always mounted in the DOM regardless of open state |
| `...props` | `React.HTMLProps<HTMLElement>` | - | Additional props to spread to the section element |

### useCollapsible

Hook to access collapsible state from within a `Collapsible` tree. Throws if used outside a `Collapsible`.

```tsx

const { open, onOpenChange } = useCollapsible()
```

| Return | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Current open state |
| `onOpenChange` | `(open: boolean) => void` | Function to update open state |
| `wrapperRef` | `React.RefObject<HTMLDivElement \| null>` | Ref to the root collapsible element |
| `triggerRef` | `React.RefObject<HTMLButtonElement \| null>` | Ref to the trigger button |
| `contentRef` | `React.RefObject<HTMLDivElement \| null>` | Ref to the content section |
| `contentId` | `string` | Auto-generated ID linking trigger and content via `aria-controls` |

### MotionCollapsibleContent

Animates height from 0 to auto with staggered blur and opacity fade. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `Omit<CollapsibleContentProps, 'onDrag' \| 'onDragStart' \| 'onDragEnd' \| 'onAnimationStart'>` | - | All props from `CollapsibleContent` except motion event handlers |