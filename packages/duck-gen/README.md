# @gentleduck/gen

Duck Gen scans your TypeScript server code and generates type-safe route maps and
message registries. It is currently tested with NestJS.

## Install

```bash
pnpm add -D @gentleduck/gen
```

## Quick start

Create a `duck-gen.toml` at your project root:

```toml
framework = "nestjs"

[extensions.shared]
sourceGlobs = ["src/**/*.ts", "src/**/*.tsx"]
tsconfigPath = "./tsconfig.json"
includeNodeModules = false

[extensions.apiRoutes]
enabled = true
globalPrefix = "/api"
normalizeAnyToUnknown = true

[extensions.messages]
enabled = true
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

Generated files include:

- `duck-gen-api-routes.d.ts`
- `duck-gen-messages.d.ts`
- `index.d.ts`

## Notes

- If `duck-gen.toml` is missing, defaults are used.
- Run the CLI from the project root so paths resolve correctly.
- Message arrays should be `as const` so keys are literal types.

