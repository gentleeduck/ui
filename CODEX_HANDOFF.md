# Duck UI Monorepo — Codex Handoff Report

## Repo Location
`/run/media/wildduck/duck/wildduck/@duck/@duck-ui`

## Branch
`master` — all changes are uncommitted on the working tree.

## Monorepo Structure
- **Package manager:** Bun 1.3.5
- **Build system:** Turbo
- **Linter/formatter:** Biome 2.4.6
- **Test runners:** `bun test` (most packages), vitest (duck-cli, duck-vim)
- **TypeScript:** 5.9.3, strict mode repo-wide

## Agent Results Summary

10 agents were launched. Only 2 completed before rate limits hit:

| Agent | Package | Status | Result |
|-------|---------|--------|--------|
| duck-libs tests | `packages/duck-libs/` | **DONE** | 50 tests, all passing across 6 files |
| duck-state tests | `packages/duck-state/` | **RATE LIMITED** | Needs test suite |
| duck-variants tests | `packages/duck-variants/` | **RATE LIMITED** | Needs `describe.skip()` removed |
| duck-hooks tests | `packages/duck-hooks/` | **RATE LIMITED** | Needs test suite |
| duck-motion tests | `packages/duck-motion/` | **RATE LIMITED** | Needs test suite |
| duck-lazy tests | `packages/duck-lazy/` | **RATE LIMITED** | Needs test suite |
| duck-extension TS fix | `packages/duck-extension/` | **RATE LIMITED** | 6 TS errors in App.tsx |
| duck-primitives cleanup | `packages/duck-primitives/` | **RATE LIMITED** | Remove layer/, fix TODO |
| registry-ui cleanup | `packages/registry-ui/` | **RATE LIMITED** | _old/ folder deprecation |
| duck-shortcut + emoji | Both packages | **RATE LIMITED** | Usage assessment needed |

## What Still Needs To Be Done

### High Priority — Tests (packages with 0 test coverage)

1. **`packages/duck-state/`** — Add comprehensive test suite:
   - `src/__tests__/atom.test.ts`: primitive atoms, derived read-only, writable derived
   - `src/__tests__/store.test.ts`: get/set, dependency tracking, invalidation, subscribers, shallow equality
   - `src/__tests__/react.test.ts`: useAtomValue, useSetAtom, useAtom, Provider
   - Add `"test": "bun test"` to package.json scripts
   - Use `import { describe, test, expect } from 'bun:test'`

2. **`packages/duck-variants/`** — Enable skipped tests:
   - Remove `describe.skip()` from `test/cva-v2.test.ts` and `test/cva.test.ts`
   - Fix any failing tests (API may have changed)
   - Add tests for: compound variants, default variants, memoization, edge cases

3. **`packages/duck-hooks/`** — Add test suite for 8 hooks:
   - useDebounce, useComposedRefs, useComputedTimeoutTransition, useCopyToClipboard
   - useIsMobile, useMediaQuery, useOnOpenChange, useStableId
   - Create `src/__tests__/` directory

4. **`packages/duck-motion/`** — Add tests:
   - Easing/duration tokens validation
   - CSS variable names
   - motionTransition() output
   - prefersReducedMotion() with mocks

5. **`packages/duck-lazy/`** — Add tests:
   - Mock IntersectionObserver
   - useLazyLoad/useLazyImage hook behavior
   - Cleanup on unmount

6. **`packages/duck-benchmark/`** — Add DuckTable tests:
   - Filtering, sorting, pagination
   - Row CRUD, dirty tracking
   - Snapshot/hydrate, event system

### High Priority — TypeScript Fixes

7. **`packages/duck-extension/src/App.tsx`** — Fix 6 TS errors:
   - Line ~138: `Type '{}' missing properties from 'string[]'` → use `[] as string[]`
   - Line ~142: `'{}' not assignable to 'SetStateAction<Record<string, Font>>'` → use proper empty value
   - Line ~143: `'{}' not assignable to 'SetStateAction<string[]>'` → use `[] as string[]`
   - Lines ~187, ~217, ~248: `'number | undefined' not assignable to 'number'` → add `?? 0`

### Medium Priority — Cleanup

8. **`packages/duck-primitives/src/layer/`** — Remove empty module:
   - Delete `src/layer/` directory (only has comment about removed hooks)
   - Remove any exports/references from barrel files
   - Verify build passes after removal

9. **`packages/duck-primitives/src/menu/sub-trigger.tsx:87`** — Resolve TODO about positioning logic

10. **`packages/registry-ui/src/_old/`** — Add deprecation:
    - Check if _old/ components are imported anywhere
    - Add `@deprecated` JSDoc tags
    - Remove re-exports from index files if unused

