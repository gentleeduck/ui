```tsx title="components/tooltip-1.tsx"
// import from your project: import Demo from '@/components/tooltip-1'
import { Button } from '@gentleduck/registry-ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## Philosophy

Tooltips are the lightest touch of contextual help  -  they appear on hover, require no interaction, and disappear when attention moves on. We build on Floating UI because positioning against viewport edges, scroll containers, and dynamic layouts is harder than it looks. The `data-state` and `data-side` attributes give you animation hooks without JavaScript state management.

* **Floating UI powered positioning** - Smart placement with `flip`, `shift`, and `offset` middleware.
* **State-aware styling hooks** - `data-state` and `data-side` attributes for state and placement styling.
* **Transform-origin variable** - Uses `--gentleduck-tooltip-content-transform-origin` for direction-aware animations.
* **Customizable delays** - Configure open delays globally with `TooltipProvider` or per tooltip with `delayDuration`.
* **Flexible triggers** - Wrap any element using `asChild`.
* **Accessible by default** - Implements proper ARIA attributes and keyboard navigation.
* **Portal rendering** - Renders tooltips in a portal to avoid layout clipping.

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add tooltip
```

Install dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs
```

Copy the `Tooltip` component code into your project.

Ensure import paths match your project structure.

## Usage

```tsx
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

// app/layout.tsx (once)
<TooltipProvider>{children}</TooltipProvider>

<Tooltip delayDuration={500}>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>
```

## Examples

### Basic

```tsx title="components/tooltip-2.tsx"
// import from your project: import Demo from '@/components/tooltip-2'
import { Button } from '@gentleduck/registry-ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip Content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

### Custom Trigger with `asChild`

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <span className="cursor-pointer underline">Hover me</span>
  </TooltipTrigger>
  <TooltipContent>Custom element trigger</TooltipContent>
</Tooltip>
```

### Animated Tooltip

```tsx
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent className="TooltipContent">Animated tooltip</TooltipContent>
</Tooltip>
```

```css
.TooltipContent {
  transform-origin: var(--gentleduck-tooltip-content-transform-origin);
  transition: transform 150ms ease, opacity 150ms ease;
}

.TooltipContent[data-state='closed'] {
  opacity: 0;
  transform: scale(0.95);
}

.TooltipContent[data-state='delayed-open'],
.TooltipContent[data-state='instant-open'] {
  opacity: 1;
  transform: scale(1);
}
```

### Tooltip with Toggle

When wrapping a `Toggle` (or any interactive element that manages its own pressed/active state), use `disableCloseOnClick` to prevent the tooltip from intercepting clicks and overriding `data-state`:

```tsx
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Bold } from 'lucide-react'

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild disableCloseOnClick>
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
    </TooltipTrigger>
    <TooltipContent>Toggle bold</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Without `disableCloseOnClick`, the tooltip's `onClick` handler prevents the Toggle from toggling, and its `data-state="closed"` overrides the Toggle's `data-state="on"/"off"`, breaking the visual feedback.

```tsx title="components/tooltip-4.tsx"
// import from your project: import Demo from '@/components/tooltip-4'
import { Toggle } from '@gentleduck/registry-ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { Bold } from 'lucide-react'

export default function Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild disableCloseOnClick>
          <Toggle aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent>
          <p>Toggle bold</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## Styling Hooks

* **`data-state`** - Set on trigger and content (`closed`, `delayed-open`, `instant-open`) for state-based styling.
* **`data-side`** - Set on content (`top`, `right`, `bottom`, `left`) for placement-aware styles.
* **`--gentleduck-tooltip-content-transform-origin`** - CSS variable for animation transform origin.

## RTL Support

Set `dir="rtl"` on `Tooltip` for a local override, or set `DirectionProvider` once at app/root level for global direction. This mirrors tooltip positioning in right-to-left layouts.

```tsx
<TooltipProvider>
  <Tooltip dir="rtl">
    <TooltipTrigger>مرر الماوس</TooltipTrigger>
    <TooltipContent>نص التلميح</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

```tsx title="components/tooltip-3.tsx"
// import from your project: import Demo from '@/components/tooltip-3'
import { Button } from '@gentleduck/registry-ui/button'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">{'تمرير'}</Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>{'أضف إلى المكتبة'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DirectionProvider>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionTooltip` and `MotionTooltipContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The tooltip fades in with a subtle scale and directional shift toward the trigger.

```tsx title="components/tooltip-5.tsx"
// import from your project: import Demo from '@/components/tooltip-5'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { MotionTooltip, MotionTooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <TooltipProvider>
      <MotionTooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>

        <MotionTooltipContent>
          <p>Add to library</p>
        </MotionTooltipContent>
      </MotionTooltip>
    </TooltipProvider>
  )
}
```

}>
  Requires the `motion` package. Use `MotionTooltip` instead of `Tooltip` and `MotionTooltipContent` instead of `TooltipContent`. `TooltipProvider` and `TooltipTrigger` stay the same.

## API Reference

### TooltipProvider

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Tooltip tree to provide behavior for |
| `delayDuration` | `number` | `700` | Delay before opening tooltips |
| `skipDelayDuration` | `number` | `300` | Window where moving between triggers skips delay |
| `disableHoverableContent` | `boolean` | `false` | Close tooltip as soon as pointer leaves trigger |

### Tooltip

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Tooltip sub-components (`TooltipTrigger`, `TooltipContent`) |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `delayDuration` | `number` | `700` | Per-tooltip delay override |
| `disableHoverableContent` | `boolean` | `false` | Per-tooltip hover-content behavior override |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `...props` | `React.ComponentPropsWithRef<typeof TooltipPrimitive.Root>` | - | Additional root props |

### TooltipTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | `false` | Renders the child element as the trigger instead of a `button` |
| `disableCloseOnClick` | `boolean` | `false` | Prevents tooltip from closing on click and from overriding the child's `data-state`/`data-slot`. Use when wrapping interactive elements like `Toggle`. |
| `children` | `React.ReactNode` | - | Content rendered inside the trigger |
| `className` | `string` | - | Additional CSS class names to apply |
| `...props` | `Omit<React.ComponentPropsWithRef<typeof TooltipPrimitive.Trigger>, 'size'>` | - | Additional props to spread to the button element |

### TooltipContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names to apply |
| `children` | `React.ReactNode` | - | Content rendered inside the tooltip |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the content container |
| `forceMount` | `boolean` | - | Keep content mounted for external animation control |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side relative to the trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment on the chosen side |
| `sideOffset` | `number` | `4` | Main-axis offset from trigger |
| `alignOffset` | `number` | `0` | Cross-axis offset from trigger |
| `...props` | `React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>` | - | Additional props to spread to the content div |

### MotionTooltip

Wraps with `useMotionRoot` for exit animation support. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `TooltipProps` | - | All props from `Tooltip` are supported |

### MotionTooltipContent

Adds directional scale, blur, and opacity enter/exit animation with ultra-fast `tweenMicro` (100ms) transition. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `TooltipContentProps` | - | All props from `TooltipContent` are supported |