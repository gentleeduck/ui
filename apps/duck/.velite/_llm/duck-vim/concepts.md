}>

The patterns behind duck-vim. Read these and the rest of the API will read straight through.

## Key descriptors

A **key descriptor** is a string that represents a single key press, optionally combined with modifiers. The format is:

```
[modifier+]*key
```

Modifiers appear in alphabetical order: `alt`, `ctrl`, `meta`, `shift`. The key is always lowercase.

**Examples:**

| Input | Canonical form |
| --- | --- |
| 

}>

The prefix check is instant (a `Set` lookup), so it doesn't add latency to normal typing.

---

## Timeout

The timeout controls how long duck-vim waits between keys in a sequence. The default is 600ms.

- **Too short** (< 300ms): Users won't have time to press the second key.
- **Too long** (> 1000ms): The UI feels laggy because <Kbd>g</Kbd> is "swallowed" for too long.
- **600ms** is a good default that matches Vim's behavior.

Configure it in the KeyHandler constructor or the React provider:

```ts
// Vanilla
const handler = new KeyHandler(registry, 800) // 800ms timeout

// React
<KeyProvider timeoutMs={800}>
```

---

## Input element handling

}>

By default, key bindings fire even when the user is typing in an input field. This is usually not what you want for single-character bindings like <Kbd>g</Kbd>.

Set `ignoreInputs: true` to skip execution when the event target is a text input, textarea, select, or contenteditable element:

```ts
registry.register('g+d', command, { ignoreInputs: true })
```

Button-type inputs (`<input type="button">`, `<input type="submit">`, `<input type="reset">`) are NOT considered text inputs, so bindings still fire when those are focused.

---

## Event options

Each binding supports these options:

| Option | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Toggle the binding on/off without unregistering |
| `preventDefault` | `false` | Call `event.preventDefault()` on match |
| `stopPropagation` | `false` | Call `event.stopPropagation()` on match |
| `ignoreInputs` | `false` | Skip when focus is in a text input |
| `requireReset` | `false` | Fire only once until the handle's `resetFired()` is called |
| `conflictBehavior` | `'warn'` | What happens when a binding is already registered: `'warn'`, `'error'`, `'replace'`, or `'allow'` |

---

## How matching works

Build a key descriptor from the KeyboardEvent (modifiers + key, normalized)

Append it to the current sequence buffer

Check if the full buffer matches a registered command  -  if yes, execute and reset

Check if the full buffer is a prefix of any command  -  if yes, start the timeout and wait

If neither, reset the buffer and retry with just the current key (handles cases like pressing g, then x where x is a standalone binding)

}>

Pure modifier key presses (<Kbd>Shift</Kbd>, <Kbd>Control</Kbd>, <Kbd>Alt</Kbd>, <Kbd>Meta</Kbd> alone) are always ignored.