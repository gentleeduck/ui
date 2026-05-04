## Rebrand to gentleduck/ui 

---

## Sidebar Overhaul 

See the full [chart docs](/www/components/chart) for all chart types and examples.

---

## JSON Editor <Badge>feat</Badge>

Added a new `json-editor` component to the UI registry with inline/sheet, popover, and callback expand modes.

### JSON Editor

- Full docs at [/www/components/json-editor](/www/components/json-editor) with installation, usage, examples, and API reference
- Portaled discard confirmation dialog for better z-index handling
- Registry dependencies: `alert-dialog`, `button`, `popover`, `field`, and `sheet`

---

## Preview Panel <Badge>feat</Badge>

Added `preview-panel` component to the registry for side-by-side content previews.

### Preview Panel

---

## Documentation Overhaul <Badge variant="outline">docs</Badge>

Completed a comprehensive documentation rewrite covering every component and package page:

- API props normalization across all **57 component pages** with formal prop tables
- **Philosophy** sections on every component and package page
- **Mermaid diagrams** on 50+ pages  -  composition diagrams and "How It's Built" dependency diagrams
- Contextual icons on all Callout blocks
- Cross-links between related components (Dialog links to Sheet and Drawer, Toggle links to Toggle Group, etc.)
- Structured documentation for all **9 core packages**

All core packages now have structured docs with architecture diagrams, philosophy sections, and API overviews. See the [Core Packages](/www/packages/duck-cli) sidebar section.

---

## Radio Group and Pagination Sync <Badge>feat</Badge>

- Updated `radio-group` keyboard behavior to track group-level navigation keys (<Kbd>Arrow</Kbd>, <Kbd>Home</Kbd>/<Kbd>End</Kbd>, <Kbd>PageUp</Kbd>/<Kbd>PageDown</Kbd>) for focus-driven selection
- Added `radio-group` typeahead and Vim-style navigation (`a-z`, `gg`, `G`) when the group or its items are focused
- Migrated `pagination` registry internals to `@gentleduck/primitives/pagination` with direction-aware wrapper controls
- Switched docs app sans font from `Montserrat` to `Geist`

### Radio Group

### Pagination

---

## Registry Fixes <Badge variant="outline">fix</Badge>

Fixed component dependency declarations in `registry-ui.ts` and `registry-examples.ts`:

- **Combobox**  -  Added missing registry entry with correct dependencies
- **Resizable**  -  Added missing `react-resizable-panels` dependency
- **Hover Card**  -  Fixed typo in `@gentleduck/libs` dependency
- **Button Group**  -  Added missing `separator` registry dependency
- **Badge**  -  Added missing `@gentleduck/primitives` dependency
- **Alert Dialog**  -  Added missing `@gentleduck/motion` dependency
- **Item**  -  Added missing `@gentleduck/primitives` dependency
- **Checkbox examples**  -  Fixed empty registry dependencies
- **Combobox examples**  -  Fixed registry dependencies to reference `combobox`
- **Theme Toggle**  -  Fixed malformed empty-string dependency

---

## Build and Infrastructure <Badge variant="outline">chore</Badge>

- Migrated from pnpm to **Bun** as the package manager
- Moved `duck-gen-docs`, `duck-query`, `duck-skitch`, and `duck-ttest` to the `duck-gen` monorepo
- Fixed Recharts v3 types and static view pages
- Corrected all GitHub URLs from `gentleeduck/ui` to `gentleeduck/duck-ui`
- Improved mermaid block rendering and ordered-list indentation in docs
- Added `@types/node` v25 and primitives dependencies
- Set docs dev server to port 3008
- Regenerated sitemap