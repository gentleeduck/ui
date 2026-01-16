# @gentleduck/gen

Duck Gen scans your TypeScript server code and generates type-safe route maps and
message registries. It is currently tested with NestJS.

## Install

```bash
pnpm add -D @gentleduck/gen
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
pnpm exec duck-gen
```

Import generated types:

```ts
import type {
  ApiRoutes,
  DuckGenI18nMessages,
  DuckgenScopedI18nByGroup,
} from '@gentleduck/gen/nestjs'
```

## Output

Duck Gen writes type definitions to `@gentleduck/gen/generated/<framework>` and
exposes them via framework entrypoints like `@gentleduck/gen/nestjs`.
You can override the output file per feature by setting
`extensions.apiRoutes.outputSource` or `extensions.messages.outputSource` in
`duck-gen.json` (paths resolve relative to the config file). Outputs are always
written to the package `generated` folder; `outputSource` adds extra output
files or directories. Use `extensions.shared.outputSource` to add shared output
directories. When you customize outputs, import types from those files directly
instead of the package entrypoints.

Generated files include:

- `duck-gen-api-routes.d.ts`
- `duck-gen-messages.d.ts`
- `index.d.ts`

## Notes

- If `duck-gen.json` is missing, defaults are used.
- Run the CLI from the project root so paths resolve correctly.
- Message arrays should be `as const` so keys are literal types.
