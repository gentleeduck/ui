# @gentleduck/cli

CLI for initializing `duck-ui` config and installing/updating/removing registry components.

## Install

```bash
npx @gentleduck/cli --help
```

## Commands

```bash
npx @gentleduck/cli init [components...]
npx @gentleduck/cli add [components...]
npx @gentleduck/cli update [components...]
npx @gentleduck/cli remove [components...]
npx @gentleduck/cli diff [components...]
```

## Monorepo Workspace Targeting

When `duck-ui.config.json` has `"monorepo": true`, the CLI resolves target paths from the config `workspace` field.

You can override the target workspace per command:

```bash
npx @gentleduck/cli add button --workspace apps/web
npx @gentleduck/cli update --all --workspace apps/web
npx @gentleduck/cli diff button --workspace apps/web
```

For `init`:

```bash
npx @gentleduck/cli init --monorepo --workspace apps/web
```

The CLI validates the workspace target:

- `package.json` must exist
- `tsconfig.json` must exist for component commands

## Migration

Legacy `duck-ui.config.json` files (without `workspace`) are rejected.

Re-run init to migrate:

```bash
npx @gentleduck/cli init
```

## Release Workflow

This repo uses Changesets for versioning and publishing.

1. Add a changeset for CLI changes:

```bash
bun run changeset
```

2. Update versions/changelogs:

```bash
bun run version-packages
```

3. Validate package before publish:

```bash
bun run --cwd packages/duck-cli test
bun run --cwd packages/duck-cli build
```

4. Publish (repo-level script):

```bash
bun run release
```
