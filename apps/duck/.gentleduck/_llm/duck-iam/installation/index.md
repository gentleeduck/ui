## Prerequisites

* Node.js 18+
* TypeScript 5.0+. duck-iam uses const type parameters and the `satisfies` operator.
* npm, bun, or pnpm.

## Install duck-iam

The core engine, memory adapter, type builders, and all integration entry points are in a single package.

Install the package

```bash
# npm
npm install @gentleduck/iam

# bun
bun add @gentleduck/iam

# pnpm
pnpm add @gentleduck/iam
```

Basic setup

```typescript title="src/lib/access.ts"
import { createAccessConfig, MemoryAdapter } from "@gentleduck/iam";

// 1. Define your application's actions, resources, and scopes
const access = createAccessConfig({
  actions: ["create", "read", "update", "delete", "manage"],
  resources: ["post", "comment", "user", "team"],
  scopes: ["org"],
} as const);

// 2. Define roles using typed builders
const viewer = access
  .defineRole("viewer")
  .grantRead("post", "comment")
  .build();

const editor = access
  .defineRole("editor")
  .inherits("viewer")
  .grant("create", "post")
  .grant("update", "post")
  .grant("create", "comment")
  .build();

const admin = access
  .defineRole("admin")
  .inherits("editor")
  .grant("delete", "post")
  .grant("delete", "comment")
  .grantCRUD("user")
  .grant("manage", "team")
  .build();

// 3. Create an adapter
const adapter = new MemoryAdapter({
  roles: [viewer, editor, admin],
  assignments: {
    "user-1": ["admin"],
    "user-2": ["editor"],
    "user-3": ["viewer"],
  },
});

// 4. Create the engine
export const engine = access.createEngine({ adapter });
```

Check permissions

```typescript
// Simple boolean check
const canCreate = await engine.can(
  "user-2",
  "create",
  { type: "post", attributes: {} }
);
// -> true (editor can create posts)

const canDelete = await engine.can(
  "user-2",
  "delete",
  { type: "post", attributes: {} }
);
// -> false (editor cannot delete posts)

// Full decision with metadata
const decision = await engine.check(
  "user-2",
  "delete",
  { type: "post", attributes: {} }
);
// -> { allowed: false, effect: "deny", reason: "...", duration: 0.12, ... }

// Debug why a permission was granted or denied
const trace = await engine.explain(
  "user-2",
  "delete",
  { type: "post", attributes: {} }
);
// -> detailed trace of every policy, rule, and condition evaluated
```

Batch permission checks

Batch-load permissions for a user, useful for hydrating client-side UI:

```typescript
const permissions = await engine.permissions("user-2", [
  { action: "create", resource: "post" },
  { action: "update", resource: "post" },
  { action: "delete", resource: "post" },
  { action: "manage", resource: "team" },
]);
// -> { "create:post": true, "update:post": true, "delete:post": false, "manage:team": false }
```

## Optional Peer Dependencies

| Integration | Peer dependency | Install |
| --- | --- | --- |
| React client | `react >= 18.0.0` | `bun add react` |
| Vue client | `vue >= 3.3.0` | `bun add vue` |
| Prisma adapter | `@prisma/client >= 5.0.0` | `bun add @prisma/client` |
| Drizzle adapter | `drizzle-orm >= 0.30.0` | `bun add drizzle-orm` |
| Redis adapter | `ioredis >= 5.0.0` or `redis >= 4.0.0` | `bun add ioredis` |

The core engine, memory adapter, HTTP adapter, and all server integrations (Express, Hono, NestJS, Next.js) have zero peer dependencies. The Drizzle schemas (`/adapters/drizzle/schema/{pg,mysql,sqlite}`) require `drizzle-orm` since they re-export Drizzle table builders.

## Import Paths

duck-iam uses subpath exports:

