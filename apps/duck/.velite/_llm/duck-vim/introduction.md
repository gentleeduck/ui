}>

**duck-vim** is a keyboard shortcut engine for the browser. Registry-based commands, multi-key sequences, cross-platform 

---

## Quick links

}>

- [Getting Started](/docs/packages/duck-vim/getting-started) - Install and run your first shortcut.
- [Core Concepts](/docs/packages/duck-vim/concepts) - Key descriptors, sequences, prefixes, the Mod key.
- [API Reference](/docs/packages/duck-vim/api) - Full API for every module.
- [Guides](/docs/packages/duck-vim/guides) - Recipes for common patterns.
- [Course](/docs/packages/duck-vim/course) - Tutorial from zero to advanced.

---

## Installation

  npm
  pnpm
  yarn

```bash
npm install @gentleduck/vim
```

```bash
pnpm add @gentleduck/vim
```

```bash
yarn add @gentleduck/vim
```

```ts
// Core (framework-agnostic)

// React bindings

```

---

## Minimal example

```ts

const registry = new Registry()
const handler = new KeyHandler(registry)

registry.register('ctrl+k', {
  name: 'Open Palette',
  execute: () => document.getElementById('palette')?.focus(),
})

handler.attach(document)
```

}>

Press <Kbd>Ctrl+K</Kbd> and the command fires. No React, no framework, no config files.