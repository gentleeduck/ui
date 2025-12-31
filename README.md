<p align="center">
  <img src="./apps/www/public/og/root.png" alt="Duck UI Logo" width="800"/>
</p>

# @gentleduck/ui

Gentleduck UI is the core monorepo for the Gentleduck ecosystem that serves only the front-end
developers to shipt their applications more quickly and with less effort.
 
## Documentation
- Website: https://www.gentleduck.org
- GitHub: https://github.com/gentleeduck/duck-ui

## What's in the Repo
### Apps
- `apps/duck-ui-docs` – UI docs site (components, blocks, charts, themes)
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

## Getting Started
```bash
git clone https://github.com/gentleeduck/duck-ui.git
cd duck-ui
pnpm install
```

## Run a Single App
```bash
pnpm --filter @gentleduck/ui-docs dev
pnpm --filter @gentleduck/gen-docs dev
```

## Contributing
We welcome contributions. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## License
MIT. See [`LICENSE`](./LICENSE) for more information.
