## About

- **Pan & zoom** via drag, scroll wheel, and pinch-to-zoom gestures
- Built-in **zoom controls** with percentage badge
- **Zero re-renders** during continuous interactions (ref-based transforms)
- `html` prop for rendering raw HTML/SVG content directly
- **Fullscreen dialog** variant with `PreviewPanelDialog`
- **Synced state** between inline and dialog panels via `syncPanels`
- RAF-batched state emission for maximum performance
- Built with gentleduck/ui components: `Button`, `Badge`, `ButtonGroup`, `Separator`, `Tooltip`, `Dialog`

## Philosophy

Preview panels bridge the gap between list views and detail views. Instead of navigating away to see content, users get an inline preview that respects their current context. We ship this as a compound component because the trigger, content, and dialog modes each need independent control while sharing state.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add preview-panel
```

Install the following dependencies:

```bash
npm install @gentleduck/libs lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

```

### With HTML content

```tsx

```

### With dialog and sync

```tsx

```

```tsx

```

## Examples

### HTML / SVG content

Render raw HTML or SVG strings directly using the `html` prop.

### Dialog with synced zoom

Open the content in a fullscreen dialog. Zoom and position sync between both panels.

### Image viewer

Use as a zoomable image viewer.

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionPreviewPanel` for a smooth entrance animation powered by [motion](https://motion.dev). The panel fades in with scale and blur on mount, and its internal controls (buttons, separators, badges, tooltips) use the full motion stack.

}>
Requires the `motion` package. Use `MotionPreviewPanel` instead of `PreviewPanel`. Same props. The internal zoom controls automatically use `MotionButton`, `MotionBadge`, `MotionSeparator`, and `MotionTooltip`.

## API Reference

### PreviewPanel

The core pan-zoom container.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `maxHeight` | `string` | `--` | Maximum height of the panel container (e.g. `"400px"`) |
| `minZoom` | `number` | `0.25` | Minimum zoom level |
| `maxZoom` | `number` | `4` | Maximum zoom level |
| `initialZoom` | `number` | `1` | Starting zoom level |
| `showControls` | `boolean` | `true` | Whether to show the zoom controls overlay |
| `html` | `string` | `--` | Raw HTML string to render inside the panel. Takes priority over `children` |
| `children` | `React.ReactNode` | `--` | Content to render inside the panel |
| `className` | `string` | `--` | Additional CSS classes for the outer container |
| `style` | `React.CSSProperties` | `--` | Inline styles for the outer container |
| `onStateChange` | `(state: PreviewPanelState) => void` | `--` | Called whenever zoom or position changes. Use to sync with another panel |
| `syncState` | `PreviewPanelState` | `--` | External state to apply. The panel syncs to this state when set |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionPreviewPanel

`scaleIn` entrance with `springBouncy` transition on mount. Zoom controls use `MotionButton`, `MotionBadge`, `MotionSeparator`, and `MotionTooltip` internally. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `PreviewPanelProps` | - | All props from `PreviewPanel` are supported |

### PreviewPanelDialog

Combines an inline `PreviewPanel` with a fullscreen `Dialog`. Includes an expand button in the bottom-right corner.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `children` | `React.ReactNode` | - | Content rendered in both inline and dialog panels |
| `html` | `string` | - | Raw HTML string. Takes priority over `children` |
| `className` | `string` | - | Class name for the outer wrapper |
| `panelClassName` | `string` | - | Class name applied to both `PreviewPanel` instances |
| `maxHeight` | `string` | - | Maximum height of the inline panel |
| `minZoom` | `number` | `0.25` | Minimum zoom level |
| `maxZoom` | `number` | `4` | Maximum zoom level |
| `initialZoom` | `number` | `1` | Starting zoom level |
| `showControls` | `boolean` | `true` | Whether to show zoom controls |
| `syncPanels` | `boolean` | `true` | Whether to sync zoom and position between inline and dialog panels |

### PreviewPanelState

The state object used for syncing between panels.

```tsx
type PreviewPanelState = {
  zoom: number
  x: number
  y: number
}
```