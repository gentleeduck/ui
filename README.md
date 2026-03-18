# gentleduck/ui

Build accessible React apps faster. 50+ components. 10+ packages. Zero compromises.

[![npm version](https://img.shields.io/npm/v/@gentleduck/cli?label=cli)](https://www.npmjs.com/package/@gentleduck/cli)
[![license](https://img.shields.io/github/license/gentleeduck/duck-ui)](./LICENSE)
[![tests](https://img.shields.io/github/actions/workflow/status/gentleeduck/duck-ui/ci.yml?label=tests)](https://github.com/gentleeduck/duck-ui/actions)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@gentleduck/primitives?label=primitives%20size)](https://bundlephobia.com/package/@gentleduck/primitives)

## Packages

| Package | Description | Version |
| --- | --- | --- |
| [`@gentleduck/calendar`](./packages/duck-calendar) | Headless calendar engine with date adapter pattern (~7 KB) | [![npm](https://img.shields.io/npm/v/@gentleduck/calendar)](https://www.npmjs.com/package/@gentleduck/calendar) |
| [`@gentleduck/primitives`](./packages/duck-primitives) | Accessibility-first headless UI primitives | [![npm](https://img.shields.io/npm/v/@gentleduck/primitives)](https://www.npmjs.com/package/@gentleduck/primitives) |
| [`@gentleduck/vim`](./packages/duck-vim) | Keyboard command engine with sequences and recording | [![npm](https://img.shields.io/npm/v/@gentleduck/vim)](https://www.npmjs.com/package/@gentleduck/vim) |
| [`@gentleduck/variants`](./packages/duck-variants) | Type-safe component variants with cva() | [![npm](https://img.shields.io/npm/v/@gentleduck/variants)](https://www.npmjs.com/package/@gentleduck/variants) |
| [`@gentleduck/motion`](./packages/duck-motion) | Animation tokens and reduced motion | [![npm](https://img.shields.io/npm/v/@gentleduck/motion)](https://www.npmjs.com/package/@gentleduck/motion) |
| [`@gentleduck/hooks`](./packages/duck-hooks) | React utility hooks | [![npm](https://img.shields.io/npm/v/@gentleduck/hooks)](https://www.npmjs.com/package/@gentleduck/hooks) |
| [`@gentleduck/libs`](./packages/duck-libs) | Shared utilities (cn, etc.) | [![npm](https://img.shields.io/npm/v/@gentleduck/libs)](https://www.npmjs.com/package/@gentleduck/libs) |
| [`@gentleduck/cli`](./packages/duck-cli) | CLI for adding and managing components | [![npm](https://img.shields.io/npm/v/@gentleduck/cli)](https://www.npmjs.com/package/@gentleduck/cli) |
| [`@gentleduck/lazy`](./packages/duck-lazy) | Lazy loading components | [![npm](https://img.shields.io/npm/v/@gentleduck/lazy)](https://www.npmjs.com/package/@gentleduck/lazy) |
| [`@gentleduck/state`](./packages/duck-state) | Atom-based state management | [![npm](https://img.shields.io/npm/v/@gentleduck/state)](https://www.npmjs.com/package/@gentleduck/state) |
| [`@gentleduck/docs`](./packages/duck-docs) | Shared docs app kit | [![npm](https://img.shields.io/npm/v/@gentleduck/docs)](https://www.npmjs.com/package/@gentleduck/docs) |
| [`registry-ui`](./packages/registry-ui) | 50+ styled Tailwind components | source-exported |

## Quick Start

```bash
# 1. Install the CLI
npx @gentleduck/cli@latest init

# 2. Initialize your project
npx @gentleduck/cli@latest init

# 3. Add a component
npx @gentleduck/cli@latest add button
```

## Key Features

- **Tailwind v4** — Built on Tailwind CSS v4 with native CSS layers
- **Dark mode** — First-class dark mode support out of the box
- **RTL + i18n** — Right-to-left layout and internationalization ready
- **ARIA compliant** — WAI-ARIA patterns across all primitives
- **Tree-shakeable** — Every package ships ESM with no side effects
- **TypeScript** — Full type coverage with strict mode
- **Persian / Hijri calendars** — Multi-calendar system support via date adapters

## Documentation

[gentleduck.dev](https://gentleduck.dev)

## Contributing

Contributions are welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) for guidelines.

## License

[MIT](./LICENSE)
