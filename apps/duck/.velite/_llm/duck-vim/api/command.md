}>

The **Registry** and **KeyHandler** classes form the core of duck-vim's shortcut system. Register commands with key bindings and let the KeyHandler dispatch them automatically.

```ts

```

## Types

### `Command`

```ts
interface Command {
  name: string
  description?: string
  execute: 

---

## Complete example

```ts

const registry = new Registry(process.env.NODE_ENV === 'development')
const handler = new KeyHandler(registry, 600, {
  ignoreInputs: true,  // default for all bindings
})

// Single-key shortcut
registry.register('ctrl+k', {
  name: 'Command Palette',
  execute: () => togglePalette(),
}, { preventDefault: true })

// Multi-key sequence
registry.register('g+d', {
  name: 'Go to Dashboard',
  execute: () => navigate('/dashboard'),
})

// One-shot binding (fires once until resetFired is called)
const saveHandle = registry.register('ctrl+s', {
  name: 'Save',
  execute: () => save(),
}, { preventDefault: true, requireReset: true })

// After save completes, allow it to fire again
async function save() {
  await saveDocument()
  saveHandle.resetFired()
}

handler.attach(document)
```

}>

Use `requireReset: true` for actions that should only fire once per invocation (like saving). Call `handle.resetFired()` when the action completes to allow the binding to fire again.