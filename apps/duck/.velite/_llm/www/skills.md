Agent skills are markdown instruction files that teach AI coding assistants the APIs, patterns, and conventions of a codebase so they produce correct code on the first try.

## Overview

`gentleduck` ships an agent skill for every published package. Each skill is scoped to a single package so the agent only loads the context it needs for the work in front of it. Skills follow the open [Agent Skills specification](https://agentskills.io/specification) and work with Claude Code, GitHub Copilot, Cursor, Cline, OpenCode, and 30+ other agents.

## Install

Install all skills at once:

```bash
npx skills add gentelduck/ui
```

Install a single skill:

```bash
npx skills add gentelduck/ui --skill duck-primitives
```

## Available skills

### Component layer

| Skill | Package | What it covers |
| --- | --- | --- |
| `duck-ui` | `@gentleduck/registry-ui` | Styled Tailwind components, variant system, compound patterns, coding style |
| `duck-primitives` | `@gentleduck/primitives` | Headless ARIA-correct primitives, scoped context, `Slot` / `asChild`, `Presence` |
| `duck-variants` | `@gentleduck/variants` | `cva()` variant function, `VariantProps`, `Variants` namespace, type inference |

### Engines

| Skill | Package | What it covers |
| --- | --- | --- |
| `duck-calendar` | `@gentleduck/calendar` | Headless calendar engine, date adapters, view rendering hooks |
| `duck-vim` | `@gentleduck/vim` | Keyboard engine, hotkey parsing, sequences, chord matching, React hooks |
| `duck-motion` | `@gentleduck/motion` | Animation tokens, reduced-motion handling |
| `duck-state` | `@gentleduck/state` | Atom-based state primitives for component-local stores |

### Tooling

| Skill | Package | What it covers |
| --- | --- | --- |
| `duck-cli` | `@gentleduck/cli` | CLI commands, template scaffolding, command authoring pattern |
| `duck-registry-build` | `@gentleduck/registry-build` | Compiling and publishing your own component registry |

### Utilities

| Skill | Package | What it covers |
| --- | --- | --- |
| `duck-hooks` | `@gentleduck/hooks` | React utility hooks shared across the stack |
| `duck-libs` | `@gentleduck/libs` | `cn()` and small helpers used by every component |
| `duck-lazy` | `@gentleduck/lazy` | Intersection-observer lazy mounting |

### Server-side

| Skill | Package | What it covers |
| --- | --- | --- |
| `duck-iam` | `@gentleduck/iam` | Identity, RBAC, sessions, audit |
| `duck-upload` | `@gentleduck/upload` | Resumable uploads, chunking, progress |
| `duck-query` | `@gentleduck/query` | Typed query helpers for the data layer |
| `duck-gen` | `@gentleduck/gen` | Code generation for controllers, routes, and schemas |

## MCP documentation server

Skills tell the agent how to use a package. The [MCP server](/www/mcp) tells the agent what's actually in the docs right now. Use both together: skills give the agent the patterns and constraints, MCP gives it live access to the current API.

The docs site exposes an MCP server at:

```
https://gentleduck.org/api/mcp
```

Available MCP tools include `list_docs`, `read_doc`, `search_docs`, `get_component_api`, `get_examples`, `get_changelog`, `get_installation`, `suggest_components`, and `semantic_search`. See the [MCP Server doc](/www/mcp) for parameters and examples.

To wire the MCP server into your agent, drop this into the project's `.mcp.json`:

```json
{
  "mcpServers": {
    "gentleduck-docs": {
      "type": "url",
      "url": "https://gentleduck.org/api/mcp"
    }
  }
}
```

## How skills work

Each skill is a `SKILL.md` file with YAML frontmatter and markdown instructions:

```markdown
---
name: duck-ui
description: Use when working with styled @gentleduck/registry-ui components...
allowed-tools: Read Grep Glob
---

# Instructions for the agent...
```

The agent reads the `description` to decide when to activate the skill. The markdown body provides the actual instructions. Reference files in a `references/` subdirectory provide deeper context loaded on demand.

## Contributing a skill

To add a skill for a new package or improve an existing one:

1. Create a directory under `skills/` with a `SKILL.md` containing frontmatter and instructions.
2. Optionally add a `references/` subdirectory with detailed content the agent loads on demand.
3. Test locally by symlinking into `.claude/skills/` and starting a new agent session.
4. Open a pull request. The skill becomes installable as soon as it merges.

See the [skills README](https://github.com/gentleeduck/duck-ui/tree/master/skills) for the full authoring guide, quality checklist, and publishing instructions.