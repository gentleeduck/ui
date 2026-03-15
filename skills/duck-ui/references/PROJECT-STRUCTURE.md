# Project Structure Reference

## Monorepo Layout

```
duck-ui/
├── apps/
│   └── duck-ui-docs/          # Next.js docs site (ui.gentleduck.org)
├── packages/
│   ├── duck-cli/              # @gentleduck/cli — project scaffolding and component installer
│   ├── duck-docs/             # @gentleduck/docs — shared docs kit (header, nav, MDX, velite)
│   ├── duck-hooks/            # @gentleduck/hooks — React utility hooks
│   ├── duck-lazy/             # @gentleduck/lazy — lazy loading and virtualized images
│   ├── duck-libs/             # @gentleduck/libs — cn(), filteredObject, groupArray, parseDate
│   ├── duck-motion/           # @gentleduck/motion — animation tokens, reduced motion, WAAPI
│   ├── duck-primitives/       # @gentleduck/primitives — headless a11y-first primitives
│   ├── duck-state/            # @gentleduck/state — atom-based state management
│   ├── duck-variants/         # @gentleduck/variants — cva() variant system
│   ├── duck-vim/              # @gentleduck/vim — keyboard command engine
│   ├── duck-shortcut/         # @gentleduck/shortcut — (deprecated, use vim)
│   ├── duck-benchmark/        # @gentleduck/benchmark — performance benchmarks
│   ├── duck-extension/        # @gentleduck/duck-extension — browser extension
│   ├── registers/             # @gentleduck/registers — component registry schemas
│   ├── registry-ui/           # @gentleduck/registry-ui — styled Tailwind components
│   ├── registry-blocks/       # @gentleduck/registry-blocks — full-page block compositions
│   ├── registry-examples/     # @gentleduck/registry-examples — component usage examples
│   ├── registry-internals/    # @gentleduck/registry-internals — internal registry helpers
│   └── registry-build/        # @gentleduck/registry-build — registry builder CLI
├── tooling/
│   ├── tsdown/                # @gentleduck/tsdown-config — shared tsdown build configuration
│   ├── typescript/            # @gentleduck/typescript-config — shared tsconfig
│   ├── biome/                 # @gentleduck/biome-config — shared biome config
│   └── vitest/                # @gentleduck/vitest-config — shared vitest config
├── templates/
│   └── acme/                  # Full monorepo template (used by cli --template acme)
├── skills/                    # Agent skills for AI assistants
├── turbo.json                 # Turborepo task config
├── biome.json                 # Biome linter/formatter config
└── package.json               # Root workspace config with catalogs
```

## Build System

- **Bundler**: tsdown (rolldown-based, config in tooling/tsdown/)
- **Package manager**: bun 1.3.5
- **Monorepo**: bun workspaces + Turborepo
- **Linter/Formatter**: Biome
- **Testing**: vitest (packages), bun test (some packages)
- **Types**: TypeScript 5.9.3, strict mode
- **CSS**: Tailwind CSS v4 with CSS custom properties
- **Docs**: Next.js + velite + MDX
- **CI/CD**: GitHub Actions (publish.yml uses changesets)

## Versioning and Publishing

- **Changesets** for version management
- `bun run version-packages` to apply changesets
- `bunx changeset publish` to publish to npm
- All packages under `@gentleduck/` scope on npm
- Public access, MIT license
```
