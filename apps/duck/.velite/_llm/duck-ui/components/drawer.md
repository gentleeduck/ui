## Philosophy

Drawers are the mobile-native sibling of sheets  -  they respond to drag gestures and snap to natural positions. We wrap Vaul because gesture physics and spring animations are notoriously hard to get right. The result feels native on touch devices while degrading gracefully to a standard overlay on desktop.

## About

Drawer is built on [Vaul](https://github.com/emilkowalski/vaul) by [emilkowalski\_](https://twitter.com/emilkowalski_).

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add drawer
```

Install the required dependency:

```bash
npm install vaul @gentleduck/libs
```

Copy and paste the following code into your project.

Update import paths as needed.

## Usage

```tsx showLineNumbers

  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui'
```

```tsx showLineNumbers

## Behavior

- **Background Scaling**: Scales the background when the drawer is open using `[vaul-drawer-wrapper]`.
- **Custom Close Threshold**: Controls when the drawer should close based on swipe distance (0 to 1).
- **Scroll Lock Timeout**: Sets a delay for drawer drag after scrolling (default: 500ms).
- **Snap Points**: Defines percentage or pixel values for drawer screen coverage.
- **Fade Effect**: Applies a fade effect from a specific snap point.
- **Modal Control**: Allows interaction with elements outside the drawer (default: true).
- **Handle-Only Dragging**: Restricts drawer dragging to `` (default: false).
- **Directional Control**: Opens drawer from top, bottom, left, or right (default: bottom).
- **Scroll Restoration Prevention**: Avoids restoring scroll after navigation within the drawer (default: true).
- **Disable Scroll Prevention**: Disables scroll prevention to fix autofocus issues (default: true).
- **No Body Styles**: Prevents Vaul from applying styles to the body (default: false).
- **Background Color on Scale**: Controls background color change when the drawer opens (default: true).
- **No Drag Attribute**: Prevents drawer dragging when interacting with elements marked `[data-vaul-no-drag]`.

## RTL Support

Set `dir="rtl"` on `Drawer` for a local override, or set `DirectionProvider` once at app/root level for global direction. Horizontal drawers (`left`/`right`) are resolved automatically for RTL/LTR.

## API Reference

### Drawer

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shouldScaleBackground` | `boolean` | `true` | Whether to scale the background when drawer is open |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction used to resolve horizontal drawer side in RTL/LTR. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `...props` | `React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>` | - | Additional props inherited from `Drawer.Root`. |

### DrawerTrigger

Wrapper around `DrawerPrimitive.Trigger`. Used to toggle the drawer open or closed.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the trigger |
| `children` | `React.ReactNode` | - | Trigger content |
| `...props` | `React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>` | - | Additional props inherited from `Drawer.Trigger`. |

### DrawerPortal

Wrapper around `DrawerPrimitive.Portal`. Renders drawer content in a React Portal.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Portal>` | - | Additional props inherited from `Drawer.Portal`. |

### DrawerClose

Wrapper around `DrawerPrimitive.Close`. Closes the drawer when clicked.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the close element |
| `children` | `React.ReactNode` | - | Close button content |
| `...props` | `React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>` | - | Additional props inherited from `Drawer.Close`. |

### DrawerOverlay

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the overlay |
| `...props` | `React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>` | - | Additional props inherited from `Drawer.Overlay`. |

### DrawerContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the content panel |
| `children` | `React.ReactNode` | - | Drawer inner content |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `overlayProps` | `React.ComponentPropsWithoutRef<typeof DrawerOverlay>` | - | Props forwarded to the `DrawerOverlay` |
| `...props` | `React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>` | - | Additional props inherited from `Drawer.Content`. |

### DrawerHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the header |
| `children` | `React.ReactNode` | - | Header content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### DrawerFooter

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes applied to the footer |
| `children` | `React.ReactNode` | - | Footer content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### DrawerTitle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes applied to the title |
| `children` | `React.ReactNode` | - | Title text |
| `...props` | `React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>` | - | Additional props inherited from `Drawer.Title`. |

### DrawerDescription

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes applied to the description |
| `children` | `React.ReactNode` | - | Description text |
| `...props` | `React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>` | - | Additional props inherited from `Drawer.Description`. |

## See also

- [Dialog](/duck-ui/components/dialog)  -  Centered modal overlay
- [Sheet](/duck-ui/components/sheet)  -  Side panel overlay