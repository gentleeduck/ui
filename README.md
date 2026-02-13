<p align="center">
  <img src="./apps/duck-ui-docs/public/og/root.png" alt="duck-ui logo" width="800"/>
</p>

# duck-ui

duck-ui is a Bun-based monorepo for the duck-ui component system, docs, and related tooling.
 
## Documentation
- Docs app: `apps/duck-ui-docs`
- GitHub: https://github.com/gentleeduck/duck-ui

## What's in this repo
### Apps
- `apps/duck-ui-docs` – component docs site (components, blocks, charts, themes)
- `apps/duck-gen-docs` – Duck Gen docs site

### Packages (Selected)
- `packages/duck-docs` – shared docs app kit used by the docs apps
- `packages/registry-ui-duckui` – UI components
- `packages/registry-blocks-duckui` – blocks and layouts
- `packages/registry-examples-duckui` – examples used in docs
- `packages/duck-libs` – utilities
- `packages/duck-hooks` – React hooks
- `packages/duck-motion` – motion primitives
- `packages/duck-variants` – class/variant helpers
- `packages/duck-vim` – keybinding engine
- `packages/duck-lazy` – lazy-loading utilities

### Published packages (npm)
- `@gentleduck/benchmark` – benchmarking tool for Duck UI components
- `@gentleduck/cli` – CLI to add components and bootstrap integrations
- `@gentleduck/gen` – type-safe API and message generator (NestJS-tested)
- `@gentleduck/hooks` – React hooks
- `@gentleduck/lazy` – lazy-loading utilities
- `@gentleduck/libs` – utilities and helpers
- `@gentleduck/motion` – motion primitives
- `@gentleduck/primitives` – headless UI primitives
- `@gentleduck/query` – type-safe Axios client
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
bun --filter @gentleduck/gen-docs dev
```

## Contributing
We welcome contributions. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## License
MIT. See [`LICENSE`](./LICENSE) for more information.
