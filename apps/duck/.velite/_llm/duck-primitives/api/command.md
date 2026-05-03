```tsx

```

## Anatomy

```tsx

```

---

## Example

```tsx

function CommandMenu() {
  return (

          <Command.Item onSelect={() => console.log('Profile')}>Profile</Command.Item>
          <Command.Item onSelect={() => console.log('Settings')}>Settings</Command.Item>

  )
}
```

---

## API

### `Command.Root`

The root container that manages search state, filtering, and keyboard navigation. Renders a `<div>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction |
| `shouldFilter` | `boolean` | `true` | Enable internal search filtering |
| `asChild` | `boolean` | - | Render as child element |

### `Command.Input`

The search input field. Renders an `<input>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |

Accepts all standard HTML input attributes.

### `Command.List`

Container for items and groups. Renders a `<ul>`. Handles internal filtering and item visibility based on the search value.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |

### `Command.Item`

A selectable item within the list. Renders a `<li>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Item value passed to `onSelect` |
| `disabled` | `boolean` | `false` | Disables the item |
| `textValue` | `string` | - | Text for search matching (auto-derived from text content if not provided) |
| `onSelect` | `(value: string) => void` | - | Called when the item is selected |
| `asChild` | `boolean` | - | Render as child element |

### `Command.Group`

Groups items with an optional heading. Renders a `<div>`. Items inside a group are hidden when none match the search.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `React.ReactNode` | - | Optional group heading |
| `asChild` | `boolean` | - | Render as child element |

### `Command.Empty`

Displays when all items are filtered out. Renders a `<div>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |

### `Command.Separator`

A visual separator between groups. Renders a `<div>`. Hidden when adjacent groups have no visible items.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |

---

## Hooks

### `useCommandContext()`

Access the command state from within `Command.Root`.

Returns: `{ search, selectedItem, selectedValue, selectedText }`