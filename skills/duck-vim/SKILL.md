---
name: duck-vim
description: >-
  Use when working with @gentleduck/vim — the keyboard command engine. Covers hotkey
  parsing, key sequence matching, chord bindings, platform-aware mod resolution,
  key recording, and the React hooks (useKeyBind, useKeySequence, useKeyCommands,
  useKeyRecorder). Not for vim-the-editor — this is a keyboard shortcut library.
allowed-tools: Read Grep
argument-hint: "[keybind-or-topic]"
---

# @gentleduck/vim

Expert scope: `packages/duck-vim/`. Parses hotkey strings, matches keyboard events, supports sequences, records key presses, and provides React hooks. Import by subpath: `@gentleduck/vim/{module}`.

## parser — `@gentleduck/vim/parser`

Exports: `parseKeyBind(binding, platform?) => ParsedKeyBind`, `normalizeKeyBind(binding, platform?) => string`, `validateKeyBind(binding) => ValidationResult`, `keyboardEventToDescriptor(e) => string | null`, `KEY_ALIASES`, `MODIFIER_KEYS`, types `ParsedKeyBind`, `ValidationResult`.

```ts
parseKeyBind('mod+shift+k', 'mac')
// => { key: 'k', ctrl: false, shift: true, alt: false, meta: true, modifiers: ['meta', 'shift'] }
normalizeKeyBind('Shift+Mod+s', 'mac') // => 'meta+shift+s'
validateKeyBind('ctrl+ctrl+k')         // => { valid: false, errors: ['Duplicate modifier: ...'], warnings: [] }
```

## matcher — `@gentleduck/vim/matcher`

Exports: `createKeyBindHandler(config) => (e) => void`, `createMultiKeyBindHandler(configs[]) => (e) => void`, `matchesKeyboardEvent(parsed, event, options?) => boolean`, `isInputElement(el) => boolean`, types `KeyBindHandlerConfig`, `MatchOptions`, `SingleKeyBindOptions`.

```ts
const handler = createKeyBindHandler({
  binding: 'Mod+S', handler: (e) => save(),
  options: { preventDefault: true, ignoreInputs: true },
})
document.addEventListener('keydown', handler) // must attach manually
```

## command — `@gentleduck/vim/command`

Exports: `Registry`, `KeyHandler`, types `Command`, `KeyBindOptions`, `RegistrationHandle`, `RegistryEntry`, `RegistryClass`.

`Command` has `{ name: string, description?: string, execute: (args?) => void | Promise<void> }`.

`KeyBindOptions` fields: `enabled?`, `preventDefault?`, `stopPropagation?`, `ignoreInputs?`, `eventType?` (`'keydown'|'keyup'`), `requireReset?`, `conflictBehavior?` (`'warn'|'error'|'replace'|'allow'`, default `'warn'`).

```ts
const registry = new Registry(/* debug */ false)
const handle = registry.register('ctrl+k', { name: 'Palette', execute: () => openPalette() },
  { preventDefault: true, conflictBehavior: 'error' })
handle.unregister()          // remove binding
handle.setEnabled(false)     // disable without removing
handle.isEnabled()           // => boolean
handle.resetFired()          // reset requireReset flag
registry.getAllCommands()     // => Map<string, Command>
registry.hasCommand('ctrl+k') // => boolean

const kh = new KeyHandler(registry, 600, /* defaultOptions */ {})
kh.attach(document)          // default target is document
kh.detach(document)
```

## platform — `@gentleduck/vim/platform`

Exports: `detectPlatform() => Platform`, `isMac(platform?) => boolean`, `resolveMod(platform?) => 'meta' | 'ctrl'`, type `Platform` (`'mac' | 'windows' | 'linux'`).

SSR safe: `detectPlatform()` falls back to `'linux'` when `navigator` is unavailable.

## format — `@gentleduck/vim/format`

