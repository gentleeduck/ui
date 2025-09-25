# @gentleduck/vim

A tiny, framework‑agnostic keyboard command engine with optional React bindings. Think “vim‑style” key sequences like `g+d`, plus single‑key combos such as `ctrl+shift+k` — all with a simple, strongly‑typed API.

* Core is DOM‑only and framework‑agnostic (`src/command/`).
* Optional React bindings (`src/react/`) provide a provider + hook for ergonomic usage.
* Supports multi‑step sequences with timeout and prefix matching.
* Written in TypeScript and ships types.

---

## Table of contents

* [Why this exists](#why-this-exists)
* [Installation](#installation)
* [Quick start (vanilla)](#quick-start-vanilla-tsjs)
* [Quick start (React)](#quick-start-react)
* [Concepts](#concepts)
* [API (core)](#api-core)
* [API (React bindings)](#api-react-bindings)
* [Advanced usage](#advanced-usage)
* [Accessibility & UX](#accessibility--ux)
* [Testing](#testing)
* [Limitations](#limitations)
* [Roadmap](#roadmap)
* [License](#license)

---

## Why this exists

Many apps need a small, predictable keyboard command system without bringing a large dependency. This project provides a tiny, strongly‑typed engine that:

* Works in any web framework (only depends on the DOM)
* Supports multi‑step sequences (e.g. `g+d`)
* Gives simple React ergonomics when you want them

## Installation

```sh
npm install @gentleduck/vim
```

```ts
// ESM (core)
import { Registry, KeyHandler, type Command } from '@gentleduck/vim/command'

// React bindings
import { KeyProvider, useKeyCommands } from '@gentleduck/vim/react'
```

If consuming from source in a monorepo, import via your configured workspace alias or relative path.

## Quick start (vanilla TS/JS)

```ts
import { Registry, KeyHandler, type Command } from '@gentleduck/vim/command'

const registry = new Registry(true) // enable debug logs
const handler = new KeyHandler(registry, 600)

const openPalette: Command = {
  name: 'Open Command Palette',
  execute: () => console.log('palette!'),
}

const goDashboard: Command = {
  name: 'Go Dashboard',
  execute: () => console.log('navigate to /dashboard'),
}

registry.register('ctrl+k', openPalette)
registry.register('g+d', goDashboard) // press `g`, then `d`

handler.attach(document)
// later: handler.detach(document)
```

## Quick start (React)

```tsx
import React from 'react'
import { KeyProvider, useKeyCommands } from '@gentleduck/vim/react'

function App() {
  useKeyCommands({
    'g+d': { name: 'Go Dashboard', execute: () => console.log('dash') },
    'ctrl+k': { name: 'Open Palette', execute: () => console.log('palette') },
  })

  return <div>Press g then d, or Ctrl+K</div>
}

export default function Root() {
  return (
    <KeyProvider debug timeoutMs={600}>
      <App />
    </KeyProvider>
  )
}
```

## Concepts

* **Key descriptor** — built from a `KeyboardEvent` as `ctrl?+alt?+meta?+shift?+key`. Always normalized to lowercase. Aliases: `' '` → `space`, `escape` → `esc`, `control` → `ctrl`.
* **Sequence** — concatenation of descriptors separated by `+` between steps (e.g. `g+d`). Each step may include modifiers: `ctrl+shift+k`.
* **Prefixes** — every registered sequence contributes progressive prefixes. Registering `g+d` will mark `g` as a valid prefix while waiting for completion.
* **Timeout** — when a prefix is active, the internal sequence resets after `timeoutMs` unless the sequence completes.

## API (core)

### `interface Command`

```ts
interface Command {
  name: string
  description?: string
  execute: <T>(args?: T) => void | Promise<void>
}
```

### `class Registry`

```ts
constructor(debug?: boolean)
register(key: string, cmd: Command): void
hasCommand(key: string): boolean
getCommand(key: string): Command | undefined
isPrefix(key: string): boolean
```

`Registry` holds the mapping from sequence strings to `Command` and tracks prefixes for multi‑step sequences.

### `class KeyHandler`

```ts
constructor(registry: Registry, timeoutMs = 600)
attach(target: HTMLElement | Document = document): void
detach(target: HTMLElement | Document = document): void
```

* Ignores pure modifier presses (`Shift`, `Control`, `Alt`, `Meta`).
* Matching strategy: try full sequence → if prefix, wait → otherwise retry last descriptor → reset.

## API (React bindings)

* **`KeyProvider`** — mounts a `Registry` and `KeyHandler`, attaches on mount, detaches on unmount.

  * Props: `{ debug?: boolean; timeoutMs?: number; children: ReactNode }`

* **`useKeyCommands(commands: Record<string, Command>)`** — registers a set of key→command mappings using the provider's `registry`. Must be used inside `KeyProvider`.

* **`KeyContext`** — advanced: exposes `{ registry: Registry; handler: KeyHandler }` for programmatic usage.

## Advanced usage

* **Scoped listeners** — call `handler.attach(element)` to scope keyboard handling to a specific DOM subtree.
* **Multiple registries** — create separate `Registry`/`KeyHandler` instances per feature for isolation.
* **Programmatic execution** — `registry.getCommand('ctrl+k')?.execute()`.
* **Debugging** — enable `debug` to log state transitions and matches.

## Accessibility & UX

* Avoid shadowing essential browser shortcuts unless necessary.
* Provide discoverability (help modal or command palette listing registered shortcuts).
* Offer alternative mouse/UI paths for critical actions.
* Test on various keyboard layouts and IME-enabled environments — `e.key` can vary by layout.

## Testing

The repo uses `vitest` + JSDOM. Test `Registry` directly for DOM‑less behavior. For `KeyHandler`, dispatch `keydown` events on a JSDOM `document` or element to simulate user input.

## Limitations

* No built‑in `unregister` API yet — consumers must manage cleanup or reinstantiate registries.
* `preventDefault`/`stopPropagation` are not applied automatically — left to integrators for fine control.
* Timing‑based sequences (`timeoutMs`) can conflict with IME and accessibility tools. Tweak `timeoutMs` as needed.

## License

[MIT © GentleDuck](./LICENSE)

