**`@gentleduck/gen` is deprecated and no longer maintained.** Use the
NestJS-native toolchain instead — it covers the same surface (typed routes,
typed bodies, runtime validation, SDK generation) with a real compiler
transformer, full tooling, and an active community.

- **[nestia](https://nestia.io/)** — typed `@TypedRoute` / `@TypedBody` /
  `@TypedQuery` / `@TypedParam` decorators, automatic SDK generation, Swagger
- **[typia](https://typia.io/)** — runtime validators, serializers, JSON
  schema generation from TypeScript types via a TS transformer plugin

Migration: replace `@Body(typiaBody

Here is the step-by-step flow:

1. **Load config**: Duck Gen reads `duck-gen.json` from your project root. This tells it
   which framework adapter to use, where your `tsconfig.json` lives, and what to generate.

2. **Build the project**: Using [ts-morph](https://ts-morph.com/), it creates an in-memory
   TypeScript project from your `tsconfigPath`. The `include` and `exclude` globs in your
   `tsconfig.json` determine which files get scanned.

3. **Scan source files**: The NestJS adapter looks for:
   - Classes decorated with `@Controller()`, these become API routes.
   - Exported variables with `@duckgen` JSDoc tags, these become message sources.

4. **Extract type information**: For each controller method, Duck Gen extracts:
   - The HTTP method (`GET`, `POST`, etc.) from decorators.
   - The full route path (`globalPrefix` + controller path + method path).
   - Request shape from parameter decorators (`@Body`, `@Query`, `@Param`, `@Headers`).
   - Response type from the method's return type.

5. **Emit `.d.ts` files**: Generated type files are written to the package's `generated`
   folder and optionally to custom output directories.

} title="Under the hood">
  Duck Gen uses [ts-morph](https://ts-morph.com/) (a TypeScript compiler wrapper) with full
  type resolution. It understands generics, utility types, type aliases, and nested return
  types, not just plain interfaces.

## Quick start

Install the package

```bash
bun add -d @gentleduck/gen
```

Create duck-gen.json in your project root

```json title="duck-gen.json"
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
      "outputSource": "./generated"
    },
    "messages": {
      "enabled": true,
      "outputSource": "./generated"
    }
  }
}
```

The `$schema` field gives you autocomplete and validation in your editor.

Run the generator

```bash
bunx duck-gen
```

You should see output like:

```text
Config loaded
Processing done
```

Import and use the generated types

```ts
import type { ApiRoutes, RouteReq, RouteRes } from '@gentleduck/gen/nestjs'

// Now your client knows every route, request shape, and response type
type SigninRequest = RouteReq<'/api/auth/signin'>
type SigninResponse = RouteRes<'/api/auth/signin'>
```

## Output files

Duck Gen always writes to the package's `generated` folder:

```text
node_modules/@gentleduck/gen/
  generated/
    nestjs/
      duck-gen-api-routes.d.ts   # route types
      duck-gen-messages.d.ts     # message types
      index.d.ts                 # barrel export
    index.d.ts                   # top-level barrel
```

If you set `outputSource` in your config, Duck Gen also copies the generated files to those
locations (e.g. `./generated` in your project root).

**Import paths:**

```ts
// From the package entrypoint (recommended)
import type { ApiRoutes, RouteReq, RouteRes } from '@gentleduck/gen/nestjs'

// From a custom output directory
import type { ApiRoutes } from './generated/duck-gen-api-routes'
```

} title="Which import path should I use?">
  Use the package entrypoint (`@gentleduck/gen/nestjs`) by default. It works in monorepo
  and standalone setups. Use a custom output path only when you need types in a package
  that cannot import `@gentleduck/gen`.

## CLI usage

Add a script to your `package.json` for convenience:

```json title="package.json"
{
  "scripts": {
    "generate": "duck-gen",
    "generate:watch": "duck-gen --watch"
  }
}
```

```bash
# Run directly
bunx duck-gen

# Or via script
bun run generate
```

**CLI behavior:**

- Requires `duck-gen.json` in the current directory. Fails if missing.
- Overwrites existing generated files on every run. Safe to run repeatedly.
- Prints warnings for `any` return types and duplicate message const names.
- Deterministic output. Safe for CI/CD pipelines.

## What to read next

| Guide | What you will learn |
| --- | --- |
| [Configuration](/duck-gen/configuration) | Every config option explained with examples. |
| [API Routes](/duck-gen/api-routes) | How route scanning works, supported decorators, request shape rules, and examples. |
| [Messages](/duck-gen/messages) | How message scanning works, tag formats, i18n type generation. |
| [Generated Types](/duck-gen/generated-types) | Deep dive into every exported type with usage examples. |
| [Duck Query](/duck-query) | Use generated types with a type-safe HTTP client. |
| [Templates](/duck-gen/templates) | Complete NestJS + Duck Query example project. |

## Troubleshooting

| Problem | Solution |
| --- | --- |
| No routes generated | Make sure decorators use **string literal** paths. Dynamic values are skipped. |
| Missing types in output | Check that `tsconfigPath` points to the right file and your `tsconfig.json` includes the source files. |
| Message keys are just `string` | Add `as const` to your message arrays or objects. |
| Duplicate group key warnings | Each `@duckgen` group key must be unique across your project. |
| `any` return warnings | Add explicit return types to controller methods, or set `normalizeAnyToUnknown: false`. |
| Config file not found | Run `duck-gen` from the directory containing `duck-gen.json`. |

## Requirements

- **Bun** 1.3.5 or newer.
- A **TypeScript** project with a valid `tsconfig.json`.
- **NestJS** (for the current tested adapter).

## Contributing

Duck Gen lives in the Gentleduck monorepo. Open issues and pull requests at
[`@gentleduck`](https://github.com/gentleeduck/duck-gen).