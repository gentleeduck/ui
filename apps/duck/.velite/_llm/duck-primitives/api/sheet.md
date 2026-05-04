```tsx

```

## Anatomy

```tsx

```

---

## Example

```tsx

function SettingsSheet() {
  return (

          <Sheet.Title className="text-lg font-semibold">Settings</Sheet.Title>

            Configure your account and interface preferences.

          <Sheet.Close className="mt-6 px-3 py-2 rounded border">Close</Sheet.Close>

  )
}
```

---

## API notes

`@gentleduck/primitives/sheet` is an alias layer over `@gentleduck/primitives/dialog`.

- behavior, accessibility, and focus management are the same as Dialog
- `Sheet.*` and `Dialog.*` map to the same underlying primitives

## API Mapping

| Sheet export | Backed by |
| --- | --- |
| `Sheet` / `Root` | `Dialog` |
| `Trigger` | `DialogTrigger` |
| `Portal` | `DialogPortal` |
| `Overlay` | `DialogOverlay` |
| `Content` | `DialogContent` |
| `Title` | `DialogTitle` |
| `Description` | `DialogDescription` |
| `Close` | `DialogClose` |

Additional exports:

- `createSheetScope` (alias of `createDialogScope`)
- type aliases such as `SheetContentProps`, `SheetTriggerProps`, etc.

---

## Keyboard interactions

Same behavior as Dialog:

| Key | Action |
| --- | --- |
| <Kbd>Space</Kbd> / <Kbd>Enter</Kbd> | Opens sheet (on Trigger) |
| <Kbd>Tab</Kbd> | Cycles focus inside sheet content |
| <Kbd>Shift+Tab</Kbd> | Reverse focus cycle |
| <Kbd>Escape</Kbd> | Closes sheet |

For full prop-level details, see [Dialog API](/duck-primitives/api/dialog).