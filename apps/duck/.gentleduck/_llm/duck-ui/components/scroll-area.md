```tsx title="components/scroll-area-1.tsx"
// import from your project: import Demo from '@/components/scroll-area-1'
import { ScrollArea } from '@gentleduck/registry-ui/scroll-area'
import { Separator } from '@gentleduck/registry-ui/separator'

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

export default function Demo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div className="text-sm" key={tag}>
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
```

## Philosophy

Native scrollbars break visual consistency across platforms. ScrollArea provides custom-styled scrollbars that behave identically everywhere while preserving native scroll physics. We keep the API minimal  -  just `viewportClassName`  -  because scrolling should be invisible infrastructure, not a feature you configure.

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add scroll-area
```

```css title="global.css"
/* Add this block of css to your project. */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  /* Replace this with your own custom scrollbar thumb color */
  background: var(--border);
  border-radius: 5px;
}
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

 Add this block of css to your project.

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  /* Replace this with your own custom scrollbar thumb color */
  background: var(--border);
  border-radius: 5px;
}
```

Update the import paths to match your project setup.

## Usage

```tsx
import { ScrollArea } from "@/components/ui/scroll-area"
```

```tsx
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  Jokester began sneaking into the castle in the middle of the night and leaving
  jokes all over the place: under the king's pillow, in his soup, even in the
  royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
  then, one day, the people of the kingdom discovered that the jokes left by
  Jokester were so funny that they couldn't help but laugh. And once they
  started laughing, they couldn't stop.
</ScrollArea>
```

## Examples

### Horizontal Scrolling

```tsx title="components/scroll-area-2.tsx"
// import from your project: import Demo from '@/components/scroll-area-2'
import { ScrollArea } from '@gentleduck/registry-ui/scroll-area'
import Image from 'next/image'

export interface IArtwork {
  artist: string
  art: string
}

export const works: IArtwork[] = [
  {
    art: 'https://images.pexels.com/photos/27309761/pexels-photo-27309761.jpeg',
    artist: 'Lina Escobar',
  },
  {
    art: 'https://images.pexels.com/photos/14757972/pexels-photo-14757972.jpeg',
    artist: 'Marco Duvall',
  },
  {
    art: 'https://images.pexels.com/photos/5046721/pexels-photo-5046721.jpeg',
    artist: 'Sahana Ramesh',
  },
]

export default function Demo() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {works.map((artwork) => (
          <figure className="shrink-0" key={artwork.artist}>
            <div className="overflow-hidden">
              <Image
                alt={`Photo by ${artwork.artist}`}
                className="max-h-[300px] select-none rounded-md object-cover"
                draggable={false}
                height={300}
                src={artwork.art}
                width={230}
              />
            </div>
            <figcaption className="pt-2 text-muted-foreground text-xs">
              Photo by <span className="font-semibold text-foreground">{artwork.artist}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </ScrollArea>
  )
}
```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/scroll-area-3.tsx"
// import from your project: import Demo from '@/components/scroll-area-3'
import { ScrollArea } from '@gentleduck/registry-ui/scroll-area'
import { Separator } from '@gentleduck/registry-ui/separator'

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

export default function Demo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border" dir="rtl">
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">الوسوم</h4>
        {tags.map((tag) => (
          <>
            <div className="text-sm" key={tag}>
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionScrollArea` for a smooth entrance animation powered by [motion](https://motion.dev). The container fades in with scale and blur on mount using the shared `scaleIn` preset with a `springBouncy` transition.

```tsx title="components/scroll-area-4.tsx"
// import from your project: import Demo from '@/components/scroll-area-4'
'use client'

import { MotionScrollArea } from '@gentleduck/registry-ui/scroll-area'
import { Separator } from '@gentleduck/registry-ui/separator'

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

export default function Demo() {
  return (
    <MotionScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </MotionScrollArea>
  )
}
```

}>
  Requires the `motion` package. Use `MotionScrollArea` instead of `ScrollArea`. Same props. The regular `ScrollArea` is perfectly fine - this is an optional enhancement.

## API Reference

### ScrollArea

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `viewportRef` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the inner scrollable viewport element |
| `viewportClassName` | `string` | `--` | Additional CSS classes for the inner scrollable viewport |
| `className` | `string` | `--` | Additional CSS classes for the outer container |
| `style` | `React.CSSProperties` | `--` | Inline styles for the outer container |
| `children` | `React.ReactNode` | `--` | Scrollable content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionScrollArea

`scaleIn` entrance with `springBouncy` transition on mount. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `ScrollAreaProps` | - | All props from `ScrollArea` are supported (drag handlers are omitted for motion type safety) |