# @gentleduck/vim

## 0.3.0

### Minor Changes

- 95638de: Audit-driven refactor across all 15 public packages. Closes type holes, hardens security boundaries, eliminates dead code, and dedups duplicated patterns.

  **Highlights**

  - `duck-docs` — CompiledMdxBody branded type gates `new Function(body)`; sanitizeSvg covers SMIL, unquoted javascript: URIs, nested script, CSS url(), bare iframe; code-preview tag + attr allowlists
  - `duck-registry-build` — safe-path containment at every fs sink; per-phase Zod cache schemas; JSON.stringify in generated TSX; cache manifest rejection on tamper
  - `duck-cli` — install pipeline path containment unified across add/init/update; env-var allowlist contract reconciled with one-time warning; aliases.ui regex validation
  - `duck-primitives` — `observe-element-rect` rAF loop guard (no leak when empty); `compose-ref` useCallback memo fix; popper forwardRef restored for R18 peer compat
  - `duck-hooks` — `useDebounce` is now a real hook (stable identity, unmount cleanup); `useStableId` delegates to React.useId (SSR-safe); `scheduleTransitionTimeout` rename strips two `useHookAtTopLevel` lint suppressions
  - `duck-lazy` — spread order fix restores the lazy swap; `next/image` moved behind `/lazy-image-next` subpath so non-Next consumers don't pull the peer
  - `duck-vim` — single document listener fans out to chord matcher + sequence manager; canonical modifier order; `requireReset` auto-clears for chord bindings; all three hook dep arrays corrected
  - `duck-variants` — `Props<T, D>` makes defaulted variant keys optional and non-defaulted required; bounded `preludeCache` LRU; second-layer `filter2` set eliminates last clone in hot path
  - `duck-ttest` — `predictates/` renamed to `predicates/`, twin dirs deleted, type-utility duplicates reconciled to canonical sources, `IsVoid` actually distinguishes void from undefined now
  - `duck-calendar` — `./*` wildcard export removed; falsy-zero `weekStartDay: 0` (Sunday) bug fixed; Gregorian helpers extracted; Hebrew `addMonths` uses Metonic cycle
  - `duck-libs` — `cnMemo` bounded LRU; `filteredObject` rejects typo keys at compile time; `parseDate` rejects ambiguous one-token inputs
  - `duck-query` — single AnyReq boundary cast replaces 14 `as any`; param regex escape; throws on unresolved `:tokens`
  - `registers` — schema tightened (`z.any()` removed); ~1000 LoC of identical block-registry boilerplate replaced with builders
  - `registry-ui` — `_audio` / `_upload` (~1.1K LoC) deleted; `motion-shell` HOC + `withMotion` collapses simple motion clones; `toDirection()` narrower replaces 52 `as IDirection.Kind` casts; chart `CSS_NAMED_COLORS` finite allowlist
  - `duck-motion` — refcounted body `pointer-events` ownership; easing/blur/duration token dedup; half of public exports were unused and removed

  Tests: 3133+ across the monorepo, all green. Type-checks clean across every project. No commits skipped hooks.

## 0.2.2

### Patch Changes

- 95dbbce: Standardize README headers across all packages: centered logo, h1, tagline, nav links, and npm badges (matching the @duck-md template). Replace per-repo `*.gentleduck.org` subdomain refs with path-based `gentleduck.org/duck-<name>` URLs. No runtime code changes.

## 0.2.1

### Patch Changes

- 918b34c: Strip `workspace:*` and `catalog:` protocol tokens from `devDependencies`/`dependencies`/`peerDependencies` of every public package before `changeset publish`. Previously published artifacts leaked these tokens into npm metadata, which broke strict resolvers (bun, deno) for downstream consumers. Adds `scripts/clean-publish.ts` and wires it into the root `release` script with a `git checkout` restore step so source remains workspace-friendly.

## 0.2.0

### Minor Changes

- 7d6fb7b: Namespace refactors: calendar react namespaces renamed to match hook names, hooks/lazy types moved into namespaces, libs utils extracted into own modules, vim react types collapsed into single Vim namespace.

## 0.1.18

### Patch Changes

- 32d0136: fix: use optional chain in parser for biome lint compliance

## 0.1.17

### Patch Changes

- 6f0e067: Standardize package exports to use explicit named exports, add `sideEffects` field and `types` export entries to package.json, and annotate internal APIs with `@internal` JSDoc tags.

## 0.1.16

### Patch Changes

- 2b6e8d0: Resolve all biome lint warnings, improve type safety, and add test coverage across the monorepo.

## 0.1.15

### Patch Changes

- 7c2aa88: Update dependencies and publish unpublished packages

## 0.1.14

### Patch Changes

- c9bbef8: Documentation and style updates.

## 0.1.13

### Patch Changes

- ad86755: Add comprehensive keyboard input processing pipeline and React integration hooks.

  **New Modules:**

  - Add platform detection module for OS-aware modifier key handling
  - Add key parser module for normalizing raw keyboard events into structured key objects
  - Add key matcher module for comparing parsed keys against registered bindings
  - Add format module for human-readable key combination display strings
  - Add sequence module for multi-key chord and sequence matching
  - Add recorder module for capturing and replaying key input sessions

  **React Integration:**

  - Add useVim and useKeySequence React hooks for declarative keybinding in components
  - Enhance KeyProvider with context-based keybinding registration and conflict detection
  - Enhance command module with options parameter and binding conflict detection

  **Maintenance:**

  - Align biome and tsconfig build info exclusions
  - Update package config, tsconfig, and README

## 0.1.12

### Patch Changes

- Fix TypeScript type exports and resolve type-only import issues affecting downstream consumers.

## 0.1.1

### Patch Changes

- Initial integration with gentleduck/ui monorepo. Set up package configuration, build pipeline, and core vim keybinding primitives.
