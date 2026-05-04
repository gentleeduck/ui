}>

**gentleduck/primitives** ships interaction behavior with no visual opinions. You own design tokens and styling; the primitives own accessibility, focus, dismissal, and interaction semantics.

## What this package is

gentleduck/primitives is a set of low-level React building blocks for teams that need:

- Correct keyboard and screen reader behavior.
- Composition via `asChild`, slotting, and scoped contexts.
- Controlled and uncontrolled state.
- Animation-aware mount/unmount.
- A path from raw primitive to polished design-system component.

This is not a CSS framework. It is an interaction and accessibility layer.

---

## When to use primitives

Use primitives for:

- A reusable design system across apps.
- Complex overlays (dialogs, popovers, menus).
- UI with strict accessibility requirements.
- Heavy visual customization where pre-styled libraries get in the way.

For quick, fixed styling with minimal customization, use pre-styled components instead.

---

## Capability model

| Layer | Responsibility | Typical primitives |
| --- | --- | --- |
| Foundation | Rendering abstraction and composition | [Primitive Elements](/docs/packages/duck-primitives/api/primitive-elements), [Slot](/docs/packages/duck-primitives/api/slot), [Direction](/docs/packages/duck-primitives/api/direction) |
| Interaction infra | Focus, dismissal, mounting, positioning | [Focus Scope](/docs/packages/duck-primitives/api/focus-scope), [Dismissable Layer](/docs/packages/duck-primitives/api/dismissable-layer), [Presence](/docs/packages/duck-primitives/api/presence), [Portal](/docs/packages/duck-primitives/api/portal), [Popper](/docs/packages/duck-primitives/api/popper) |
| Product patterns | Overlays, menus, inputs, selection | [Dialog](/docs/packages/duck-primitives/api/dialog), [Popover](/docs/packages/duck-primitives/api/popover), [Menu](/docs/packages/duck-primitives/api/menu), [Select](/docs/packages/duck-primitives/api/select), [Slider](/docs/packages/duck-primitives/api/slider) |

This layering is why primitives scale in large codebases.

---

## How teams usually adopt

1. Start with one high-value wrapper (`Dialog`, `Popover`, `Menu`).
2. Standardize wrapper rules: `forwardRef`, `className` merge, defaults, no hidden primitive props.
3. Add design tokens and motion classes via `data-state`.
4. Document wrapper contracts in your design-system package.
5. Add more primitives once keyboard and screen reader tests pass.

}>

Build wrappers once; consume wrappers everywhere. Avoid copying examples ad hoc into apps.

---

## Bundle size

gentleduck primitives are 50-92% smaller than the Radix equivalents. Shared internals (Slot, Presence, Popper, focus-scope) are deduplicated across all primitives. Measured sizes: Alert Dialog 1.6 KB vs 18.6 KB, Popover 2.4 KB vs 19.6 KB, Dialog 3.1 KB vs 10.6 KB. Installing 5 Radix primitives costs about 25 KB in duplicated internals; with gentleduck the shared internals load once.

See [benchmark results](/docs/packages/duck-primitives/benchmarks) for per-component numbers and methodology.

---

## Architecture snapshot

Higher-level components compose lower-level ones. Drop one level lower when you need custom behavior.

---

## Production checklist

Before shipping primitive-based wrappers:

- Verify title/description semantics for dialogs.
- Verify keyboard loops and escape behavior.
- Verify focus restoration after close.
- Verify click-outside handling for nested overlays.
- Verify reduced-motion behavior.
- Verify RTL behavior if your app supports Arabic/Hebrew/Persian.

---

## Internal examples

Production patterns from the internal registry.

### 1) Guarded async dialog

### 2) Side-aware popover

### 3) Dropdown menu selection semantics

### 4) Tooltip delay behavior

### 5) Controlled select

### 6) Alert dialog confirmation

---

## Learn next

} className="[&_ul]:my-0">
- [Getting Started](/docs/packages/duck-primitives/getting-started) - Set up a baseline.
- [Core Concepts](/docs/packages/duck-primitives/concepts) - Internals and composition patterns.
- [API Reference](/docs/packages/duck-primitives/api) - Props and events for every primitive.
- [Course](/docs/packages/duck-primitives/course) - From fundamentals to system-level patterns.