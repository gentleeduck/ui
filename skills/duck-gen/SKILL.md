---
name: duck-gen
description: >-
  Use when working with @gentleduck/gen, the type-safe API route and message code
  generator for TypeScript. Covers duck-gen.json configuration, NestJS controller
  scanning, API route type map generation, @duckgen message tagging, i18n type
  emission, the duck-gen CLI, and the @gentleduck/query typed Axios client.
allowed-tools: Read Grep Glob
argument-hint: "[extension-or-topic]"
---

# @gentleduck/gen

You are an expert on duck-gen, the compile-time code generation toolchain for the gentleduck ecosystem. Your scope covers `packages/duck-gen/` (the generator), `packages/duck-query/` (the typed client), and `packages/duck-ttest/` (type testing).

## Architecture Overview

duck-gen is a CLI tool that reads a `duck-gen.json` config, scans a TypeScript project using ts-morph, and emits `.d.ts` type declaration files. It has two main extensions:

1. **API Routes** -- scans NestJS controllers and emits a typed route map (`ApiRoutes` interface)
2. **Messages** -- scans `@duckgen`-tagged const exports and emits i18n type dictionaries

The generated types power `@gentleduck/query`, a typed Axios client that enforces request/response shapes at compile time.

## Package Map

| Package | npm | Purpose |
|---|---|---|
| `packages/duck-gen/` | `@gentleduck/gen` | CLI + code generator |
| `packages/duck-query/` | `@gentleduck/query` | Typed Axios client consuming generated types |
| `packages/duck-ttest/` | `@gentleduck/ttest` | Compile-time type testing utilities |
| `apps/duck-gen-docs/` | private | Documentation site (Next.js + MCP server) |

## Source Structure

```
packages/duck-gen/
  bin/duck-gen.js           # CLI entry (bun shim)
  src/
    index.ts                # CLI runner: loads config, resolves outputs, runs processor
    config/
      index.ts              # Barrel re-export
      config.dto.ts         # Zod schema for duck-gen.json (DuckGenConfig type)
      config.ts             # load_duckgen_config() -- reads and validates duck-gen.json
      config.libs.ts        # INI-style parser helpers (strip_comment, parse_value, unquote, ensure_object_at_path)
    core/
      paths.ts              # Output path resolution, emitFrameworkIndex, emitGeneratedIndex
      types.ts              # DuckGenOutputPaths, DuckGenOutputTargets
    framework/
      index.ts              # getFrameworkProcessor() dispatcher
      nestjs/
        index.ts            # Barrel re-export
        nestjs.ts           # processNestJs() -- orchestrates API routes + messages
        api-routes/
          index.ts          # Barrel re-export
          api-routes.ts     # processNestJsApiRoutes() -- scans @Controller classes
          api-routes.emit.ts    # emitApiRoutesFile() -- writes the .d.ts output
          api-routes.types.ts   # Route, HttpMethod, ImportMaps, TypeSymbolImportInfo
          api-routes.constants.ts  # HTTP_METHOD_DECORATORS, HTTP_METHODS
          api-routes.libs.ts    # AST helpers for decorators, type text, imports
          type-expander.ts      # Deep type expansion for response types
    messages/
      index.ts              # Barrel re-export
      messages.ts           # scanDuckgenMessages() -- finds @duckgen-tagged exports
      messages.emit.ts      # emitDuckgenMessagesFile() -- writes i18n types
      messages.libs.ts      # parseDuckgenMessagesTag() -- JSDoc tag parser
      messages.types.ts     # DuckgenMessageSource
    shared/
      project.ts            # getProject() -- cached ts-morph Project factory
      utils.ts              # relImport, formatPropKey, sanitizeTypeText, doc, sortMap, isNodeModulesFile
```

## Configuration (duck-gen.json)

The config file lives at the project root. Schema defined in `config.dto.ts` using Zod:

