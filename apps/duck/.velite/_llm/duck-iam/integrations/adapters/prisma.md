## Install

```typescript
import { PrismaAdapter } from '@gentleduck/iam/adapters/prisma'
```

Stores duck-iam state in your database through Prisma Client. Requires four models in your `schema.prisma`.

```bash
bun add @prisma/client
bun add -D prisma
```

---

## Required schema

Add these models to your `schema.prisma`:

```prisma
model AccessPolicy {
  id          String  @id
  name        String
  description String?
  version     Int     @default(1)
  algorithm   String
  rules       Json
  targets     Json?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("access_policies")
}

model AccessRole {
  id          String  @id
  name        String
  description String?
  permissions Json
  inherits    String[]
  scope       String?
  metadata    Json?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  assignments AccessAssignment[]

  @@map("access_roles")
}

model AccessAssignment {
  id        String  @id @default(cuid())
  subjectId String
  roleId    String
  scope     String?

  role      AccessRole @relation(fields: [roleId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([subjectId, roleId, scope])
  @@index([subjectId])
  @@map("access_assignments")
}

model AccessSubjectAttr {
  subjectId String @id
  data      Json

  updatedAt DateTime @updatedAt

  @@map("access_subject_attrs")
}
```

A copy lives at `node_modules/@gentleduck/iam/src/adapters/prisma/schema.prisma` for reference.

Run after editing:

```bash
bunx prisma migrate dev --name add-iam-models
bunx prisma generate
```

---

## Usage

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@gentleduck/iam/adapters/prisma'
import { Engine } from '@gentleduck/iam'

const prisma = new PrismaClient()
const adapter = new PrismaAdapter(prisma)

const engine = new Engine({ adapter, cacheTTL: 60 })
```

The adapter uses `upsert` for save operations, so calling `savePolicy` or `saveRole` with an existing ID updates the record rather than throwing a conflict error.

---

## How it maps

| Adapter method | Prisma operation |
| --- | --- |
| `listPolicies()` | `accessPolicy.findMany()` |
| `getPolicy(id)` | `accessPolicy.findUnique({ where: { id } })` |
| `savePolicy(p)` | `accessPolicy.upsert(...)` |
| `deletePolicy(id)` | `accessPolicy.delete({ where: { id } })` |
| `listRoles()` | `accessRole.findMany()` |
| `getRole(id)` | `accessRole.findUnique({ where: { id } })` |
| `saveRole(r)` | `accessRole.upsert(...)` |
| `deleteRole(id)` | `accessRole.delete({ where: { id } })` |
| `getSubjectRoles(id)` | `accessAssignment.findMany({ where: { subjectId } })` |
| `getSubjectScopedRoles(id)` | Same query, filtered for non-null scope |
| `assignRole(id, role, scope?)` | `accessAssignment.create(...)` |
| `revokeRole(id, role, scope?)` | `accessAssignment.deleteMany(...)` |
| `getSubjectAttributes(id)` | `accessSubjectAttr.findUnique(...)` |
| `setSubjectAttributes(id, attrs)` | `accessSubjectAttr.upsert(...)` (merges with existing) |

---

## Notes & caveats

- **`assignRole` is not idempotent** — it uses `create`, so a duplicate `(subjectId, roleId, scope)` will throw on the unique constraint. Catch the conflict in your application or check `getSubjectRoles` first.
- **`setSubjectAttributes` is read-merge-write** — concurrent writes can lose updates. For high-contention attribute writes, wrap in a Prisma transaction with `SELECT ... FOR UPDATE` semantics.
- **JSON columns** — Prisma handles `Json` natively. No manual stringify needed.

---

## When to use

- Production apps already on Prisma
- Multi-database support (Postgres, MySQL, SQLite, MongoDB, SQL Server, CockroachDB)
- Want type-safe SQL via Prisma Client

For pure SQL with stronger types and zero runtime, see [Drizzle](/docs/duck-iam/integrations/adapters/drizzle).