}>

API reference for every **duck-vim** module. Each module can be imported separately.

## Modules

Each module has a single responsibility.

| Module | Import path | Description |
| --- | --- | --- |
| [Platform](/duck-vim/api/platform) | `@gentleduck/vim/platform` | OS detection and Mod key resolution |
| [Parser](/duck-vim/api/parser) | `@gentleduck/vim/parser` | Parse, normalize, and validate key binding strings |
| [Matcher](/duck-vim/api/matcher) | `@gentleduck/vim/matcher` | Match keyboard events against parsed bindings |
| [Command](/duck-vim/api/command) | `@gentleduck/vim/command` | Registry and KeyHandler for managing shortcuts |
| [Sequence](/duck-vim/api/sequence) | `@gentleduck/vim/sequence` | Multi-step sequence matching |
| [Recorder](/duck-vim/api/recorder) | `@gentleduck/vim/recorder` | Record key combinations for settings UIs |
| [Format](/duck-vim/api/format) | `@gentleduck/vim/format` | Format bindings for display |
| [React](/duck-vim/api/react) | `@gentleduck/vim/react` | Provider, hooks, and context |

}>

All modules except **React** are framework-agnostic and work in any browser environment.

}>

Start at [Platform](/duck-vim/api/platform) for OS detection. Read [Parser](/duck-vim/api/parser) and [Matcher](/duck-vim/api/matcher) for binding logic. Use [Command](/duck-vim/api/command) for the registry system, or [React](/duck-vim/api/react) for hooks.