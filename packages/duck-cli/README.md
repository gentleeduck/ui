<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/cli" width="120"/>
</p>

<h1 align="center">@gentleduck/cli</h1>

<p align="center">
  CLI to add gentleduck/ui components and bootstrap integrations.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/cli"><img src="https://img.shields.io/npm/v/@gentleduck/cli.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/cli"><img src="https://img.shields.io/npm/dm/@gentleduck/cli.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/cli.svg" alt="MIT"/></a>
</p>

---

Add components to your project.

Scaffold a duck-ui configuration and install, update, diff, or remove registry components from the terminal.

## Quick start

```bash
npx @gentleduck/cli init
npx @gentleduck/cli add button
```

## Commands

| Command | Description |
|---------|-------------|
| `init` | Create `duck-ui.config.json` and install base dependencies |
| `add [components...]` | Install components from the registry |
| `diff [components...]` | Show what changed between local and registry versions |
| `update [components...]` | Pull latest registry versions into your project |
| `remove [components...]` | Delete installed components |
| `list` | List available registry components |

## Monorepo support

Pass `--monorepo` during init and target a specific workspace with `--workspace`:

```bash
npx @gentleduck/cli init --monorepo --workspace apps/web
npx @gentleduck/cli add button --workspace apps/web
```

## Features

- **TypeScript** -- resolves path aliases from your `tsconfig.json`
- **Tailwind v4** -- detects and configures Tailwind CSS v4
- **Monorepo aware** -- workspace targeting with validation
- **Diff view** -- inline diff with merge conflict UI before overwriting
- **Package manager detection** -- works with npm, yarn, pnpm, and bun

## Docs

[gentleduck.org](https://gentleduck.org)

## License

[MIT](./LICENSE)
