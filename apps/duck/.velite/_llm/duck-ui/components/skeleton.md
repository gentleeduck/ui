```tsx title="components/skeleton-1.tsx"
// import from your project: import Demo from '@/components/skeleton-1'
import { Skeleton } from '@gentleduck/registry-ui/skeleton'

export default function Demo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```

## Philosophy

Loading states deserve the same design attention as loaded states. Skeleton placeholders reduce perceived wait time by hinting at the shape of incoming content. We keep this component prop-less intentionally  -  you control the shape through `className` and layout, mirroring the actual content it replaces.

For icon-only UIs, keep a compact icon-sized skeleton instead of removing the skeleton entirely, so layout stability is preserved while loading.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add skeleton
```

Install the following dependencies:

```bash
npm install @gentleduck/libs 
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

```tsx
<Skeleton className="w-[100px] h-[20px] rounded-full" />
```

## Examples

### Card

```tsx title="components/skeleton-2.tsx"
// import from your project: import Demo from '@/components/skeleton-2'
import { Skeleton } from '@gentleduck/registry-ui/skeleton'

export default function Demo() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/skeleton-3.tsx"
// import from your project: import Demo from '@/components/skeleton-3'
import { Skeleton } from '@gentleduck/registry-ui/skeleton'

export default function Demo() {
  return (
    <div dir="rtl">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
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

Use `MotionSkeleton` for staggered entrance animations powered by [motion](https://motion.dev). Each skeleton block fades in with scale and blur, staggered by 50ms via the `index` prop.

```tsx title="components/skeleton-4.tsx"
// import from your project: import Demo from '@/components/skeleton-4'
'use client'

import { MotionSkeleton } from '@gentleduck/registry-ui/skeleton'

export default function Demo() {
  return (
    <div className="flex items-center space-x-4">
      <MotionSkeleton className="h-12 w-12 rounded-full" index={0} />
      <div className="space-y-2">
        <MotionSkeleton className="h-4 w-[250px]" index={1} />
        <MotionSkeleton className="h-4 w-[200px]" index={2} />
      </div>
    </div>
  )
}
```

}>
Requires the `motion` package. Use `MotionSkeleton` instead of `Skeleton`. Same props plus `index` for stagger delay. The regular `Skeleton` is perfectly fine - this is an optional enhancement.

## API Reference

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS class names to control shape and size |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionSkeleton

Staggered `scaleIn` entrance with `springBouncy` transition. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `...props` | `SkeletonProps` | - | All props from `Skeleton` are supported |