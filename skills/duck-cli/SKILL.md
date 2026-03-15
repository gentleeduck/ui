---
name: duck-cli
description: >-
  Use when working with @gentleduck/cli — the command-line tool for initializing
  projects, scaffolding from templates, and adding components. Covers the init, add,
  update, diff, and list commands, project detection, config generation, and the
  template scaffold system.
allowed-tools: Read Grep Glob Bash(node:*) Bash(bun:*)
argument-hint: "[command]"
---

# @gentleduck/cli

You are an expert on the duck-ui CLI tool. Your scope is `packages/duck-cli/`. This package provides the `npx @gentleduck/cli` command that helps users bootstrap projects and install components.

## Commands

### init

Initializes a project with duck-ui configuration.

```bash
npx @gentleduck/cli init                              # Interactive
npx @gentleduck/cli init -y                           # Non-interactive with defaults
npx @gentleduck/cli init --template acme --cwd ./app  # Scaffold from template
npx @gentleduck/cli init --monorepo --workspace packages/ui
npx @gentleduck/cli init -p NEXT_JS -b zinc --css ./src/styles.css
```

### add

Adds components to an existing project.

```bash
npx @gentleduck/cli add button dialog tabs
npx @gentleduck/cli add button --workspace packages/ui  # Monorepo
npx @gentleduck/cli add -y                               # Skip prompts
```

### update, diff, list

```bash
npx @gentleduck/cli update button    # Update component to latest
npx @gentleduck/cli diff button      # Show diff between local and registry
npx @gentleduck/cli list             # List available components
```

## Source Structure

```
packages/duck-cli/src/
├── commands/
│   ├── init/           # init command (init.ts, init.libs.ts, init.dto.ts, init.constants.ts)
│   ├── add/            # add command
│   ├── update/         # update command
│   ├── diff/           # diff command
│   └── list/           # list command
├── utils/
│   ├── template-scaffold/   # --template flag implementation
│   ├── get-package-manager/ # detects bun/pnpm/yarn/npm
│   ├── preflight-configs/   # project detection and config generation
│   ├── registry-mutation/   # component file writing
│   ├── get-registry/        # fetches component registry from API
│   └── text-styling/        # terminal colors (kleur)
├── gui/                     # ink-based interactive UI
└── index.ts                 # commander program setup
```

## Command Pattern

Each command follows this structure:

```
commands/{name}/
├── {name}.ts           # Commander command definition with .option() and .action()
├── {name}.libs.ts      # Action handler implementation
├── {name}.dto.ts       # Zod schema for options validation
└── {name}.constants.ts # Command metadata (name, description, flags)
```

## Template Scaffold

The `--template` flag downloads a tarball from GitHub:

1. Fetch `https://codeload.github.com/gentelduck/ui/tar.gz/master`
2. Extract entries matching `templates/{name}/` via tar filter
3. Skip ignored segments (node_modules, .git, dist, .turbo, etc.)
4. Detect package manager and run install

Source: `packages/duck-cli/src/utils/template-scaffold/`

## Build

Built with tsdown into a single `dist/index.mjs`. Entry: `src/index.ts`. Published as `@gentleduck/cli` with bin `duck-cli`.

For implementation details, read the source files. For the command option schemas, read the `.dto.ts` files.
