# @gentleduck/registers

## 0.4.1

### Patch Changes

- 95dbbce: Standardize README headers across all packages: centered logo, h1, tagline, nav links, and npm badges (matching the @duck-md template). Replace per-repo `*.gentleduck.org` subdomain refs with path-based `gentleduck.org/duck-<name>` URLs. No runtime code changes.

## 0.4.0

### Minor Changes

- 7d6fb7b: Registry constant exports renamed to camelCase convention.

## 0.3.5

### Patch Changes

- 0f4f2e2: Registered typography as a new component in the UI registry. Wired typography-examples registry dependency.

## 0.3.4

### Patch Changes

- 2b6e8d0: Resolve all biome lint warnings, improve type safety, and add test coverage across the monorepo.

## 0.3.3

### Patch Changes

- efb94d8: fix: add missing component dependencies (primitives, lucide-react) to registry entries

## 0.3.2

### Patch Changes

- 7c2aa88: Update dependencies and publish unpublished packages

## 0.3.1

### Patch Changes

- c9bbef8: Documentation and style updates.

## 0.3.0

### Minor Changes

- ad86755: Add internal registry support, expand theme system, and update component definitions.

  **Features:**

  - Add internal registry support for primitive component wrappers
  - Add shared direction API for RTL/LTR support across primitives and registry
  - Add sidebar blocks 01-16 with full registry infrastructure
  - Add new color themes: amber, purple, and teal
  - Update component registry definitions and generated JSON manifests

  **Fixes:**

  - Update warning-foreground color in registry color definitions for better contrast
  - Migrate duckui registry packages to new structure

## 0.2.0

### Minor Changes

- 36f9364: Add json-editor component with inline, sheet, and popover editing modes for JSON data with validation. Includes registry entries and three example demos.

## 0.1.1

### Patch Changes

- df94032: Initial public release of registry schema, color definitions, and component registry manifests.
