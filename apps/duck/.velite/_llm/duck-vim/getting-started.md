}>

Install **duck-vim** and bind your first shortcut. Three approaches: vanilla JS, React with hooks, or standalone handlers.

## Installation

```bash
npm install @gentleduck/vim
```

}>
duck-vim ships TypeScript types. No `@types` package needed.

---

## Option A: Vanilla (no framework)

This is the simplest path. You create a registry, a handler, register commands, and attach to the DOM.

Create a registry and handler

```ts
import { Registry, KeyHandler, type Command } from '@gentleduck/vim/command'

const registry = new Registry()
const handler = new KeyHandler(registry, 600)
```

Define and register commands

```ts
const openPalette: Command = {
  name: 'Open Command Palette',
  execute: () => console.log('Palette opened!'),
}

const goToDashboard: Command = {
  name: 'Go to Dashboard',
  execute: () => (window.location.href = '/dashboard'),
}

registry.register('ctrl+k', openPalette, { preventDefault: true })
registry.register('g+d', goToDashboard)
```

Start listening

```ts
handler.attach(document)
```

Press <Kbd>Ctrl+K</Kbd> to open the palette. Press <Kbd>g</Kbd> then <Kbd>d</Kbd> (within 600ms) to navigate to the dashboard.

To stop listening:

```ts
handler.detach(document)
```

---

## Option B: React

Wrap your app in `KeyProvider`, then use hooks to register bindings.

```tsx
import { KeyProvider, useKeyBind, useKeySequence } from '@gentleduck/vim/react'

function App() {
  const [open, setOpen] = useState(false)

  // Single key binding
  useKeyBind('ctrl+k', () => setOpen(true), { preventDefault: true })

  // Multi-key sequence: press g, then d
  useKeySequence(['g', 'd'], () => {
    window.location.href = '/dashboard'
  })

  return (
    <div>
      <p>Press Ctrl+K to open palette, or g then d to go to dashboard.</p>
      {open && <CommandPalette onClose={() => setOpen(false)} />}
    </div>
  )
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

## Option C: Standalone handlers (no registry)

}>

If you just need a quick one-off binding without a full registry, use `createKeyBindHandler`.

```ts
import { createKeyBindHandler } from '@gentleduck/vim/matcher'

const handler = createKeyBindHandler({
  binding: 'Mod+S',
  handler: (e) => {
    console.log('Save!')
  },
  options: { preventDefault: true },
})

document.addEventListener('keydown', handler)
```

This resolves `Mod` to <Kbd>Cmd</Kbd> on Mac and <Kbd>Ctrl</Kbd> on Windows/Linux automatically.

---

## What's next?

} className="[&_ul]:my-0">

- Read [Core Concepts](/duck-vim/concepts) to understand key descriptors, sequences, and the Mod key.
- Browse the [API Reference](/duck-vim/api) for every module.
- Follow the [Course](/duck-vim/course) for a hands-on walkthrough from beginner to advanced.