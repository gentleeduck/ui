<p align="center">
  <img src="./public/og/root.png" alt="gentleduck/ui" width="800"/>
</p>

# @gentleduck/ui-docs

Next.js documentation site for gentleduck/ui. Covers components, blocks, charts, themes, and registry-powered previews.

## Stack
- Next.js App Router
- `@gentleduck/docs` (shared docs kit)
- Velite (MDX pipeline)
- Registry tooling for component previews

## Quick Start
```bash
bun --filter @gentleduck/ui-docs dev:docs
bun --filter @gentleduck/ui-docs dev
```

## Scripts
- `bun --filter @gentleduck/ui-docs dev` - run the dev server
- `bun --filter @gentleduck/ui-docs build` - production build
- `bun --filter @gentleduck/ui-docs start` - serve the build
- `bun --filter @gentleduck/ui-docs dev:docs` - watch/generate MDX content
- `bun --filter @gentleduck/ui-docs build:docs` - one-time MDX build
- `bun --filter @gentleduck/ui-docs build:reg` - rebuild the UI registry and format output
- `bun --filter @gentleduck/ui-docs lint` - lint

## Environment
- `.env` is optional; see `.env.example` for defaults.
- Registry build inputs and output paths live in [registry-build.config.ts](/run/media/wildduck/duck/wildduck/@duck/@duck-ui/apps/duck-ui-docs/registry-build.config.ts), not in `.env`.
