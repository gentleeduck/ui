## What context adds

By default, the `When` condition builder accepts any string for `.attr()`, `.resourceAttr()`, `.env()`, and `.check()` field paths. To get autocompletion and type-checked values, pass a `context` phantom field with your application's context type.

```typescript
import { createAccessConfig, type DefaultContext } from '@gentleduck/iam'

interface AppContext extends DefaultContext {
  subject: {
    id: string
    roles: string[]
    attributes: {
      status: 'active' | 'banned' | 'suspended'
      department: string
    }
  }
  resource: {
    type: 'post' | 'comment' | 'user'
    id?: string
    attributes: {
      ownerId: string
      status: 'draft' | 'published' | 'archived'
    }
  }
  environment: {
    hour: number
    dayOfWeek: number
    maintenanceMode: boolean
  }
  scope: string
}

const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete'] as const,
  resources: ['post', 'comment', 'user'] as const,
  roles: ['viewer', 'editor', 'admin'] as const,
  context: {} as unknown as AppContext,
})
```

Every `When` builder created through `access` gets full intellisense:

```typescript
access
  .policy('banned-users')
  .rule('block-banned', (r) =>
    r
      .deny()
      .on('*')
      .of('*')
      .when((w) => w.attr('status', 'eq', 'banned')),
    // 'status' autocompletes from subject.attributes
    // 'banned' constrained to 'active' | 'banned' | 'suspended'
  )
  .build()

access
  .policy('maintenance')
  .rule('deny-writes', (r) =>
    r
      .deny()
      .on('create', 'update', 'delete')
      .of('*')
      .when((w) => w.env('maintenanceMode', 'eq', true)),
    // 'maintenanceMode' autocompletes from environment
    // value constrained to boolean
  )
  .build()
```

The `context` field is a **phantom type** — its runtime value is never used. The `{} as unknown as AppContext` cast is safe because the value is discarded; only the type information flows through to the builders.

---

## Per-resource attribute narrowing

When you declare a `resourceAttributes` map in your context, `.resourceAttr()` narrows its available keys based on the resource specified in `.of()`:

```typescript
interface AppContext extends DefaultContext {
  // ... subject, resource, environment, scope ...
  resourceAttributes: {
    post: { ownerId: string; status: 'draft' | 'published' | 'archived'; title: string }
    comment: { ownerId: string; body: string }
    user: { email: string; status: 'active' | 'banned' }
    dashboard: { name: string }
  }
}

const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete'] as const,
  resources: ['post', 'comment', 'user', 'dashboard'] as const,
  context: {} as unknown as AppContext,
})
```

`.resourceAttr()` shows only the keys for the resource specified in `.of()`:

```typescript
// .of('post') -> resourceAttr shows: 'ownerId' | 'status' | 'title'
access
  .policy('post-title')
  .rule('deny-empty', (r) =>
    r
      .deny()
      .on('create', 'update')
      .of('post')
      .when((w) => w.not((n) => n.resourceAttr('title', 'exists'))),
    //                                     ^ only post keys here
  )
  .build()

// .of('comment') -> resourceAttr shows: 'ownerId' | 'body'
access
  .policy('comment-body')
  .rule('deny-empty', (r) =>
    r
      .deny()
      .on('create')
      .of('comment')
      .when((w) => w.not((n) => n.resourceAttr('body', 'exists'))),
    //                                    ^ only comment keys here
  )
  .build()

// .of('*') -> resourceAttr shows union of ALL keys:
// 'ownerId' | 'status' | 'title' | 'body' | 'email' | 'name'
access
  .policy('global-owner')
  .rule('deny-non-owner', (r) =>
    r
      .deny()
      .on('delete')
      .of('*')
      .when((w) => w.not((n) => n.resourceAttr('ownerId', 'eq', '$subject.id'))),
  )
  .build()
```

The same narrowing works in `grantWhen` on roles:

```typescript
access
  .defineRole('member')
  .grantWhen('update', 'post', (w) =>
    w.isOwner().resourceAttr('status', 'eq', 'draft'),
    // 'status' narrows to 'draft' | 'published' | 'archived' (post attrs)
  )
  .build()
```

