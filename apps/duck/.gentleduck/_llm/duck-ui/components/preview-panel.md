```tsx title="components/preview-panel-1.tsx"
// import from your project: import Demo from '@/components/preview-panel-1'
import { PreviewPanel } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <PreviewPanel maxHeight="400px" className="rounded-lg border bg-card">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="size-24 rounded-full bg-primary/20" />
        <h3 className="font-semibold text-lg">Pan & Zoom</h3>
        <p className="text-muted-foreground text-sm">Drag to pan, scroll to zoom, or use the controls.</p>
      </div>
    </PreviewPanel>
  )
}
```

## About

* **Pan & zoom** via drag, scroll wheel, and pinch-to-zoom gestures
* Built-in **zoom controls** with percentage badge
* **Zero re-renders** during continuous interactions (ref-based transforms)
* `html` prop for rendering raw HTML/SVG content directly
* **Fullscreen dialog** variant with `PreviewPanelDialog`
* **Synced state** between inline and dialog panels via `syncPanels`
* RAF-batched state emission for maximum performance
* Built with gentleduck/ui components: `Button`, `Badge`, `ButtonGroup`, `Separator`, `Tooltip`, `Dialog`

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
import { PreviewPanel } from '@/components/ui/preview-panel'
```

```tsx
<PreviewPanel maxHeight="400px">
  <YourContent />
</PreviewPanel>
```

### With HTML content

```tsx
<PreviewPanel html="<svg>...</svg>" maxHeight="400px" />
```

### With dialog and sync

```tsx
import { PreviewPanelDialog } from '@/components/ui/preview-panel'
```

```tsx
<PreviewPanelDialog syncPanels maxHeight="400px">
  <YourContent />
</PreviewPanelDialog>
```

## Examples

### HTML / SVG content

Render raw HTML or SVG strings directly using the `html` prop.

```tsx title="components/preview-panel-2.tsx"
// import from your project: import Demo from '@/components/preview-panel-2'
import { PreviewPanel } from '@gentleduck/registry-ui/preview-panel'

const SVG_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="10" y="10" width="80" height="80" rx="8" fill="#3b82f6" opacity="0.8"/>
  <rect x="110" y="10" width="80" height="80" rx="8" fill="#10b981" opacity="0.8"/>
  <rect x="10" y="110" width="80" height="80" rx="8" fill="#f59e0b" opacity="0.8"/>
  <rect x="110" y="110" width="80" height="80" rx="8" fill="#ef4444" opacity="0.8"/>
  <text x="100" y="105" text-anchor="middle" font-size="12" fill="currentColor">SVG Content</text>
</svg>`

export default function Demo() {
  return <PreviewPanel html={SVG_HTML} maxHeight="350px" className="rounded-lg border bg-card" />
}
```

### Dialog with synced zoom

Open the content in a fullscreen dialog. Zoom and position sync between both panels.

```tsx title="components/preview-panel-3.tsx"
// import from your project: import Demo from '@/components/preview-panel-3'
import { PreviewPanelDialog } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <PreviewPanelDialog maxHeight="350px" syncPanels>
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list generated from Array.from
              key={i}
              className="flex size-16 items-center justify-center rounded-md bg-primary/10 font-medium text-sm">
              {i + 1}
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm">
          Click expand to open fullscreen. Zoom state syncs between both views.
        </p>
      </div>
    </PreviewPanelDialog>
  )
}
```

### Image viewer

Use as a zoomable image viewer.

```tsx title="components/preview-panel-4.tsx"
// import from your project: import Demo from '@/components/preview-panel-4'
import { PreviewPanel } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <PreviewPanel maxHeight="400px" initialZoom={0.8} className="rounded-lg border bg-card">
      {/* biome-ignore lint/performance/noImgElement: example component demonstrating PreviewPanel with a plain img */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
        alt="Landscape"
        className="max-w-[600px] rounded-md"
        draggable={false}
      />
    </PreviewPanel>
  )
}
```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/preview-panel-5.tsx"
// import from your project: import Demo from '@/components/preview-panel-5'
import { PreviewPanel } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <PreviewPanel maxHeight="400px" className="rounded-lg border bg-card" dir="rtl">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="size-24 rounded-full bg-primary/20" />
        <h3 className="font-semibold text-lg">تحريك وتكبير</h3>
        <p className="text-muted-foreground text-sm">اسحب للتحريك، مرر للتكبير، او استخدم ادوات التحكم.</p>
      </div>
    </PreviewPanel>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionPreviewPanel` for a smooth entrance animation powered by [motion](https://motion.dev). The panel fades in with scale and blur on mount, and its internal controls (buttons, separators, badges, tooltips) use the full motion stack.

```tsx title="components/preview-panel-6.tsx"
// import from your project: import Demo from '@/components/preview-panel-6'
'use client'

import { MotionPreviewPanel } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <MotionPreviewPanel maxHeight="400px" className="rounded-lg border bg-card">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="size-24 rounded-full bg-primary/20" />
        <h3 className="font-semibold text-lg">Pan & Zoom</h3>
        <p className="text-muted-foreground text-sm">Drag to pan, scroll to zoom, or use the controls.</p>
      </div>
    </MotionPreviewPanel>
  )
}
```

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