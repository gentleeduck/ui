}>

Match keyboard events against parsed key bindings and create standalone handlers. This module provides the low-level matching engine and convenient factory functions for binding shortcuts without the full registry.

```ts

  matchesKeyboardEvent,
  isInputElement,
  createKeyBindHandler,
  createMultiKeyBindHandler,
} from '@gentleduck/vim/matcher'
```

## Types

### `MatchOptions`

```ts
interface MatchOptions {
  /** Ignore case when comparing the non-modifier key. Default: true */
  ignoreCase?: boolean
}
```

### `SingleKeyBindOptions`

```ts
interface SingleKeyBindOptions {
  enabled?: boolean        // Default: true
  preventDefault?: boolean // Default: false
  stopPropagation?: boolean // Default: false
  ignoreInputs?: boolean   // Default: false
}
```

### `KeyBindHandlerConfig`

```ts
interface KeyBindHandlerConfig {
  binding: string
  handler: (event: KeyboardEvent) => void
  options?: SingleKeyBindOptions
}
```

---

## Functions

### `matchesKeyboardEvent(parsed, event, options?)`

Low-level check: does this `KeyboardEvent` match a `ParsedKeyBind`?

```ts
function matchesKeyboardEvent(
  parsed: ParsedKeyBind,
  event: KeyboardEvent,
  options?: MatchOptions
): boolean
```

Checks all four modifier flags (`ctrlKey`, `altKey`, `metaKey`, `shiftKey`) for exact match, then compares the non-modifier key. Handles aliases like `space` and `esc` automatically.

**Example:**

```ts

const parsed = parseKeyBind('ctrl+s')

document.addEventListener('keydown', (e) => {
  if (matchesKeyboardEvent(parsed, e)) {
    e.preventDefault()
    save()
  }
})
```

}>

This is the lowest-level matching function. For most use cases, prefer `createKeyBindHandler` or `createMultiKeyBindHandler` which handle options like `preventDefault` and `ignoreInputs` for you.

---

### `isInputElement(el)`

Returns `true` if the element is a text-entry input where key bindings should typically be suppressed.

```ts
function isInputElement(el: Element | null): boolean
```

Considers these as input elements: `<input>` (except button/submit/reset types), `<textarea>`, `<select>`, and any element with `contentEditable`.

}>

Button-type inputs (`<input type="button">`, `<input type="submit">`, `<input type="reset">`) return `false` because they are not text-entry fields.

---

### `createKeyBindHandler(config)`

Creates a standalone `keydown` event handler for a single binding. This is the simplest way to bind a shortcut without using the full registry system.

```ts
function createKeyBindHandler(config: KeyBindHandlerConfig): (event: KeyboardEvent) => void
```

**Example:**

Create the handler with your binding and options:

```ts
const handler = createKeyBindHandler({
  binding: 'Mod+S',
  handler: () => save(),
  options: { preventDefault: true, ignoreInputs: true },
})
```

Attach it to the DOM:

```ts
document.addEventListener('keydown', handler)
```

Clean up when no longer needed:

```ts
document.removeEventListener('keydown', handler)
```

---

### `createMultiKeyBindHandler(configs)`

Creates a single event handler that checks multiple bindings. First match wins.

```ts
function createMultiKeyBindHandler(configs: KeyBindHandlerConfig[]): (event: KeyboardEvent) => void
```

**Example:**

```ts
const handler = createMultiKeyBindHandler([
  {
    binding: 'Mod+S',
    handler: () => save(),
    options: { preventDefault: true },
  },
  {
    binding: 'Mod+Shift+S',
    handler: () => saveAs(),
    options: { preventDefault: true },
  },
  {
    binding: 'Mod+Z',
    handler: () => undo(),
    options: { preventDefault: true },
  },
])

document.addEventListener('keydown', handler)
```

}>

These standalone handlers do not support multi-key sequences. For sequences, use the [Registry/KeyHandler](/duck-vim/api/command) system or [SequenceManager](/duck-vim/api/sequence).