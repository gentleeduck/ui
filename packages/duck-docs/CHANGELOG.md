# @gentleduck/docs

## 1.0.0

### Minor Changes

- 7d6fb7b: Update internal dependencies: hooks, libs, vim, registry-ui bumped to new minor versions.

### Patch Changes

- Updated dependencies [7d6fb7b]
  - @gentleduck/hooks@0.2.0
  - @gentleduck/libs@0.2.0
  - @gentleduck/vim@0.2.0

## 0.3.3

### Patch Changes

- 3971d93: Make all text and heading sizes responsive across docs

## 0.3.2

### Patch Changes

- bff0977: fix: responsive breadcrumb with ellipsis on mobile, pager now includes index pages with children
- 32d0136: fix: replace removed lucide-react brand icons (Github, Twitter) with inline SVGs, fix import ordering
- Updated dependencies [32d0136]
  - @gentleduck/vim@0.1.18

## 0.3.1

### Patch Changes

- 76e824b: fix: presence animation interrupt, breadcrumb keys, theme hydration, nested buttons

  - Presence: cancel in-flight exit animation on re-mount to prevent stale animationend from unmounting re-opened content
  - Breadcrumb: move key from BreadcrumbItem to Fragment (React key warning)
  - ModeSwitcher: use stable aria-label until mounted to prevent hydration mismatch
  - PopoverTrigger: add asChild to calendar-7 and combobox-7 to prevent nested buttons

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

## 0.2.13

### Patch Changes

- 24b824b: Fix header shifting right when scroll is disabled by dialogs or sheets. Compensates for the removed scrollbar width using the CSS variable set by react-remove-scroll.

## 0.2.12

### Patch Changes

- 0fd319f: Update carousel, pagination, and sidebar components with tests and fixes.

## 0.2.11

### Patch Changes

- f593df5: Bump version to sync downstream consumers.

## 0.2.10

### Patch Changes

- 80f8c4c: Fix declaration output for shared docs and registry UI components so consumer apps keep valid props during production typechecking.

## 0.2.9

### Patch Changes

- 652edb5: Replace translucent backdrop-blur header with solid `bg-background` in site header.

## 0.2.8

### Patch Changes

- 6f0e067: Standardize package exports to use explicit named exports, add `sideEffects` field and `types` export entries to package.json, and annotate internal APIs with `@internal` JSDoc tags.
- Updated dependencies [6f0e067]
  - @gentleduck/hooks@0.1.13
  - @gentleduck/libs@0.1.16
  - @gentleduck/vim@0.1.17

## 0.2.7

### Patch Changes

- 5e8d19f: fix header backdrop

## 0.2.6

### Patch Changes

- 43817f1: Move DocsPathBreadcrumb component from duck-ui-docs app to @gentleduck/docs package

## 0.2.5

### Patch Changes

- 9afd136: Fix copy button icon sizing in DocsCopyPage - add explicit size-3.5 to Copy, Check, and ChevronDown icons.

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
