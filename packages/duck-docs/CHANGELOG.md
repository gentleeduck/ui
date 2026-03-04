# @gentleduck/docs

## 0.1.0

### Minor Changes

- 5b3e859: feat: migrate from @shikijs/compat to shiki v2 and resolve mermaid locally

  Replaced @shikijs/compat with native shiki v2 createHighlighter. Improved
  rehype-mermaid to resolve mermaid from node_modules instead of CDN, and
  added --allow-file-access-from-files for local rendering.

## 0.0.16

### Patch Changes

- 7c2aa88: Update dependencies and publish unpublished packages
- Updated dependencies [7c2aa88]
  - @gentleduck/hooks@0.1.11
  - @gentleduck/libs@0.1.14
  - @gentleduck/vim@0.1.15

## 0.0.15

### Patch Changes

- c9bbef8: Documentation and style updates.
- Updated dependencies [c9bbef8]
  - @gentleduck/hooks@0.1.10
  - @gentleduck/libs@0.1.13
  - @gentleduck/vim@0.1.14

## 0.0.14

### Patch Changes

- ad86755: Overhaul MDX rendering pipeline, improve docs layout, and add accessibility support.

  **MDX Rendering:**

  - Refactor MDX rendering pipeline for better performance and maintainability
  - Split MDX styles into layered CSS files for modular theming
  - Decompose MDX runtime and type plugin metadata into separate modules
  - Improve mermaid block rendering and callout icon support

  **Docs Layout:**

  - Add SVG path indicator with mask-image highlight to table of contents
  - Enhance TOC sidebar with edit links, scroll navigation, and formatting
  - Add skeleton fallback to TOC tree to prevent layout shift on mount
  - Fix toolbar height and empty TOC handling
  - Show prev/next pager buttons on all doc pages, not just components
  - Add loading and error states for ComponentPreview and ComponentSource

  **Search and Performance:**

  - Replace command menu substring search with lunr.js full-text search
  - Lazy-load CommandMenu, MobileNav, and CardsDemo components
  - Refactor command navigation model and virtualize command menu

  **Accessibility:**

  - Comprehensive accessibility audit across examples, blocks, and docs
  - Add aria-hidden to decorative icons in sidebar, preview-panel, and upload
  - Increase touch target size in docs sidebar to meet WCAG guidelines
  - Add prefers-reduced-motion support across animation components

  **Testing:**

  - Add bun-based MDX regression tests and docs architecture tests

- Updated dependencies [ad86755]
  - @gentleduck/hooks@0.1.9
  - @gentleduck/libs@0.1.12
  - @gentleduck/vim@0.1.13

## 0.0.13

### Patch Changes

- 919f689: Improve mermaid diagram block rendering with better sizing and dark mode support. Fix ordered-list indentation for nested items.

## 0.0.12

### Patch Changes

- d46534e: Update default sans font fallback from Geist to Montserrat for improved cross-platform typography consistency.

## 0.0.11

### Patch Changes

- fe4335d: Fix missing peer dependency causing build failures in downstream consumers.

## 0.0.1

### Patch Changes

- 3e65b9f: Initial public release of the @gentleduck/docs MDX rendering framework.
