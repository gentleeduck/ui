## Two layers of combination

Decisions are produced in two stages:

1. **Inside a policy** - the policy's [combining algorithm](/duck-iam/core/policies/combining-algorithms) (`AccessControl.CombiningAlgorithm`: `deny-overrides`, `allow-overrides`, `first-match`, `highest-priority`) folds matching rules into one effect.
2. **Across policies** - the engine merges per-policy decisions using its `policyCombine` setting (`AccessControl.PolicyCombine`). Defaults to `'and'`; configurable via `IamEngineTypes.IConfig.policyCombine`.

```typescript
import { IamEngine } from '@gentleduck/iam'

new IamEngine({
  adapter,
  policyCombine: 'and',              // default: every applicable policy must allow
  // policyCombine: 'allow-overrides', // any applicable allow wins
  // policyCombine: 'first-applicable', // first decisive policy wins; development mode only
})
```

### NotApplicable semantics

A policy whose `targets` don't match the request is **NotApplicable** and contributes nothing to the cross-policy combine - it is *skipped*, not folded as the default effect. This matches XACML and is the safe default: an admin policy that targets `actions: ['admin:*']` should not deny every regular request, it should be invisible to them.

The same rule applies to the auto-generated RBAC policy: if no roles are defined, it's skipped entirely so it can't short-circuit an AND chain.

***

## Strict AND across policies (default)

`policyCombine: 'and'`. Every **applicable** policy must allow for the final result to be `allow`. The first non-allow short-circuits.

```typescript
// Policy A: RBAC-generated, allows editors to update posts
// Policy B: Custom, denies updates on weekends

// On a weekday: Policy A allows, Policy B allows -> ALLOWED
// On a weekend: Policy A allows, Policy B denies  -> DENIED
```

Short-circuiting: as soon as any policy denies, evaluation stops. Remaining policies aren't evaluated.

***

## Defense in depth

Layer policies for tiered restrictions:

* The RBAC policy handles "who can do what"
* A time-based policy handles "when they can do it"
* A geo-fencing policy handles "where they can do it from"
* A content policy handles "what they can do it to"

Each policy evaluates independently. A deny from any one is final.

This shape composes well - adding a new restriction never weakens existing ones. It also makes auditing easier: each policy file represents one concern.

***

## The default effect

When no rules match inside a policy, the engine falls back to `defaultEffect` - `'deny'` by default (fail closed):

```typescript
const engine = new IamEngine({
  adapter: myAdapter,
  defaultEffect: 'deny', // this is the default
})
```

Fail-closed means an unmatched request denies instead of accidentally allowing. The default applies:

* Inside a policy when no rule matches and the algorithm has nothing to combine
* After **every** policy was NotApplicable (no applicable policy contributed)
* After all applicable policies finish without producing a definitive allow

A policy with non-matching targets is **not** folded as the default - it's skipped from the combine entirely. See "NotApplicable semantics" above.

Choose `defaultEffect: 'allow'` only if your policies are explicitly written as deny exceptions on top of an open baseline. The community convention is to keep `'deny'` and add explicit allow rules.

***

## When to switch off the AND default

duck-iam now ships three cross-policy combine modes via `IamEngineTypes.IConfig.policyCombine`:

| Mode | When to use |
|---|---|
| `'and'` (default) | Defense in depth. Each new policy can only restrict access. Auditable per policy. |
| `'allow-overrides'` | Layered grants where one permissive policy must beat stricter ones (e.g. break-glass roles). Any applicable allow wins. |
| `'first-applicable'` | Ordered-by-specificity policy set, XACML-style. First policy that produces a non-default decision wins. **Development mode only** - `evaluatePolicyFast` can't represent it faithfully so the engine ctor refuses `mode: 'production'` + `'first-applicable'`. |

For most apps, stick with `'and'`. Switch to `'allow-overrides'` only when you have a deliberate "this permissive policy must win" pattern; switch to `'first-applicable'` only when policy order is part of your security model.

If you want OR semantics for one specific scenario, prefer encoding it *inside* one policy with `allow-overrides` over splitting across multiple - same effect, smaller blast radius.

***

## Practical pattern

A typical setup has 3-5 policies:

```typescript
// 1. Auto-generated RBAC policy (from roles you defined)
//    algorithm: 'allow-overrides'

// 2. Business hours restriction
const businessHours = definePolicy('business-hours')
  .target({ actions: ['create', 'update', 'delete'] })
  .algorithm('first-match')
  .rule('deny-off-hours', /* ... */)
  .rule('allow-in-hours', (r) => r.allow().on('*').of('*'))
  .build()

// 3. Content safety (banned users, owner-only deletes)
const contentSafety = definePolicy('content-safety')
  .algorithm('deny-overrides')
  .rule('block-banned', /* ... */)
  .rule('owner-delete-only', /* ... */)
  .build()

// 4. Geo-fencing (optional)
const geoFence = definePolicy('geo-fence')
  .target({ actions: ['*'] })
  .algorithm('first-match')
  .rule('block-restricted-regions', /* ... */)
  .rule('allow-default', (r) => r.allow().on('*').of('*'))
  .build()
```

A request must satisfy all four. Each policy handles one concern. Order doesn't matter - AND is commutative.

See the [layered example](/duck-iam/core/policies/example-layered) for a complete walkthrough.