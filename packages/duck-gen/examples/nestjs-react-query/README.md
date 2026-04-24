# Duck Gen + NestJS + React Query + i18n Example

This example shows Duck Gen generating API route and message types from a
NestJS server, then consuming those types in a React client using Duck Query,
React Query, and a typed i18n dictionary.

## Setup

From the repo root:

```bash
bun install
bun run --filter @gentleduck/duck-gen-example gen
```

## Build

```bash
bun run --filter @gentleduck/duck-gen-example build
```

## Run (optional)

```bash
bun run --filter @gentleduck/duck-gen-example-server dev
bun run --filter @gentleduck/duck-gen-example-client dev
```

By default, the client expects the API at `http://localhost:3000`.
You can override it with `VITE_API_BASE`.
