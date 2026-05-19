# Agent Skills

This directory contains agent skills for the gentleduck/ui ecosystem. Each skill teaches AI coding agents how to work with a specific package  -  its API, patterns, coding style, and conventions.

Skills follow the open [Agent Skills specification](https://agentskills.io/specification) and work with Claude Code, GitHub Copilot, Cursor, Cline, OpenCode, and 30+ other agents.

## Available Skills

| Skill | Package | What it covers |
|---|---|---|
| `duck-ui` | `@gentleduck/registry-ui` | Styled Tailwind components, variant system, compound patterns, coding style |
| `duck-primitives` | `@gentleduck/primitives` | Headless a11y-first primitives, scoped context, Slot/asChild, Presence |
| `duck-variants` | `@gentleduck/variants` | cva() variant function, VariantProps, CvaProps, type inference |
| `duck-cli` | `@gentleduck/cli` | CLI commands, template scaffolding, command authoring pattern |
| `duck-vim` | `@gentleduck/vim` | Keyboard engine, hotkey parsing, sequences, React hooks |

## Installing Skills

Users install skills from this repo into their own projects:

```bash
npx skills add gentleduck/duck-ui
```

This discovers all skills in the `skills/` directory and installs them into the user's agent configuration (`.claude/skills/`, `.cursor/skills/`, etc.).

To install a specific skill:

```bash
npx skills add gentleduck/duck-ui --skill duck-primitives
```

## Skill File Format

Each skill is a directory containing a `SKILL.md` file with YAML frontmatter:

```
skills/{name}/
├── SKILL.md                # Required: frontmatter + instructions
└── references/             # Optional: deeper context loaded on demand
    ├── CODING-STYLE.md
    └── OTHER-REFERENCE.md
```

### SKILL.md Structure

```markdown
---
name: skill-name
description: >-
  When to activate this skill. Write in third person. Be specific about
  the trigger conditions  -  this text determines whether the agent loads
  the skill, so vague descriptions cause false activations.
allowed-tools: Read Grep Glob
argument-hint: "[optional-argument-hint]"
---

# Title

Instructions for the agent. Keep under 5000 tokens / 500 lines.
Reference files in references/ for deeper content that loads on demand.
```

### Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Lowercase, hyphens only, 1-64 chars. Must match directory name. |
| `description` | Yes | When to use this skill. 1-1024 chars. No XML tags. Third person. |
| `allowed-tools` | No | Space-separated tool names the agent can use without asking permission. |
| `argument-hint` | No | Shown in autocomplete, e.g. `[component-name]`. |
| `user-invocable` | No | Set `false` to hide from the `/` menu (background knowledge only). |
| `context` | No | Set `fork` to run in a forked subagent context. |
| `agent` | No | Which subagent to use when `context: fork`. Options: `Explore`, `Plan`, `general-purpose`. |
| `model` | No | Model override when skill is active. |

### References (Progressive Disclosure)

Put detailed content in `references/` subdirectory. Reference from SKILL.md:

```markdown
For the full coding style guide, see [CODING-STYLE.md](references/CODING-STYLE.md).
```

The agent only reads reference files when it needs them, keeping the initial context small. This is important for performance  -  a 200-line SKILL.md plus on-demand references is much better than a 2000-line monolith.

## Publishing to skills.sh

Skills in this repo are automatically discoverable by the skills CLI because they follow the standard directory convention (`skills/{name}/SKILL.md`).

To get listed on [skills.sh](https://skills.sh/) leaderboard:

1. Skills must be in a public GitHub repo
2. Each skill must have a valid `SKILL.md` with `name` and `description` frontmatter
3. The repo must be accessible at `github.com/{owner}/{repo}`
4. Users install via `npx skills add {owner}/{repo}`
5. Anonymous telemetry from installations determines leaderboard ranking

No manual submission is needed. The leaderboard indexes public repos automatically when users install skills from them.

## Creating a New Skill

1. Create a directory under `skills/` matching the package name:

   ```bash
   mkdir -p skills/duck-calendar/references
   ```

2. Write the `SKILL.md` with frontmatter and instructions. Follow these rules:
   - Keep the description specific and trigger-focused
   - Keep the body under 500 lines / 5000 tokens
   - Put detailed reference content in `references/`
   - Include the exact file structure pattern so the agent can create new code
   - Include a "Do Not" section with explicit guardrails
   - Include the import paths and coding conventions
   - Show real code from the actual codebase, not hypothetical examples

3. Optionally add reference files for deeper content:
   - `references/CODING-STYLE.md`  -  file structure, naming, annotated code template
   - `references/COMPONENTS.md`  -  registry of available items
   - `references/API.md`  -  detailed API reference

4. Test the skill locally by symlinking into `.claude/skills/`:

   ```bash
   mkdir -p .claude/skills
   ln -s ../../skills/duck-calendar .claude/skills/duck-calendar
   ```

   Then start a new Claude Code session and try invoking it.

5. Commit and push. The skill is now installable by anyone:

   ```bash
   npx skills add gentleduck/duck-ui
   ```

## Maintaining Skills

### When to Update a Skill

- When a package's public API changes (new exports, renamed functions, changed signatures)
- When coding conventions change (new file structure, new naming patterns)
- When a new component or primitive is added (update the registry reference)
- When import paths change

### What NOT to Put in Skills

- Implementation internals that change frequently (put these in code comments instead)
- Generated content (API docs that can be fetched from the MCP server)
- Version-specific information (the skill should describe the current state)
- Content duplicated from the README or docs site

### Quality Checklist

Before merging a skill change:

- [ ] `name` in frontmatter matches directory name
- [ ] `description` is specific about when to activate
- [ ] SKILL.md is under 500 lines
- [ ] Code examples are copied from actual source files, not invented
- [ ] Import paths are correct and tested
- [ ] "Do Not" guardrails are present
- [ ] References are one level deep (no nested reference chains)
- [ ] No sensitive information (API keys, internal URLs, credentials)

## MCP Integration

The docs site exposes an MCP server at `https://gentleduck.org/duck-ui/api/mcp` with 9 tools for searching docs, reading component APIs, getting examples, and suggesting components. The `.mcp.json` at the repo root configures this for local development.

Skills reference MCP tools by their fully qualified names in the instruction body. The MCP server itself is configured in `.mcp.json`, not in skill frontmatter.

## Further Reading

- [Agent Skills Specification](https://agentskills.io/specification)
- [Claude Code Skills Docs](https://code.claude.com/docs/en/skills)
- [Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [skills.sh Directory](https://skills.sh/)
