```tsx title="components/button-1.tsx"
// import from your project: import Demo from '@/components/button-1'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { CommandShortcut } from '@gentleduck/registry-ui/command'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { ArrowBigUpDash, Command } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-expanded={open}
            aria-label={'advanced button'}
            icon={<ArrowBigUpDash />}
            isCollapsed={open}
            loading={false}
            onClick={() => setOpen((prev) => !prev)}
            size="default">
            Button
          </Button>
        </TooltipTrigger>
        <TooltipContent forceMount side="top" className="flex items-center gap-2">
          <CommandShortcut
            keys="ctrl+m"
            onKeysPressed={() => {
              setOpen((prev) => !prev)
              toast.success('Advanced button')
            }}
            variant="secondary">
            <Command />
            +m
          </CommandShortcut>
          <p>Advanced button</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## Philosophy

Buttons are the primary call to action in any interface. We ship an intentionally rich variant system because buttons carry the most visual weight in UI decisions  -  primary, destructive, ghost, and outline each communicate different levels of commitment. The `asChild` pattern lets you render any element as a button, because sometimes a link needs to look like one.

- Multiple **styles**, **sizes**, and **border** options out of the box
- Built-in **loading state** with spinner and auto-disable
- Supports **icons**, **dual icons**, and **collapsed icon-only mode**
- Flexible `asChild` rendering for links and custom wrappers
- Smooth **hover animations** with optional `AnimationIcon`
- Fully **typed**, **accessible**, and **responsive**
- Powered by `@gentleduck/variants` for scalable theming
- Clean, composable, and **Tailwind-optimized**

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add button
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/variants @gentleduck/libs lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Button } from '@/components/ui/button'
```

```tsx
<Button>Button</Button>
```

### Button

`Button` is a versatile and customizable React component designed to render a button with various styles and functionalities. It supports different sizes, variants, and additional features like loading states and icons. The component is flexible and can be used in a variety of scenarios, from simple buttons to complex interactive elements.

#### Example Usage:

```tsx
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const MyButton = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="lg" variant="default">
          Submit
        </Button>
      </TooltipTrigger>
      <TooltipContent>Submit Button</TooltipContent>
    </Tooltip>
  )
}
```

### Link

You can use the `buttonVariants` helper to create any element like a link that looks like a button.

```tsx
import { buttonVariants } from '@/components/ui/button'
```

```tsx
<Link className={buttonVariants({ variant: 'outline' })}>I'm a Link 🦆</Link>
```

Alternatively, you can set the `asChild` parameter and nest the link component.

```tsx
<Button asChild>
  <Link href="/tos">I'm a Link to ToS 🦆</Link>
</Button>
```

## Examples

### Primary

```tsx title="components/button-2.tsx"
// import from your project: import Demo from '@/components/button-2'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Simple button" type="button" variant={'default'}>
      Button
    </Button>
  )
}
```

### Secondary

```tsx title="components/button-3.tsx"
// import from your project: import Demo from '@/components/button-3'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" type="button" variant={'secondary'}>
      Button
    </Button>
  )
}
```

### Ghost

```tsx title="components/button-4.tsx"
// import from your project: import Demo from '@/components/button-4'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" type="button" variant={'ghost'}>
      Button
    </Button>
  )
}
```

### Outline

```tsx title="components/button-5.tsx"
// import from your project: import Demo from '@/components/button-5'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" type="button" variant={'outline'}>
      Button
    </Button>
  )
}
```

### Link

```tsx title="components/button-6.tsx"
// import from your project: import Demo from '@/components/button-6'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" type="button" variant={'link'}>
      Button
    </Button>
  )
}
```

### Destructive

```tsx title="components/button-7.tsx"
// import from your project: import Demo from '@/components/button-7'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" type="button" variant={'destructive'}>
      Button
    </Button>
  )
}
```

### Warning

```tsx title="components/button-8.tsx"
// import from your project: import Demo from '@/components/button-8'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" type="button" variant="warning">
      Button
    </Button>
  )
}
```

### Dashed

