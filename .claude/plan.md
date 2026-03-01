# Codebase Inconsistency Fixes

## Summary
Recent commits (`3d549e53`, `f2c0fd48`, etc.) removed non-ASCII characters from duck-cli and registry-build packages, but the same patterns remain in other parts of the codebase. There are also typos and a regex using raw Arabic characters instead of Unicode escapes.

## Fixes

### 1. Arabic Unicode in regex - use Unicode escape sequences
**File:** `packages/duck-libs/src/index.ts:11`
- Replace raw Arabic chars in regex with Unicode escapes: `/[^\u0623-\u064Aa-zA-Z0-9-]/g`

### 2. Typos in code
**File:** `packages/duck-cli/src/utils/registry-mutation/registry-mutation.lib.ts`
- Line 23: `chekck` -> `check`
- Line 162: parameter `foce` -> `force` (also update usage on line 228)

### 3. En-dashes/em-dashes in active source files
Replace Unicode dashes with ASCII `--` in these files:
- `packages/registry-examples-duckui/src/navigation-menu/navigation-menu-1.tsx`
- `packages/_default/internal/sink/components/hover-card-demo.tsx`
- `apps/benchmark/src/example/hover-card.tsx`
- `apps/benchmark/src/duck/hover-card/hover-card.tsx`
- `apps/benchmark/src/duck/hover-card/duck.tsx`
- `apps/duck-ui-docs/app/(app)/hack/hack.tsx`

### 4. NOT changing (out of scope)
- **Mac keyboard symbols** (command, shift, option, etc.) in shortcut UI components - these are standard UI display characters that users expect to see
- **Emojis in sidebar demo data** (`_default/internal/sidebar-*.tsx`, `registry-blocks-duckui/src/sidebar/`) - these are UI content meant for display
- **Files in legacy directories** (`_oldstuff_refactor/`, `___/`) - not active code
- **Generated files** (`.velite/`, `.next/`) - auto-generated
