## Install

```typescript
import { IamFileAdapter } from '@gentleduck/iam/adapters/file'
```

JSON-on-disk store. Single-file persistence with read-through cache + write-back on every mutation. Single-writer: multiple processes against the same file will clobber each other without external locking. Suitable for CLIs, dev fixtures, and single-process apps.

For production with concurrent writers, use [Redis](/duck-iam/integrations/adapters/redis), [Prisma](/duck-iam/integrations/adapters/prisma), [Drizzle](/duck-iam/integrations/adapters/drizzle), or build a [custom adapter](/duck-iam/integrations/adapters/custom).

***

## Basic usage

```typescript
import fs from 'node:fs/promises'
import { IamFileAdapter } from '@gentleduck/iam/adapters/file'
import { IamEngine } from '@gentleduck/iam'

const adapter = new IamFileAdapter({
  path: '/var/lib/myapp/iam.json',
  fs,
})

const engine = new IamEngine({ adapter })

await adapter.savePolicy({
  id: 'allow-read',
  name: 'Allow Read',
  algorithm: 'deny-overrides',
  rules: [
    { id: 'r1', effect: 'allow', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } },
  ],
})

const allowed = await engine.can('user-1', 'read', { type: 'post', attributes: {} })
```

The adapter creates the parent directory on first write (`fs.mkdir(..., { recursive: true })`), so you don't need to ensure the path exists.

***

## Configuration

```typescript
import type { IamFile } from '@gentleduck/iam/adapters/file'

const init: IamFile.IInit = {
  path: '/var/lib/myapp/iam.json',
  fs: await import('node:fs/promises'),
}
```

| Option | Type     | Notes                                                                          |
|---|---|---|
| `path` | `string` | Absolute path to the JSON store. Created on first write if missing.            |
| `fs`   | `IamFile.IFS` | Filesystem driver - `node:fs/promises`-compatible. See "Custom FS" below. |

***

## On-disk layout

The adapter writes a single JSON file with four top-level keys:

```json
{
  "policies": {
    "allow-read": { "id": "allow-read", "name": "Allow Read", ... }
  },
  "roles": {
    "viewer": { "id": "viewer", "name": "Viewer", "permissions": [...] }
  },
  "assignments": {
    "user-1": [
      { "role": "viewer" },
      { "role": "editor", "scope": "org-acme" }
    ]
  },
  "attributes": {
    "user-1": { "department": "engineering", "status": "active" }
  }
}
```

Indented with `JSON.stringify(state, null, 2)` so the file is human-editable. Hand-edits between process restarts work - the adapter rereads on next mutation.

***

## Custom filesystem

`IamFile.IFS` is the minimal `node:fs/promises` surface the adapter needs. Implement it for in-memory testing, S3-backed durability, or any other backend:

```typescript
import type { IamFile } from '@gentleduck/iam/adapters/file'

const inMemoryFS: IamFile.IFS = {
  files: new Map<string, string>(),
  async readFile(path) {
    const v = this.files.get(path)
    if (v == null) throw new Error('ENOENT')
    return v
  },
  async writeFile(path, data) {
    this.files.set(path, data)
  },
  async mkdir() {
    /* no-op */
  },
}

const adapter = new IamFileAdapter({ path: '/store.json', fs: inMemoryFS })
```

Tests in the package use this pattern - no real filesystem touched.

***

## Error tolerance

The adapter starts with empty state when the file is missing or malformed:

```typescript
// File doesn't exist
const adapter = new IamFileAdapter({ path: '/nope/iam.json', fs })
await adapter.listPolicies() // -> []

// File is invalid JSON
fs.writeFileSync('/store.json', 'not-json{')
const adapter2 = new IamFileAdapter({ path: '/store.json', fs })
await adapter2.listPolicies() // -> []   (does not throw)
```

This makes it safe to deploy alongside a missing store, and resistant to partial-write corruption on the next start.

***

## Concurrency model

Single-writer. The adapter caches state in memory and writes the full JSON document on every mutation. If two processes share the same file, the second write clobbers the first.

For concurrent-writer scenarios:

* **Same machine, multiple processes** - use [Redis](/duck-iam/integrations/adapters/redis) or [Prisma](/duck-iam/integrations/adapters/prisma).
* **Hand-editable + horizontally scaled** - keep the JSON in version control, build a custom adapter that pulls from it on `refresh()` and writes go through a CI pipeline.

The adapter coalesces concurrent in-process reads via a single-flight `loadInFlight` promise, so the first read populates the cache for everyone else without duplicating disk reads.

***

## When to use it

yes CLI tools that ship pre-baked policies
yes Dev fixtures committed to a repo
yes Single-process apps (Electron, desktop daemons, sidecars)
yes Tests that need persistence between assertions but not between runs

no Multi-process production servers
no Apps with >10k policy mutations/sec (pays a full JSON serialize on every write)
no Apps requiring transactional cross-key updates

***

## See also

* [Memory adapter](/duck-iam/integrations/adapters/memory) - same shape, in-process only, no persistence.
* [Custom adapter](/duck-iam/integrations/adapters/custom) - implement `IamAdapter.IAdapter` for any backend.
* [Adapter comparison](/duck-iam/integrations/adapters/comparison) - feature matrix across all storage backends.