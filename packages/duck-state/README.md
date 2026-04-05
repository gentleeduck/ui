<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/state

Atom-based state management.

Lightweight, Jotai-inspired primitives with dependency tracking, derived atoms, and React bindings.

## Quick Start

```bash
bun add @gentleduck/state
```

```tsx
import { atom, createStore } from '@gentleduck/state'

const count = atom(0)
const double = atom((get) => get(count) * 2)

const store = createStore()
store.set(count, 1)
store.get(double) // 2
```

### React

```tsx
import { Provider, useAtom } from '@gentleduck/state/react'

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>
}

function App() {
  return (
    <Provider>
      <Counter />
    </Provider>
  )
}
```

## API

| Export | Entry point | Description |
| --- | --- | --- |
| `atom` | `@gentleduck/state` | Create primitive, derived, or writable derived atoms |
| `createStore` | `@gentleduck/state` | Standalone store with `get`, `set`, `subscribe` |
| `Provider` | `@gentleduck/state/react` | React context provider for a store |
| `useAtom` | `@gentleduck/state/react` | Read + write an atom |
| `useAtomValue` | `@gentleduck/state/react` | Read-only subscription |
| `useSetAtom` | `@gentleduck/state/react` | Write-only setter |
| `useStore` | `@gentleduck/state/react` | Access the current store |

## License

MIT
