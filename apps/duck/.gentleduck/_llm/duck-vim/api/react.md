}>
  Provider, hooks, and context for using **duck-vim** in React applications. Drop in the `KeyProvider`, then use hooks like `useKeyBind` and `useKeySequence` to register shortcuts declaratively.

```ts
import {
  KeyProvider,
  KeyContext,
  useKeyCommands,
  useKeyBind,
  useKeySequence,
  useKeyRecorder,
} from '@gentleduck/vim/react'
```

}>
  All React exports require the `'use client'` directive in Next.js App Router or similar RSC environments.

***

## Types

### `KeyContextValue`

The shape of the value provided by `KeyContext`.

```ts
interface KeyContextValue {
  registry: Registry
  handler: KeyHandler
  sequenceManager: SequenceManager
  timeoutMs: number
  defaultOptions?: Partial<KeyBindOptions>
}
```

### `KeyBindHookOptions`

Options for `useKeyBind`. Extends `KeyBindOptions` with a `targetRef`.

```ts
interface KeyBindHookOptions extends Partial<KeyBindOptions> {
  targetRef?: React.RefObject<HTMLElement | null>
}
```

### `SequenceHookOptions`

Options for `useKeySequence`. Extends `SequenceOptions` with a `targetRef`.

```ts
interface SequenceHookOptions extends SequenceOptions {
  targetRef?: React.RefObject<HTMLElement | null>
}
```

### `KeyRecorderReturn`

```ts
interface KeyRecorderReturn {
  state: KeyRecorderState
  start: (target?: HTMLElement) => void
  stop: () => void
  reset: () => void
}
```

***

## `KeyProvider`

Wraps your app (or a subtree) with the keyboard command system. Creates a `Registry`, `KeyHandler`, and `SequenceManager`, attaches the handler on mount, and cleans up on unmount.

```tsx
interface KeyProviderProps {
  debug?: boolean                      // Enable debug logging
  timeoutMs?: number                   // Sequence timeout (default: 600)
  defaultOptions?: Partial<KeyBindOptions>  // Default options for all bindings
  children: React.ReactNode
}
```

**Example:**

```tsx
<KeyProvider debug={process.env.NODE_ENV === 'development'} timeoutMs={600}>
  <App />
</KeyProvider>
```

}>
  Place it at the root of your app, or wrap specific sections if you want isolated shortcut systems.

***

## `KeyContext`

Direct access to the context value. Use this for advanced scenarios where the hooks do not cover your needs.

```ts
const ctx = React.useContext(KeyContext)
// ctx.registry, ctx.handler, ctx.sequenceManager
```

}>
  This is primarily for internal or advanced usage. In most cases, the provided hooks (`useKeyBind`, `useKeySequence`, `useKeyCommands`) are sufficient.

***

## `useKeyCommands(commands, options?)`

Register multiple bindings at once using a record of key sequences to commands.

```ts
function useKeyCommands(
  commands: Record<string, Command>,
  options?: KeyBindOptions,
): void
```

Bindings are registered on mount and cleaned up on unmount. If the `commands` object changes, old bindings are unregistered and new ones are registered.

**Example:**

```tsx
function App() {
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
    'ctrl+k': {
      name: 'Command Palette',
      execute: () => setOpen(true),
    },
  }, { ignoreInputs: true })

  return <div>...</div>
}
```

}>
  The `commands` object should be stable (memoized or defined outside the component) to avoid unnecessary re-registrations on every render.

***

## `useKeyBind(binding, handler, options?)`

Register a single key binding.

```ts
function useKeyBind(
  binding: string,
  handler: () => void,
  options?: KeyBindHookOptions,
): void
```

The `handler` function is captured in a ref internally, so it always calls the latest version without needing it in the dependency array.

Basic usage
Scoped to element
Conditional
Without KeyProvider

```tsx
useKeyBind('ctrl+k', () => setOpen(true), { preventDefault: true })
```

```tsx
const editorRef = useRef<HTMLDivElement>(null)

useKeyBind('ctrl+s', () => save(), {
  preventDefault: true,
  targetRef: editorRef,
})

return <div ref={editorRef} tabIndex={0}>Editor content</div>
```

```tsx
useKeyBind('escape', () => close(), {
  enabled: isOpen,
})
```

`useKeyBind` works even without a `KeyProvider`. It creates a standalone registry and handler internally. This is useful for isolated components that do not participate in the global shortcut system.

***

## `useKeySequence(steps, handler, options?)`

Register a multi-key sequence.

```ts
function useKeySequence(
  steps: string[],
  handler: () => void,
  options?: SequenceHookOptions,
): void
```

**Example:**

```tsx
// Press g, then d (within timeout)
useKeySequence(['g', 'd'], () => navigate('/dashboard'))

// Press Ctrl+K, then Ctrl+D
useKeySequence(['ctrl+k', 'ctrl+d'], () => deleteAll())

// Scoped to an element
useKeySequence(['j', 'k'], () => scrollUp(), {
  targetRef: listRef,
  timeout: 400,
})
```

***

## `useKeyRecorder()`

React wrapper around `KeyRecorder` for building shortcut customization UIs.

```ts
function useKeyRecorder(): KeyRecorderReturn
```

**Example:**

```tsx
function ShortcutRecorder() {
  const { state, start, stop, reset } = useKeyRecorder()

  return (
    <div>
      <button onClick={() => start()}>
        {state.isRecording ? 'Press a key combination...' : 'Click to record'}
      </button>

      {state.recorded && (
        <div>
          <span>Recorded: {state.recorded}</span>
          <button onClick={reset}>Clear</button>
        </div>
      )}

      {state.isRecording && (
        <button onClick={stop}>Cancel</button>
      )}
    </div>
  )
}
```

}>
  The recorder automatically prevents default behavior and stops propagation while recording, so pressing <Kbd>Ctrl+S</Kbd> will not trigger the browser's save dialog while the user is defining a shortcut.

***

## Hook comparison

| Hook | Use case | Supports sequences |
| --- | --- | --- |
| `useKeyBind` | Single binding | No |
| `useKeySequence` | Multi-step sequence | Yes |
| `useKeyCommands` | Bulk registration | Via Registry (e.g. `'g+d'`) |
| `useKeyRecorder` | Settings UI | - |

}>
  Choose `useKeyBind` for most cases. Use `useKeySequence` when you need explicit multi-step sequences with modifier keys at each step. Use `useKeyCommands` when registering many bindings at once.