```tsx title="components/button-9.tsx"
// import from your project: import Demo from '@/components/button-9'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" type="button" variant={'dashed'}>
      Button
    </Button>
  )
}
```

### Nothing

```tsx title="components/button-10.tsx"
// import from your project: import Demo from '@/components/button-10'
'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import { ArrowRight, Mail, PanelLeftClose, RefreshCw, Send } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [loading1, setLoading1] = React.useState(false)
  const [loading2, setLoading2] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  const handleLoad = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <MotionButton>Default</MotionButton>
      <MotionButton variant="outline" icon={<Mail />}>
        Email
      </MotionButton>
      <MotionButton variant="ghost" secondIcon={<ArrowRight />}>
        Next
      </MotionButton>
      <MotionButton variant="default" icon={<Send />} loading={loading1} onClick={() => handleLoad(setLoading1)}>
        Submit
      </MotionButton>
      <MotionButton
        variant="secondary"
        icon={<RefreshCw />}
        secondIcon={<ArrowRight />}
        loading={loading2}
        onClick={() => handleLoad(setLoading2)}>
        Sync
      </MotionButton>
      <MotionButton
        variant="outline"
        icon={<PanelLeftClose />}
        isCollapsed={collapsed}
        onClick={() => setCollapsed((c) => !c)}>
        Sidebar
      </MotionButton>
    </div>
  )
}
```

### With Border

```tsx title="components/button-11.tsx"
// import from your project: import Demo from '@/components/button-11'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" border={'primary'} type="button" variant={'nothing'}>
      Button
    </Button>
  )
}
```

### With Border Destructive

```tsx title="components/button-12.tsx"
// import from your project: import Demo from '@/components/button-12'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" border="destructive" type="button" variant="destructive">
      Button
    </Button>
  )
}
```

### With Border Warning

```tsx title="components/button-13.tsx"
// import from your project: import Demo from '@/components/button-13'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" border="warning" type="button" variant="warning">
      Button
    </Button>
  )
}
```

### With Border Secondary

```tsx title="components/button-14.tsx"
// import from your project: import Demo from '@/components/button-14'
import { Button } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" border="secondary" type="button" variant="secondary">
      Button
    </Button>
  )
}
```

### With Icon

```tsx title="components/button-15.tsx"
// import from your project: import Demo from '@/components/button-15'
import { Button } from '@gentleduck/registry-ui/button'
import { Inbox } from 'lucide-react'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" icon={<Inbox />} type="button">
      Button
    </Button>
  )
}
```

### Loading

```tsx title="components/button-16.tsx"
// import from your project: import Demo from '@/components/button-16'
import { Button } from '@gentleduck/registry-ui/button'
import { Inbox } from 'lucide-react'

export default function Demo() {
  return (
    <Button aria-busy="true" aria-label="Loading inbox button" icon={<Inbox />} loading={true} type="button">
      <span>Button</span>
    </Button>
  )
}
```

When `loading` is `true`, `Button` renders a `lucide-react` `` with `animate-spin`, disables interaction, and replaces the leading `icon` until loading completes.

### With Second Icon

```tsx title="components/button-17.tsx"
// import from your project: import Demo from '@/components/button-17'
import { Button } from '@gentleduck/registry-ui/button'
import { ChevronsRight } from 'lucide-react'

export default function Demo() {
  return (
    <Button aria-label="Inbox button with 23 notifications" secondIcon={<ChevronsRight />} type="button">
      Button
    </Button>
  )
}
```

### Collapsible

```tsx title="components/button-18.tsx"
// import from your project: import Demo from '@/components/button-18'
import { Button } from '@gentleduck/registry-ui/button'
import { Inbox } from 'lucide-react'
import React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <Button
      aria-label="Inbox button with 23 notifications"
      icon={<Inbox />}
      isCollapsed={open}
      onClick={() => setOpen(!open)}
      type="button">
      Button
    </Button>
  )
}
```

### Expand Icon

