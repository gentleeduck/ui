## Pick what you need

`gentleduck` is a set of independent packages. Most teams start with one of the two entry points below, then add tools as they need them.

### Start here

### Add tools as you grow

## Quick start

The shortest path is the CLI. From an existing React project:

```bash
bunx @gentleduck/cli init
bunx @gentleduck/cli add button dialog
```

`init` writes a `duck-ui.json` config, sets up Tailwind tokens, and prepares the import alias. `add` copies the component source — you own it.

If you only want primitives, install the package directly:

```bash
bun add @gentleduck/primitives
```

## Per-framework guides

Pick the framework you ship with for the full setup walkthrough, including Tailwind config, dark mode, and import aliases:

* [Next.js](/duck-ui/installation/next)
* [Vite](/duck-ui/installation/vite)
* [Astro](/duck-ui/installation/astro)
* [Remix / React Router](/duck-ui/installation/react-router)
* [TanStack Start](/duck-ui/installation/tanstack)
* [Laravel Inertia](/duck-ui/installation/laravel)
* [Manual setup](/duck-ui/installation/manual)
* [Monorepo setup](/duck-ui/installation/monorepo)

New to the project? Read the [Introduction](/www/introduction) first to see how the packages fit together before installing them piecemeal.