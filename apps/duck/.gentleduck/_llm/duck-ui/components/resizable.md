```tsx title="components/resizable-1.tsx"
// import from your project: import Demo from '@/components/resizable-1'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gentleduck/registry-ui/resizable'

export default function Demo() {
  return (
    <ResizablePanelGroup className="max-w-md rounded-lg border md:min-w-[450px]" orientation="horizontal">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

## Philosophy

Resizable panels let users allocate screen real estate to match their workflow. We wrap react-resizable-panels because the math of proportional resizing, minimum sizes, and persistent layouts is deceptively complex. The PanelGroup/Panel/Handle model keeps the API simple while supporting arbitrarily complex layouts.

## About

The `Resizable` component is built on top of
[`react-resizable-panels`](https://github.com/bvaughn/react-resizable-panels) by [`bvaughn`](https://github.com/bvaughn).

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add resizable
```

Install the following dependencies:

```bash
npm install react-resizable-panels @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
```

```tsx showLineNumbers
<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Two</ResizablePanel>
</ResizablePanelGroup>
```

## Examples

### Vertical

Use the `orientation` prop to set the direction of the resizable panels.

```tsx title="components/resizable-2.tsx"
// import from your project: import Demo from '@/components/resizable-2'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gentleduck/registry-ui/resizable'

export default function Demo() {
  return (
    <ResizablePanelGroup className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]" orientation="vertical">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

```tsx showLineNumbers {9}
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Example() {
  return (
    <ResizablePanelGroup orientation="vertical">
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Handle

The grip handle shows by default. Pass `withHandle={false}` to render only the thin line without the visible grip.

```tsx title="components/resizable-3.tsx"
// import from your project: import Demo from '@/components/resizable-3'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gentleduck/registry-ui/resizable'

export default function Demo() {
  return (
    <ResizablePanelGroup className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]" orientation="horizontal">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

```tsx showLineNumbers {11}
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Example() {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/resizable-4.tsx"
// import from your project: import Demo from '@/components/resizable-4'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gentleduck/registry-ui/resizable'

export default function Demo() {
  return (
    <ResizablePanelGroup className="max-w-md rounded-lg border md:min-w-[450px]" orientation="horizontal" dir="rtl">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">واحد</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">اثنان</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">ثلاثة</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionResizablePanelGroup` for a smooth entrance animation powered by [motion](https://motion.dev). The panel group fades in with scale and blur on mount using `springBouncy`.

```tsx title="components/resizable-5.tsx"
// import from your project: import Demo from '@/components/resizable-5'
import {
  MotionResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@gentleduck/registry-ui/resizable'

export default function Demo() {
  return (
    <MotionResizablePanelGroup className="max-w-md rounded-lg border md:min-w-[450px]" orientation="horizontal">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </MotionResizablePanelGroup>
  )
}
```

}>
  Requires the `motion` package. Use `MotionResizablePanelGroup` instead of `ResizablePanelGroup`. The rest of the components (`ResizablePanel`, `ResizableHandle`) stay the same. The regular `ResizablePanelGroup` is perfectly fine - this is an optional enhancement.

## API Reference

### ResizablePanelGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | (required) | Layout orientation of the panels |
| `className` | `string` | `--` | Additional CSS classes for the panel group |
| `dir` | `"ltr" \| "rtl"` | `--` | Text direction override for RTL support |
| `children` | `React.ReactNode` | `--` | `ResizablePanel` and `ResizableHandle` elements |
| `...props` | `React.ComponentPropsWithoutRef<typeof Group>` | - | Additional props inherited from `Group`. |

### ResizablePanel

Re-exports `Panel` from `react-resizable-panels` directly.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultSize` | `number` | `-` | Default size of the panel as a percentage (0-100) |
| `minSize` | `number` | `-` | Minimum size of the panel as a percentage |
| `maxSize` | `number` | `-` | Maximum size of the panel as a percentage |
| `collapsible` | `boolean` | `false` | Whether the panel can be collapsed |
| `className` | `string` | `--` | Additional CSS classes for the panel |
| `children` | `React.ReactNode` | `--` | Panel content |
| `...props` | `React.ComponentPropsWithoutRef<typeof Panel>` | - | Additional props inherited from `Panel`. |

### ResizableHandle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `withHandle` | `boolean` | `true` | Whether to render the visible grip icon handle. Set to `false` to show only the thin line. |
| `className` | `string` | `--` | Additional CSS classes for the resize handle |
| `...props` | `React.ComponentPropsWithoutRef<typeof PanelResizeHandle>` | - | Additional props inherited from `Separator`. |

### MotionResizablePanelGroup

`scaleIn` entrance with `springBouncy` transition on mount. Wraps `ResizablePanelGroup`. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `ResizablePanelGroupProps` | - | All props from `ResizablePanelGroup` are supported |