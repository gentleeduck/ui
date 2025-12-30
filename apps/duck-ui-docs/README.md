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

## Content
- `apps/duck-ui-docs/content/docs/**` – MDX sources
- `apps/duck-ui-docs/.velite/` – generated content (do not edit)
- `apps/duck-ui-docs/__ui_registry__/` – generated registry data
- `apps/duck-ui-docs/public/r/` – registry exports used in docs

## Registry Previews
- `apps/duck-ui-docs/velite-configs/plugins/rehype-component.ts` injects registry source and previews into MDX.

## Environment
- `.env` is optional; see `.env.example` for defaults.
