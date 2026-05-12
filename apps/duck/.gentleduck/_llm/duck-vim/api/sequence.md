}>
  Multi-step keyboard sequence matching with timeout support. Handle complex shortcuts like <Kbd>Ctrl+K</Kbd> followed by <Kbd>Ctrl+D</Kbd>, or simple character sequences like <Kbd>g</Kbd> then <Kbd>d</Kbd>.

```ts
import { SequenceManager, createSequenceMatcher } from '@gentleduck/vim/sequence'
import type {
  SequenceStep,
  SequenceOptions,
  SequenceRegistration,
  SequenceHandle,
  SequenceState,
} from '@gentleduck/vim/sequence'
```

## When to use SequenceManager vs Registry

Registry + KeyHandler
SequenceManager

The **Registry + KeyHandler** system supports sequences like `g+d` (single character steps). It fits most applications.

Use **SequenceManager** when you need:

* Steps that are full key combinations (e.g. <Kbd>Ctrl+K</Kbd> then <Kbd>Ctrl+D</Kbd>)
* Multiple sequences registered independently with separate handlers
* Fine-grained state reporting (which step you are on)
* Standalone sequence matching separate from the Registry

***

## Types

### `SequenceStep`

```ts
interface SequenceStep {
  binding: string // e.g. 'ctrl+k', 'g', 'd'
}
```

### `SequenceOptions`

```ts
interface SequenceOptions {
  timeout?: number  // ms between steps, default: 600
  enabled?: boolean // default: true
}
```

### `SequenceRegistration`

```ts
interface SequenceRegistration {
  steps: SequenceStep[]
  handler: () => void
  options?: SequenceOptions
}
```

### `SequenceHandle`

```ts
interface SequenceHandle {
  unregister: () => void
}
```

### `SequenceState`

Reports progress of the most-advanced matching entry.

```ts
interface SequenceState {
  completedSteps: number
  totalSteps: number
  isMatching: boolean
}
```

***

## `SequenceManager`

Manages multiple sequence registrations and matches keyboard events against them.

### `register(registration)`

```ts
manager.register(registration: SequenceRegistration): SequenceHandle
```

**Example:**

```ts
const manager = new SequenceManager()

const handle = manager.register({
  steps: [{ binding: 'ctrl+k' }, { binding: 'ctrl+d' }],
  handler: () => console.log('Ctrl+K, Ctrl+D pressed!'),
  options: { timeout: 800 },
})

// Later:
handle.unregister()
```

### `handleKeyEvent(event)`

Feed a keyboard event. Returns `true` if any sequence completed and fired.

```ts
manager.handleKeyEvent(event: KeyboardEvent): boolean
```

You must wire this up yourself:

```ts
document.addEventListener('keydown', (e) => manager.handleKeyEvent(e))
```

}>
  Or use the React `KeyProvider`, which does this automatically.

### `getState()`

Returns the aggregate matching state across all entries.

```ts
manager.getState(): SequenceState
```

**Example:** Use this to show a "waiting for next key" indicator:

```ts
const state = manager.getState()
if (state.isMatching) {
  showHint(`Step ${state.completedSteps}/${state.totalSteps}`)
}
```

### `reset()`

Resets all in-progress sequence matching state.

```ts
manager.reset(): void
```

### `destroy()`

Clears all registrations, cancels all timers, and removes all state.

```ts
manager.destroy(): void
```

***

## `createSequenceMatcher(steps, handler, options?)`

A convenience function that creates a lightweight single-sequence matcher without needing to instantiate `SequenceManager` yourself.

```ts
function createSequenceMatcher(
  steps: string[],
  handler: () => void,
  options?: SequenceOptions,
): {
  feed: (event: KeyboardEvent) => boolean
  reset: () => void
  getState: () => SequenceState
}
```

**Example:**

```ts
const matcher = createSequenceMatcher(
  ['g', 'd'],
  () => navigate('/dashboard'),
  { timeout: 500 },
)

document.addEventListener('keydown', (e) => matcher.feed(e))
```

***

## Matching behavior

When a keyboard event arrives:

Pure modifier keys (<Kbd>Shift</Kbd>, <Kbd>Control</Kbd>, <Kbd>Alt</Kbd>, <Kbd>Meta</Kbd>) are ignored.

For each enabled entry, check if the event matches the expected next step.

If it matches, advance the step counter.

If the sequence is complete, fire the handler and reset.

If it does not match, reset that entry to step 0 and retry step 0 with the current event (so pressing a wrong key mid-sequence does not lose the first key of a new attempt).

}>
  This retry behavior means sequences are forgiving: if you press <Kbd>g</Kbd>, <Kbd>x</Kbd>, <Kbd>g</Kbd>, <Kbd>d</Kbd>, the `g+d` sequence still fires on the last two keys.