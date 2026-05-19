<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/gen" width="120"/>
</p>

<h1 align="center">@gentleduck/gen</h1>

<p align="center">
  Type-safe API and message generator for TypeScript projects (deprecated).
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/gen"><img src="https://img.shields.io/npm/v/@gentleduck/gen.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/gen"><img src="https://img.shields.io/npm/dm/@gentleduck/gen.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/gen.svg" alt="MIT"/></a>
</p>

---

> [!WARNING]
> **`@gentleduck/gen` is deprecated and no longer maintained.** Use the
> NestJS-native toolchain instead — they cover the same surface (typed routes,
> typed bodies, runtime validation, SDK generation) and ship with a real
> compiler transformer, full tooling, and an active community.
>
> - **[nestia](https://nestia.io/)** — typed `@TypedRoute` / `@TypedBody` /
>   `@TypedQuery` / `@TypedParam` decorators, automatic SDK generation, Swagger
>   support
> - **[typia](https://typia.io/)** — runtime validators, serializers, JSON
>   schema generation, all from TypeScript types via a TS transformer plugin
>
> Migration is straightforward: replace `@Body(typiaBody<X>())` with
> `@TypedBody()`, `@Get()` with `@TypedRoute.Get()`, etc. See the [nestia
> migration guide](https://nestia.io/docs/sdk/) for details.

---

Duck Gen scans your TypeScript server code and generates type-safe route maps and
message registries. It is currently tested with NestJS.

## Install

```bash
bun add -d @gentleduck/gen
```

## Quick start

Create a `duck-gen.json` at your project root:

```json
{
  "$schema": "node_modules/@gentleduck/gen/duck-gen.schema.json",
  "framework": "nestjs",
  "extensions": {
    "shared": {
      "includeNodeModules": false,
      "outputSource": "./generated",
      "sourceGlobs": ["src/**/*.ts", "src/**/*.tsx"],
      "tsconfigPath": "./tsconfig.json"
    },
    "apiRoutes": {
      "enabled": true,
      "globalPrefix": "/api",
      "normalizeAnyToUnknown": true,
      "outputSource": ["./generated", "./src/generated"]
    },
    "messages": {
      "enabled": true,
      "outputSource": "./generated"
    }
  }
}
```

Add a message group tagged for Duck Gen:

```ts
/**
 * @duckgen messages
 */
export const AuthMessages = [
  'AUTH_SIGNIN_SUCCESS',
  'AUTH_SIGNIN_FAILED',
] as const
```

Run the generator:

```bash
bunx duck-gen
```

Import generated types (package outputs only exist when you don't set `outputSource`):

```ts
import type {
  ApiRoutes,
  DuckGenI18nMessages,
  DuckgenScopedI18nByGroup,
} from '@gentleduck/gen/nestjs'
```

If you configure `outputSource`, import directly from your generated file instead:

```ts
import type { ApiRoutes } from './generated/duck-gen-api-routes'
```

## Output

Duck Gen writes type definitions to `@gentleduck/gen/generated/<framework>` and
exposes them via framework entrypoints like `@gentleduck/gen/nestjs` **only when
no output paths are configured**. If you set `extensions.shared.outputSource`,
`extensions.apiRoutes.outputSource`, or `extensions.messages.outputSource`, the
generator writes **only** to those configured paths (paths resolve relative to
`duck-gen.json`). When you customize outputs, import types from those files
directly instead of the package entrypoints.

Generated files include:

- `duck-gen-api-routes.d.ts`
- `duck-gen-messages.d.ts`
- `index.d.ts`

## Notes

- If `duck-gen.json` is missing, defaults are used.
- Run the CLI from the project root so paths resolve correctly.
- Message arrays should be `as const` so keys are literal types.
- `sourceGlobs` are resolved relative to `duck-gen.json` and override tsconfig
  includes for that extension when provided.
- If no `sourceGlobs` are provided, Duck Gen uses defaults:
  - API routes: `**/*.controller.ts(x)`
  - Messages: `**/*.ts(x)`
- API routes do **not** fall back to `extensions.shared.sourceGlobs`. If your
  controllers don’t follow `*.controller.ts(x)`, set
  `extensions.apiRoutes.sourceGlobs` explicitly.
- Duck Gen automatically excludes `node_modules`, `dist`, `generated`, and
  `.turbo` from globs unless `includeNodeModules` is `true`.
- If no `tsconfigPath` is set, Duck Gen prefers `tsconfig.duckgen.json` (if it
  exists) and falls back to `tsconfig.json`.
