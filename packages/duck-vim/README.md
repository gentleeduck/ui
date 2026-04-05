<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/vim

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
