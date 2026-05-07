---
"@gentleduck/cli": minor
---

Add `theme` command for managing theme tokens.

Three subcommands:

- `duck-cli theme list` — list every theme in the registry (`--json` for machine output)
- `duck-cli theme info <name>` — print color tokens for one theme (`--json` supported)
- `duck-cli theme add <name>` — install a theme into your `globals.css` (`--css <path>` to override)

`theme add` writes a guarded block bracketed by `/* @gentleduck/cli theme:start */` and `/* @gentleduck/cli theme:end */`. Re-running `theme add` with another theme replaces the block in place, so swapping themes is a one-command operation. Defaults search the common globals.css locations (`app/globals.css`, `src/app/globals.css`, `src/index.css`, `src/styles/globals.css`, `styles/globals.css`).

Backed by:

- New `getRegistryThemesIndex()` helper that fetches `/r/themes/index.json`
- New `getRegistryTheme(name)` helper that fetches `/r/themes/<name>.json`
- Zod schemas `registryThemesIndexSchema` and `registryThemeSchema` exported from `~/utils/get-registry`
- Registry now ships a generated `/r/themes/index.json` alongside the per-theme JSON files

Tests: 18 new unit + integration tests covering rendering, merging, path resolution, network errors, and schema validation.
