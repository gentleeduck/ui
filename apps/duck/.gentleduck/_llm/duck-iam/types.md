## Convention

duck-iam ships TypeScript types under per-module namespaces. Two rules:

1. **Interfaces use the `I` prefix** - `IPolicy`, `IRule`, `IDecision`, `IAccessRequest`, etc.
2. **Type aliases stay bare** - `Effect`, `Operator`, `Mode`, `PolicyCombine`, `CombiningAlgorithm`.

Every type lives inside one namespace export per module. Consumers import the namespace once and access members through it:

```typescript
import type { AccessControl, IamRequest } from '@gentleduck/iam'

function check(policy: AccessControl.IPolicy, req: IamRequest.IAccessRequest): AccessControl.IDecision {
  // ...
}
```

The pattern matches the rest of the duck-\* monorepo (calendar, upload, etc.). Type aliases stay bare because adding `I` to `Effect` reads awkwardly and conveys no information.

***

## Namespace map

### Core namespaces

Exported from `@gentleduck/iam`:

| Namespace | Members |
|---|---|
| `AccessControl` | `IPolicy`, `IRule`, `IPermission`, `IRole`, `IDecision`, `ICondition`, `IConditionGroup`, `Effect`, `Operator`, `CombiningAlgorithm`, `PolicyCombine`, `Mode`, `ModeResult`, `ModePermissionMap`, `OpFn` |
| `Request` | `IAccessRequest`, `ISubject`, `IResource`, `IEnvironment`, `IScopedRole` |
| `Adapter` | `IAdapter`, `IPolicyStore`, `IRoleStore`, `ISubjectStore`, `IReadOptions` |
| `Primitives` | `Attributes`, `AttributeValue`, `Scalar` |
| `Client` | `PermissionKey`, `PermissionMap`, `IPermissionCheck` |
| `DotPath` | `DotPaths`, `FlexibleDotPaths`, `DollarPaths`, `FlexibleDollarPaths`, `PathValue`, `FieldValue`, `ConditionValue`, `AttrValue`, `AttrValueAt`, `SubjectAttrs`, `SubjectAttrShape`, `ResourceAttrs`, `ResourceAttrShape`, `EnvAttrs`, `EnvAttrShape`, `ResourceAttrMap`, `ResolvedResourceAttrs`, `ResolvedResourceAttrPaths`, `IDefaultContext`, `IAnyAttributes` |
| `IamEngineTypes` | `IConfig`, `IHooks`, `IAdmin`, `IMetricsEvent`, `IInvalidator`, `IInvalidateEvent`, `ISnapshot`, `IImportOptions`, `IImportResult`, `IHealth` |
| `Evaluate` | `Combiner`, `IIndexedRule`, `IPolicyRuleIndex` |
| `Explain` | `IResult`, `ISubjectInfo`, `IPolicyTrace`, `IRuleTrace`, `ILeafTrace`, `IGroupTrace`, `Trace` |
| `Validate` | `IIssue`, `IResult`, `ValidationCode` |
| `Config` | `IAccessConfig`, `IAccessConfigInput`, `InferAction`, `InferResource`, `InferScope`, `InferRole` |

### Module-local namespaces

Each integration module exports its own option-bag namespace (added in 2.0):

| Namespace | Source | Members |
|---|---|---|
| `Memory` | `@gentleduck/iam/adapters/memory` | `IInit` |
| `File` | `@gentleduck/iam/adapters/file` | `IInit`, `IFS`, `IState` |
| `Http` | `@gentleduck/iam/adapters/http` | `IConfig` (baseUrl, fetch, headers, retry, timeout, circuit-breaker) |
| `Redis` | `@gentleduck/iam/adapters/redis` | `IConfig`, `ILike` (minimal client surface) |
| `Drizzle` | `@gentleduck/iam/adapters/drizzle` | `IConfig` (db, tables, ops) |
| `Express` | `@gentleduck/iam/server/express` | `IOptions`, `IAdminRouterOptions`, `IAdminAuthorize` |
| `Hono` | `@gentleduck/iam/server/hono` | `IOptions`, `IAdminOptions`, `IAdminAuthorize`, `IRouterLike` |
| `Nest` | `@gentleduck/iam/server/nest` | `IAuthorizeMeta`, `IGuardOptions`, `IAdminOptions`, `IAdminAuthorize` |
| `Next` | `@gentleduck/iam/server/next` | `IWithAccessOptions`, `IMiddlewareOptions`, `IAdminOptions`, `IAdminAuthorize` |
| `ReactClient` | `@gentleduck/iam/client/react` | `IContextValue` |
| `RedisInvalidator` | `@gentleduck/iam/invalidators/redis` | `IConfig`, `IPubSubLike` |
| `Metrics` | `@gentleduck/iam/observability/metrics` | `IAggregator`, `ISnapshot`, `IConfig` |

The class `IamEngine` lives next to the `IamEngineTypes` namespace - same name avoided by suffixing the type-only namespace. `IamMemoryAdapter` / `IamFileAdapter` / etc. are classes; their config namespaces (`Memory`, `File`, `Http`, `Redis`, `Drizzle`) hold the option bags. `ReactClient` is named so to avoid clashing with the React package namespace at the import site.

***

## Why namespaces

Three reasons.

**1. Avoid name collisions across modules.** `IResult` exists in both `Validate` and `Explain`. Without namespaces, one of them needs a longer name. With namespaces, both stay short and the context is explicit at the call site (`IamValidate.IResult` vs `IamExplain.IResult`).

**2. One import per module.** Instead of:

```typescript
import type {
  IPolicy, IRule, IDecision, ICondition, IConditionGroup,
  Effect, CombiningAlgorithm, PolicyCombine,
} from '@gentleduck/iam'
```

You write:

```typescript
import type { AccessControl } from '@gentleduck/iam'
```

...and access everything through `AccessControl.X`. Reading the call site you know which module each type belongs to.

**3. Tree-shake friendliness.** `import type { AccessControl }` is a single TypeScript type import - the bundler doesn't trace 14 distinct re-exports, and `sideEffects: false` in `package.json` lets it drop unused namespaces entirely.

***

## Migrating from flat imports

If you have older code using the flat names:

```typescript
// Before
import type { Policy, Rule, Decision } from '@gentleduck/iam'

function check(p: Policy): Decision { /* ... */ }
```

Two mechanical changes:

```typescript
// After
import type { AccessControl } from '@gentleduck/iam'

function check(p: AccessControl.IPolicy): AccessControl.IDecision { /* ... */ }
```

1. Drop the flat names from the import; pull in the namespace instead.
2. Prefix references: `Policy` -> `AccessControl.IPolicy`, `Rule` -> `AccessControl.IRule`, etc.

The runtime values (`IamEngine`, `IamMemoryAdapter`, `policy`, `defineRole`, builders, etc.) are unchanged - only type imports moved.

***

## See also

* [Engine](/duck-iam/advanced/engine) - `IamEngineTypes.IConfig` and `IamEngineTypes.IHooks` shapes.
* [Adapters](/duck-iam/integrations/adapters) - `IamAdapter.IAdapter` contract.
* [Conditions](/duck-iam/core/policies/conditions) - `AccessControl.ICondition` and `AccessControl.IConditionGroup`.