```tsx title="components/button-19.tsx"
// import from your project: import Demo from '@/components/button-19'
import { Button } from '@gentleduck/registry-ui/button'
import { Inbox } from 'lucide-react'

export default function Demo() {
  return (
    <div className="block">
      <Button aria-label="Inbox button" icon={<Inbox />} type="button" variant="expandIcon">
        Button
      </Button>
    </div>
  )
}
```

## RTL Support

```tsx title="components/button-21.tsx"
// import from your project: import Demo from '@/components/button-21'
import { Button } from '@gentleduck/registry-ui/button'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { ChevronLeft, Send } from 'lucide-react'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="default" icon={<Send />}>
          ارسال
        </Button>
        <Button variant="outline" icon={<ChevronLeft />} className="rtl:[&_svg]:rotate-180">
          السابق
        </Button>
        <Button variant="secondary">تسجيل الدخول</Button>
        <Button variant="destructive">حذف</Button>
      </div>
    </DirectionProvider>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionButton` for subtle press feedback powered by [motion](https://motion.dev). The button scales to 0.97 on tap for a physical press feel.

```tsx title="components/button-10.tsx"
// import from your project: import Demo from '@/components/button-10'
'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import { ArrowRight, Mail, PanelLeftClose, RefreshCw, Send } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [loading1, setLoading1] = React.useState(false)
  const [loading2, setLoading2] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  const handleLoad = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <MotionButton>Default</MotionButton>
      <MotionButton variant="outline" icon={<Mail />}>
        Email
      </MotionButton>
      <MotionButton variant="ghost" secondIcon={<ArrowRight />}>
        Next
      </MotionButton>
      <MotionButton variant="default" icon={<Send />} loading={loading1} onClick={() => handleLoad(setLoading1)}>
        Submit
      </MotionButton>
      <MotionButton
        variant="secondary"
        icon={<RefreshCw />}
        secondIcon={<ArrowRight />}
        loading={loading2}
        onClick={() => handleLoad(setLoading2)}>
        Sync
      </MotionButton>
      <MotionButton
        variant="outline"
        icon={<PanelLeftClose />}
        isCollapsed={collapsed}
        onClick={() => setCollapsed((c) => !c)}>
        Sidebar
      </MotionButton>
    </div>
  )
}
```

}>
Requires the `motion` package. Use `MotionButton` instead of `Button`. Same props except `asChild` is not supported. The regular `Button` is perfectly fine - this is an optional enhancement.

## API Reference

### Button

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive' \| 'warning' \| 'outline' \| 'dashed' \| 'secondary' \| 'ghost' \| 'link' \| 'expandIcon' \| 'nothing'` | `'default'` | Visual style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-lg'` | `'default'` | Size of the button |
| `border` | `'default' \| 'primary' \| 'secondary' \| 'destructive' \| 'warning'` | `'default'` | Border style variant |
| `asChild` | `boolean` | `-` | If `true`, renders using a custom child element via `Slot` (e.g. a `Link`) |
| `loading` | `boolean` | `-` | If `true`, renders ``, disables the button, and temporarily overrides `icon` |
| `disabled` | `boolean` | `-` | Disables the button manually |
| `icon` | `React.ReactNode` | `-` | Primary icon displayed before the content (or centered if collapsed) |
| `secondIcon` | `React.ReactNode` | `-` | Secondary icon displayed after the content |
| `isCollapsed` | `boolean` | `-` | If `true`, renders icon-only button (hides children and secondIcon) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native HTML button type |
| `...props` | `Omit<React.HTMLProps<HTMLButtonElement>, 'size'>` | - | Additional props to spread to the button element |

### AnimationIcon

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | (required) | Content inside the animation icon wrapper |
| `animationIcon` | `{ icon?: React.ReactNode; iconPlacement?: 'left' \| 'right' }` | `-` | Animation icon configuration with icon element and placement direction |

### MotionButton

Adds `whileTap` press feedback (scale 0.97) and animated icon/text transitions via `AnimatePresence`. `asChild` is not supported. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `Omit<ButtonProps, 'asChild'>` | - | All props from `Button` except `asChild` |