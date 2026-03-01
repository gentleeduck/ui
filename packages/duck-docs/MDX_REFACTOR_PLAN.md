# MDX Module Refactor Plan

## Scope
Refactor the MDX rendering and plugin pipeline in `@gentleduck/docs` to improve:
- type safety
- module boundaries
- maintainability
- testability
- contributor onboarding

Target area:
- `src/components/mdx/**`
- `src/velite/**`
- `src/styles/mdx.css` (and split follow-up files)
- related types under `src/types/**`

## Current Baseline

### Strengths
- Rendering stack is centralized in `src/components/mdx/mdx.tsx`.
- Velite pipeline is already configurable in `src/velite/config.ts`.
- Code block handling has started modularization via `code/pre-block/`.

### Pain Points
1. `mdx.tsx` acts as a composition and implementation hub at the same time.
2. Plugin-to-component metadata flow relies on ad hoc `__*` properties with weak shared contracts.
3. `mdx.css` is broad and hard to reason about for component-specific behavior.
4. No dedicated regression suite for MDX AST transforms and runtime rendering contracts.
5. Naming consistency and plugin typing can be improved (`rhype*` typo + generic `any` paths).

## Refactor Goals
1. Introduce a typed MDX metadata contract used by both rehype plugins and runtime components.
2. Reduce accidental coupling between AST transforms and UI rendering.
3. Make code-block rendering easy to extend without reintroducing monolith files.
4. Add predictable test coverage for AST and render output.
5. Keep behavior stable while improving internals incrementally.

## Delivery Strategy
Use small, safe phases with acceptance checks in each phase.

### Phase 1: Contracts and Safety (in progress)
Deliverables:
1. Add shared MDX runtime metadata types under `src/types`.
2. Replace ad hoc plugin metadata writes with typed helper usage.
3. Align `pre-block` prop typing with shared metadata contract.
4. Remove obvious `any` usage in MDX metadata plugin path.

Acceptance:
1. `bun run check-types` passes in `packages/duck-docs`.
2. No behavior change in regular code blocks.
3. No new runtime dependencies.

### Phase 2: Runtime Decomposition
Deliverables:
1. Split `mdx.tsx` into composition-focused modules:
   - component registry composer
   - default typography components
   - UI extension components
2. Keep one thin public `Mdx` entrypoint.

Acceptance:
1. Existing docs pages render the same.
2. Imports become easier to scan and maintain.

### Phase 3: Plugin Architecture Cleanup
Deliverables:
1. Normalize plugin naming and export conventions.
2. Introduce a utility for typed property reads/writes on hast nodes.
3. Explicit plugin ordering rationale in `src/velite/config.ts`.

Acceptance:
1. AST metadata contract is traceable and typed end-to-end.
2. Reduced plugin duplication.

### Phase 4: Style Layering
Deliverables:
1. Split `src/styles/mdx.css` into:
   - `mdx-base.css`
   - `mdx-typography.css`
   - `mdx-code.css`
   - `mdx-extensions.css`
2. Keep `mdx.css` as an import barrel.

Acceptance:
1. CSS responsibilities are clear by file.
2. No visual regressions in docs code blocks and typography.

### Phase 5: Test Suite
Deliverables:
1. Add unit tests for metadata parsing/transforms.
2. Add snapshot tests for transformed code/pre blocks.
3. Add targeted runtime tests for `PreBlock` and MDX component composition.

Acceptance:
1. Contract-level regressions are caught in CI.
2. Refactor confidence increases for future plugin work.

### Phase 6: Performance and DX
Deliverables:
1. Remove unused MDX map imports.
2. Audit expensive plugin work and avoid repeated parsing.
3. Add contributor notes for MDX architecture and extension points.

Acceptance:
1. No regressions in build time.
2. Lower onboarding time for MDX/plugin changes.

## Risks and Controls
1. Risk: subtle docs rendering regressions.
Control: phase-by-phase rollouts + snapshots + scoped checks.

2. Risk: plugin contract drift.
Control: one shared type source and typed helpers.

3. Risk: broad CSS changes causing layout shifts.
Control: split CSS after contracts stabilize and validate by page set.

## Execution Log
- 2026-03-01: Plan created.
- 2026-03-01: Phase 1 started (typed metadata contract + plugin/type alignment).
- 2026-03-01: Added `src/types/mdx-runtime.ts` and wired shared metadata types through `unist`, `metadata-plugin`, `rehype-pre-block-source`, `rehype-npm-command`, and `pre-block` props.
- 2026-03-01: Phase 2 started by splitting `mdx.tsx` into `mdx-runtime`, `mdx-components-base`, `mdx-components-ui`, and `mdx-components-registry` with `Mdx` kept as a thin entrypoint.
- 2026-03-01: Added typed plugin property helpers (`hast-properties.ts`) and integrated them into metadata/npm/pre-block rehype plugins.
- 2026-03-01: Added initial plugin tests (`metadata-utils`, `rehype-npm-command`) and strict MDX component registry map typing scaffolding.
- 2026-03-01: Added `rehypeMetadataPlugin` naming fix with compatibility alias, clarified rehype plugin phase ordering in config, and added `@gentleduck/docs` package-level test script.
- 2026-03-01: Introduced `mdx-components/typography.tsx` alias and switched new composition modules to the corrected import path while keeping backward compatibility.
- 2026-03-01: Added `src/components/mdx/ARCHITECTURE.md` contributor guide for runtime composition boundaries and plugin metadata extension rules.
- 2026-03-01: Split `src/styles/mdx.css` into layered files (`mdx-base.css`, `mdx-typography.css`, `mdx-code.css`, `mdx-extensions.css`) and kept `mdx.css` as a barrel.
- 2026-03-01: Fixed build entry hygiene by excluding both `__test__` and `__tests__` from `tsdown` entries to prevent test artifacts in publish output.
- 2026-03-01: Moved plugin tests from `src/**/__tests__` to `tests/**` to keep publish/build artifacts source-only.
- 2026-03-01: Tightened MDX runtime typing via `CompiledMdxComponent` and explicit `MdxComponentMap` contract in `useMDXComponent`.
- 2026-03-01: Added test compile target (`tsconfig.test.json`) and package script `check-types:test` for typed validation of `tests/**`.
- 2026-03-01: Added regression coverage for `rehypePreBlockSource` and MDX registry composition (`tests/velite/plugins/rehype-pre-block-source.test.ts`, `tests/components/mdx/mdx-components-registry.test.ts`).
- 2026-03-01: Removed remaining `any` cast from `PreBlock` theme forwarding via explicit `'data-theme'` prop typing in pre-block types.
- 2026-03-01: Re-ran package validations successfully: `bun run check-types`, `bun run check-types:test`, and `bun run build`.
- 2026-03-01: Replaced `bunx vitest` test execution with Bun-native tests (`bun run test`) for reliable no-network/no-temp-install workflow in this workspace.
- 2026-03-01: Added runtime MDX regressions for `useMDXComponent` and `PreBlock` rendering branches (`tests/components/mdx/mdx-runtime.test.tsx`, `tests/components/mdx/pre-block.test.tsx`).
- 2026-03-01: Removed `@ts-ignore`/`@ts-expect-error` paths in `component-preview.tsx` by introducing typed element guards for code-fragment extraction.
- 2026-03-01: Re-ran package validations successfully: `bun run check-types`, `bun run check-types:test`, `bun run test`, and `bun run build`.
