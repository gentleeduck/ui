# @gentleduck/vim

## 0.1.13

### Patch Changes

- ad86755: Add comprehensive keyboard input processing pipeline and React integration hooks.

  **New Modules:**
  - Add platform detection module for OS-aware modifier key handling
  - Add key parser module for normalizing raw keyboard events into structured key objects
  - Add key matcher module for comparing parsed keys against registered bindings
  - Add format module for human-readable key combination display strings
  - Add sequence module for multi-key chord and sequence matching
  - Add recorder module for capturing and replaying key input sessions

  **React Integration:**
  - Add useVim and useKeySequence React hooks for declarative keybinding in components
  - Enhance KeyProvider with context-based keybinding registration and conflict detection
  - Enhance command module with options parameter and binding conflict detection

  **Maintenance:**
  - Align biome and tsconfig build info exclusions
  - Update package config, tsconfig, and README

## 0.1.12

### Patch Changes

- Fix TypeScript type exports and resolve type-only import issues affecting downstream consumers.

## 0.1.1

### Patch Changes

- Initial integration with gentleduck/ui monorepo. Set up package configuration, build pipeline, and core vim keybinding primitives.
