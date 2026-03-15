---
name: duck-vim
description: >-
  Use when working with @gentleduck/vim — the keyboard command engine. Covers hotkey
  parsing, key sequence matching, chord bindings, platform-aware mod resolution,
  key recording, and the React hooks (useKeyBind, useKeySequence, useKeyCommands,
  useKeyRecorder). Not for vim-the-editor — this is a keyboard shortcut library.
allowed-tools: Read Grep
argument-hint: "[keybind-or-topic]"
---

# @gentleduck/vim

You are an expert on the keyboard command engine. Your scope is `packages/duck-vim/`. This package parses hotkey strings, matches keyboard events, supports sequences (vim-style chords), records key presses, and provides React hooks.

## Modules

Import by subpath: `@gentleduck/vim/{module}`

### parser — Parse hotkey strings into structured objects

```tsx
import { parseKeyBind, type ParsedKeyBind } from '@gentleduck/vim/parser'

parseKeyBind('mod+shift+k')
// => { key: 'k', mod: true, shift: true, alt: false, meta: false }
// mod resolves to Cmd on Mac, Ctrl elsewhere
```

### matcher — Match keyboard events against parsed bindings

```tsx
import { createKeyBindHandler, matchesKeyboardEvent, isInputElement } from '@gentleduck/vim/matcher'

const handler = createKeyBindHandler('mod+k', (e) => { openSearch() })
document.addEventListener('keydown', handler)

// Multi-key: matches any of several bindings
const multi = createMultiKeyBindHandler([
  { bind: 'mod+k', handler: openSearch },
  { bind: 'mod+j', handler: openTerminal },
])
```

### platform — Detect OS for mod key resolution

```tsx
import { detectPlatform, isMac, resolveMod } from '@gentleduck/vim/platform'

detectPlatform() // => 'mac' | 'windows' | 'linux'
resolveMod()     // => 'metaKey' on Mac, 'ctrlKey' elsewhere
```

### format — Display-friendly key labels

```tsx
import { formatForDisplay, formatWithLabels } from '@gentleduck/vim/format'

formatForDisplay('mod+shift+k') // => '⌘⇧K' on Mac, 'Ctrl+Shift+K' on Windows
```

### sequence — Vim-style multi-key sequences

```tsx
import { createSequenceMatcher, SequenceManager } from '@gentleduck/vim/sequence'

const seq = createSequenceMatcher('g g', () => scrollToTop(), { timeout: 1000 })
```

### recorder — Record key presses for shortcut discovery

```tsx
import { KeyRecorder, KeyStateTracker } from '@gentleduck/vim/recorder'
```

### react — React hooks

```tsx
import { useKeyBind, useKeySequence, useKeyCommands, useKeyRecorder, KeyProvider } from '@gentleduck/vim/react'

// Single binding
useKeyBind('mod+k', () => openCommandMenu())

// Sequence
useKeySequence('g g', () => scrollToTop())

// Command registry
useKeyCommands([
  { id: 'search', bind: 'mod+k', handler: openSearch },
  { id: 'save', bind: 'mod+s', handler: save },
])

// Recording mode
const { recording, startRecording, stopRecording, keys } = useKeyRecorder()
```

## Source

```
packages/duck-vim/src/
├── command/   # KeyHandler, Registry
├── format/    # Display formatting
├── matcher/   # Event matching
├── parser/    # String parsing
├── platform/  # OS detection
├── react/     # React hooks and context
├── recorder/  # Key recording
└── sequence/  # Multi-key sequences
```

Each module is independently importable via the package.json exports map.
