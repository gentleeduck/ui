<p align="center">
  <img src="./public/og/root.png" alt="duck ui root" width="800"/>
</p>

# @gentleduck/duck-www

Next.js documentation site for Gentleduck UI. Covers components, blocks, charts, themes, and registry-powered previews.

## Stack
- Next.js App Router
- `@gentleduck/duck-docs` (shared docs kit)
- Velite (MDX pipeline)
- Registry tooling for component previews

## Quick Start
```bash
pnpm --filter @gentleduck/www dev:docs
pnpm --filter @gentleduck/www dev
```

## Scripts
- `pnpm --filter @gentleduck/www dev` – run the dev server
- `pnpm --filter @gentleduck/www build` – production build
- `pnpm --filter @gentleduck/www start` – serve the build
- `pnpm --filter @gentleduck/www dev:docs` – watch/generate MDX content
- `pnpm --filter @gentleduck/www build:docs` – one-time MDX build
- `pnpm --filter @gentleduck/www build:reg` – rebuild the UI registry and format output
- `pnpm --filter @gentleduck/www lint` – lint

## Environment
- `.env` is optional; see `.env.example` for defaults.
