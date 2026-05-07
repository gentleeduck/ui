```tsx title="components/label-1.tsx"
// import from your project: import Demo from '@/components/label-1'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  )
}
```

## Philosophy

Labels are the accessibility backbone of every form. A form control without a label is invisible to screen readers. We ship Label as a standalone component rather than baking it into every form element because composition is more flexible than configuration  -  you decide where the label goes and how it connects.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add label
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Label } from "@/components/ui/label"
```

```tsx
<Label htmlFor="email">Your email address</Label>
```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/label-3.tsx"
// import from your project: import Demo from '@/components/label-3'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div dir="rtl">
      <div className="flex items-center gap-2">
        <Checkbox id="tterms" />
        <Label htmlFor="tterms">قبول الشروط والاحكام</Label>
      </div>
    </div>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionLabel` for a fade+blur entrance animation powered by [motion](https://motion.dev). Pairs well with `MotionInput` for staggered form field entrance.

```tsx title="components/label-4.tsx"
// import from your project: import Demo from '@/components/label-4'
'use client'

import { MotionInput } from '@gentleduck/registry-ui/input'
import { MotionLabel } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <div className="flex flex-col gap-1.5">
        <MotionLabel htmlFor="motion-label-name" index={0}>
          Full name
        </MotionLabel>
        <MotionInput id="motion-label-name" placeholder="Jane Doe" index={0} />
      </div>
      <div className="flex flex-col gap-1.5">
        <MotionLabel htmlFor="motion-label-email" index={1}>
          Email address
        </MotionLabel>
        <MotionInput id="motion-label-email" type="email" placeholder="jane@example.com" index={1} />
      </div>
    </div>
  )
}
```

}>
Requires the `motion` package. Use `MotionLabel` instead of `Label`. Pass `index` for stagger delay.

## API Reference

### Label

Renders an accessible label element associated with form controls.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional class names for the label element |
| `htmlFor` | `string` | - | The `id` of the form element this label is associated with |
| `children` | `React.ReactNode` | - | Label text or elements |
| `ref` | `React.Ref<HTMLLabelElement>` | - | Ref forwarded to the label element |
| `...props` | `React.HTMLProps<HTMLLabelElement>` | - | Additional props to spread to the label element |

### MotionLabel

Same props as `Label` plus an optional `index` prop for stagger delay (50ms per index). Adds fade+blur entrance. Requires the `motion` package.