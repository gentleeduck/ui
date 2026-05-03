}>

**Lesson 4 of 10**: Floating UI quality depends on placement strategy, not just CSS.

## Baseline popover

```tsx

export function FilterPopover() {
  return (

  )
}
```

---

## Placement API

Core props on `Content`:

- `side`: top/right/bottom/left.
- `align`: start/center/end.
- `sideOffset`: distance from anchor.
- `alignOffset`: fine alignment shift.

Treat these as geometry controls. Keep spacing, color, borders in CSS/tokens.

---

## Collision strategy

Popper can flip and shift content to keep it visible.

```tsx

```

Use `collisionPadding` to preserve comfortable edge spacing.

---

## Anchor modeling

By default, content anchors to `Trigger`. Use `Anchor` when trigger and visual anchor differ.

```tsx

  <div className="inline-flex items-center gap-2">...</div>

```

This is useful for composite inputs and toolbar groups.

---

## Side-aware animation

Use `data-side` and `data-state` for directional motion:

```css
[data-state='open'][data-side='top'] { animation: slideDownIn 150ms ease; }
[data-state='open'][data-side='bottom'] { animation: slideUpIn 150ms ease; }
```

This prevents motion that feels disconnected from placement.

---

## Popover vs Tooltip vs Dialog

- `Popover`: interactive floating content.
- `Tooltip`: non-interactive hint text.
- `Dialog`: high-priority task or interruption.

Wrong primitive choice usually leads to accessibility issues.

---

## Lab

1. Build an anchored filter popover.
2. Test all `side` + `align` combinations near viewport edges.
3. Add side-aware enter/exit motion and verify reduced-motion fallback.

}>

Next: [Lesson 5 - Menus, Dropdowns, and Selection](/docs/packages/duck-primitives/course/05-menus)