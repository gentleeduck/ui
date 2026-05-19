```tsx title="components/sonner-1.tsx"
// import from your project: import Demo from '@/components/sonner-1'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { toast } from 'sonner'

export default function Demo() {
  return (
    <Button
      onClick={() =>
        toast('Event has been created', {
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
          description: 'Sunday, December 03, 2023 at 9:00 AM',
        })
      }
      variant="outline">
      Show Toast
    </Button>
  )
}
```

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
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

Install the following dependencies:

```bash
npm install sonner next-themes @gentleduck/libs lucide-react
```

Add the `Button` and `Progress` component to your project.

The `Sonner` component uses the [`Button`](/duck-ui/components/button) and [`Progress`](/duck-ui/components/progress) components. Make sure you have them installed in your project.

Copy and paste the following code into your project.

Add the Toaster component

```tsx title="app/layout.tsx" {1,9}
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

## Usage

```tsx
import { toast } from 'sonner'
```

```tsx
toast('Event has been created.')
```

## Examples

### Default

```tsx title="components/sonner-2.tsx"
// import from your project: import Demo from '@/components/sonner-2'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

export default function Demo() {
  return (
    <Button
      onClick={() =>
        toast('Actions have been triggered', {
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
          className: 'gap-3',
          description: `you have clicked the 'super button' button, and btw i can be loading.`,
          icon: <ShieldAlert />,
        })
      }
      variant="outline">
      Show Toast
    </Button>
  )
}
```

### Upload

```tsx title="components/sonner-3.tsx"
// import from your project: import Demo from '@/components/sonner-3'
import { Button } from '@gentleduck/registry-ui/button'
import { SonnerUpload } from '@gentleduck/registry-ui/sonner'
import React from 'react'
import { toast } from 'sonner'

export default function Demo() {
  const controllerRef = React.useRef(new AbortController())
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = React.useRef(0)

  const updateToast = (progress: number) => {
    toast(
      <SonnerUpload
        attachments={2}
        onCancel={handleCancel}
        onComplete={handleComplete}
        progress={progress}
        remainingTime={Math.max(0, 3000 - progress * 30)}
      />,
      { dismissible: false, duration: 30000, id: 'sonner' },
    )
  }

  const startProgress = () => {
    progressRef.current = 0
    updateToast(0)

    intervalRef.current = setInterval(() => {
      const randomStep = Math.floor(Math.random() * 11) + 5 // 5-15%
      progressRef.current = Math.min(progressRef.current + randomStep, 100)
      updateToast(progressRef.current)

      if (progressRef.current >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        intervalRef.current = null
      }
    }, 400)
  }

  const handleCancel = () => {
    toast.dismiss('sonner')
    controllerRef.current.abort()
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleComplete = () => {
    toast.dismiss('sonner')
  }

  const handleClick = () => {
    handleCancel() // Ensure no previous interval is running
    controllerRef.current = new AbortController()
    startProgress()
  }

  return (
    <Button border="default" onClick={handleClick} size="sm" variant="outline">
      Show Upload Toast
    </Button>
  )
}
```

### Toast Types

```tsx title="components/sonner-4.tsx"
// import from your project: import Demo from '@/components/sonner-4'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { toast } from 'sonner'

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={() => toast.success('File uploaded successfully')} variant="outline">
        Success
      </Button>
      <Button onClick={() => toast.error('Upload failed. Please try again.')} variant="outline">
        Error
      </Button>
      <Button onClick={() => toast.warning('Storage is almost full (90%)')} variant="outline">
        Warning
      </Button>
      <Button onClick={() => toast.info('Your file is queued for processing')} variant="outline">
        Info
      </Button>
      <Button
        onClick={() => {
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: 'Uploading file...',
            success: 'File uploaded successfully!',
            error: 'Upload failed',
          })
        }}
        variant="outline">
        Promise
      </Button>
    </div>
  )
}
```

### Multi-File Upload

```tsx title="components/sonner-5.tsx"
// import from your project: import Demo from '@/components/sonner-5'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { SonnerUpload } from '@gentleduck/registry-ui/sonner'
import React from 'react'
import { toast } from 'sonner'

export default function Demo() {
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = React.useRef(0)
  const toastId = 'multi-upload'

  const updateToast = (progress: number) => {
    toast(
      <SonnerUpload
        attachments={5}
        onCancel={handleCancel}
        onComplete={handleComplete}
        progress={progress}
        remainingTime={Math.max(0, Math.round((100 - progress) * 0.6))}
      />,
      { dismissible: false, duration: 60000, id: toastId },
    )
  }

  const startProgress = () => {
    progressRef.current = 0
    updateToast(0)

    intervalRef.current = setInterval(() => {
      const step = Math.floor(Math.random() * 6) + 2
      progressRef.current = Math.min(progressRef.current + step, 100)
      updateToast(progressRef.current)

      if (progressRef.current >= 100 && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 600)
  }

  const handleCancel = () => {
    toast.dismiss(toastId)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleComplete = () => {
    toast.dismiss(toastId)
    toast.success('All 5 files uploaded successfully')
  }

  const handleClick = () => {
    handleCancel()
    startProgress()
  }

  return (
    <Button border="default" onClick={handleClick} size="sm" variant="outline">
      Upload 5 Files
    </Button>
  )
}
```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/sonner-6.tsx"
// import from your project: import Demo from '@/components/sonner-6'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { toast } from 'sonner'

export default function Demo() {
  return (
    <div dir="rtl">
      <Button
        onClick={() =>
          toast('تم إنشاء الحدث', {
            action: {
              label: 'تراجع',
              onClick: () => console.log('Undo'),
            },
            description: 'الأحد، 3 ديسمبر 2023 الساعة 9:00 صباحاً',
            style: {
              direction: 'rtl',
              textAlign: 'right',
            },
          })
        }
        variant="outline">
        {'عرض الإشعار'}
      </Button>
    </div>
  )
}
```

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