# @gentleduck/docs

## 0.2.5

### Patch Changes

- 9afd136: Fix copy button icon sizing in DocsCopyPage — add explicit size-3.5 to Copy, Check, and ChevronDown icons.

## 0.2.4

### Patch Changes

- 2b6e8d0: Resolve all biome lint warnings, improve type safety, and add test coverage across the monorepo.
- Updated dependencies [2b6e8d0]
  - @gentleduck/hooks@0.1.12
  - @gentleduck/libs@0.1.15
  - @gentleduck/vim@0.1.16

## 0.2.3

### Patch Changes

- 5ccba20: fixed the copy-button z-index

## 0.2.2

### Patch Changes

- fix(search): disable primitive's built-in filter when using custom lunr search

  The command menu had two competing filtering systems: lunr-based search and the primitive's
  substring filter. The primitive's filter was hiding items via `el.hidden = true` even when
  lunr correctly found them, causing search results to not appear. Added `shouldFilter` prop
  to the Command primitive to allow disabling the built-in filter.

## 0.2.1

### Patch Changes

- 2dddadb: fixing some issues

## 0.2.0

### Minor Changes

- 9f5eb58: Introduce local font preset support across docs UI, switch docs app fonts from Geist to bundled local assets (JetBrains Mono Nerd, Inter, Inria Serif), update MDX/code typography behavior, and migrate syntax highlighting compatibility for the docs pipeline.

## 0.1.1

### Patch Changes

- abe4c0a: update the header

## 0.1.0

### Minor Changes

- c1c256f: feat: migrate from @shikijs/compat to shiki v2 and resolve mermaid locally

  Replaced @shikijs/compat with native shiki v2 createHighlighter. Improved
  rehype-mermaid to resolve mermaid from node_modules instead of CDN, and
  added --allow-file-access-from-files for local rendering.

### Patch Changes

- 995316e: feat: increase header transparency and add gradient blob styling

  Updated site-header to use more transparent background with stronger
  backdrop blur. Added gradient blob decorations to hero sections,
  feature sections, and sponsor sections across all docs apps.

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
