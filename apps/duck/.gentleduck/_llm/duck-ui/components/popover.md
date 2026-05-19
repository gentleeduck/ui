```tsx title="components/popover-1.tsx"
// import from your project: import Demo from '@/components/popover-1'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'

export default function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input className="col-span-2 h-8" defaultValue="100%" id="width" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input className="col-span-2 h-8" defaultValue="300px" id="maxWidth" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input className="col-span-2 h-8" defaultValue="25px" id="height" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input className="col-span-2 h-8" defaultValue="none" id="maxHeight" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
```

```tsx showLineNumbers
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>
```

## Examples

### Sides

```tsx title="components/popover-2.tsx"
// import from your project: import Demo from '@/components/popover-2'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side={'top'} className="w-80">
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the values for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width">Width</Label>
                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxWidth">Max</Label>
                <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxHeight">Max</Label>
                <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side={'right'} className="w-80">
          {/* same content */}
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the values for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width-r">Width</Label>
                <Input id="width-r" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxWidth-r">Max</Label>
                <Input id="maxWidth-r" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height-r">Height</Label>
                <Input id="height-r" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxHeight-r">Max</Label>
                <Input id="maxHeight-r" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side={'bottom'} className="w-80">
          {/* same content */}
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the values for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width-b">Width</Label>
                <Input id="width-b" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxWidth-b">Max</Label>
                <Input id="maxWidth-b" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height-b">Height</Label>
                <Input id="height-b" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxHeight-b">Max</Label>
                <Input id="maxHeight-b" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side={'left'} className="w-80">
          {/* same content */}
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the values for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width-l">Width</Label>
                <Input id="width-l" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxWidth-l">Max</Label>
                <Input id="maxWidth-l" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height-l">Height</Label>
                <Input id="height-l" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxHeight-l">Max</Label>
                <Input id="maxHeight-l" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
```

### Form

```tsx title="components/popover-3.tsx"
// import from your project: import Demo from '@/components/popover-3'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'

export default function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
          }}>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">Configure the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="p3-width">Width</Label>
              <Input className="col-span-2 h-8" defaultValue="100%" id="p3-width" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="p3-height">Height</Label>
              <Input className="col-span-2 h-8" defaultValue="25px" id="p3-height" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </PopoverClose>
            <Button size="sm" type="submit">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
```

### Active Trigger on Open

Style the trigger to appear active while the popover is open using `data-[state=open]`:

```tsx title="components/popover-5.tsx"
// import from your project: import Demo from '@/components/popover-5'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Settings } from 'lucide-react'

export default function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:ring-2 data-[state=open]:ring-ring">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Preferences</h4>
          <p className="text-muted-foreground text-sm">The trigger stays active while this is open.</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

## Component Composition

## RTL Support

Set `dir="rtl"` on `Popover` for a local override, or set `DirectionProvider` once at app/root level for global direction. In RTL mode, `side="left"` and `side="right"` are logically swapped.

```tsx
<Popover dir="rtl">
  <PopoverTrigger>افتح</PopoverTrigger>
  <PopoverContent>محتوى النافذة المنبثقة هنا.</PopoverContent>
</Popover>
```

```tsx title="components/popover-4.tsx"
// import from your project: import Demo from '@/components/popover-4'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <Popover dir="rtl">
        <PopoverTrigger asChild>
          <Button variant="outline">افتح النافذة المنبثقة</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">الابعاد</h4>
              <p className="text-muted-foreground text-sm">قم بتعيين ابعاد الطبقة.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">العرض</Label>
                <Input className="col-span-2 h-8" defaultValue="100%" id="width" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">اقصى عرض</Label>
                <Input className="col-span-2 h-8" defaultValue="300px" id="maxWidth" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">الارتفاع</Label>
                <Input className="col-span-2 h-8" defaultValue="25px" id="height" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight">اقصى ارتفاع</Label>
                <Input className="col-span-2 h-8" defaultValue="none" id="maxHeight" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </DirectionProvider>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionPopover` and `MotionPopoverContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The transform origin matches the placement side automatically.

```tsx title="components/popover-6.tsx"
// import from your project: import Demo from '@/components/popover-6'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { MotionPopover, MotionPopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'

export default function Demo() {
  return (
    <MotionPopover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <MotionPopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="p6-width">Width</Label>
              <Input className="col-span-2 h-8" defaultValue="100%" id="p6-width" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="p6-maxWidth">Max. width</Label>
              <Input className="col-span-2 h-8" defaultValue="300px" id="p6-maxWidth" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="p6-height">Height</Label>
              <Input className="col-span-2 h-8" defaultValue="25px" id="p6-height" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="p6-maxHeight">Max. height</Label>
              <Input className="col-span-2 h-8" defaultValue="none" id="p6-maxHeight" />
            </div>
          </div>
        </div>
      </MotionPopoverContent>
    </MotionPopover>
  )
}
```

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