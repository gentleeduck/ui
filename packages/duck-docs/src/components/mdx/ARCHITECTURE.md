# MDX Architecture

This directory contains the runtime rendering layer for docs MDX content.

## Key Modules

1. `mdx.tsx`
- Thin public entrypoint.
- Compiles MDX runtime code and renders it with the composed component registry.

2. `mdx-runtime.ts`
- Runtime loader helper (`useMDXComponent`).
- Keeps `new Function(...)` handling isolated from UI component composition.

3. `mdx-components-registry.ts`
- Final composed MDX component map.
- Merges base content components and UI-facing primitives.

4. `mdx-components-base.tsx`
- Core markdown/mdx renderers (typography, code/pre, table, tabs, callouts, media).
- Includes MDX-specific wrappers (`pre`, `Steps`, `Step`, etc.).

5. `mdx-components-ui.tsx`
- Optional UI primitives exposed directly in MDX content.
- Keeps registry-ui dependencies isolated from base markdown semantics.

6. `mdx-components/`
- Leaf render components used by the base registry.
- `code/pre-block/` is organized for maintainable command/code block behavior.

7. `src/styles/mdx*.css`
- `mdx.css` is a compatibility barrel file.
- Style layers are split into:
  - `mdx-base.css`
  - `mdx-typography.css`
  - `mdx-code.css`
  - `mdx-extensions.css`

## Velite/Rehype Metadata Flow

Plugin metadata is typed in `src/types/mdx-runtime.ts` and applied by:
- `src/velite/plugins/metadata-plugin.ts`
- `src/velite/plugins/rehype-pre-block-source.ts`
- `src/velite/plugins/rehype-npm-command.ts`

Use `hast-properties.ts` helpers when adding new plugin metadata to avoid ad hoc object shape mutations.

## Extension Rules

1. Add new MDX-level visual behavior in `mdx-components-base.tsx` unless it is a generic UI primitive.
2. Add UI primitives in `mdx-components-ui.tsx`, then compose via registry.
3. Keep `mdx.tsx` thin; avoid adding renderer internals there.
4. Any new plugin metadata must be represented in `src/types/mdx-runtime.ts` first.

## Testing Conventions

1. Keep plugin/AST tests in `tests/velite/plugins/**`.
2. Keep runtime component composition tests in `tests/components/mdx/**`.
3. Validate package sources with `bun run check-types`.
4. Validate tests with `bun run check-types:test`.
5. Execute runtime regressions with `bun run test`.
