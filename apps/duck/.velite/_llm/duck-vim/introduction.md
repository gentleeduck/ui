}>

**duck-vim** is a keyboard shortcut engine for the browser. Registry-based commands, multi-key sequences, cross-platform 

---

## Quick links

}>

- [Getting Started](/duck-vim/getting-started) - Install and run your first shortcut.
- [Core Concepts](/duck-vim/concepts) - Key descriptors, sequences, prefixes, the Mod key.
- [API Reference](/duck-vim/api) - Full API for every module.
- [Guides](/duck-vim/guides) - Recipes for common patterns.
- [Course](/duck-vim/course) - Tutorial from zero to advanced.

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
import { Registry, KeyHandler } from '@gentleduck/vim/command'
import { parseKeyBind } from '@gentleduck/vim/parser'
import { formatForDisplay } from '@gentleduck/vim/format'

// React bindings
import { KeyProvider, useKeyBind, useKeySequence } from '@gentleduck/vim/react'
```

---

## Minimal example

```ts
import { Registry, KeyHandler } from '@gentleduck/vim/command'

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