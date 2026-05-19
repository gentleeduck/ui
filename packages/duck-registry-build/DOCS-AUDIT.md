# Registry-Build Documentation Audit

Audited: 2026-03-10
Resolved: 2026-03-11
Source: `packages/registry-build/src/`
Docs: `apps/duck-ui-docs/content/docs/packages/duck-registry-build/`

All issues below have been fixed.

---

## Critical

### 1. `cli.mdx`  -  Ghost CLI flags [FIXED]

Removed `--no-index` and `--no-components` from the flags table. These never existed in the source.

---

## Moderate

### 2. `configuration.mdx`  -  Missing `baseLayerRules` in `cssTemplates` [FIXED]

Added `baseLayerRules` to the `cssTemplates` code example.

### 3. `configuration.mdx`  -  Missing default `ignore` patterns for `sources` [FIXED]

Added default ignore patterns `['**/__test__/**', '**/*.test.*', '**/*.spec.*']` to the sources table.

### 4. `extensions.mdx`  -  Missing default `stage` value [FIXED]

Noted that `afterBuild` is the default when `stage` is omitted.

### 5. `getting-started.mdx`  -  Missing spread syntax for `uiRegistryPreset()` [FIXED]

Updated references to show `...uiRegistryPreset()` spread syntax.

### 6. `performance.mdx`  -  Vague parallelism default [FIXED]

Documented exact formula: `Math.max(1, Math.min(cpuCount, 8))`.

---

## Minor

### 7. `configuration.mdx`  -  Missing `branding` field table/defaults [FIXED]

Added field table with types and defaults (`name` -> `'@gentleduck/registry-build'`, `font` -> `'ANSI Shadow'`).

### 8. `index.mdx`  -  Diagram inaccuracy [FIXED]

Clarified that compatibility normalization happens during config resolution, not as a separate pipeline stage.

### 9. `architecture.mdx`  -  Diagram inaccuracy [FIXED]

Changed "Build summary" to "Return build result to CLI" to reflect that it's CLI-layer formatting, not a pipeline step.

### 10. `extensions.mdx`  -  Incomplete `componentIndexExtension` example [FIXED]

Added `header` and `generator` options to the inline example.

### 11. `course.mdx`  -  Misleading phrasing [FIXED]

Changed "core phases be disabled" to "extensions be omitted from the extensions array".
