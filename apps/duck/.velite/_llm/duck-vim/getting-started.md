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

Press }

  )
}

export default function Root() {
  return (

  )
}
```

---

## Option C: Standalone handlers (no registry)

}>

If you just need a quick one-off binding without a full registry, use `createKeyBindHandler`.

```ts

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

- Read [Core Concepts](/docs/packages/duck-vim/concepts) to understand key descriptors, sequences, and the Mod key.
- Browse the [API Reference](/docs/packages/duck-vim/api) for every module.
- Follow the [Course](/docs/packages/duck-vim/course) for a hands-on walkthrough from beginner to advanced.