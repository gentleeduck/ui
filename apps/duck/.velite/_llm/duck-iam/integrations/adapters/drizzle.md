## Install

```typescript
import { DrizzleAdapter } from '@gentleduck/iam/adapters/drizzle'
```

Works with any Drizzle ORM driver. Pre-built schema modules are shipped for all three SQL dialects.

```bash
bun add drizzle-orm
bun add -D drizzle-kit
```

---

## Pre-built schemas

Pick the entry that matches your database. All three define the same four tables (`access_policies`, `access_roles`, `access_assignments`, `access_subject_attrs`) with dialect-appropriate column types.

### PostgreSQL

```typescript
import {
  accessPolicies,
  accessRoles,
  accessAssignments,
  accessSubjectAttrs,
} from '@gentleduck/iam/adapters/drizzle/schema/pg'
```

- `jsonb` for rules, permissions, targets, metadata, attributes
- Native `text[]` for `inherits`
- `timestamptz` with `defaultNow()` and auto-updated `updated_at`

### MySQL

```typescript
import {
  accessPolicies,
  accessRoles,
  accessAssignments,
  accessSubjectAttrs,
} from '@gentleduck/iam/adapters/drizzle/schema/mysql'
```

- `json` columns (MySQL native)
- `varchar(191)` for IDs (utf8mb4 + index-friendly)
- `datetime(3)` with millisecond precision

### SQLite

```typescript
import {
  accessPolicies,
  accessRoles,
  accessAssignments,
  accessSubjectAttrs,
} from '@gentleduck/iam/adapters/drizzle/schema/sqlite'
```

- `text` for JSON columns (adapter auto-parses on read, stringifies on write)
- `integer` ms epoch for timestamps
- Default `[]` for `inherits` text column

---

## What each schema includes

- Primary keys, FK cascade on `roleId` -> `accessRoles.id`
- Unique index on `(subjectId, roleId, scope)` for idempotent assignments
- Lookup index on `subjectId` for fast role queries
- Auto-managed `created_at` / `updated_at`

---

## Generating migrations

Re-export the schema from your own schema barrel so `drizzle-kit` picks it up:

```typescript
// db/schema.ts
export * from '@gentleduck/iam/adapters/drizzle/schema/pg'

// ...your own tables alongside
import { pgTable, text } from 'drizzle-orm/pg-core'
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
})
```

Configure `drizzle.config.ts` to point at this barrel, then:

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

---

## Usage

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq, and } from 'drizzle-orm'
import { Pool } from 'pg'
import { DrizzleAdapter } from '@gentleduck/iam/adapters/drizzle'
import { Engine } from '@gentleduck/iam'
import {
  accessPolicies,
  accessRoles,
  accessAssignments,
  accessSubjectAttrs,
} from '@gentleduck/iam/adapters/drizzle/schema/pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

const adapter = new DrizzleAdapter({
  db,
  tables: {
    policies: accessPolicies,
    roles: accessRoles,
    assignments: accessAssignments,
    attrs: accessSubjectAttrs,
  },
  ops: { eq, and },
})

const engine = new Engine({ adapter, cacheTTL: 60 })
```

---

## Constructor config

| Option | Type | Description |
| --- | --- | --- |
| `db` | Drizzle database instance | Your Drizzle `db` object with `select`, `insert`, `delete` |
| `tables.policies` | Drizzle table | Policy table reference |
| `tables.roles` | Drizzle table | Role table reference |
| `tables.assignments` | Drizzle table | Assignment table reference |
| `tables.attrs` | Drizzle table | Subject attributes table reference |
| `ops.eq` | `(col, val) -> condition` | Drizzle `eq` operator |
| `ops.and` | `(...conditions) -> condition` | Drizzle `and` operator |

You can swap in your own table definitions if you need extra columns or a different naming scheme — only the column names listed in the schema files are required.

---

## JSON handling

The Drizzle adapter handles JSON serialization automatically:

- **PostgreSQL** — `jsonb` columns pass through as parsed objects
- **MySQL** — `json` columns pass through as parsed objects
- **SQLite** — `text` columns are JSON.parse'd on read and JSON.stringify'd on write

Inherits arrays follow the same pattern: native `text[]` on PG, JSON-stringified array on MySQL/SQLite.

---

## Notes & caveats

- **`assignRole` uses `onConflictDoNothing`** — already idempotent, calling twice is safe.
- **`setSubjectAttributes` is read-merge-write** — same race risk as Prisma. Wrap in a transaction for high-contention writes.
- **Custom column names** — if you rename columns in the table definition, the adapter still works as long as the keys passed in `tables.*` match. Drizzle's table inference handles the rest.

---

## When to use

- Production apps already on Drizzle
- SQL-first teams that want zero runtime overhead
- Edge runtimes (Drizzle works on Cloudflare D1, Neon serverless, etc.)

For ORM-style queries with relation modeling, see [Prisma](/docs/duck-iam/integrations/adapters/prisma).