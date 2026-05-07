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

  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
```

```tsx showLineNumbers

  
      
      

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionResizablePanelGroup` for a smooth entrance animation powered by [motion](https://motion.dev). The panel group fades in with scale and blur on mount using `springBouncy`.

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