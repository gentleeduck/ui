# @gentleduck/motion

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
