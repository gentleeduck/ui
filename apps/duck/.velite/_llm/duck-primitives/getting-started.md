}>

Install primitives, wire global direction, build a controlled dialog, run a QA
checklist.

## Install

```bash
npm install @gentleduck/primitives
```

Requirements:

- React `18+`
- TypeScript optional (types are bundled)

---

## Set document direction once

If the product might support RTL later, set direction now.

```tsx

export function Providers({ children }: { children: React.ReactNode }) {
  return 

        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-5 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out"
          onEscapeKeyDown={(event) => {
            if (submitting) event.preventDefault()
          }}
          onInteractOutside={(event) => {
            if (submitting) event.preventDefault()
          }}
        >
          <Dialog.Title className="text-lg font-semibold">Delete project?</Dialog.Title>

            This action removes all environments and cannot be undone.

                Cancel

              {submitting ? 'Deleting...' : 'Delete'}

  )
}
```

You get:

- Focus trap and restoration.
- Dismissal control on Escape and outside interactions.
- Correct dialog ARIA semantics.
- State-driven animation hooks via `data-state`.

---

## Import strategy

Use namespace imports to keep JSX readable and avoid naming collisions:

```tsx

```

---

## Controlled vs uncontrolled rule

- Use uncontrolled (`defaultOpen`) for simple local UI.
- Use controlled (`open` + `onOpenChange`) for workflows, async actions, analytics, or URL-driven state.

If you need business rules around close behavior, default to controlled.

---

## Minimal QA before merge

1. Keyboard-only: tab into trigger, open, tab cycle, close with <Kbd>Escape</Kbd>, confirm focus restore.
2. Screen reader: confirm title and description are announced.
3. Nested overlays: confirm outside click behavior is correct.
4. Reduced motion: ensure animations are disabled when `prefers-reduced-motion: reduce`.
5. RTL pass: verify placement/alignment for at least one floating primitive.

---

## Next pages

} className="[&_ul]:my-0">
- [Core Concepts](/docs/packages/duck-primitives/concepts) - `asChild`, Presence, Dismissable Layer, context scoping.
- [Course](/docs/packages/duck-primitives/course) - Lessons with labs and production patterns.
- [API Reference](/docs/packages/duck-primitives/api) - Full prop and event reference.