---
name: duck-cli
description: >-
  Use when working with @gentleduck/cli  -  the command-line tool for initializing
  projects, scaffolding from templates, and adding components. Covers the init,
  add, update, remove, diff, and list commands.
allowed-tools: Read Grep Glob Bash(bun run build) Bash(bun run test)
argument-hint: "[command]"
---

# @gentleduck/cli

You are an expert on the duck-ui CLI tool. Your scope is `packages/duck-cli/`. This package provides the `npx @gentleduck/cli` command that helps users bootstrap projects and install components.

## Global Flag

`--verbose`  -  show detailed error output (stack traces). Handled via a `preAction` hook in `src/main/main.ts`.

## Commands

### init

Initializes a project with duck-ui configuration.

```bash
npx @gentleduck/cli init                              # Interactive
npx @gentleduck/cli init -y                           # Non-interactive with defaults
npx @gentleduck/cli init --template acme --cwd ./app  # Scaffold from template
npx @gentleduck/cli init --monorepo -w packages/ui    # Monorepo workspace
npx @gentleduck/cli init -p NEXT_JS -b zinc --css ./src/styles.css
npx @gentleduck/cli init -a                           # Init and install all components
npx @gentleduck/cli init button dialog                # Init and install specific components
```

Flags: `-y, --yes`, `-c, --cwd <cwd>`, `-p, --project-type <type>`, `-b, --base-color <color>`, `--alias <alias>`, `--css <path>`, `--css-variables / --no-css-variables`, `--monorepo / --no-monorepo`, `-w, --workspace <path>`, `--prefix <prefix>`, `-a, --all`, `-t, --template <name>`.

### add

Adds components to an existing project.

```bash
npx @gentleduck/cli add button dialog tabs
npx @gentleduck/cli add -f                             # Overwrite existing
npx @gentleduck/cli add -w packages/ui                 # Monorepo workspace
npx @gentleduck/cli add -a                             # All components
npx @gentleduck/cli add -y                             # Skip prompts
```

Flags: `-y, --yes`, `-f, --force`, `-c, --cwd <cwd>`, `-w, --workspace <path>`, `-a, --all`.

### update, remove, diff

```bash
npx @gentleduck/cli update button    # Update component to latest
npx @gentleduck/cli remove button    # Remove component
npx @gentleduck/cli diff button      # Show diff between local and registry
```

All three accept: `-y, --yes`, `-c, --cwd <cwd>`, `-w, --workspace <path>`.

### list

```bash
npx @gentleduck/cli list             # List available components
npx @gentleduck/cli list -t ui       # Filter by type (ui, hook, lib, block)
npx @gentleduck/cli list -j          # Output as JSON
```

Flags: `-t, --type <type>`, `-j, --json`.

## Source Structure

```
packages/duck-cli/src/
├── commands/{name}/    # 5 files each: .ts, .libs.ts, .dto.ts, .constants.ts, .types.ts
│   └── shared.types.ts # CommandConfig, OptionType (re-exported by each .types.ts)
├── utils/              # template-scaffold/, get-package-manager/, get-project-info/,
│                       # preflight-configs/, registry-mutation/, get-registry/,
│                       # text-styling/, diff-format/, merge/, workspace/,
│                       # resolve-components.ts, spinner.ts, banner.ts, verbose.ts,
│                       # require-config-value.ts
├── main/               # main.ts (commander setup), main.constants.ts (REGISTRY_URL)
├── gui/                # ink-based interactive UI
└── index.ts            # entry point
```

## Command Pattern

Each command has five files. See [COMMAND-PATTERN.md](references/COMMAND-PATTERN.md) for the full pattern with code examples.

## Registry API

The registry URL defaults to `https://gentleduck.org/duck-ui/r` and can be overridden with the `COMPONENTS_REGISTRY_URL` env var. Defined in `src/main/main.constants.ts` as `REGISTRY_URL`.

## Local Development

```bash
cd packages/duck-cli
bun run build                      # Build with tsdown into dist/index.mjs
bun run dev                        # Watch mode
bun run start -- init -y           # Run the built CLI
bun run start:dev -- init -y       # Run against local registry (localhost:3003)
bun run test                       # Run vitest
```

## Error Patterns

1. Command not found -- forgot to register in `src/main/main.ts`
2. Option type mismatch -- Zod schema field name/type does not match the Commander option
3. Registry fetch failure -- check `get-registry/` and the `COMPONENTS_REGISTRY_URL` env var
4. Template not found -- tarball filter pattern does not match the template directory name

## Do Not

- Do not run arbitrary shell commands -- use `execa` with explicit command and args arrays
- Do not skip Zod validation -- always parse options through the schema before use
- Do not use `console.log` for user feedback -- use the `spinner` and `highlighter` utilities
- Do not hardcode registry URLs -- use `REGISTRY_URL` from `main.constants.ts`
- Do not add commands without updating the snapshot test at `src/__test__/unit/command-help.test.ts`
