## The Stack

GentleDuck is not a single library. It is a set of focused packages that solve specific problems independently and share the same conventions.

---

## Core Layer

### @gentleduck/libs

Framework-agnostic utilities shared across the ecosystem.

- **`cn`** -- Class name merging. `clsx` + `tailwind-merge` as a single import.
- **`Slot`** -- Polymorphic composition with ref forwarding.
- **`Portal`** -- Mount components outside the DOM tree. Used by dialogs, tooltips, and popovers.
- **`filtered-object`**, **`group-array`**, **`parse-date`** -- Small helpers that replace heavier utility libraries.

Every GentleDuck package imports from `@gentleduck/libs`. Zero external dependencies.

### @gentleduck/variants

A type-safe class name generator. A faster, smaller alternative to [class-variance-authority](https://cva.style/).

```ts
import { cva } from '@gentleduck/variants'

const button = cva('inline-flex items-center rounded font-medium', {
  variants: {
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-6 text-base',
    },
    variant: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    },
  },
  defaultVariants: { size: 'md', variant: 'primary' },
})

button({ size: 'lg', variant: 'ghost' })
// => "inline-flex items-center rounded font-medium h-10 px-6 text-base hover:bg-accent hover:text-accent-foreground"
```

Benchmarks at ~7x faster than CVA with full TypeScript inference.

### @gentleduck/hooks

React hooks for common UI problems:

| Hook | Purpose |
| --- | --- |
| `use-debounce` | Debounce values for search inputs |
| `use-composed-refs` | Merge multiple refs into one |
| `use-media-query` | Responsive queries in code |
| `use-is-mobile` | Mobile detection |
| `use-copy-to-clipboard` | Clipboard API |
| `use-stable-id` | SSR-safe ID generation |
| `use-on-open-change` | Modal state management |

Each hook imports independently.

---

## Behavior Layer

### @gentleduck/primitives

Unstyled, accessibility-first primitives. They handle focus trapping, keyboard navigation, ARIA attributes, and click-outside dismissal. You bring the design.

Includes:
- **Dialog, Drawer, Sheet** -- Modal and dismissible surfaces
- **Popover, Tooltip** -- Positioned floating elements (built on Floating UI)
- **Slider** -- Range input with keyboard support
- **Navigation Menu** -- Accessible menu navigation patterns

Every component in `registry-ui-duckui` builds on these primitives. Start here if you want your own design system.

### @gentleduck/motion

Animation and transition utilities that pair with duck-variants. Covers enter/exit animations, mount/unmount transitions, and staggered sequences.

Used by Dialog, Sheet, Drawer, Tooltip, Popover, and Dropdown Menu for open/close animations.

### @gentleduck/vim

Keyboard navigation engine modeled on vim's modal editing. Powers the command palette, menu navigation, and keyboard-driven interfaces across duck-www.

---

## How They Compose

Here is how `Button` uses the stack:

A larger component like `Command` composes more layers:

Each layer is useful on its own. The composition patterns are where it pays off.

---

## Adopting Incrementally

Each package is published independently on npm. Pick what you need:

```bash
# Just need class name generation?
bun add @gentleduck/variants

# Just need hooks?
bun add @gentleduck/hooks

# Want headless primitives?
bun add @gentleduck/primitives

# Want the full component library?
bunx @gentleduck/cli init button dialog input
```

Start with what fixes your biggest problem. Add the rest as you need it.

  Every package is TypeScript-first, tree-shakeable, has zero or minimal dependencies, and versions independently. You control what you adopt.