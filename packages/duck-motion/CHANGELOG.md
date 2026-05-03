# @gentleduck/motion

## 0.3.2

### Patch Changes

- 553e2ea: Fix `files` field to include `src/css/index.css` instead of stale `src/index.css`. The `./css` export pointed to a path that wasn't shipped in the tarball, breaking `import '@gentleduck/motion/css'` in consumer apps.

## 0.3.1

### Patch Changes

- b4706d3: Replace `workspace:*` deps in published `dependencies` and `peerDependencies` with explicit semver. Previous publishes leaked `workspace:*` to the npm tarball, breaking `bun install` for downstream consumers (`error: Workspace dependency "@gentleduck/calendar" not found`).

## 0.3.0

### Minor Changes

- 7d6fb7b: Motion: export IDuckMotion namespace, add token presets, stagger utility, and exit-transition context. Shortcut and registry-ui gain motion library integration with dialog animations and MotionBadge preset.

### Patch Changes

- Updated dependencies [7d6fb7b]
  - @gentleduck/variants@0.1.22

## 0.2.0

### Minor Changes

- 0f4f2e2: Performance and tree-shaking improvements for the motion library.

  useMotionPreset now accepts either a preset name string or a preset object directly. The object form enables tree-shaking since unused presets are never imported. Exported MotionProvider from the barrel. Removed deprecated motion-tokens module. Extracted shared preset utilities into presets/\_utils.ts. Moved TAP_SCALE_TRANSITION and standardEase to transitions/tweens.ts as shared constants. Added sideEffects false to enable bundler tree-shaking.

## 0.1.18

### Patch Changes

- 6f0e067: Standardize package exports to use explicit named exports, add `sideEffects` field and `types` export entries to package.json, and annotate internal APIs with `@internal` JSDoc tags.
- Updated dependencies [6f0e067]
  - @gentleduck/variants@0.1.21

## 0.1.17

### Patch Changes

- 2b6e8d0: Resolve all biome lint warnings, improve type safety, and add test coverage across the monorepo.
- Updated dependencies [2b6e8d0]
  - @gentleduck/variants@0.1.20

## 0.1.16

### Patch Changes

- 7c2aa88: Update dependencies and publish unpublished packages
- Updated dependencies [7c2aa88]
  - @gentleduck/variants@0.1.19

## 0.1.15

### Patch Changes

- c9bbef8: Documentation and style updates.
- Updated dependencies [c9bbef8]
  - @gentleduck/variants@0.1.18

## 0.1.14

### Patch Changes

- ad86755: Add motion design tokens and reduced-motion accessibility support.

  **Features:**

  - Add motion design tokens for consistent animation duration, easing, and spring values
  - Add reduced-motion helper utilities for prefers-reduced-motion media query support
  - Centralize reduced-motion styles via shared @gentleduck/motion helpers
  - Integrate duck-motion helpers into block-wrapper and inline reduced-motion styles

  **Maintenance:**

  - Refactor motion utilities for cleaner API surface
  - Remove unused AnimPopoverArrowVariants
  - Update README and add react peer dependency
  - Align biome and tsconfig build info exclusions

- Updated dependencies [ad86755]
  - @gentleduck/variants@0.1.17

## 0.1.12

### Patch Changes

- Improve animation variants with smoother easing curves and consistent timing across popover, dialog, and tooltip transitions.
