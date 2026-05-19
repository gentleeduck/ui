```tsx title="components/progress-1.tsx"
// import from your project: import Demo from '@/components/progress-1'
'use client'

import { Progress } from '@gentleduck/registry-ui/progress'
import * as React from 'react'

export default function Demo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress className="w-[60%]" value={progress} />
}
```

## Philosophy

Progress bars answer the most anxious user question: "Is this working?" A determinate progress indicator builds trust by showing measurable advancement. We keep the API to a single `value` prop because progress is inherently one-dimensional  -  the component's visual treatment handles the rest.

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add progress
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Progress } from "@/components/ui/progress"
```

```tsx
<Progress value={33} />
```

## RTL Support

Set `dir="rtl"` on `Progress` for a local override, or set `DirectionProvider` once at app/root level for global direction.

```tsx title="components/progress-2.tsx"
// import from your project: import Demo from '@/components/progress-2'
'use client'

import { Progress } from '@gentleduck/registry-ui/progress'
import * as React from 'react'

export default function Demo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress className="w-[60%] rtl:rotate-180" value={progress} dir="rtl" />
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionProgress` for smooth value animations powered by [motion](https://motion.dev). The progress bar animates with a bouncy spring transition when the value changes.

```tsx title="components/progress-3.tsx"
// import from your project: import Demo from '@/components/progress-3'
'use client'

import { MotionProgress } from '@gentleduck/registry-ui/progress'
import * as React from 'react'

export default function Demo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <MotionProgress className="w-[60%]" value={progress} />
}
```

}>
  Requires the `motion` package. Use `MotionProgress` instead of `Progress`. Same props. The regular `Progress` is perfectly fine - this is an optional enhancement.

## API Reference

### Progress

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | (required) | Progress value from `0` to `100` representing the completion percentage |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional CSS classes for the progress bar container |
| `...props` | `Omit<React.HTMLProps<HTMLDivElement>, 'value'>` | - | Additional props to spread to the content div |

### MotionProgress

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | (required) | Progress value from `0` to `100`. Value changes animate with a `springBouncy` spring transition. |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes for the progress bar container |
| `...props` | `Omit<React.HTMLProps<HTMLDivElement>, 'value'>` | - | Additional props to spread to the content div |