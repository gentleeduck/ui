## The Adapter interface

Any object satisfying this interface can plug into `IamEngine`:

```typescript
import type { IamAdapter, AccessControl, IamRequest, Attributes } from '@gentleduck/iam'

interface IamAdapter.IAdapter<TAction, TResource, TRole, TScope> {
  // PolicyStore
  listPolicies(opts?: IamAdapter.IReadOptions): Promise<AccessControl.IPolicy<TAction, TResource, TRole>[]>
  getPolicy(id: string, opts?: IamAdapter.IReadOptions): Promise<AccessControl.IPolicy<TAction, TResource, TRole> | null>
  savePolicy(policy: AccessControl.IPolicy<TAction, TResource, TRole>): Promise<void>
  deletePolicy(id: string): Promise<void>

  // RoleStore
  listRoles(opts?: IamAdapter.IReadOptions): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope>[]>
  getRole(id: string, opts?: IamAdapter.IReadOptions): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope> | null>
  saveRole(role: AccessControl.IRole<TAction, TResource, TRole, TScope>): Promise<void>
  deleteRole(id: string): Promise<void>

  // SubjectStore
  getSubjectRoles(subjectId: string, opts?: IamAdapter.IReadOptions): Promise<TRole[]>
  getSubjectScopedRoles?(subjectId: string, opts?: IamAdapter.IReadOptions): Promise<IamRequest.IScopedRole<TRole, TScope>[]>
  assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void>
  revokeRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void>
  getSubjectAttributes(subjectId: string, opts?: IamAdapter.IReadOptions): Promise<Attributes>
  setSubjectAttributes(subjectId: string, attrs: Attributes): Promise<void>
}
```

`getSubjectScopedRoles` is **optional**. If your application doesn't use scoped roles, omit it. When absent, the engine treats scoped assignments as empty and continues with global role evaluation only.

Adapter read methods now accept an optional `opts?: IamAdapter.IReadOptions` argument carrying a `signal?: AbortSignal`.
The engine uses it to honor `adapterTimeoutMs` and to abort in-flight reads when an invalidation arrives.
Custom adapters can either forward the signal to the underlying client (recommended for network/DB calls) or safely
ignore it - the engine treats both as valid.

***

## Example: DynamoDB sketch

```typescript
import type { IamAdapter, Policy, Role, Attributes, ScopedRole } from '@gentleduck/iam'
import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

export class DynamoAdapter implements Adapter {
  constructor(
    private db: DynamoDBDocument,
    private table: string,
  ) {}

  async listPolicies(): Promise<Policy[]> {
    const out = await this.db.scan({
      TableName: this.table,
      FilterExpression: '#k = :k',
      ExpressionAttributeNames: { '#k': 'kind' },
      ExpressionAttributeValues: { ':k': 'policy' },
    })
    return (out.Items ?? []).map((i) => i.value as Policy)
  }

  async getPolicy(id: string): Promise<Policy | null> {
    const out = await this.db.get({ TableName: this.table, Key: { pk: `policy#${id}` } })
    return (out.Item?.value as Policy) ?? null
  }

  async savePolicy(p: Policy): Promise<void> {
    await this.db.put({
      TableName: this.table,
      Item: { pk: `policy#${p.id}`, kind: 'policy', value: p },
    })
  }

  async deletePolicy(id: string): Promise<void> {
    await this.db.delete({ TableName: this.table, Key: { pk: `policy#${id}` } })
  }

  // ... implement remaining methods for roles and subjects
}
```

***

## Example: MongoDB sketch

```typescript
import type { IamAdapter, Policy } from '@gentleduck/iam'
import type { Db } from 'mongodb'

export class MongoAdapter implements Adapter {
  constructor(private db: Db) {}

  async listPolicies(): Promise<Policy[]> {
    return this.db.collection<Policy>('access_policies').find({}).toArray()
  }

  async getPolicy(id: string): Promise<Policy | null> {
    return this.db.collection<Policy>('access_policies').findOne({ id })
  }

  async savePolicy(p: Policy): Promise<void> {
    await this.db.collection('access_policies').replaceOne({ id: p.id }, p, { upsert: true })
  }

  async deletePolicy(id: string): Promise<void> {
    await this.db.collection('access_policies').deleteOne({ id })
  }

  // ... implement remaining methods
}
```

***

## Implementation guidelines

### Idempotency

`assignRole` should be idempotent. Use unique constraints, set semantics (Redis), or `INSERT ... ON CONFLICT DO NOTHING` (SQL). Calling `assignRole(subjectId, roleId, scope)` twice with the same arguments must not throw.

### Scoped roles

If you store scoped and unscoped assignments together, `getSubjectRoles` should return **only unscoped assignments**, and `getSubjectScopedRoles` should return only scoped. The engine merges them based on request scope.

The `IamMemoryAdapter` returns both from `getSubjectRoles` (which then gets deduplicated by the engine) - both shapes work. The cleaner contract is split.

### Attribute merging

`setSubjectAttributes(id, { foo: 'bar' })` should **merge**, not replace. To delete an attribute, set it to `null` and treat that as a tombstone in your storage layer.

### Atomic writes

For high-contention attribute writes, use database transactions (`SELECT ... FOR UPDATE` in SQL, `WATCH/MULTI/EXEC` in Redis, transactions in MongoDB). The built-in adapters do **not** wrap reads + merges in transactions, so concurrent writes may lose data.

***

## Testing custom adapters

Use `IamMemoryAdapter` as a behavioral reference. Your adapter should produce identical engine results for the same inputs.

```typescript
import { IamEngine } from '@gentleduck/iam'
import { YourAdapter } from './your-adapter'

const adapter = new YourAdapter(/* config */)

// Seed
await adapter.saveRole({
  id: 'editor',
  name: 'Editor',
  permissions: [
    { action: 'read', resource: '*' },
    { action: 'update', resource: 'post' },
  ],
})
await adapter.assignRole('user-1', 'editor')

// Test
const engine = new IamEngine({ adapter })
const canUpdate = await engine.can('user-1', 'update', { type: 'post', attributes: {} })
const canDelete = await engine.can('user-1', 'delete', { type: 'post', attributes: {} })

assert(canUpdate === true)
assert(canDelete === false)
```

### Test checklist

* \[ ] CRUD on policies (list, get, save w/ upsert, delete)
* \[ ] CRUD on roles
* \[ ] Idempotent `assignRole` (calling twice doesn't throw)
* \[ ] `revokeRole` without scope clears all scopes
* \[ ] `revokeRole` with scope only clears matching
* \[ ] `getSubjectScopedRoles` returns only scoped
* \[ ] `setSubjectAttributes` merges (doesn't replace)
* \[ ] Empty subject returns `[]` from `getSubjectRoles`, `{}` from `getSubjectAttributes`
* \[ ] End-to-end: `engine.can()` returns expected result after seeding via your adapter

The built-in adapters' test files (`src/adapters/*/__tests__/*.test.ts`) make a good copy-paste-and-adapt starting point.

***

## Publishing your adapter

If your adapter is general-purpose, consider publishing it as a separate npm package (e.g. `@your-org/duck-iam-adapter-foo`). The duck-iam team welcomes upstream contributions for popular databases - open a PR with tests + docs.