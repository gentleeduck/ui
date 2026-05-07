## Why Another Animation Library?

General-purpose animation libraries handle springs, keyframes, and timeline orchestration. That is more machinery than you need for a fade-in dialog or a dropdown transition.

`@gentleduck/motion` targets UI component animations. It coordinates mount/unmount with CSS or JS transitions and stays small.

---

## What It Solves

You want a dialog to fade in on open and fade out on close. React unmounts the component immediately when `open={false}`, so the exit animation never plays.

```tsx
// The problem: component unmounts before animation finishes
{open && <Dialog>...</Dialog>}
```

`@gentleduck/motion` provides a `Presence` primitive that holds the component in the tree until the exit animation finishes.

---

## How It Works

Three phases:

1. **Mount** — component enters the DOM, enter animation triggers
2. **Present** — component is visible and interactive
3. **Exit** — exit animation plays, component unmounts after it ends

---

## Used Across the Ecosystem

Every animated component in `@gentleduck/ui` uses motion primitives:

| Component | Animation |
| --- | --- |
| **Dialog** | Fade + scale on open/close |
| **Sheet** | Slide from edge with backdrop fade |
| **Drawer** | Slide up with drag-to-dismiss |
| **Dropdown Menu** | Scale + fade from trigger |
| **Tooltip** | Fade with slight offset |
| **Popover** | Scale from anchor point |
| **Collapsible** | Height animation |
| **Accordion** | Height animation per section |

---

## Pairing with Variants

Motion pairs with `@gentleduck/variants` for conditional animation classes:

```tsx
import { cva } from '@gentleduck/variants'

const overlay = cva('fixed inset-0 bg-black/50', {
  variants: {
    state: {
      open: 'animate-in fade-in',
      closed: 'animate-out fade-out',
    },
  },
})
```

Variants pick the classes. Motion picks when to unmount.

---

## Getting Started

```bash
bun add @gentleduck/motion
```

Motion is a peer dependency of `@gentleduck/primitives` and ships automatically with the CLI installer. Install it directly if you are building custom components on top of primitives.