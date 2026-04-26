# @gentleduck/registry-ui

## 0.4.1

### Patch Changes

- Updated dependencies [df57671]
  - @gentleduck/primitives@0.2.11

## 0.4.0

### Minor Changes

- 7d6fb7b: Motion: export IDuckMotion namespace, add token presets, stagger utility, and exit-transition context. Shortcut and registry-ui gain motion library integration with dialog animations and MotionBadge preset.

### Patch Changes

- Updated dependencies [7d6fb7b]
- Updated dependencies [7d6fb7b]
- Updated dependencies [7d6fb7b]
  - @gentleduck/motion@0.3.0
  - @gentleduck/calendar@0.3.0
  - @gentleduck/hooks@0.2.0
  - @gentleduck/libs@0.2.0
  - @gentleduck/vim@0.2.0
  - @gentleduck/primitives@0.2.10
  - @gentleduck/variants@0.1.22

## 0.3.3

### Patch Changes

- 0f4f2e2: Performance pass across all Motion components. Extracted inline useMotionPreset option objects to module-level constants. Memoized context provider values in Accordion, Tabs, ToggleGroup, and Collapsible. Extracted inline animate and transition literals to constants in Switch, Tabs, and Progress. Memoized event handlers with useCallback. Converted 47 wildcard barrel exports to named exports for tree-shaking. Migrated all 41 component files from string-based preset lookups to direct preset object imports. Fixed stale event handler closure in CollapsibleTrigger. Fixed MotionSelectTrigger to use LazyMotion plus m.div instead of the heavy motion.div root import. Added sideEffects false to package.json.
- Updated dependencies [0f4f2e2]
  - @gentleduck/motion@0.2.0

## 0.3.2

### Patch Changes

- Updated dependencies [32d0136]
  - @gentleduck/calendar@0.2.1

## 0.3.1

### Patch Changes

- Updated dependencies [58d1c61]
  - @gentleduck/calendar@0.2.0

## 0.3.0

### Minor Changes

- 3ee8b3a: feat: add AI documentation chat and command menu enhancements

  @gentleduck/docs:

  - Add useAIChat hook for streaming AI chat with rAF-batched updates
  - Add AIChatPanel component with markdown rendering, shiki syntax highlighting, and dynamic props
  - Add AI toggle mode to CommandMenu with auto-switch on empty search results
  - Add react-markdown and shiki as optional peer dependencies

  @gentleduck/registry-ui:

  - Add hideClose prop to DialogContent to conditionally hide the close button
  - Add children prop to CommandInput for rendering extra elements in the input wrapper
  - Add contentClassName prop to CommandDialog for dynamic dialog sizing

## 0.2.12

### Patch Changes

- 0fd319f: Update carousel, pagination, and sidebar components with tests and fixes.

## 0.2.11

### Patch Changes

- 3b33efe: Remove select-none from accordion content so users can select and copy text inside accordion panels.

## 0.2.10

### Patch Changes

- 74f5628: Remove whitespace-nowrap from accordion trigger to allow text wrapping on smaller screens.

## 0.2.9

### Patch Changes

- 80f8c4c: Fix declaration output for shared docs and registry UI components so consumer apps keep valid props during production typechecking.

## 0.2.8

### Patch Changes

- e7ee580: fix(registry-ui): replace workspace:\* dependencies with published npm versions

  The published package had `workspace:*` references that broke any consumer's install.

## 0.2.6

### Patch Changes

- 2b6e8d0: Resolve all biome lint warnings, improve type safety, and add test coverage across the monorepo.
- Updated dependencies [2b6e8d0]
  - @gentleduck/primitives@0.2.5
  - @gentleduck/variants@0.1.20
  - @gentleduck/hooks@0.1.12
  - @gentleduck/motion@0.1.17
  - @gentleduck/libs@0.1.15
  - @gentleduck/vim@0.1.16

## 0.2.5

### Patch Changes

- fix(search): disable primitive's built-in filter when using custom lunr search

  The command menu had two competing filtering systems: lunr-based search and the primitive's
  substring filter. The primitive's filter was hiding items via `el.hidden = true` even when
  lunr correctly found them, causing search results to not appear. Added `shouldFilter` prop
  to the Command primitive to allow disabling the built-in filter.

- Updated dependencies
  - @gentleduck/primitives@0.2.4

## 0.2.4

### Patch Changes

- ba8a6f3: fix: update resizable components to react-resizable-panels v4 API

  Replace deprecated ref with panelRef across resizable component and
  examples to align with react-resizable-panels v4.

## 0.2.3

### Patch Changes

- 7c2aa88: Update dependencies and publish unpublished packages
- Updated dependencies [7c2aa88]
  - @gentleduck/hooks@0.1.11
  - @gentleduck/libs@0.1.14
  - @gentleduck/motion@0.1.16
  - @gentleduck/primitives@0.2.3
  - @gentleduck/variants@0.1.19
  - @gentleduck/vim@0.1.15

## 0.2.2

### Patch Changes

- c9bbef8: Documentation and style updates.
- Updated dependencies [c9bbef8]
  - @gentleduck/hooks@0.1.10
  - @gentleduck/libs@0.1.13
  - @gentleduck/motion@0.1.15
  - @gentleduck/primitives@0.2.2
  - @gentleduck/variants@0.1.18
  - @gentleduck/vim@0.1.14

## 0.2.1

### Patch Changes

- ad86755: Migrate all UI components to new duck-primitives, add RTL support, and update component styles.

  **Features:**

  - Migrate all registry-ui components to new duck-primitives module
  - Add RTL support with CSS logical properties across components
  - Add AnimVariants for consistent animation behavior
  - Rewrite alert-dialog to use new primitives
  - Rewrite sheet to use new dialog-based primitives
  - Rewrite menubar to use new menubar primitives
  - Switch preview index to next/dynamic SSR entries

  **Fixes:**

  - Fix dialog and popover styles for Tailwind CSS v4 compatibility
  - Fix select to manage its own open state
  - Fix popover width and update calendar/date-picker examples
  - Disable SSR for dynamic preview components

- Updated dependencies [ad86755]
  - @gentleduck/primitives@0.2.1
  - @gentleduck/hooks@0.1.9
  - @gentleduck/libs@0.1.12
  - @gentleduck/variants@0.1.17
  - @gentleduck/motion@0.1.14
  - @gentleduck/vim@0.1.13

## 0.2.0

### Minor Changes

- 36f9364: Add json-editor component with inline, sheet, and popover editing modes for JSON data with validation. Includes registry entries and three example demos.

### Patch Changes

- d46534e: Upgrade recharts peer dependency from v2 to v3.7.0 with updated chart component types.
- Updated dependencies [36f9364]
  - @gentleduck/primitives@0.2.0

## 0.1.17

### Patch Changes

- Updated dependencies [4f93768]
  - @gentleduck/primitives@0.1.45

## 0.1.16

### Patch Changes

- Updated dependencies [d0a2c1d]
- Updated dependencies [d0a2c1d]
  - @gentleduck/primitives@0.1.44

## 0.1.15

### Patch Changes

- Updated dependencies [45ec82f]
  - @gentleduck/primitives@0.1.43

## 0.1.14

### Patch Changes

- Updated dependencies [cd47e32]
  - @gentleduck/primitives@0.1.42

## 0.1.13

### Patch Changes

- df94032: Initial public release of styled UI component wrappers for duck-primitives with Tailwind CSS styling and registry infrastructure.
