## Themes System <Badge>feat</Badge>

Migrated theme system to JSON-based config with visual tooling.

- Added **color-editor** and **converter** pages for interactive theme customization
- Completed green palette and fixed orange inconsistencies
- Added **amber**, **purple**, and **teal** color themes
- Added themes selector with dashboard preview
- Updated zinc palette and related registry configs
- 8 palettes available: zinc, slate, stone, gray, amber, purple, teal, green

---

## Primitives Foundation <Badge>feat</Badge>

Laid the groundwork for the custom primitives system:

- Added **sheet** and **popover** primitives with hooks and types
- Improved mount and tooltip animations with hover-card primitive
- Refactored dialog, sheet, and popover implementations
- Integrated **floating-ui** for context-menu and popover positioning

### Sheet

### Popover

### Tooltip

### Hover Card

### Context Menu

### Dialog

---

## Blocks System <Badge>feat</Badge>

Introduced the **Blocks** system with view pages for full-page component demos.

- Added **signup-1** authentication block with assets
- Added block viewer with toolbar for code/preview toggle
- Added calendar, dashboard, and sidebar example blocks
- Each block has a dedicated full-screen view page at `/view/[name]`

### Calendar

### Sidebar

---

## Docs Site <Badge variant="outline">docs</Badge>

- Added **charts** section with layout, pages, and registry integration
- Added cards showcase and restructured component docs
- Enhanced layout, navigation, and command menu
- Added sitemap and SEO configs with **JSON-LD** structured data
- Added favicon sets for light and dark modes
- Added structured metadata for search engines

---

## CLI Init and Theme Commands <Badge>feat</Badge>

- Added `template` command to `@gentleduck/cli` for scaffolding new projects
- Updated theme JSONs and preflight config handling
- Completed `init` and enhanced `add` commands

---

## New Documentation <Badge variant="outline">docs</Badge>

- Added [CLI docs](/www/packages/duck-cli) with init, add, and template commands
- Added resizable component docs
- Added package docs for [duck-lazy](/www/packages/duck-lazy), [duck-variants](/www/packages/duck-variants), and [duck-vim](/www/packages/duck-vim)
- Set up **changesets** for automated package versioning

---

## Component Updates <Badge variant="outline">fix</Badge>

- Fixed sheet and dialog layout overflow issues
- Fixed block code copy functionality
- Fixed GitHub link in docs header
- Cleaned up legacy UI components and old examples