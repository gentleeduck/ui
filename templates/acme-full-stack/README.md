<p align="center">
  <img src="./public/logo-dark.svg" alt="acme/ui" width="120"/>
</p>

<h1 align="center">@acme/ui</h1>

<p align="center">
  React component library, headless primitives, hooks, variants, and developer tooling for the Acme design system.
</p>

<p align="center">
  <a href="./LICENSE">MIT</a> -
  <a href="./CHANGELOG.md">Changelog</a> -
  <a href="./CONTRIBUTING.md">Contributing</a> -
  <a href="https://acme.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@acme/registry-ui"><img src="https://img.shields.io/npm/v/@acme/registry-ui.svg?label=registry-ui" alt="registry-ui"/></a>
  <a href="https://www.npmjs.com/package/@acme/primitives"><img src="https://img.shields.io/npm/v/@acme/primitives.svg?label=primitives" alt="primitives"/></a>
  <a href="https://www.npmjs.com/package/@acme/cli"><img src="https://img.shields.io/npm/v/@acme/cli.svg?label=cli" alt="cli"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/@acme/registry-ui.svg" alt="MIT"/></a>
</p>

---

## Install

```sh
bunx @acme/cli init
bunx @acme/cli add button dialog calendar
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
| [`packages/registry-ui`](packages/registry-ui) | [`@acme/registry-ui`](https://www.npmjs.com/package/@acme/registry-ui) | Styled Tailwind components |
| [`packages/duck-primitives`](packages/duck-primitives) | [`@acme/primitives`](https://www.npmjs.com/package/@acme/primitives) | Headless a11y-first primitives |
| [`packages/duck-variants`](packages/duck-variants) | [`@acme/variants`](https://www.npmjs.com/package/@acme/variants) | Type-safe `cva()` variant system |
| [`packages/duck-motion`](packages/duck-motion) | [`@acme/motion`](https://www.npmjs.com/package/@acme/motion) | Motion primitives + reduced motion |
| [`packages/duck-hooks`](packages/duck-hooks) | [`@acme/hooks`](https://www.npmjs.com/package/@acme/hooks) | React utility hooks |
| [`packages/duck-libs`](packages/duck-libs) | [`@acme/libs`](https://www.npmjs.com/package/@acme/libs) | `cn()` + small utilities |
| [`packages/duck-lazy`](packages/duck-lazy) | [`@acme/lazy`](https://www.npmjs.com/package/@acme/lazy) | Lazy-loading helpers |
| [`packages/duck-calendar`](packages/duck-calendar) | [`@acme/calendar`](https://www.npmjs.com/package/@acme/calendar) | Headless calendar engine |
| [`packages/duck-vim`](packages/duck-vim) | [`@acme/vim`](https://www.npmjs.com/package/@acme/vim) | Keyboard command engine |
| [`packages/duck-query`](packages/duck-query) | [`@acme/query`](https://www.npmjs.com/package/@acme/query) | Atom + query primitives |
| [`packages/duck-ttest`](packages/duck-ttest) | [`@acme/ttest`](https://www.npmjs.com/package/@acme/ttest) | Type-level testing utilities |
| [`packages/duck-gen`](packages/duck-gen) | [`@acme/gen`](https://www.npmjs.com/package/@acme/gen) | Codegen helpers |
| [`packages/duck-cli`](packages/duck-cli) | [`@acme/cli`](https://www.npmjs.com/package/@acme/cli) | Project scaffolding + add CLI |
| [`packages/duck-docs`](packages/duck-docs) | [`@acme/docs`](https://www.npmjs.com/package/@acme/docs) | Shared docs app kit |
| [`packages/duck-registry-build`](packages/duck-registry-build) | [`@acme/registry-build`](https://www.npmjs.com/package/@acme/registry-build) | Component registry build engine |
| [`packages/registers`](packages/registers) | [`@acme/registers`](https://www.npmjs.com/package/@acme/registers) | Registry schema + types |

Private docs-only: `registry-blocks`, `registry-examples`, `registry-internals`.
WIP / deprecated lives under `packages/wip/` and `packages/deprecated/`.

## Apps

| Path | Role |
| --- | --- |
| [`apps/duck`](apps/duck) | Docs site at [acme.org/duck-ui](https://acme.org/duck-ui) |

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

- Site: [acme.org/duck-ui](https://acme.org/duck-ui)
- Component docs: `apps/duck/content/docs/<package>/`
- Sibling repos: [`@acme/iam`](https://github.com/acme/duck-iam), [`@acme/upload`](https://github.com/acme/duck-upload), [`@acme/md`](https://github.com/acme/duck-md)

## Contributing

PR checklist + style notes in [`CONTRIBUTING.md`](CONTRIBUTING.md).
Security: [`SECURITY.md`](SECURITY.md). Behaviour: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License

MIT. See [`LICENSE`](LICENSE).
