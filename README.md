<p align="center">
  <img src="./public/logo-dark.svg" alt="gentleduck/ui" width="120"/>
</p>

<h1 align="center">@gentleduck/ui</h1>

<p align="center">
  React component library, headless primitives, hooks, variants, and developer tooling for the Gentleduck design system.
</p>

<p align="center">
  <a href="./LICENSE">MIT</a> -
  <a href="./CHANGELOG.md">Changelog</a> -
  <a href="./CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/registry-ui"><img src="https://img.shields.io/npm/v/@gentleduck/registry-ui.svg?label=registry-ui" alt="registry-ui"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/primitives"><img src="https://img.shields.io/npm/v/@gentleduck/primitives.svg?label=primitives" alt="primitives"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/cli"><img src="https://img.shields.io/npm/v/@gentleduck/cli.svg?label=cli" alt="cli"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/registry-ui.svg" alt="MIT"/></a>
</p>

---

## Install

```sh
bunx @gentleduck/cli init
bunx @gentleduck/cli add button dialog calendar
```

## Quick start

```tsx
import { Button } from '@/components/ui/button'

export default function App() {
  return <Button variant="default">Quack</Button>
}
```

## Workspace

| Path | Package | Role |
| --- | --- | --- |
| [`packages/registry-ui`](packages/registry-ui) | [`@gentleduck/registry-ui`](https://www.npmjs.com/package/@gentleduck/registry-ui) | Styled Tailwind components |
| [`packages/duck-primitives`](packages/duck-primitives) | [`@gentleduck/primitives`](https://www.npmjs.com/package/@gentleduck/primitives) | Headless a11y-first primitives |
| [`packages/duck-variants`](packages/duck-variants) | [`@gentleduck/variants`](https://www.npmjs.com/package/@gentleduck/variants) | Type-safe `cva()` variant system |
| [`packages/duck-motion`](packages/duck-motion) | [`@gentleduck/motion`](https://www.npmjs.com/package/@gentleduck/motion) | Motion primitives + reduced motion |
| [`packages/duck-hooks`](packages/duck-hooks) | [`@gentleduck/hooks`](https://www.npmjs.com/package/@gentleduck/hooks) | React utility hooks |
| [`packages/duck-libs`](packages/duck-libs) | [`@gentleduck/libs`](https://www.npmjs.com/package/@gentleduck/libs) | `cn()` + small utilities |
| [`packages/duck-lazy`](packages/duck-lazy) | [`@gentleduck/lazy`](https://www.npmjs.com/package/@gentleduck/lazy) | Lazy-loading helpers |
| [`packages/duck-calendar`](packages/duck-calendar) | [`@gentleduck/calendar`](https://www.npmjs.com/package/@gentleduck/calendar) | Headless calendar engine |
| [`packages/duck-vim`](packages/duck-vim) | [`@gentleduck/vim`](https://www.npmjs.com/package/@gentleduck/vim) | Keyboard command engine |
| [`packages/duck-query`](packages/duck-query) | [`@gentleduck/query`](https://www.npmjs.com/package/@gentleduck/query) | Atom + query primitives |
| [`packages/duck-ttest`](packages/duck-ttest) | [`@gentleduck/ttest`](https://www.npmjs.com/package/@gentleduck/ttest) | Type-level testing utilities |
| [`packages/duck-gen`](packages/duck-gen) | [`@gentleduck/gen`](https://www.npmjs.com/package/@gentleduck/gen) | Codegen helpers |
| [`packages/duck-cli`](packages/duck-cli) | [`@gentleduck/cli`](https://www.npmjs.com/package/@gentleduck/cli) | Project scaffolding + add CLI |
| [`packages/duck-docs`](packages/duck-docs) | [`@gentleduck/docs`](https://www.npmjs.com/package/@gentleduck/docs) | Shared docs app kit |
| [`packages/duck-registry-build`](packages/duck-registry-build) | [`@gentleduck/registry-build`](https://www.npmjs.com/package/@gentleduck/registry-build) | Component registry build engine |
| [`packages/registers`](packages/registers) | [`@gentleduck/registers`](https://www.npmjs.com/package/@gentleduck/registers) | Registry schema + types |

Private docs-only: `registry-blocks`, `registry-examples`, `registry-internals`.
WIP / deprecated lives under `packages/wip/` and `packages/deprecated/`.

## Apps

| Path | Role |
| --- | --- |
| [`apps/duck`](apps/duck) | Docs site at [gentleduck.org/duck-ui](https://gentleduck.org/duck-ui) |

## Templates

| Path | Stack |
| --- | --- |
| [`templates/acme`](templates/acme) | Next.js monorepo starter wired to the registry |

## Build

```sh
bun install
bunx turbo run build --filter='./packages/*'
bunx turbo run test --filter='./packages/*'
bunx turbo run check-types --filter='./packages/*'
```

## Docs

- Site: [gentleduck.org/duck-ui](https://gentleduck.org/duck-ui)
- Component docs: `apps/duck/content/docs/<package>/`
- Sibling repos: [`@gentleduck/iam`](https://github.com/gentleeduck/duck-iam), [`@gentleduck/upload`](https://github.com/gentleeduck/duck-upload), [`@gentleduck/md`](https://github.com/gentleeduck/duck-md)

## Contributing

PR checklist + style notes in [`CONTRIBUTING.md`](CONTRIBUTING.md).
Security: [`SECURITY.md`](SECURITY.md). Behaviour: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License

MIT. See [`LICENSE`](LICENSE).
