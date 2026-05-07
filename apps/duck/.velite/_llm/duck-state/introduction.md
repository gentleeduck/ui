}
  title="Experimental: Not Production Ready"
  tone="warning">
`@gentleduck/state` is currently in active development and is **not ready for production use**. APIs and behavior may change without long-term compatibility guarantees.

## Philosophy

`@gentleduck/state` keeps state modeling explicit with an atom/store API. It is optimized for predictable dependency tracking and small runtime surface area.

## Installation

```bash
npm install @gentleduck/state
```

## Usage

### Core (vanilla)

```ts
import { atom, createStore } from '@gentleduck/state'

const count = atom(0)
const double = atom((get) => get(count) * 2)

const store = createStore()
store.set(count, (prev) => prev + 1)
console.log(store.get(double))
```

### React

```tsx
import { atom } from '@gentleduck/state'
import { useAtom, useAtomValue, useSetAtom, Provider } from '@gentleduck/state/react'

const count = atom(0)

function Counter() {
  const [value, setValue] = useAtom(count)
  return <button onClick={() => setValue((c) => c + 1)}>{value}</button>
}

function App() {
  return (
    <Provider>
      <Counter />
    </Provider>
  )
}
```

## API Reference

### `atom(initialValue)`

Creates a primitive writable atom.

### `atom(read)`

Creates a derived read-only atom. The `read` function receives a `get` accessor to read other atoms. Values are cached and only recomputed when dependencies change.

### `atom(read, write)`

Creates a writable derived atom.

### `createStore()`

Creates a store instance with:

- `get(atom)`  -  read the current value of an atom
- `set(atom, valueOrUpdater)`  -  update an atom's value (uses shallow equality to skip unnecessary notifications)
- `subscribe(atom, callback)`  -  subscribe to changes, returns an unsubscribe function

### React Hooks

### `useAtom(atom)`

Returns a `[value, setValue]` tuple for writable atoms.

### `useAtomValue(atom)`

Returns the current value of any atom (read-only or writable).

### `useSetAtom(atom)`

Returns a setter function for writable atoms without subscribing to value changes.

### `Provider`

Injects a store instance into the React tree. Components use the nearest `Provider`'s store, or fall back to a global singleton.