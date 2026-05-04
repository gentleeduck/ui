}>

duck-primitives use the `Presence` component to delay unmounting until CSS animations finish. No JavaScript animation library required.

## How animation works

duck-primitives use the `Presence` component to delay unmounting until CSS animations finish. This means you can use standard CSS `@keyframes` for enter/exit animations without any JavaScript animation library.

---

## CSS keyframes pattern

Define open and closed animations, then apply them via `data-state`:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes scaleOut {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
}

.overlay[data-state="open"] { animation: fadeIn 200ms ease; }
.overlay[data-state="closed"] { animation: fadeOut 200ms ease; }

.content[data-state="open"] { animation: scaleIn 200ms ease; }
.content[data-state="closed"] { animation: scaleOut 200ms ease; }
```

}>

Presence detects the `animationend` event and only unmounts after it fires. Make sure you define both open **and** closed animations  -  without a closed animation, Presence unmounts immediately.

---

## Tailwind CSS

```tsx

```

}>

Requires the `tailwindcss-animate` plugin for `animate-in` / `animate-out` utilities.

---

## The `forceMount` escape hatch

If you want to control animation entirely yourself (e.g., with Framer Motion), use `forceMount` on Portal, Overlay, and Content to keep them always mounted:

```tsx

```

---

## Presence render function

For conditional class application without forceMount:

```tsx

  {({ present }) => (

      Sidebar content

  )}

```

---

## Tips

}>

- Always define both open and closed animations. Without a closed animation, Presence unmounts immediately.
- Keep animations short (150-300ms) for responsive UI. Longer animations feel sluggish.
- Use `ease` or `cubic-bezier` timing functions. `linear` looks mechanical.
- Test with reduced motion preferences: `@media (prefers-reduced-motion: reduce) { ... }`