```json
{
  "framework": "nestjs",
  "extensions": {
    "shared": {
      "includeNodeModules": false,
      "tsconfigPath": "./tsconfig.json",
      "sourceGlobs": ["src/**/*.ts"],
      "outputSource": "./some/path"
    },
    "apiRoutes": {
      "enabled": true,
      "globalPrefix": "/api",
      "normalizeAnyToUnknown": true,
      "outputSource": "./generated",
      "outputPath": "./generated",
      "sourceGlobs": ["src/**/*.controller.ts"],
      "tsconfigPath": "./tsconfig.json"
    },
    "messages": {
      "enabled": true,
      "outputSource": "./generated",
      "outputPath": "./generated",
      "sourceGlobs": ["src/**/*.messages.ts"],
      "tsconfigPath": "./tsconfig.json"
    }
  }
}
```

Key fields:
- `framework` -- only `"nestjs"` is supported currently
- `extensions.shared.outputSource` -- output directories merged into both apiRoutes and messages output paths
- `extensions.apiRoutes.globalPrefix` -- prepended to all route paths (optional)
- `extensions.apiRoutes.normalizeAnyToUnknown` -- replaces `any` with `unknown` in output
- `outputSource` -- string or string array of extra output directories (per-extension or shared)
- `outputPath` -- fallback for `outputSource` when both are set on apiRoutes or messages; `outputSource` takes precedence
- `tsconfigPath` -- path to tsconfig.json (optional, per-extension or shared)

## API Route Generation

The generator scans NestJS controller files for `@Controller` decorated classes and HTTP method decorators (`@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`, etc.).

For each route method it extracts:
- **Path**: joined from `globalPrefix` + controller prefix + method path
- **HTTP method**: from the decorator name
- **Body/Query/Params/Headers**: from `@Body()`, `@Query()`, `@Param()`, `@Headers()` parameter decorators
- **Response type**: the awaited return type, deeply expanded

The output is a `.d.ts` file with:
```typescript
export interface ApiRoutes {
  '/api/auth/signin': RouteMeta<SignInDto, never, never, never, AuthResponse, 'POST'>
  '/api/users/:id': RouteMeta<never, never, { id: string }, never, UserResponse, 'GET'>
}

export type RoutePath = keyof ApiRoutes
export type RouteMethod<P extends RoutePath> = RouteOf<P>['method']
export type RouteRes<P extends RoutePath> = RouteOf<P>['res']
export type RouteReq<P extends RoutePath> = CleanupNever<Pick<RouteOf<P>, 'body' | 'query' | 'params' | 'headers'>>
export type DuckFetcher = <P extends RoutePath>(path: P, req: RouteReq<P>) => Promise<RouteRes<P>>
export type RouteMethods = ApiRoutes[RoutePath]['method']
export type RouteOfMethod<P extends keyof ApiRoutes, M extends RouteMethods> = Extract<RouteOf<P>, { method: M }>
export type RouteResMethod<P extends RoutePath, M extends RouteMethods> = RouteOfMethod<P, M>['res']
export type RouteReqMethod<P extends RoutePath, M extends RouteMethods> = CleanupNever<Pick<RouteOfMethod<P, M>, 'body' | 'query' | 'params' | 'headers'>>
export type PathsByMethod<M extends RouteMethods> = { [P in RoutePath]: M extends RouteMethod<P> ? P : never }[RoutePath]
export type DuckClient = { request: DuckFetcher; byMethod: ... }
// plus: GetBody, GetQuery, GetParams, GetHeaders, GetRes, GetReq
```

## Message Generation (i18n)

Tag exported const arrays or objects with `@duckgen` in JSDoc:

```typescript
/** @duckgen messages auth */
export const AUTH_MESSAGES = ['signin.success', 'signin.error', 'signout'] as const

/** @duckgen users */
export const USER_MESSAGES = { 'user.created': true, 'user.deleted': true } as const
```

Supported tag forms:
- `@duckgen` -- uses the const name as group key
- `@duckgen messages` -- same, explicit "messages" keyword
- `@duckgen messages auth` -- uses "auth" as group key
- `@duckgen auth` -- shorthand, uses "auth" as group key

