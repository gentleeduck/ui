## Philosophy

Hover cards provide progressive disclosure without commitment. They let users preview content before clicking, reducing unnecessary navigation. We build on Popover primitives because hover cards are fundamentally popovers with mouse-enter triggers  -  shared internals mean consistent behavior and smaller bundle size.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add hover-card
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs
```

Add the `Button` component to your project.

The `HoverCard` component uses the [`Button`](/duck-ui/components/button) component. Make sure you have it installed in your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
```

```tsx

  <HoverCardTrigger>Hover</HoverCardTrigger>

    The React Framework - created and maintained by @vercel.

```

## Examples

### Active Trigger on Open

Style the trigger to appear active while the hover card is open using `data-[state=open]`:

## RTL Support

Set `dir="rtl"` on `HoverCard` for a local override, or set `DirectionProvider` once at app/root level for global direction. This mirrors hover-card positioning for right-to-left layouts.

```tsx

  <HoverCardTrigger>مرر الماوس</HoverCardTrigger>

    محتوى البطاقة هنا.

```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionHoverCard` and `MotionHoverCardContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The card scales and fades with a directional shift matching the placement side.

}>
Requires the `motion` package. Use `MotionHoverCard` instead of `HoverCard` and `MotionHoverCardContent` instead of `HoverCardContent`. `HoverCardTrigger` stays the same.

## API Reference

### HoverCard

Root wrapper that provides hover-card state and context. Wraps `HoverCardPrimitive.Root` internally.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `-` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | `-` | Callback when open state changes |
| `defaultOpen` | `boolean` | `-` | Initial open state for uncontrolled usage |
| `openDelay` | `number` | `700` | Delay before opening on hover/focus |
| `closeDelay` | `number` | `300` | Delay before closing on pointer leave/blur |
| `delayDuration` | `number` | - | Alias for `openDelay`. If both are provided, `openDelay` takes precedence |
| `skipDelayDuration` | `number` | - | Reserved for future use (currently ignored) |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Default side for `HoverCardContent` positioning |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `children` | `React.ReactNode` | `--` | HoverCard sub-components |
| `...props` | `React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>` | - | Additional props inherited from `HoverCard.Root`. |

### HoverCardTrigger

The element that triggers the hover card on hover. Applies `buttonVariants` styling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ButtonVariant` | `'outline'` | Button variant style |
| `size` | `ButtonSize` | `'default'` | Button size |
| `border` | `ButtonBorder` | `'default'` | Button border style |
| `asChild` | `boolean` | `false` | Whether to use the child as the trigger element directly |
| `children` | `React.ReactNode` | `--` | Content rendered inside the trigger button |
| `...props` | `React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> & React.ComponentPropsWithoutRef<typeof Button>` | - | Additional props inherited from `HoverCard.Trigger` and `Button`. |

### HoverCardContent

The content displayed when the hover card is open. Wraps `HoverCardPrimitive.Content` with animation and styling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `-` | Additional CSS classes to apply to the content container |
| `children` | `React.ReactNode` | `-` | Content rendered inside the hover card |
| `forceMount` | `boolean` | `-` | Keep content mounted for animation control |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side relative to the trigger. Defaults to the `placement` value from `HoverCard` |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment on the chosen side |
| `sideOffset` | `number` | `4` | Main-axis offset from trigger |
| `alignOffset` | `number` | `0` | Cross-axis offset from trigger |
| `...props` | `React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> & React.HTMLProps<HTMLDivElement>` | - | Additional props inherited from `HoverCard.Content` and standard content div props. |

### MotionHoverCard

Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `HoverCardProps` | - | All props from `HoverCard` are supported |

### MotionHoverCardContent

Adds directional scale, blur, and opacity enter/exit animation. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `HoverCardContentProps` | - | All props from `HoverCardContent` are supported |