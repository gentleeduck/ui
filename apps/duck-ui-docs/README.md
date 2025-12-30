<p align="center">
  <img src="./public/og/root.png" alt="duck ui root" width="800"/>
</p>

# @gentleduck/duck-ui-docs

Next.js documentation site for Gentleduck UI. Covers components, blocks, charts, themes, and registry-powered previews.

## Stack
- Next.js App Router
- `@gentleduck/duck-docs` (shared docs kit)
- Velite (MDX pipeline)
- Registry tooling for component previews

## Quick Start
```bash
pnpm --filter @gentleduck/ui-docs dev:docs
pnpm --filter @gentleduck/ui-docs dev
```

## Scripts
- `pnpm --filter @gentleduck/ui-docs dev` – run the dev server
- `pnpm --filter @gentleduck/ui-docs build` – production build
- `pnpm --filter @gentleduck/ui-docs start` – serve the build
- `pnpm --filter @gentleduck/ui-docs dev:docs` – watch/generate MDX content
- `pnpm --filter @gentleduck/ui-docs build:docs` – one-time MDX build
- `pnpm --filter @gentleduck/ui-docs build:reg` – rebuild the UI registry and format output
- `pnpm --filter @gentleduck/ui-docs lint` – lint

## Environment
- `.env` is optional; see `.env.example` for defaults.