The output `.d.ts` file emits:
```typescript
export type DuckgenMessageSources = {
  auth: typeof AUTH_MESSAGES
  users: typeof USER_MESSAGES
}
export type DuckgenMessageGroup = keyof DuckgenMessageSources
export type DuckgenMessageKey<G extends DuckgenMessageGroup> = ...
export type DuckgenMessageDictionary<G extends DuckgenMessageGroup> = Record<DuckgenMessageKey<G>, string>
export type DuckGenI18nMessages = DuckgenMessageDictionaryByGroup
export type DuckgenI18n<Lang extends string, G extends DuckgenMessageGroup> = Record<Lang, DuckgenMessageDictionary<G>>
export type DuckgenI18nByGroup<Lang extends string> = Record<Lang, DuckGenI18nMessages>
export type DuckgenScopedI18nByGroup<Lang, ScopeOrMessages, Messages> = ...
```

## @gentleduck/query (Typed Client)

`packages/duck-query/` provides `createDuckQueryClient<Routes>()` which returns a typed Axios wrapper:

```typescript
import { createDuckQueryClient } from '@gentleduck/query'
import type { ApiRoutes } from '@gentleduck/gen/generated'

const api = createDuckQueryClient<ApiRoutes>({ baseURL: 'https://api.example.com' })

// Fully typed -- path, request shape, and response are inferred
// All methods return Promise<AxiosResponse<RouteRes>>
const res = await api.post('/api/auth/signin', { body: { email, password } })
const user = await api.get('/api/users/:id', { params: { id: '123' } })

// Access the underlying Axios instance
api.axios.interceptors.request.use(...)
```

Client properties and methods:
- `axios` -- the underlying `AxiosInstance`
- `request` -- generic fetcher (uses `config.method` or defaults to GET)
- `byMethod` -- explicit method + path fetcher
- `get`, `post`, `put`, `patch`, `del` -- shorthand methods

All methods accept an optional trailing `AxiosRequestConfig` for per-request overrides.

Accepts either an `AxiosInstance` or `AxiosRequestConfig` as the argument to `createDuckQueryClient`.

## CLI Usage

```bash
# Run via npx or bunx (bin name is "duck-gen")
npx duck-gen
bunx duck-gen
```

The CLI reads `duck-gen.json` from cwd, runs the configured extensions, and writes `.d.ts` files to the specified output paths. Uses `ora` for spinners and `chalk` for colored output.

## Import Paths

```typescript
// Generator config types
import type { DuckGenConfig } from '@gentleduck/gen'

// Generated type declarations (after running duck-gen)
import type { ApiRoutes } from '@gentleduck/gen/generated'
import type { ApiRoutes } from '@gentleduck/gen/nestjs'

// JSON schema
import schema from '@gentleduck/gen/schema'

// Typed Axios client
import { createDuckQueryClient } from '@gentleduck/query'
```

## Coding Style

- **Runtime**: Bun (>=1.3.5), ESM (`"type": "module"`)
- **Formatter**: Biome -- single quotes, no semicolons (as-needed), trailing commas, 120 line width, 2-space indent
- **Naming**: snake_case for config/internal functions (`load_duckgen_config`, `config_schema`), camelCase for public API and framework code (`processNestJs`, `emitApiRoutesFile`)
- **Imports**: `node:` protocol for Node builtins, `import type` for type-only imports
- **File naming**: `{feature}.ts` for main, `{feature}.types.ts`, `{feature}.emit.ts`, `{feature}.libs.ts`, `{feature}.constants.ts`
- **Comments**: duck emoji prefix for doc comments (`// 🦆 ...` or `/** 🦆 ... */`)
- **Validation**: Zod schemas for config, ts-morph for AST analysis
- **Build**: tsdown for library builds
- **No semicolons** at end of statements (Biome enforces as-needed)
- **Generated files** start with `// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.`

## Do Not

- Do not manually edit files under `generated/` -- they are auto-generated by the CLI
- Do not add framework processors without updating `getFrameworkProcessor()` in `framework/index.ts`
- Do not use `require()` -- the codebase is ESM-only
- Do not skip the Zod validation step when loading config
- Do not import from internal source paths in consumer code -- use the package export map
- Do not add `any` types without `normalizeAnyToUnknown` handling
- Do not create circular imports between `messages/` and `framework/nestjs/api-routes/`
