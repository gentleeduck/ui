<p align="center">
  <img src="./public/og/root.png" alt="duck gen root" width="800"/>
</p>

# @gentleduck/duck-gen-docs

Next.js documentation site for Duck Gen, the compiler extension that keeps API routes and message tags aligned across frameworks.
## Quick Start
```bash
pnpm --filter @gentleduck/gen-docs dev:docs
pnpm --filter @gentleduck/gen-docs dev
```

## Scripts
- `pnpm --filter @gentleduck/gen-docs dev` – run the dev server
- `pnpm --filter @gentleduck/gen-docs build` – production build
- `pnpm --filter @gentleduck/gen-docs start` – serve the build
- `pnpm --filter @gentleduck/gen-docs dev:docs` – watch/generate MDX content
- `pnpm --filter @gentleduck/gen-docs build:docs` – one-time MDX build
- `pnpm --filter @gentleduck/gen-docs lint` – lint

## Content
- `apps/duck-gen-docs/content/docs/**` – MDX sources
- `apps/duck-gen-docs/.velite/` – generated content (do not edit)
- `apps/duck-gen-docs/velite.config.ts` – Velite config (shared via `@gentleduck/duck-docs/velite`)

## Environment
- `.env` is optional; see `.env.example` for defaults.