11. **`packages/duck-shortcut/`** — Assess and deprecate:
    - Check if imported anywhere in repo
    - Add deprecation notice recommending `@gentleduck/vim`

12. **`packages/duck-emoji/`** — Already excluded from workspaces:
    - Essentially empty (~2 LOC), already excluded in root package.json workspaces

### Medium Priority — Feature Completion

13. **`packages/duck-state/`** — After tests:
    - Async atom support (Promises with loading/error)
    - Batched notifications via `queueMicrotask`
    - `onMount`/`onUnmount` lifecycle hooks
    - Circular dependency detection

14. **`packages/registry-blocks/`** — Empty templates:
    - `src/dashboards/` needs dashboard templates
    - `src/blog/` needs blog layouts

15. **`packages/registry-build/main.ts`** — Replace `Record<string, any>` line ~60

### Low Priority — Documentation

16. **Add README.md per package**: duck-state, duck-hooks, duck-motion, duck-lazy, duck-vim

17. **Add JSDoc @example tags**: duck-hooks (8 hooks), duck-libs (6 utils), duck-motion (tokens)

18. **MCP improvements** (`apps/duck-ui-docs/app/api/mcp/server.ts`):
    - Inverted index for O(1) keyword lookup
    - Incremental indexing
    - Search result caching
    - Architecture README

### Low Priority — Docs App

19. **`apps/duck-ui-docs/`**:
    - `app/llms.txt/route.ts:8` — Add type: `let entries: Dirent[]`
    - Mermaid error boundary in duck-docs
    - Lazy-load Excalidraw

## Changes Already Made (Uncommitted)

### CI/CD
- `.github/workflows/main.yml` — Split into parallel jobs: setup → lint | build | test
- `.github/workflows/publish.yml` — Added caching, build step, npm registry-url

### Biome
- `biome.json` — `recommended: true`, `noExplicitAny: warn`, ~30 rules configured. 0 errors, 334 warnings.

### Package Fixes
- Renamed `packages/duck-extention/` → `packages/duck-extension/` (directory + all refs)
- `package.json` (root) — lucide-react catalog `0.562.0` → `0.576.0`, added sherif, excluded _oldstuff_refactor and duck-emoji from workspaces
- `apps/duck-ui-docs/package.json` — Moved ts-morph to devDependencies, fixed zod version

### TypeScript (~85 `any` eliminated across ~50 files)
- `packages/duck-state/` — `Atom<any>` → `Atom<unknown>` (6 instances)
- `packages/duck-primitives/` — Scope<C=any> kept (required for covariance), slot.tsx, hooks, navigation-menu all cleaned
- `packages/duck-primitives/src/hooks/use-controllable-state.tsx` — Fixed generic isFunction type guard
- 13 registry-examples — `zodResolver(schema as any)` → proper cast
- Many more (see git diff)

### Build Fixes
- `apps/duck-ui-docs/app/api/mcp/server.ts` — Fixed nullable indexed access (3 spots)
- `apps/duck-ui-docs/lib/get-registry-item.ts` — Fixed nullable files[0]?.path
- `apps/duck-ui-docs/lib/rehype-component.ts` — Fixed file vs array cast

### Tests Added
- `apps/duck-ui-docs/app/api/mcp/server.test.ts` — 45 unit tests for MCP
- `apps/duck-ui-docs/app/api/mcp/server.integration.test.ts` — 10 integration tests
- `packages/duck-libs/src/__tests__/` — 50 tests across 6 files (cn, filteredObject, groupArray, groupDataByNumbers, parseDate, generateArabicSlug)

### Auto-fixed by Biome
- 102+ files: unused imports removed, formatting, template literals

## Current Build Status
```
bun run build    → EXIT 0 (all 15 tasks pass)
bun run check    → EXIT 0 (0 errors, 334 warnings)
bun install      → Clean
```

## Key Commands
```bash
bun install                  # Install deps
bun run build                # Build all packages (turbo)
bun run check                # Biome lint + format check
bun run fix                  # Auto-fix biome issues
bun run test                 # Run all tests (turbo)
bun run check-types          # TypeScript type check
bunx biome check --write .   # Auto-fix safe issues
```

## Important Notes
- **Never** use `git add -A` — uncommitted changes across 100+ files
- `packages/_oldstuff_refactor/` — excluded from linting/building, do not touch
- `packages/___/` — excluded, do not touch
- Duck-cli tests have pre-existing failures (`vi.unstubAllGlobals is not a function`) — vitest/bun mismatch
- Test imports: `bun:test` for most packages, `vitest` for duck-cli and duck-vim
