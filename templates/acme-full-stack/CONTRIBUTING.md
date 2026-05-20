# Contributing to acme/ui

Thanks for the interest. This file covers the workflow + style.

## Repo layout

```
acme/
|- apps/duck-ui-docs/        public docs site, registry explorer
|- packages/registry-ui/     styled Tailwind components (source-exported)
|- packages/duck-primitives/ headless a11y-first primitives
|- packages/duck-cli/        CLI for scaffolding + adding components
|- packages/duck-variants/   cva() variant system
|- packages/duck-calendar/   headless calendar engine
|- packages/duck-motion/     motion tokens
|- packages/duck-vim/        keyboard command engine
|- packages/duck-state/      atom-based state
|- packages/duck-hooks/      React hooks
|- packages/duck-libs/       cn() + utilities
|- packages/duck-lazy/       lazy-loading helpers
|- packages/duck-docs/       shared docs app kit
|- tooling/                  shared biome / tsdown / typescript / vitest configs
`- skills/                   agent skills for AI coding assistants
```

## Build

```sh
bun install
bun run build
bun run test
```

## Pre-commit

Husky runs Biome checks automatically. Before pushing:

```sh
bun run check         # biome check
bun run check-types   # turbo run check-types
bun run test          # turbo run test
```

## Style

- TypeScript only. No semicolons, single quotes (Biome enforced).
- Use `cn()` from `@acme/libs/cn` for class merging.
- Use `cva()` from `@acme/variants` for variants.
- `React.forwardRef` with explicit generics; `displayName` on every
  component; `data-slot` on root elements.
- Import order: external libs, `@acme/*` packages, relative.
- Caveman-mode terse comments. No filler. Comments explain WHY, not
  WHAT.
- Conventional commit subjects: `kind(scope): subject`. Examples:
  `fix(button): resolve focus ring on safari`,
  `feat(calendar): add range selection`.

## Tests

Per-package `tests/*.test.ts(x)` for unit + integration. Vitest +
`@testing-library/react`. Run `bun run test` at the root to run the
full workspace.

## Adding a new component / primitive / hook

- Add source under the right package (`registry-ui`, `duck-primitives`,
  `duck-hooks`, etc.).
- Add a `displayName` and `data-slot` attribute on the root.
- Export from the package's barrel/index.
- Add a test.
- Add a docs page in `apps/duck-ui-docs/` if user-facing.
- Add a changeset (`bun changeset`) describing the change.

## PR checklist

- [ ] Tests pass: `bun run test`
- [ ] Biome clean: `bun run check`
- [ ] Types clean: `bun run check-types`
- [ ] Docs updated for user-facing changes
- [ ] Changeset added for published package changes
- [ ] No special chars in prose (em-dash, curly quotes, etc)

## Reporting bugs / requesting features

Open an issue at
[github.com/acme/acme/issues](https://github.com/acme/acme/issues).
For security issues, see [`SECURITY.md`](SECURITY.md).

## License

Contributions are licensed under MIT (see [`LICENSE`](LICENSE)) by
default.
