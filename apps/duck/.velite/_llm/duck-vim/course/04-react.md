}>
Lesson 4 of 8  -  Use KeyProvider and hooks to manage keyboard shortcuts in React applications.

## Overview

duck-vim's React layer wraps the core system in a context provider and exposes hooks for ergonomic usage. The provider creates a shared `Registry`, `KeyHandler`, and `SequenceManager`, attaches event listeners on mount, and cleans everything up on unmount.

---

## Setting up the provider

  
    Wrap your app (or the relevant subtree) with `KeyProvider`:

    ```tsx
    import { KeyProvider } from '@gentleduck/vim/react'

    export default function Root() {
      return (

      )
    }
    ```
  

**Props:**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `debug` | `boolean` | `false` | Log key events and matches to console |
| `timeoutMs` | `number` | `600` | Timeout for multi-key sequences |
| `defaultOptions` | `Partial
}
```

}>
Key points:

- The handler is always called with the latest closure (it's stored in a ref internally).
- Use `enabled` to conditionally activate bindings.
- Use `ignoreInputs: true` to skip when the user is typing in a text field.

---

## `useKeyCommands`: Bulk registration

Register multiple bindings at once with a record:

```tsx

function Navigation() {
  const navigate = useNavigate()

  useKeyCommands({
    'g+d': {
      name: 'Go to Dashboard',
      execute: () => navigate('/dashboard'),
    },
    'g+s': {
      name: 'Go to Settings',
      execute: () => navigate('/settings'),
    },
    'g+p': {
      name: 'Go to Profile',
      execute: () => navigate('/profile'),
    },
  }, { ignoreInputs: true })

  return null // This component just registers shortcuts
}
```

}>
**Stability warning:** The `commands` object is used in a `useEffect` dependency array. If you define it inline, it creates a new object every render and re-registers all bindings. Either define it outside the component, or wrap it in `useMemo`.

```tsx
// Good: stable reference
const commands = useMemo(() => ({
  'g+d': { name: 'Dashboard', execute: () => navigate('/dashboard') },
}), [navigate])

useKeyCommands(commands)
```

---

## `useKeySequence`: Multi-step sequences

For explicit multi-step sequences where each step can be a full key combination:

```tsx

function Editor() {
  // Press Ctrl+K, then Ctrl+C to comment
  useKeySequence(['ctrl+k', 'ctrl+c'], () => {
    commentSelection()
  })

  // Press Ctrl+K, then Ctrl+U to uncomment
  useKeySequence(['ctrl+k', 'ctrl+u'], () => {
    uncommentSelection()
  })
}
```

}>
This is different from `useKeyCommands` with `'g+d'`:

- `useKeyCommands` with `'g+d'` uses the Registry's sequence support (single-character steps only).
- `useKeySequence` uses the `SequenceManager` and supports full key combinations at each step.

---

## Working without a provider

All hooks work without a `KeyProvider`. When used outside a provider, they create standalone registries and handlers internally:

```tsx
// This works even without KeyProvider
function StandaloneComponent() {
  useKeyBind('escape', () => close())
  return 

  )
}
```

---

## Exercises

1. Create a `KeyProvider` and register three shortcuts with `useKeyCommands`.
2. Add a `useKeyBind` for <Kbd>Escape</Kbd> that only fires when a modal is open.
3. Try removing the `KeyProvider` and confirm that `useKeyBind` still works standalone.

}>
**Next:** [Lesson 5  -  Multi-Key Sequences](/docs/packages/duck-vim/course/05-sequences)