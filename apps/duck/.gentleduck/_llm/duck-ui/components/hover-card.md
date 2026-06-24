```tsx title="components/hover-card-1.tsx"
// import from your project: import Demo from '@/components/hover-card-1'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui/hover-card'
import { CalendarIcon } from 'lucide-react'

export default function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger variant={'link'}>@nextjs</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage alt="VC" src="https://github.com/gentleeduck.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">@nextjs</h4>
            <p className="text-sm">The React Framework -- created and maintained by @vercel.</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-muted-foreground text-xs">Joined December 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
```

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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
```

```tsx
<HoverCard>
  <HoverCardTrigger>Hover</HoverCardTrigger>
  <HoverCardContent>
    The React Framework - created and maintained by @vercel.
  </HoverCardContent>
</HoverCard>
```

## Examples

### Active Trigger on Open

Style the trigger to appear active while the hover card is open using `data-[state=open]`:

```tsx title="components/hover-card-3.tsx"
// import from your project: import Demo from '@/components/hover-card-3'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui/hover-card'

export default function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href="https://github.com/gentleeduck"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-sm underline-offset-4 hover:underline data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:no-underline">
          @gentleduck
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/gentleeduck.png" />
            <AvatarFallback>GD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">gentleduck</h4>
            <p className="text-muted-foreground text-sm">The trigger link is highlighted while hovering this card.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
```

### Arrow

Add a caret pointing at the trigger. The arrow moves along the content edge when collision avoidance shifts the card near a viewport boundary.

```tsx title="components/hover-card-5.tsx"
// import from your project: import Demo from '@/components/hover-card-5'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui/hover-card'
import { CalendarIcon } from 'lucide-react'

export default function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger variant="link">@nextjs</HoverCardTrigger>
      <HoverCardContent side="bottom" arrowPadding={8} className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage alt="VC" src="https://github.com/gentleeduck.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">@nextjs</h4>
            <p className="text-sm">The React Framework — created and maintained by @vercel.</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-muted-foreground text-xs">Joined December 2021</span>
            </div>
          </div>
        </div>
        <HoverCardArrow />
      </HoverCardContent>
    </HoverCard>
  )
}
```

## RTL Support

Set `dir="rtl"` on `HoverCard` for a local override, or set `DirectionProvider` once at app/root level for global direction. This mirrors hover-card positioning for right-to-left layouts.

```tsx
<HoverCard dir="rtl">
  <HoverCardTrigger>مرر الماوس</HoverCardTrigger>
  <HoverCardContent>
    محتوى البطاقة هنا.
  </HoverCardContent>
</HoverCard>
```

```tsx title="components/hover-card-2.tsx"
// import from your project: import Demo from '@/components/hover-card-2'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui/hover-card'
import { CalendarIcon } from 'lucide-react'

export default function Demo() {
  return (
    <HoverCard dir="rtl">
      <HoverCardTrigger variant={'link'}>@nextjs</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4 space-x-reverse">
          <Avatar dir="rtl">
            <AvatarImage alt="VC" src="https://github.com/gentleeduck.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">@nextjs</h4>
            <p className="text-sm">اطار React -- تم انشاؤه وصيانته بواسطة @vercel.</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-muted-foreground text-xs">انضم في ديسمبر 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionHoverCard` and `MotionHoverCardContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The card scales and fades with a directional shift matching the placement side.

```tsx title="components/hover-card-4.tsx"
// import from your project: import Demo from '@/components/hover-card-4'
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { HoverCardTrigger, MotionHoverCard, MotionHoverCardContent } from '@gentleduck/registry-ui/hover-card'
import { CalendarIcon } from 'lucide-react'

export default function Demo() {
  return (
    <MotionHoverCard>
      <HoverCardTrigger variant={'link'}>@nextjs</HoverCardTrigger>
      <MotionHoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage alt="VC" src="https://github.com/gentleeduck.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">@nextjs</h4>
            <p className="text-sm">The React Framework -- created and maintained by @vercel.</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-muted-foreground text-xs">Joined December 2021</span>
            </div>
          </div>
        </div>
      </MotionHoverCardContent>
    </MotionHoverCard>
  )
}
```

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