Without `resourceAttributes`, `.resourceAttr()` falls back to `resource.attributes` which uses the general attribute type from your context.

---

## How the type system works

The typed context system uses several TypeScript utility types that work together:

| Type | Purpose |
| --- | --- |
| `DotPaths<T>` | Generates all valid dot-separated paths through `T` (e.g. `'subject.attributes.status'`). Arrays are treated as leaf paths and functions are skipped. Bails to `never` for string-indexed types to avoid polluting the union with `string`. |
| `FlexibleDotPaths<T>` | Smart wrapper: returns `DotPaths<T> \| (string & {})` when `T` has open-ended attribute bags (like `DefaultContext`), giving autocomplete for known structural paths while accepting arbitrary strings. For fully typed contexts, returns strict `DotPaths<T>` only. |
| `PathValue<T, P>` | Resolves the value type at path `P` within `T` |
| `FieldValue<T, P>` | Like `PathValue` but wraps the result in `ConditionValue` to add `$`-reference support |
| `ConditionValue<T, V>` | Adapts a value type for condition builders. Non-string values pass through unchanged; string values add `DollarPaths<T>` for `$`-reference autocomplete. Prevents type widening so `env('hour', 'lt', '')` correctly errors when `hour` is `number`. |
| `FlexibleDollarPaths<T>` | `DollarPaths<T> \| (string & {})`, added directly to method value signatures so the IDE shows `$`-prefixed autocomplete suggestions (e.g. `$subject.id`) alongside a flexible string input. |
| `SubjectAttrs<T>` | Extracts `T['subject']['attributes']` |
| `ResourceAttrs<T>` | Extracts `T['resource']['attributes']` |
| `EnvAttrs<T>` | Extracts `T['environment']` |
| `ResourceAttrMap<T>` | Extracts `T['resourceAttributes']` (per-resource attribute map) |
| `ResolvedResourceAttrs<T, R>` | Resolves resource attrs for resource `R`: specific type for known resources, merged union for `'*'` |
| `AttrValue<A, K>` | Resolves the value type for key `K` in attribute bag `A`. Strips `undefined` from optional properties so that `yearsExperience?: number` correctly resolves to `number`, not `AttributeValue`. |
| `DollarPaths<T>` | Generates `$`-prefixed versions of all dot-paths. Used for autocomplete on dynamic cross-references like `'$subject.id'`. |

The `context` phantom field on `createAccessConfig` captures your context type (`TContext`). This type parameter flows through `AccessConfig` into every builder:

```
createAccessConfig({ context: {} as AppContext })
  -> AccessConfig<..., TContext=AppContext>
    -> PolicyBuilder<..., TContext>
      -> RuleBuilder<..., TContext>
        -> .of('post') returns RuleBuilder<..., TActiveResource='post'>
          -> When<..., TContext, TActiveResource='post'>
            -> .resourceAttr() uses ResolvedResourceAttrs<AppContext, 'post'>
              -> returns AppContext['resourceAttributes']['post']
              -> { ownerId: string; status: 'draft' | 'published' | 'archived'; title: string }
```

When `.of('*')` is used, `ResolvedResourceAttrs` merges all resource attribute types using `MergedResourceAttrs`, which collects every key from every resource and unions their value types.

---

## Why value autocomplete can still be broad

Field-path autocomplete and value autocomplete are distinct.

- If a field resolves to a narrow literal union such as `'draft' | 'published'`, the value side stays narrow and still offers `$subject.*` / `$resource.*` / `$environment.*` references.
- If a field resolves to broad `string`, `number`, `boolean`, or a generic `AttributeValue`, TypeScript can only offer broad scalar input plus the `$` references.
- Open-ended attribute bags such as `Record<string, unknown>` or the default `AnyAttributes` are the usual reason value suggestions feel looser than expected.

For the tightest autocomplete, make the parts of your context that matter most explicit:

```typescript
interface AppContext extends DefaultContext {
  subject: {
    id: string
    roles: string[]
    attributes: {
      status: 'active' | 'banned'
      tier: 'free' | 'pro'
    }
  }
}
```

This gives better value narrowing in `.check()`, `.eq()`, `.neq()`, `.attr()`, `.resourceAttr()`, and `.env()` without changing runtime behavior.