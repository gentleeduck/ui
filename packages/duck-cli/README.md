<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/cli

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
