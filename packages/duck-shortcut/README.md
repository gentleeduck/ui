<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/shortcut

> **Deprecated** -- use [`@gentleduck/vim`](../duck-vim) instead.

Keyboard shortcut hook for React.

## Quick start

```bash
npm install @gentleduck/shortcut
```

```tsx
import { useDuckShortcut } from '@gentleduck/shortcut'

function App() {
  useDuckShortcut({
    keys: ['ctrl+s'],
    onKeysPressed: () => console.log('Ctrl+S pressed'),
  })

  return <div>Press Ctrl+S</div>
}
```

## Features

- Key combinations (`ctrl+s`, `command+k`)
- Key sequences (`Up Up Down Down Left Right B A Enter`)
- Mixed combinations and sequences in one binding
- Global listener -- no event capture conflicts
- Case-insensitive key names
- Multiple instances without conflicts

## API

### `useDuckShortcut`

```typescript
interface DuckShortcutProps {
  keys: string | string[]
  onKeysPressed: () => void
}

declare function useDuckShortcut(props: DuckShortcutProps): void
```

| Prop | Type | Description |
| --- | --- | --- |
| `keys` | `string \| string[]` | Shortcut bindings -- combinations (`'ctrl+s'`) or sequences (`'Up Up Down Down'`) |
| `onKeysPressed` | `() => void` | Called when any listed shortcut fires |

## License

[MIT](./LICENSE)
