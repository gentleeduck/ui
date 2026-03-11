# acme/ui

A Bun-based monorepo for the acme/ui component system, docs, and related tooling.

## Documentation
- Docs app: `apps/acme-docs`
- GitHub: https://github.com/acme/acme-ui

## Workspace Matrix

### Apps

| Path | Package | Role | Status |
| --- | --- | --- | --- |
| `apps/acme-docs` | `@acme/docs` | Public docs site | Active |

### Packages

| Path | Package | Role | Status |
| --- | --- | --- | --- |
| `packages/ui` | `@acme/ui` | UI component library | Active |

### Tooling Packages

| Path | Package | Role | Status |
| --- | --- | --- | --- |
| `tooling/biome` | `@acme/biome-config` | Shared Biome config | Internal |
| `tooling/github` | `@acme/github` | GitHub/project automation support | Internal |
| `tooling/tailwind` | `@acme/tailwind-config` | Shared Tailwind config | Internal |
| `tooling/tsdown` | `@acme/tsdown-config` | Shared `tsdown` config | Internal |
| `tooling/typescript` | `@acme/typescript-config` | Shared TypeScript config | Internal |
| `tooling/vitest` | `@acme/vitest-config` | Shared Vitest config | Internal |
| `tooling/bash` | `bash` | Shell utilities and misc scripts | Internal |

## Getting Started
```bash
git clone https://github.com/acme/acme-ui.git
cd acme-ui
bun install
```

## Run a Single App
```bash
bun --filter @acme/docs dev
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
