}>
  Lesson 1 of 8  -  Why keyboard shortcuts matter and how duck-vim approaches the problem.

## Why keyboard shortcuts?

Keyboard shortcuts aren't only for power users. They serve three audiences:

**Power users** want to stay on the keyboard. Reaching for the mouse breaks flow. VS Code, Figma, and Notion ship deep keyboard interfaces for this reason.

**Accessibility** depends on keyboard navigation. Users who can't use a mouse rely on shortcuts. WCAG 2.1 guideline 2.1 requires all functionality to be operable through a keyboard.

**Efficiency** is measurable. Studies show keyboard shortcuts cut task completion time by 30-50% for repetitive operations.

***

## The problem with naive approaches

Most developers start with something like this:

```ts
// Don't do this
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'k') {
    openPalette()
  }
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    save()
  }
  // ... 50 more if-statements
})
```

} className="[&_ul]:my-0">
  This approach breaks down quickly:

  * **No discoverability.** Users can't find what shortcuts exist.
  * **No customization.** Bindings are hardcoded.
  * **No multi-key sequences.** You can't do Vim-style <Kbd>G</Kbd> then <Kbd>D</Kbd>.
  * **No cleanup.** Removing a shortcut means finding and deleting code.
  * **Cross-platform issues.** <Kbd>Ctrl</Kbd> on Windows should be <Kbd>Cmd</Kbd> on Mac.
  * **Input conflicts.** Pressing <Kbd>G</Kbd> fires even when the user is typing in a search box.

***

## How duck-vim solves this

duck-vim uses a **registry pattern**. Instead of imperative event handlers, you declare bindings:

```ts
registry.register('ctrl+k', {
  name: 'Open Palette',
  execute: () => openPalette(),
})
```

} className="[&_ul]:my-0">
  The registry is the single source of truth for all shortcuts. From it you get:

  * **Discoverability:** Query `registry.getAllCommands()` to build a command palette.
  * **Customization:** Unregister and re-register with a different key.
  * **Sequences:** Register `'g+d'` and the system handles prefix detection and timeouts.
  * **Cross-platform:** Write `'Mod+S'` and it resolves to <Kbd>Cmd+S</Kbd> on Mac, <Kbd>Ctrl+S</Kbd> elsewhere.
  * **Input safety:** Set `ignoreInputs: true` to skip bindings when the user is typing.

***

## Architecture at a glance

duck-vim is split into small, focused modules:

```txt
@gentleduck/vim
├── platform/   -> OS detection, Mod key resolution
├── parser/     -> Parse "ctrl+shift+s" into structured data
├── matcher/    -> Does this KeyboardEvent match this binding?
├── command/    -> Registry + KeyHandler (the core system)
├── sequence/   -> Multi-step sequence matching
├── recorder/   -> Record key combos for settings UIs
├── format/     -> Format bindings for display ("Cmd+S")
└── react/      -> Provider + hooks
```

}>
  The core modules have zero framework dependencies. React bindings are a separate, optional layer.

***

## What we'll build in this course

}>
  By the end of the course you can:

1. Register and manage keyboard shortcuts in any JavaScript application.
2. Build multi-key Vim-style sequences.
3. Integrate shortcuts into React with providers and hooks.
4. Display shortcuts with platform-aware formatting.
5. Build a key recorder for shortcut customization UIs.
6. Build a command palette powered by the registry.
7. Handle edge cases: scoped bindings, conflict detection, input elements.

}>
  **Next:** [Lesson 2  -  Your First Shortcut](/duck-vim/course/02-first-shortcut)