Exports: `formatForDisplay(binding, options?) => string`, `formatWithLabels(binding, options?) => string`, `SYMBOL_MAP`, `LABEL_MAP`, type `FormatOptions { platform?, separator? }`.

```ts
formatForDisplay('mod+shift+k', { platform: 'mac' })  // => 'Cmd+Shift+K'
formatWithLabels('mod+enter', { platform: 'mac' })     // => 'Cmd + Enter' (space-padded separator)
```

## sequence — `@gentleduck/vim/sequence`

Exports: `createSequenceMatcher(steps[], handler, options?) => { feed, reset, getState }`, `SequenceManager`, types `SequenceOptions`, `SequenceHandle`, `SequenceState`, `SequenceRegistration`, `SequenceStep`.

```ts
const seq = createSequenceMatcher(['g', 'g'], () => scrollToTop(), { timeout: 1000 })
seq.feed(event) // => true when complete
const mgr = new SequenceManager()
const handle = mgr.register({ steps: [{ binding: 'g' }, { binding: 'd' }], handler: goToDefinition })
mgr.handleKeyEvent(event) // feed events; returns true if any matched
handle.unregister()
mgr.destroy()
```

## recorder — `@gentleduck/vim/recorder`

Exports: `KeyRecorder`, `KeyStateTracker`, types `KeyRecorderOptions`, `KeyRecorderState`, `KeyStateSnapshot`.

```ts
const recorder = new KeyRecorder({ onRecord: (b) => console.log(b), onStart, onStop })
recorder.start(document) // Ctrl+Shift+K => onRecord('ctrl+shift+k')
recorder.getState()      // => { activeKeys: string[], recorded: string | null, isRecording }
recorder.stop(); recorder.reset(); recorder.destroy()

const tracker = new KeyStateTracker()
tracker.attach(document)
tracker.isKeyPressed('shift')   // => boolean
tracker.getSnapshot()           // => { pressed: ReadonlySet<string>, hasModifier: boolean }
tracker.detach(); tracker.destroy()
```

## react — `@gentleduck/vim/react`

Exports: `useKeyBind`, `useKeySequence`, `useKeyCommands`, `useKeyRecorder`, `KeyProvider`, `KeyContext`, types `KeyContextValue`, `KeyBindHookOptions`, `SequenceHookOptions`, `KeyRecorderReturn`.

```ts
useKeyBind('mod+k', () => openMenu(), { preventDefault: true, targetRef })
useKeySequence(['g', 'g'], () => scrollToTop(), { timeout: 1000 }) // string[], NOT space-separated
useKeyCommands({ 'ctrl+k': { name: 'Search', execute: openSearch } }, optionalKeyBindOptions) // requires KeyProvider
const { state, start, stop, reset } = useKeyRecorder()
```

`KeyProvider` props: `debug?`, `timeoutMs?` (default 600), `defaultOptions?: Partial<KeyBindOptions>`, `children`.

## Recipes

**Command palette:** `<KeyProvider><App /></KeyProvider>`, then `useKeyBind('mod+k', () => setPaletteOpen(true), { preventDefault: true, ignoreInputs: true })`.

**Customizable keybinds:** Use `useKeyRecorder()` -- render `state.recorded`, call `start(el)` on focus, `stop()` on blur, persist result, pass to `useKeyBind` dynamically.

**Conflict detection:** `conflictBehavior: 'error'` in dev to catch collisions; `'replace'` for user overrides.

## Pitfalls

1. Binding silent -- check `isInputElement`, `options.enabled`, and that `KeyProvider` wraps the tree
2. Sequence timeout -- default 600ms; increase with `{ timeout: ms }`
3. Always use `mod+` not `ctrl+`/`meta+`; always pass `string[]` not space-separated to sequences
4. `createKeyBindHandler` takes `{ binding, handler, options }` -- not positional args
5. `useKeyCommands` requires `KeyProvider` -- warns and no-ops without it
6. For many bindings prefer `useKeyCommands` over repeated `useKeyBind`
