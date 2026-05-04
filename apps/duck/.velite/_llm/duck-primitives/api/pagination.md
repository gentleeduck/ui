```tsx

```

## Anatomy

```tsx

```

## Example

```tsx

      <button type="button">التالي</button>

      <button type="button">١</button>

```

## API

### `Pagination.Root`

Renders a semantic `<nav>` container (`aria-label="pagination"` by default).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction for pagination context. Resolved with `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `...props` | `React.ComponentPropsWithoutRef<'nav'>` | - | Additional props for the root nav element |

### `Pagination.Content`

Renders a `<ul>` element inside `Pagination.Root` and inherits direction from root context.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.ComponentPropsWithoutRef<'ul'>` | - | Additional props for the list element |

### `Pagination.Item`

Renders a `<li>` element inside `Pagination.Content` and inherits direction from root context.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.ComponentPropsWithoutRef<'li'>` | - | Additional props for the list item element |