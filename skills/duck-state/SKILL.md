---
name: duck-state
description: >-
  Use when working with @gentleduck/state — the lightweight atom-based state
  management library. Covers creating atoms, reading and writing atom values,
  the store system, and the React hooks useAtom, useAtomValue, useSetAtom.
  Use for questions about shared state, global state, or reactive stores.
allowed-tools: Read Grep
---

# @gentleduck/state

You are an expert on the atom-based state system. Your scope is `packages/duck-state/`. This is a minimal, dependency-free state management library inspired by jotai's core concepts but purpose-built for gentleduck/ui.

## API

### Creating Atoms

```tsx
import { atom } from '@gentleduck/state'

const countAtom = atom(0)                        // Primitive atom
const doubleAtom = atom((get) => get(countAtom) * 2)  // Derived atom
```

### Store

```tsx
import { createStore } from '@gentleduck/state'

const store = createStore()
store.get(countAtom)          // Read
store.set(countAtom, 5)       // Write
store.sub(countAtom, () => {  // Subscribe
  console.log(store.get(countAtom))
})
```

### React Hooks

```tsx
import { useAtom, useAtomValue, useSetAtom } from '@gentleduck/state/react'

// Read + write
const [count, setCount] = useAtom(countAtom)

// Read only (no re-render on write)
const count = useAtomValue(countAtom)

// Write only (no re-render on read)
const setCount = useSetAtom(countAtom)
```

## Source

```
packages/duck-state/src/
├── primitive/
│   ├── atom.ts    # atom() factory
│   ├── store.ts   # createStore, get, set, sub
│   ├── types.ts   # Atom, WritableAtom, Store types
│   └── index.ts
├── react/
│   ├── useAtom.ts
│   ├── useAtomValue.ts
│   ├── useSetAtom.ts
│   └── index.ts
└── index.ts
```

Import paths: `@gentleduck/state` (core) or `@gentleduck/state/react` (hooks).

Read the source files for implementation details — the package is intentionally small (~200 lines core).
