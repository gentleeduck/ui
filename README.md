<p align="center">
  <img src="./public/logo-dark.svg" alt="gentleduck/ui" width="120"/>
</p>

# gentleduck/ui

A Bun-based monorepo for the gentleduck/ui component system, docs, and related tooling.
 
## Documentation
- Docs app: `apps/duck-ui-docs`
- GitHub: https://github.com/gentleeduck/duck-ui

## Workspace Matrix

### Apps

| Path | Package | Role | Status |
| --- | --- | --- | --- |
| `apps/duck-ui-docs` | `@gentleduck/ui-docs` | Public docs site, registry explorer, MCP server | Active |
| `apps/benchmark` | `benchmark` | Standalone benchmark app | Standalone, excluded from default root workspace scripts |

### Published Packages

| Path | Package | Role | Status |
| --- | --- | --- | --- |
| `packages/duck-benchmark` | [`@gentleduck/benchmark`](https://www.npmjs.com/package/@gentleduck/benchmark) | Benchmarking package | Active |
| `packages/duck-calendar` | [`@gentleduck/calendar`](https://www.npmjs.com/package/@gentleduck/calendar) | Headless calendar engine with date adapter pattern (~5 KB) | Active |
| `packages/duck-cli` | [`@gentleduck/cli`](https://www.npmjs.com/package/@gentleduck/cli) | CLI for installing and updating duck-ui pieces | Active |
| `packages/duck-docs` | [`@gentleduck/docs`](https://www.npmjs.com/package/@gentleduck/docs) | Shared docs app kit | Active |
| `packages/duck-hooks` | [`@gentleduck/hooks`](https://www.npmjs.com/package/@gentleduck/hooks) | React hooks | Active |
| `packages/duck-lazy` | [`@gentleduck/lazy`](https://www.npmjs.com/package/@gentleduck/lazy) | Lazy-loading helpers | Active |
| `packages/duck-libs` | [`@gentleduck/libs`](https://www.npmjs.com/package/@gentleduck/libs) | Shared utility helpers | Active |
| `packages/duck-motion` | [`@gentleduck/motion`](https://www.npmjs.com/package/@gentleduck/motion) | Motion tokens and helpers | Active |
| `packages/duck-primitives` | [`@gentleduck/primitives`](https://www.npmjs.com/package/@gentleduck/primitives) | Accessibility-first unstyled primitives | Active |
| `packages/duck-shortcut` | [`@gentleduck/shortcut`](https://www.npmjs.com/package/@gentleduck/shortcut) | Legacy shortcut package | Deprecated, frozen in favor of `@gentleduck/vim` |
| `packages/duck-state` | [`@gentleduck/state`](https://www.npmjs.com/package/@gentleduck/state) | Lightweight state primitives | Active |
| `packages/duck-variants` | [`@gentleduck/variants`](https://www.npmjs.com/package/@gentleduck/variants) | Variant and class composition helpers | Active |
| `packages/duck-vim` | [`@gentleduck/vim`](https://www.npmjs.com/package/@gentleduck/vim) | Keyboard command engine | Active |
| `packages/registers` | [`@gentleduck/registers`](https://www.npmjs.com/package/@gentleduck/registers) | Registry schema and aggregate data exports | Active |
| `packages/registry-ui` | [`@gentleduck/registry-ui`](https://www.npmjs.com/package/@gentleduck/registry-ui) | Source exports for UI components | Active |

### Private / Internal Packages

| Path | Package | Role | Status |
| --- | --- | --- | --- |
| `packages/duck-extension` | `@gentleduck/duck-extension` | Browser extension experiments | Private, active |
| `packages/registry-blocks` | `@gentleduck/registry-blocks` | Registry block content | Private, active |
| `packages/registry-build` | `@gentleduck/registry-build` | Registry generation tooling | Private, active |
| `packages/registry-examples` | `@gentleduck/registry-examples` | Example source content | Private, active |
| `packages/registry-internals` | `@gentleduck/registry-internals` | Internal registry content | Private, active |
| `packages/types` | `@gentleduck/types` | Shared type-only package | Private, active |

### Tooling Packages

| Path | Package | Role | Status |
| --- | --- | --- | --- |
| `tooling/biome` | `@gentleduck/biome-config` | Shared Biome config | Internal |
| `tooling/github` | `@gentleduck/github` | GitHub/project automation support | Internal |
| `tooling/tailwind` | `@gentleduck/tailwind-config` | Shared Tailwind config | Internal |
| `tooling/tsdown` | `@gentleduck/tsdown-config` | Shared `tsdown` config | Internal |
| `tooling/typescript` | `@gentleduck/typescript-config` | Shared TypeScript config | Internal |
| `tooling/vitest` | `@gentleduck/vitest-config` | Shared Vitest config | Internal |
| `tooling/bash` | `bash` | Shell utilities and misc scripts | Internal |

### Archived / Planned

| Path | Package | Role | Status |
| --- | --- | --- | --- |
| `packages/_oldstuff_refactor` | `@duck-ui/oldstuff-refactor` | Archived refactor material | Archived, excluded from root workspace automation |
| `packages/duck-emoji` | `@gentleduck/emoji` | Planned emoji package | Placeholder, excluded from root workspace automation |

## Workspace Policy

- Root quality scripts target the active workspace graph only.
- Archived and placeholder packages stay in the repo for reference, but are excluded from root workspace automation.
- Deprecated published packages remain documented until they are formally removed from maintenance or npm distribution.

## Getting Started
```bash
git clone https://github.com/gentleeduck/duck-ui.git
cd duck-ui
bun install
```

## Run a Single App
```bash
bun --filter @gentleduck/ui-docs dev
```

## Common Workspace Commands
```bash
bun run dev          # run all workspace dev tasks
bun run build        # build all packages/apps
bun run test         # run tests across workspaces
bun run check        # biome checks
bun run check-types  # TypeScript type checks
bun run ci           # non-mutating repo verification (check, workspace lint, types, tests, build)
```

## Contributing
We welcome contributions. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## License
MIT. See [`LICENSE`](./LICENSE) for more information.
