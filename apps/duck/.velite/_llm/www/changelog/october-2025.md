## CLI Launch <Badge>feat</Badge>

Introduced `@gentleduck/cli` for UI component management.

- Initialize with `npx @gentleduck/cli init`
- Add components with `npx @gentleduck/cli add button kbd field`
- Handled mismatched alias between `duck-ui.config` and `tsconfig`
- Published to npm as `@gentleduck/cli`

See the full [CLI docs](/www/packages/duck-cli).

---

## New Components <Badge>feat</Badge>

### Kbd

### Empty

### Field

### Item

### Input Group

Also added:

- `useCopyToClipboard` hook
- "Who I Am" and "FAQs" pages

---

## Registry Overhaul <Badge variant="outline">chore</Badge>

- Populated registry with new UI components, examples, and blocks
- Standardized registry entries and refined UI components
- Unified component border and rounding logic across primitives
- Fixed various bugs and enhanced API type inference
- Added auto-index script for registry entries