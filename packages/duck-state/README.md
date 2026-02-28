# @gentleduck/state

Lightweight atomic state management for React. Provides a Jotai-inspired `atom` + `createStore` API with dependency tracking and derived atoms.

## Installation

```bash
bun add @gentleduck/state
```

## Usage

```ts
import { atom, createStore } from '@gentleduck/state'

// Primitive atom
const count = atom(0)

// Derived atom
const double = atom((get) => get(count) * 2)

// Store
const store = createStore()

store.subscribe(count, () => {
  console.log('count:', store.get(count))
})

store.set(count, (prev) => prev + 1)
console.log(store.get(double)) // 2
```

## API

### `atom(initialValue)`

Creates a primitive atom with a default value.

### `atom(read)`

Creates a read-only derived atom. `read` receives a `get` function to access other atoms.

### `atom(read, write)`

Creates a writable derived atom with custom read and write logic.

### `createStore()`

Creates a store instance to manage atom state outside of React.

- `store.get(atom)` - Read the current value of an atom.
- `store.set(atom, value)` - Set the value of a writable atom.
- `store.subscribe(atom, callback)` - Subscribe to changes on an atom. Returns an unsubscribe function.

## License

[MIT](./LICENSE)
