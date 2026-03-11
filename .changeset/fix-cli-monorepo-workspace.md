---
"@gentleduck/cli": patch
---

fix(cli): resolve monorepo config, CSS, and components to workspace directory

- Write `duck-ui.config.json` to workspace instead of monorepo root
- Write CSS theme file to workspace instead of monorepo root
- Set `workspace: { root: ".", project: "." }` when config lives in workspace
- Resolve config search path from workspace in all commands (init, add, update, diff, remove)
- Fix tsconfig paths template to use `./src/*` so components land in `<workspace>/src/ui/`
- Add `platform: 'node'` to tsdown config for proper CJS/Node resolution
