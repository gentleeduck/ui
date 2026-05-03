```tsx

```

## What it does

}>

`DirectionProvider` lets you set `ltr`/`rtl` once for a subtree. `useDirection` resolves local `dir` overrides first, then provider value, then falls back to `ltr`.

This is the single direction module used by primitives and registry-ui components.

## Example

```tsx

export function App() {
  return (

        <Dialog.Trigger>Open</Dialog.Trigger>

  )
}
```

## API

### `DirectionProvider`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Direction value provided to descendants |
| `children` | `React.ReactNode` | - | Wrapped subtree |

### `useDirection`

```tsx
const direction = useDirection(localDir)
```

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| `localDir` | `'ltr' \| 'rtl' \| undefined` | `undefined` | Optional local override |

Returns:
- `localDir` when provided
- Provider `dir` when available
- `'ltr'` as final fallback