```typescript
// Core engine, builders, memory adapter, types
import { Engine, defineRole, policy, when, MemoryAdapter } from "@gentleduck/iam";

// Server integrations
import { accessMiddleware, guard } from "@gentleduck/iam/server/express";
import { accessMiddleware, guard } from "@gentleduck/iam/server/hono";
import { Authorize, nestAccessGuard } from "@gentleduck/iam/server/nest";
import { withAccess, checkAccess, getPermissions } from "@gentleduck/iam/server/next";

// Client libraries
import { createAccessControl } from "@gentleduck/iam/client/react";
import { createVueAccess } from "@gentleduck/iam/client/vue";
import { AccessClient } from "@gentleduck/iam/client/vanilla";

// Storage adapters
import { MemoryAdapter } from "@gentleduck/iam/adapters/memory";
import { PrismaAdapter } from "@gentleduck/iam/adapters/prisma";
import { DrizzleAdapter } from "@gentleduck/iam/adapters/drizzle";
import { RedisAdapter } from "@gentleduck/iam/adapters/redis";
import { HttpAdapter } from "@gentleduck/iam/adapters/http";

// Drizzle pre-built schemas (pick one dialect)
import * as schema from "@gentleduck/iam/adapters/drizzle/schema/pg";
// or:    @gentleduck/iam/adapters/drizzle/schema/mysql
// or:    @gentleduck/iam/adapters/drizzle/schema/sqlite
```

## TypeScript Configuration

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

`strict` enables const type parameter inference for type-safe role and policy builders. `bundler` module resolution is required for subpath exports; `"moduleResolution": "nodenext"` also works.

## Next Steps

* [Quick Start](/duck-iam/guides): end-to-end walkthrough with roles, policies, server middleware, and client hooks.
* [Core Concepts](/duck-iam/core): deep dive into the RBAC + ABAC evaluation model.
* [Integrations](/duck-iam/integrations/adapters): set up Express, Hono, NestJS, or Next.js middleware.

***

## Installation FAQ

Do I need every peer dependency to use duck-iam?

No. <code className="rounded bg-muted px-2 py-1">react</code>, <code className="rounded bg-muted px-2 py-1">vue</code>,
and <code className="rounded bg-muted px-2 py-1">@prisma/client</code> are optional peers. Install only the
peers needed by the subpaths you import.

Why do the package runtime requirements differ from the monorepo tooling requirements?

The published package targets Node.js 18+ runtimes. The monorepo also includes docs, examples,
and workspace tooling that may require newer Node or Bun versions.

Can I import only the pieces I need?

Yes. The package uses subpath exports such as <code className="rounded bg-muted px-2 py-1">@gentleduck/iam/server/express</code>,
<code className="rounded bg-muted px-2 py-1">@gentleduck/iam/client/react</code>, and
<code className="rounded bg-muted px-2 py-1">@gentleduck/iam/adapters/drizzle</code> so framework-specific code stays opt-in.

Do I have to use createAccessConfig() on day one?

No. You can start with the untyped builders and add <code className="rounded bg-muted px-2 py-1">createAccessConfig()</code>
when you want compile-time validation for actions, resources, scopes, and roles.

What should I seed first in a new project?

Start with your stable role definitions, a small set of core policies, and the initial role assignments
needed to boot the app. Subject attributes can be added later as your domain data becomes available.

Can I mix root imports with adapter, server, and client subpaths?

Yes. Import builders, types, and the engine from
<code className="rounded bg-muted px-2 py-1">@gentleduck/iam</code>, then pull framework-specific pieces from
their subpaths such as <code className="rounded bg-muted px-2 py-1">@gentleduck/iam/server/next</code> or
<code className="rounded bg-muted px-2 py-1">@gentleduck/iam/client/react</code>.

Why is MemoryAdapter available from both the root package and its own subpath?

It is exported from the root as a convenience for tests, demos, and quick prototypes. The dedicated subpath
exists for consistency with the other adapters.

Why do I not get strong autocomplete immediately after installing?

Strong autocomplete depends on type information, not just the package install. Use
<code className="rounded bg-muted px-2 py-1">createAccessConfig()</code> with
<code className="rounded bg-muted px-2 py-1">as const</code> arrays for actions/resources/scopes, and add a typed
<code className="rounded bg-muted px-2 py-1">context</code> if you want rich dot-path and `$` value suggestions.