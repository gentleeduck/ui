## Philosophy

Toasts are the UI equivalent of a tap on the shoulder  -  noticeable but not blocking. We wrap Sonner because it handles the hard parts (stacking, dismissal timing, swipe gestures, accessibility announcements) better than a from-scratch implementation. Our layer adds visual consistency with the design system and upload progress integration.

## About

Sonner is built and maintained by [emilkowalski\_](https://twitter.com/emilkowalski_).

## How It's Built

## Installation

  CLI
  Manual

Run the following command:

```bash
npx @gentleduck/cli add sonner
```

Add the Toaster component

```tsx title="app/layout.tsx" {1,9}

export default function RootLayout({ children }) {
  return (

  )
}
```

Install the following dependencies:

```bash
npm install sonner next-themes @gentleduck/libs lucide-react
```

Add the `Button` and `Progress` component to your project.

The `Sonner` component uses the [`Button`](/docs/components/button) and [`Progress`](/docs/components/progress) components. Make sure you have them installed in your project.

Copy and paste the following code into your project.

Add the Toaster component

```tsx title="app/layout.tsx" {1,9}

export default function RootLayout({ children }) {
  return (

  )
}
```

## Usage

```tsx

```

```tsx
toast('Event has been created.')
```

## Examples

### Default

### Upload

### Toast Types

### Multi-File Upload

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## API Reference

### Toaster

The `Toaster` component wraps the `Sonner` `Toaster` from the `sonner` library, applying theme synchronization via `next-themes` and default styling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Toast theme. Auto-detected from `next-themes` `useTheme()` |
| `...props` | `ToasterProps` | - | Additional props inherited from the `sonner` toaster. |

### SonnerUpload

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `progress` | `number` | (required) | Current upload progress percentage (0--100) |
| `attachments` | `number` | (required) | Number of files being uploaded |
| `remainingTime` | `number` | - | Estimated remaining upload time in seconds |
| `onCancel` | `(e: React.MouseEvent<HTMLButtonElement>, dismiss: (id: string) => void) => void` | - | Callback triggered when the Cancel button is clicked. Receives the click event and a function to dismiss the toast by ID |
| `onComplete` | `(e: React.MouseEvent<HTMLButtonElement>, dismiss: (id: string) => void) => void` | - | Callback triggered when the Complete button is clicked. Receives the click event and a function to dismiss the toast by ID |

`SonnerUpload` shows a spinning `Loader` icon while `progress < 100` and switches to a success `CircleCheck` icon at completion.

### Utility Function

#### `formatTime(seconds: number): string`

Formats a duration in seconds into a human-readable string:

* Returns days if >= 1 day (`'Xd '`),
* else hours if >= 1 hour (`'Xh '`),
* else minutes if >= 1 minute (`'Xm '`),
* else seconds (`'Xs'`).

### Types

```ts
export type UploadSonnerProps = {
  progress: number
  attachments: number
  remainingTime?: number
  onCancel?: (
    e: React.MouseEvent<HTMLButtonElement>,
    dismiss: (id: string) => void
  ) => void
  onComplete?: (
    e: React.MouseEvent<HTMLButtonElement>,
    dismiss: (id: string) => void
  ) => void
}

export type ToasterProps = React.ComponentProps<typeof Sonner>
```