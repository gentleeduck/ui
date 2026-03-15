# Component Registry Reference

## All Available Components

### Layout & Navigation
- **accordion** — collapsible content sections using native `<details>`/`<summary>`
- **breadcrumb** — navigation breadcrumb trail
- **carousel** — swipeable content carousel
- **collapsible** — single collapsible panel
- **menubar** — horizontal menu bar with submenus
- **navigation-menu** — site navigation with animated indicators
- **pagination** — page navigation controls
- **sidebar** — collapsible app sidebar with mobile sheet fallback
- **tabs** — tabbed content panels

### Overlay & Popups
- **alert-dialog** — modal confirmation dialog (blocks interaction)
- **dialog** — modal dialog with portal, overlay, focus trap
- **drawer** — bottom sheet drawer with drag-to-dismiss
- **dropdown-menu** — context-style dropdown from a trigger
- **context-menu** — right-click context menu
- **hover-card** — hover-triggered card preview
- **popover** — anchored popup panel
- **sheet** — slide-in panel from any edge
- **tooltip** — hover/focus tooltip

### Form Controls
- **button** — button with variant system (default, destructive, outline, ghost, link)
- **button-group** — grouped button set
- **checkbox** — checkbox with indeterminate support
- **combobox** — searchable select using command palette
- **command** — command palette (cmdk-style)
- **input** — text input
- **input-group** — input with prefix/suffix addons
- **input-otp** — one-time password input
- **label** — form label
- **radio-group** — radio button group
- **select** — native-style select dropdown
- **slider** — range slider
- **switch** — toggle switch
- **textarea** — multiline text input
- **toggle** — pressable toggle button
- **toggle-group** — grouped toggles (single or multi select)

### Data Display
- **avatar** — user avatar with fallback
- **badge** — small status badge
- **calendar** — date picker calendar grid
- **card** — content card container
- **chart** — data visualization (wraps recharts)
- **empty** — empty state placeholder
- **kbd** — keyboard shortcut display
- **preview-panel** — component preview with source
- **progress** — progress bar
- **separator** — visual divider
- **skeleton** — loading skeleton placeholder
- **table** — data table
- **field** — form field wrapper with label, description, error

### Feedback
- **alert** — static alert/banner (info, warning, error, success)
- **sonner** — toast notification system (wraps sonner)

### Utility
- **aspect-ratio** — fixed aspect ratio container
- **resizable** — resizable panels
- **scroll-area** — custom scrollbar area
- **upload** — file upload dropzone and progress

## Import Pattern

```tsx
// Styled component (most common)
import { Button } from '@gentleduck/registry-ui/button'

// Headless primitive (for custom styling)
import * as DialogPrimitive from '@gentleduck/primitives/dialog'

// Variant function (for extending)
import { buttonVariants } from '@gentleduck/registry-ui/button'
```
