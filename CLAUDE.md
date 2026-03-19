# Project Instructions

## React Grab

This project uses [React Grab](https://reactgrab.com) in development mode. When the user provides context from React Grab (element selections with file paths, line numbers, and component names), use that information to navigate directly to the exact source code instead of searching. The context typically looks like:

- A component name and file path (e.g., "Button at button.tsx line 42")
- An element description with its location in the component tree
- The relevant source code snippet

Always trust React Grab context over searching. It points to the exact file and line.

## Monorepo Structure

- `packages/registry-ui/`  -  styled Tailwind components (source-exported, no build)
- `packages/duck-primitives/`  -  headless a11y-first primitives (built with tsdown)
- `packages/duck-docs/`  -  shared docs app kit
- `packages/duck-calendar/`  -  headless calendar engine with date adapters
- `packages/duck-cli/`  -  CLI for scaffolding and adding components
- `packages/duck-variants/`  -  cva() variant system
- `packages/duck-motion/`  -  animation tokens and reduced motion
- `packages/duck-vim/`  -  keyboard command engine
- `packages/duck-state/`  -  atom-based state management
- `packages/duck-hooks/`  -  React utility hooks
- `packages/duck-libs/`  -  cn(), utilities
- `packages/duck-lazy/`  -  lazy loading components
- `apps/duck-ui-docs/`  -  docs site (Next.js)
- `templates/acme/`  -  monorepo template
- `skills/`  -  agent skills for AI coding assistants

## Build and Test

- Build: `npx turbo run build`
- Test: `npx turbo run test`
- Lint: `npx biome check .`
- Type check: `npx turbo run check-types`
- Package manager: bun

## Conventions

- Always use `cn()` from `@gentleduck/libs/cn` for class merging
- Always use `cva()` from `@gentleduck/variants` for component variants
- Always use `React.forwardRef` with explicit generics for components
- Always set `displayName` on every component
- Always add `data-slot` attribute on component root elements
- Import order: external libs, @gentleduck packages, relative imports
- No semicolons, single quotes (biome enforced)
