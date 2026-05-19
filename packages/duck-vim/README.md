<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/vim" width="120"/>
</p>

<h1 align="center">@gentleduck/vim</h1>

<p align="center">
  Keyboard command engine with hotkey parsing, sequences, recording, and React hooks.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/vim"><img src="https://img.shields.io/npm/v/@gentleduck/vim.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/vim"><img src="https://img.shields.io/npm/dm/@gentleduck/vim.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/vim.svg" alt="MIT"/></a>
</p>

---

Keyboard command engine for React.

Bind hotkeys, record key sequences, and handle platform-aware modifier keys. Framework-agnostic core with React hooks included.

## Why

- Multi-step key sequences (`g` then `d`) with configurable timeout
- Key recording for settings UIs where users customize their bindings
- Platform-aware `Mod` key: resolves to `Cmd` on macOS, `Ctrl` everywhere else

## Quick start

```bash
npm install @gentleduck/vim
```

```tsx
import { KeyProvider, useKeyBind } from '@gentleduck/vim/react'

function App() {
  useKeyBind('ctrl+k', () => console.log('open palette'), {
    preventDefault: true,
  })

  return <div>Press Ctrl+K</div>
}

export default function Root() {
  return (
    <KeyProvider>
      <App />
    </KeyProvider>
  )
}
```

## Features

- **Key parsing** -- parse, normalize, and validate binding strings (`Mod+Shift+S` to structured descriptors)
- **Sequences** -- multi-step key chains with timeout and progress tracking
- **Recording** -- capture key combinations from user input for rebinding UIs
- **React hooks** -- `useKeyBind`, `useKeySequence`, `useKeyRecorder`, `useKeyCommands`
- **Platform detection** -- auto-detect macOS/Windows/Linux and resolve modifier labels
- **Conflict detection** -- warn, error, or silently replace duplicate bindings
- **Per-binding options** -- `preventDefault`, `stopPropagation`, `ignoreInputs`, `requireReset`

## Modules

Each module is a separate subpath export and can be used independently:

| Module | Import | Purpose |
|--------|--------|---------|
| `platform` | `@gentleduck/vim/platform` | OS detection, `Mod` resolution |
| `parser` | `@gentleduck/vim/parser` | Parse/normalize/validate bindings |
| `matcher` | `@gentleduck/vim/matcher` | Match keyboard events |
| `format` | `@gentleduck/vim/format` | Platform-aware display formatting |
| `command` | `@gentleduck/vim/command` | Registry and key handler |
| `sequence` | `@gentleduck/vim/sequence` | Multi-key sequence matching |
| `recorder` | `@gentleduck/vim/recorder` | Key combination recording |
| `react` | `@gentleduck/vim/react` | React context, hooks |

## Bundle

- Zero runtime dependencies (React is a peer dep)
- Tree-shakeable subpath exports
- `"sideEffects": false`

## Docs

[gentleduck.org](https://gentleduck.org)

## License

[MIT](./LICENSE)
