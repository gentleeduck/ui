# @gentleduck/vim

A keyboard command engine for the web. Framework-agnostic core with optional React bindings.

Supports single-key combos (`ctrl+shift+k`), multi-step sequences (`g+d`), cross-platform `Mod` key, key binding parsing/validation/formatting, key recording, conflict detection, and per-binding options -- all strongly typed.

---

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Modules](#modules)
  - [platform](#platform)
  - [parser](#parser)
  - [matcher](#matcher)
  - [format](#format)
  - [command](#command)
  - [sequence](#sequence)
  - [recorder](#recorder)
  - [react](#react)
- [React hooks](#react-hooks)
- [Per-binding options](#per-binding-options)
- [Conflict detection](#conflict-detection)
- [Key aliases](#key-aliases)
- [Testing](#testing)
- [License](#license)

---

## Installation

```sh
npm install @gentleduck/vim
# or
bun add @gentleduck/vim
```

Each module is a separate subpath export:

```ts
import { Registry, KeyHandler } from '@gentleduck/vim/command'
import { parseKeyBind, normalizeKeyBind, validateKeyBind } from '@gentleduck/vim/parser'
import { detectPlatform, resolveMod, isMac } from '@gentleduck/vim/platform'
import { formatForDisplay, formatWithLabels } from '@gentleduck/vim/format'
import { matchesKeyboardEvent, isInputElement, createKeyBindHandler } from '@gentleduck/vim/matcher'
import { SequenceManager, createSequenceMatcher } from '@gentleduck/vim/sequence'
import { KeyRecorder, KeyStateTracker } from '@gentleduck/vim/recorder'
import { KeyProvider, useKeyCommands, useKeyBind, useKeySequence, useKeyRecorder } from '@gentleduck/vim/react'
```

---

## Quick start

### Vanilla TS/JS

```ts
import { Registry, KeyHandler } from '@gentleduck/vim/command'

const registry = new Registry()
const handler = new KeyHandler(registry, 600)

// Single-key combo
const handle = registry.register('ctrl+k', {
  name: 'Open Palette',
  execute: () => console.log('palette opened'),
}, { preventDefault: true })

// Multi-step sequence
registry.register('g+d', {
  name: 'Go Dashboard',
  execute: () => console.log('navigating to /dashboard'),
})

handler.attach(document)

// Later: cleanup
handle.unregister()
handler.detach(document)
```

### React

```tsx
import { KeyProvider, useKeyBind, useKeySequence } from '@gentleduck/vim/react'

function App() {
  useKeyBind('ctrl+k', () => console.log('palette'), { preventDefault: true })
  useKeySequence(['g', 'd'], () => console.log('dashboard'))

  return <div>Press Ctrl+K or g then d</div>
}

export default function Root() {
  return (
    <KeyProvider timeoutMs={600}>
      <App />
    </KeyProvider>
  )
}
```

---

## Modules

### platform

OS detection and cross-platform `Mod` key resolution.

```ts
import { detectPlatform, resolveMod, isMac } from '@gentleduck/vim/platform'

detectPlatform()       // 'mac' | 'windows' | 'linux'
resolveMod()           // 'meta' on mac, 'ctrl' otherwise
resolveMod('windows')  // 'ctrl'
isMac()                // true on macOS
```

- Caches the result after the first call.
- Falls back to `'linux'` during SSR (when `navigator` is unavailable).

---

### parser

Parse, normalize, and validate key binding strings.

```ts
import { parseKeyBind, normalizeKeyBind, validateKeyBind, keyboardEventToDescriptor } from '@gentleduck/vim/parser'
```

#### `parseKeyBind(binding, platform?)`

Parses a key binding string into a structured object. Resolves `Mod` to the platform-specific modifier.

```ts
parseKeyBind('Mod+Shift+S', 'mac')
// {
//   key: 's',
//   ctrl: false, shift: true, alt: false, meta: true,
//   modifiers: ['meta', 'shift']
// }

parseKeyBind('Mod+Shift+S', 'linux')
// {
//   key: 's',
//   ctrl: true, shift: true, alt: false, meta: false,
//   modifiers: ['ctrl', 'shift']
// }
```

Throws on empty string, modifier-only input, or multiple non-modifier keys.

#### `normalizeKeyBind(binding, platform?)`

Returns the canonical form: modifiers in alphabetical order, all lowercase.

```ts
normalizeKeyBind('Shift+Ctrl+K')  // 'ctrl+shift+k'
normalizeKeyBind('Mod+S', 'mac')  // 'meta+s'
```

#### `validateKeyBind(binding)`

Non-throwing validation. Returns `{ valid, warnings, errors }`.

```ts
validateKeyBind('ctrl+shift+s')
// { valid: true, warnings: [], errors: [] }

validateKeyBind('ctrl+ctrl+k')
// { valid: false, warnings: [], errors: ["Duplicate modifier: 'ctrl'"] }

validateKeyBind('alt+k')
// { valid: true, warnings: ['Alt+letter combinations may not work on macOS due to special characters'], errors: [] }
```

#### `keyboardEventToDescriptor(event)`

Converts a `KeyboardEvent` into a canonical descriptor string. Returns `null` for pure modifier presses.

```ts
// For a keydown event where user pressed Ctrl+S:
keyboardEventToDescriptor(event)  // 'ctrl+s'
```

---

### matcher

Match keyboard events against parsed key bindings. Detect input elements. Create standalone handlers.

```ts
import { matchesKeyboardEvent, isInputElement, createKeyBindHandler, createMultiKeyBindHandler } from '@gentleduck/vim/matcher'
```

#### `matchesKeyboardEvent(parsed, event, options?)`

Checks if a `KeyboardEvent` matches a `ParsedKeyBind`.

```ts
const parsed = parseKeyBind('ctrl+s')
matchesKeyboardEvent(parsed, event)  // true or false
```

Options: `{ ignoreCase?: boolean }` (default: `true`).

#### `isInputElement(element)`

Returns `true` for text inputs, textareas, selects, and contenteditable elements. Returns `false` for button-type inputs (`button`, `submit`, `reset`).

```ts
isInputElement(document.querySelector('input[type="text"]'))  // true
isInputElement(document.querySelector('button'))               // false
```

#### `createKeyBindHandler(config)`

Creates a standalone `keydown` event handler for a single key binding.

```ts
const handler = createKeyBindHandler({
  binding: 'Mod+S',
  handler: (e) => save(),
  options: { preventDefault: true, ignoreInputs: true }
})

document.addEventListener('keydown', handler)
```

#### `createMultiKeyBindHandler(configs)`

Same as above but for multiple key bindings. First match wins.

```ts
const handler = createMultiKeyBindHandler([
  { binding: 'Mod+S', handler: () => save(), options: { preventDefault: true } },
  { binding: 'Mod+Z', handler: () => undo(), options: { preventDefault: true } },
])

document.addEventListener('keydown', handler)
```

---

### format

Platform-aware display formatting for key bindings.

```ts
import { formatForDisplay, formatWithLabels } from '@gentleduck/vim/format'
```

#### `formatForDisplay(binding, options?)`

Compact display with platform-specific modifier names.

```ts
formatForDisplay('Mod+S', { platform: 'mac' })      // 'Cmd+S'
formatForDisplay('Mod+S', { platform: 'linux' })     // 'Ctrl+S'
formatForDisplay('Mod+S', { platform: 'windows' })   // 'Ctrl+S'
formatForDisplay('ctrl+shift+k')                      // 'Ctrl+Shift+K'
```

#### `formatWithLabels(binding, options?)`

Verbose labels with a wider separator.

```ts
formatWithLabels('Mod+Shift+S', { platform: 'mac' })     // 'Cmd + Shift + S'
formatWithLabels('ctrl+space', { platform: 'linux' })     // 'Ctrl + Space'
```

Options: `{ platform?: Platform, separator?: string }`.

Platform modifier mappings:

| Modifier | Mac   | Windows | Linux |
|----------|-------|---------|-------|
| meta     | Cmd   | Win     | Super |
| ctrl     | Ctrl  | Ctrl    | Ctrl  |
| alt      | Opt   | Alt     | Alt   |
| shift    | Shift | Shift   | Shift |

---

### command

The core registry and key handler. Manages key-binding-to-command mappings with prefix-based multi-step sequence support.

```ts
import { Registry, KeyHandler } from '@gentleduck/vim/command'
```

#### `class Registry`

```ts
const registry = new Registry(debug?: boolean)

// Register a command -- returns a RegistrationHandle
const handle = registry.register(key, command, options?)

// Query
registry.hasCommand(key)                // boolean
registry.getCommand(key)                // Command | undefined
registry.getEntry(key)                  // RegistryEntry | undefined
registry.getOptions(key)                // KeyBindOptions | undefined
registry.getAllCommands()               // Map<string, Command>
registry.isPrefix(key)                  // boolean

// Unregister
handle.unregister()                     // via the handle
registry.unregister(key)                // directly by key
registry.clear()                        // remove all
```

#### `class KeyHandler`

```ts
const handler = new KeyHandler(registry, timeoutMs?, defaultOptions?)

handler.attach(target?)   // default: document
handler.detach(target?)
```

Matching strategy:
1. Try the full accumulated sequence.
2. If the sequence is a known prefix, wait up to `timeoutMs` for the next key.
3. Otherwise, reset and retry with just the last key.
4. If nothing matches, reset entirely.

Ignores pure modifier key presses (`Shift`, `Control`, `Alt`, `Meta`).

#### `interface Command`

```ts
interface Command {
  name: string
  description?: string
  execute: <T>(args?: T) => void | Promise<void>
}
```

#### `interface RegistrationHandle`

Returned from `registry.register()`. Provides per-binding control.

```ts
interface RegistrationHandle {
  unregister: () => void
  setEnabled: (enabled: boolean) => void
  isEnabled: () => boolean
  resetFired: () => void
}
```

---

### sequence

Dedicated multi-key sequence matching via `SequenceManager`, separate from the command registry's built-in prefix system.

```ts
import { SequenceManager, createSequenceMatcher } from '@gentleduck/vim/sequence'
```

#### `class SequenceManager`

Manages multiple sequence registrations. Feed keyboard events and it tracks progress across all registered sequences.

```ts
const manager = new SequenceManager()

const handle = manager.register({
  steps: [{ binding: 'g' }, { binding: 'd' }],
  handler: () => console.log('g then d'),
  options: { timeout: 600 }
})

// Feed events from a listener
document.addEventListener('keydown', (e) => {
  manager.handleKeyEvent(e)
})

// Query state
manager.getState()   // { completedSteps, totalSteps, isMatching }
manager.reset()      // reset all in-progress matching
manager.destroy()    // cleanup

handle.unregister()  // remove one sequence
```

#### `createSequenceMatcher(steps, handler, options?)`

Lightweight standalone matcher for a single sequence.

```ts
const matcher = createSequenceMatcher(['g', 'd'], () => console.log('matched'))

document.addEventListener('keydown', (e) => {
  matcher.feed(e)
})

matcher.getState()  // { completedSteps, totalSteps, isMatching }
matcher.reset()
```

---

### recorder

Record key combinations and track key state. Useful for settings UIs where users customize keybindings.

```ts
import { KeyRecorder, KeyStateTracker } from '@gentleduck/vim/recorder'
```

#### `class KeyRecorder`

Records a single key combination from user input.

```ts
const recorder = new KeyRecorder({
  onRecord: (binding) => console.log('Recorded:', binding),
  onStart: () => console.log('Recording started'),
  onStop: () => console.log('Recording stopped'),
})

recorder.start(document.body)
// User presses Ctrl+Shift+K
// onRecord fires with 'ctrl+shift+k'

recorder.getState()  // { activeKeys: [], recorded: 'ctrl+shift+k', isRecording: true }
recorder.stop()
recorder.reset()
recorder.destroy()
```

#### `class KeyStateTracker`

Tracks which keys are currently held down.

```ts
const tracker = new KeyStateTracker()
tracker.attach(document.body)

tracker.isKeyPressed('a')   // true if 'a' is held
tracker.getSnapshot()       // { pressed: ReadonlySet<string>, hasModifier: boolean }

tracker.detach()
tracker.destroy()
```

---

### react

React bindings: context provider, legacy hook, and modern hooks.

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

#### `KeyProvider`

Mounts a `Registry`, `KeyHandler`, and `SequenceManager`. Attaches a global keydown listener on mount.

```tsx
<KeyProvider debug={false} timeoutMs={600} defaultOptions={{ preventDefault: false }}>
  <App />
</KeyProvider>
```

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `debug` | `boolean` | `false` | Enable debug logging |
| `timeoutMs` | `number` | `600` | Timeout between sequence steps (ms) |
| `defaultOptions` | `Partial<KeyBindOptions>` | `{}` | Default options for all registrations |
| `children` | `ReactNode` | -- | Required |

#### `KeyContext`

Advanced usage: access `{ registry, handler, sequenceManager, timeoutMs, defaultOptions }` directly.

```tsx
const ctx = React.useContext(KeyContext)
ctx?.registry.register('ctrl+k', { name: 'test', execute: () => {} })
```

#### `useKeyCommands(commands, options?)`

Register multiple key-command mappings. Automatically unregisters on cleanup.

```tsx
useKeyCommands({
  'ctrl+k': { name: 'Open Palette', execute: () => setOpen(true) },
  'g+d': { name: 'Go Dashboard', execute: () => navigate('/dashboard') },
}, { preventDefault: true })
```

Must be used inside `KeyProvider`.

---

## React hooks

### `useKeyBind(binding, handler, options?)`

Bind a single key binding. Works with or without `KeyProvider`.

```tsx
// Basic
useKeyBind('ctrl+k', () => setOpen(true))

// With options
useKeyBind('Mod+S', () => save(), {
  preventDefault: true,
  ignoreInputs: true,
})

// Scoped to a specific element
const ref = useRef<HTMLDivElement>(null)
useKeyBind('escape', () => close(), { targetRef: ref })
```

Options extend `KeyBindOptions` with an additional `targetRef`.

### `useKeySequence(steps, handler, options?)`

Bind a multi-key sequence.

```tsx
useKeySequence(['g', 'd'], () => navigate('/dashboard'))
useKeySequence(['g', 'h'], () => navigate('/home'), { timeout: 800 })
```

### `useKeyRecorder()`

Record key combinations for settings UIs.

```tsx
function KeybindingInput() {
  const { state, start, stop, reset } = useKeyRecorder()

  return (
    <div>
      <button onClick={() => start()}>
        {state.isRecording ? 'Recording...' : 'Click to record'}
      </button>
      {state.recorded && <span>Recorded: {state.recorded}</span>}
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

---

## Per-binding options

Every `register()` call accepts an optional `KeyBindOptions` object:

```ts
interface KeyBindOptions {
  enabled?: boolean              // default: true
  preventDefault?: boolean       // default: false
  stopPropagation?: boolean      // default: false
  ignoreInputs?: boolean         // default: false -- skip when focused on text inputs
  eventType?: 'keydown' | 'keyup'  // default: 'keydown'
  requireReset?: boolean         // default: false -- fire only once until resetFired() is called
  conflictBehavior?: 'warn' | 'error' | 'replace' | 'allow'  // default: 'warn'
}
```

Options can also be set as defaults via the `KeyHandler` constructor or the `KeyProvider` `defaultOptions` prop. Per-binding options override defaults.

```ts
// Constructor defaults
const handler = new KeyHandler(registry, 600, { preventDefault: true })

// Per-binding override
registry.register('ctrl+k', command, { preventDefault: false })
```

---

## Conflict detection

When registering a key binding that already exists, the behavior is controlled by `conflictBehavior`:

| Value | Behavior |
|-------|----------|
| `'warn'` | Logs a console warning and replaces (default) |
| `'error'` | Throws an `Error` |
| `'replace'` | Silently replaces the existing binding |
| `'allow'` | Silently proceeds (same as replace) |

```ts
registry.register('ctrl+k', cmd1)
registry.register('ctrl+k', cmd2, { conflictBehavior: 'error' })
// throws: "Key binding 'ctrl+k' is already registered"
```

---

## Key aliases

The parser automatically normalizes these aliases:

| Input | Canonical |
|-------|-----------|
| `' '` (space character) | `space` |
| `escape` | `esc` |
| `control` | `ctrl` |
| `cmd`, `command` | `meta` |
| `opt`, `option` | `alt` |
| `Mod` | `meta` (mac) / `ctrl` (windows, linux) |

---

## Architecture

```
platform  (zero deps)
   |
parser  (depends on: platform)
   |
matcher  (depends on: parser)
   |          |
format    sequence  (format: parser + platform, sequence: parser + matcher)
               |
recorder  (depends on: parser)
   |           |
command  (depends on: matcher)
   |
react  (depends on: command, sequence, recorder)
```

Each module is a separate entry point (`@gentleduck/vim/<module>`) and can be used independently. The `react` module pulls everything together.

---

## Testing

Uses `vitest` with `jsdom`.

```sh
bun run test        # run all tests
bun run dev         # watch mode
bun run check-types # type check
bun run build       # build all modules
```

---

## License

[MIT](./LICENSE)
