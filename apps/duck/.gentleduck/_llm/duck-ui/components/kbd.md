```tsx title="components/kbd-1.tsx"
// import from your project: import Demo from '@/components/kbd-1'
import { Kbd, KbdGroup } from '@gentleduck/registry-ui/kbd'

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>Alt</Kbd>
        <Kbd>Fn</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>S</Kbd>
      </KbdGroup>
    </div>
  )
}
```

}>
  **Rewritten version:**
  **Note:** You might wonder why we don't use the `CommandShortcut` component from the `command` module.
  The reason is that we want to give you the flexibility to use the `kbd` component in any context, not just within a command.
  Additionally, the `CommandShortcut` component is specifically designed to represent a keyboard shortcut associated with a command, not a plain HTML element.
  As a result, it has a different API and does not require certain props like `keys` or `onKeyPress`.

## Philosophy

Keyboard shortcuts deserve visual prominence. The Kbd component renders key combinations with consistent styling, making shortcut discovery a natural part of the UI rather than something hidden in documentation. We pair it with `@gentleduck/vim` for actual key binding  -  Kbd handles the display, vim handles the logic.

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add kbd
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Kbd } from "@/components/ui/kbd"
```

```tsx
<Kbd>Ctrl</Kbd>
```

## Examples

### Group

Use the `KbdGroup` component to group keyboard keys together.

```tsx title="components/kbd-2.tsx"
// import from your project: import Demo from '@/components/kbd-2'
import { Kbd, KbdGroup } from '@gentleduck/registry-ui/kbd'

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-sm">
        Press{' '}
        <KbdGroup>
          <Kbd>Ctrl + K</Kbd>
          <Kbd>Ctrl + P</Kbd>
        </KbdGroup>{' '}
        to jump between files quickly
      </p>
    </div>
  )
}
```

### Button

Use the `Kbd` component inside a `Button` component to display a keyboard key inside a button.

```tsx title="components/kbd-3.tsx"
// import from your project: import Demo from '@/components/kbd-3'
import { Button } from '@gentleduck/registry-ui/button'
import { Kbd } from '@gentleduck/registry-ui/kbd'

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button className="pr-2" size="sm" variant="outline">
        Confirm <Kbd>Enter</Kbd>
      </Button>
      <Button className="pr-2" size="sm" variant="outline">
        Dismiss <Kbd>Esc</Kbd>
      </Button>
    </div>
  )
}
```

### Tooltip

You can use the `Kbd` component inside a `Tooltip` component to display a tooltip with a keyboard key.

```tsx title="components/kbd-4.tsx"
// import from your project: import Demo from '@/components/kbd-4'
import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { Kbd, KbdGroup } from '@gentleduck/registry-ui/kbd'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-4">
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline">
                Undo
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                Undo{' '}
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Z</Kbd>
                </KbdGroup>
              </div>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline">
                Redo
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                Redo{' '}
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Y</Kbd>
                </KbdGroup>
              </div>
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>
      </div>
    </TooltipProvider>
  )
}
```

### Input Group

You can use the `Kbd` component inside a `InputGroupAddon` component to display a keyboard key inside an input group.

```tsx title="components/kbd-5.tsx"
// import from your project: import Demo from '@/components/kbd-5'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { Kbd } from '@gentleduck/registry-ui/kbd'
import { SearchIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Quick find..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>Ctrl</Kbd>
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/kbd-6.tsx"
// import from your project: import Demo from '@/components/kbd-6'
import { Kbd, KbdGroup } from '@gentleduck/registry-ui/kbd'

export default function Demo() {
  return (
    <div dir="rtl">
      <div className="flex flex-col items-center gap-4">
        <div dir="ltr">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>Alt</Kbd>
            <Kbd>Fn</Kbd>
          </KbdGroup>
        </div>

        <div dir="ltr">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>S</Kbd>
          </KbdGroup>
        </div>
      </div>
    </div>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionKbd` for staggered fade+blur entrance on keyboard shortcuts powered by [motion](https://motion.dev).

```tsx title="components/kbd-7.tsx"
// import from your project: import Demo from '@/components/kbd-7'
'use client'

import { KbdGroup, MotionKbd } from '@gentleduck/registry-ui/kbd'

export default function Demo() {
  return (
    <div className="flex items-center gap-4 p-4">
      <KbdGroup>
        <MotionKbd index={0}>⌘</MotionKbd>
        <MotionKbd index={1}>K</MotionKbd>
      </KbdGroup>
      <KbdGroup>
        <MotionKbd index={2}>⌘</MotionKbd>
        <MotionKbd index={3}>⇧</MotionKbd>
        <MotionKbd index={4}>P</MotionKbd>
      </KbdGroup>
    </div>
  )
}
```

}>
  Requires the `motion` package. Use `MotionKbd` instead of `Kbd`. Pass `index` for stagger order.

## API Reference

### Kbd

Displays an individual keyboard key with consistent styling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional class names for the kbd element |
| `children` | `React.ReactNode` | - | Key label text or icon |
| `...props` | `React.HTMLProps<HTMLElement>` | - | Additional props to spread to the kbd element |

### KbdGroup

Groups multiple `Kbd` components together in an inline layout.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the group |
| `children` | `React.ReactNode` | - | `Kbd` elements to group together |
| `...props` | `React.ComponentPropsWithoutRef<'div'>` | - | Additional props to spread to the group element (renders as a `kbd`) |

### MotionKbd

Same props as `Kbd` plus an optional `index` prop for stagger delay (30ms per index). Adds fade+blur entrance. Requires the `motion` package.