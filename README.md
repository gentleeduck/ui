<p align="center">
  <img src="./apps/duck-ui-docs/public/og/ui-home-67.png" alt="gentleduck/ui homepage snapshot (67%)" width="800"/>
</p>

# gentleduck/ui

A Bun-based monorepo for the gentleduck/ui component system, docs, and related tooling.
 
## Documentation
- Docs app: `apps/duck-ui-docs`
- GitHub: https://github.com/gentleeduck/duck-ui

## What's in this repo
### Apps
- `apps/duck-ui-docs` – component docs site (components, blocks, charts, themes)
### Packages (Selected)
- `packages/duck-docs` – shared docs app kit used by the docs apps
- `packages/registry-ui` – UI components
- `packages/registry-blocks` – blocks and layouts
- `packages/registry-examples` – examples used in docs
- `packages/duck-libs` – utilities
- `packages/duck-hooks` – React hooks
- `packages/duck-motion` – motion primitives
- `packages/duck-variants` – class/variant helpers
- `packages/duck-vim` – keybinding engine
- `packages/duck-lazy` – lazy-loading utilities

### Published packages (npm)
- `@gentleduck/benchmark` – benchmarking tool for gentleduck/ui components
- `@gentleduck/cli` – CLI to add components and bootstrap integrations
- `@gentleduck/hooks` – React hooks
- `@gentleduck/lazy` – lazy-loading utilities
- `@gentleduck/libs` – utilities and helpers
- `@gentleduck/motion` – motion primitives
- `@gentleduck/primitives` – headless UI primitives
- `@gentleduck/shortcut` – keyboard shortcut utilities
- `@gentleduck/variants` – class/variant helpers
- `@gentleduck/vim` – keybinding engine

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
```

## Contributing
We welcome contributions. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## License
MIT. See [`LICENSE`](./LICENSE) for more information.
