}>

**Lesson 2 of 10**: You will build a dialog that is realistic enough to ship, not just a demo.

## Baseline implementation

```tsx

export function AccountDangerZone() {
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  async function handleDelete() {
    try {
      setBusy(true)
      // await api.deleteAccount()
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    

        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-5 shadow-lg"
          onEscapeKeyDown={(event) => {
            if (busy) event.preventDefault()
          }}
          onInteractOutside={(event) => {
            if (busy) event.preventDefault()
          }}
        >
          <Dialog.Title className="text-lg font-semibold">Delete account?</Dialog.Title>

            This action is irreversible.

              <button disabled={busy} className="rounded border px-3 py-2 text-sm">Cancel</button>

              {busy ? 'Deleting...' : 'Delete'}

  )
}
```

---

## Anatomy and responsibilities

| Part | Responsibility |
| --- | --- |
| `Root` | Owns open state and context |
| `Trigger` | Announces + toggles dialog |
| `Portal` | Escapes local stacking/overflow context |
| `Overlay` | Backdrop + outside interaction surface |
| `Content` | Dialog semantics, focus lifecycle, dismiss orchestration |
| `Title` / `Description` | Accessible announcement text |
| `Close` | Explicit close action |

---

## Controlled vs uncontrolled

Choose uncontrolled for simple local interactions.

Choose controlled when:

- closing/opening depends on async state,
- analytics or audit logging is required,
- route/query params reflect open state,
- permissions or validation gates apply.

---

## Guarded dismiss flow

Prevent close while critical work runs:

- block `Escape` via `onEscapeKeyDown`.
- block outside interactions via `onInteractOutside`.
- disable close controls.

This pattern avoids data loss and inconsistent UI states.

---

## Modal vs non-modal

```tsx

```

Use non-modal only for utility surfaces that should not trap focus or hide page semantics. For destructive workflows, keep modal behavior.

---

## QA checks

1. Open from keyboard and mouse.
2. Tab cycles inside content.
3. `Escape` closes only when allowed.
4. Focus returns to trigger on close.
5. Title/description are announced.

}>

Next: [Lesson 3 - The asChild Pattern](/duck-primitives/course/03-as-child)