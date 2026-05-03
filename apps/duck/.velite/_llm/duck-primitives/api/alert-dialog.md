```tsx

```

## Anatomy

```tsx

```

---

## How it differs from Dialog

}>

Alert Dialog wraps Dialog with `modal` forced to `true`. It replaces `Dialog.Close` with two explicit actions: **Cancel** (dismiss without action) and **Action** (confirm and proceed).

The key difference: Alert Dialog requires explicit user choice. Clicking the overlay does **NOT** dismiss it (unlike Dialog). The user must press Cancel or Action.

---

## Example

```tsx

function DeleteButton() {
  return (

          <AlertDialog.Title>Delete this item?</AlertDialog.Title>
          <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>

              Cancel

            <AlertDialog.Action
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => deleteItem()}
            >
              Delete

  )
}
```

---

## API

### `AlertDialog.Root`

Same as `Dialog.Root` but `modal` is always `true`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | - | Called when open state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction for keyboard navigation |

### `AlertDialog.Trigger`

Same as `Dialog.Trigger`.

### `AlertDialog.Portal`

Same as `Dialog.Portal`.

### `AlertDialog.Overlay`

Same as `Dialog.Overlay`.

### `AlertDialog.Content`

Same as `Dialog.Content`, but pointer-down-outside does not dismiss.

### `AlertDialog.Title`

Same as `Dialog.Title`.

### `AlertDialog.Description`

Same as `Dialog.Description`.

### `AlertDialog.Cancel`

Closes the dialog without taking action. Focus returns to the trigger.

### `AlertDialog.Action`

Closes the dialog and confirms the action. Attach your `onClick` to execute the destructive operation.

---

## Accessibility

} className="[&_ul]:my-0">
- Uses `role="alertdialog"` which tells screen readers this requires attention.
- Focus is trapped and clicking outside does **not** dismiss.
- `Cancel` should always be present to provide an escape path.