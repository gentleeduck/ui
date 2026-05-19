```tsx title="components/separator-1.tsx"
// import from your project: import Demo from '@/components/separator-1'
import { Separator } from '@gentleduck/registry-ui/separator'

export default function Demo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="font-medium text-sm leading-none">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
```

## Philosophy

Visual hierarchy needs breathing room. The Separator creates semantic and visual boundaries between content sections. We expose `orientation` as the only meaningful prop because a divider's job is to divide  -  its value comes from where you place it, not how you configure it.

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add separator
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Separator } from "@/components/ui/separator"
```

```tsx
<Separator />
```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/separator-2.tsx"
// import from your project: import Demo from '@/components/separator-2'
import { Separator } from '@gentleduck/registry-ui/separator'

export default function Demo() {
  return (
    <div dir="rtl">
      <div>
        <div className="space-y-1">
          <h4 className="font-medium text-sm leading-none">مكونات Radix الاساسية</h4>
          <p className="text-muted-foreground text-sm">مكتبة مكونات واجهة مستخدم مفتوحة المصدر.</p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>المدونة</div>
          <Separator orientation="vertical" />
          <div>التوثيق</div>
          <Separator orientation="vertical" />
          <div>المصدر</div>
        </div>
      </div>
    </div>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionSeparator` for a smooth expand-from-center animation powered by [motion](https://motion.dev). Horizontal separators scale along the X axis, vertical ones along Y.

```tsx title="components/separator-3.tsx"
// import from your project: import Demo from '@/components/separator-3'
import { MotionSeparator } from '@gentleduck/registry-ui/separator'

export default function Demo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="font-medium text-sm leading-none">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
      </div>
      <MotionSeparator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <MotionSeparator orientation="vertical" />
        <div>Docs</div>
        <MotionSeparator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
```

}>
  Requires the `motion` package. Use `MotionSeparator` instead of `Separator`. Same props. The regular `Separator` is perfectly fine - this is an optional enhancement.

## API Reference

### Separator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Controls the orientation of the separator line |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.HTMLProps<HTMLHRElement>` | - | Additional props to spread to the hr element |

### MotionSeparator

Expands from center with `springBouncy` transition — scales along X for horizontal, Y for vertical. Renders a `div` with `role="separator"` instead of `hr`. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Controls the orientation and animation axis |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the div element |