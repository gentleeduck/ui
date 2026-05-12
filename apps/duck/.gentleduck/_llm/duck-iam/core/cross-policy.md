## Two layers of combination

Decisions are produced in two stages:

1. **Inside a policy** — the policy's [combining algorithm](/docs/duck-iam/core/policies/combining-algorithms) (`deny-overrides`, `allow-overrides`, `first-match`, `highest-priority`) folds matching rules into one effect.
2. **Across policies** — the engine **AND-combines** results. Every policy must allow for the final result to be `allow`.

The cross-policy step is **not configurable** — it's fixed engine behavior.

***

## Strict AND across policies

A combining algorithm resolves conflicts within one policy. Across policies, duck-iam uses strict AND — every policy must allow for the final result to be `allow`.

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

This shape composes well — adding a new restriction never weakens existing ones. It also makes auditing easier: each policy file represents one concern.

***

## The default effect

When no rules match inside a policy, the engine falls back to `defaultEffect` — `'deny'` by default (fail closed):

```typescript
const engine = new Engine({
  adapter: myAdapter,
  defaultEffect: 'deny', // this is the default
})
```

Fail-closed means an unmatched request denies instead of accidentally allowing. The default applies:

* Inside a policy when no rule matches and the algorithm has nothing to combine
* After a policy target miss (the policy is skipped, contributes the default effect)
* After all policies finish without producing a definitive allow

Choose `defaultEffect: 'allow'` only if your policies are explicitly written as deny exceptions on top of an open baseline. The community convention is to keep `'deny'` and add explicit allow rules.

***

## Why no cross-policy `OR` mode?

duck-iam intentionally doesn't ship a cross-policy `OR` combiner. Two reasons:

1. **Security ergonomics** — AND-combination means adding a policy can only restrict access. New deny rules can't accidentally weaken existing ones.
2. **Policy independence** — each policy is auditable on its own. With OR, you'd need to consider all policies together to understand any single decision.

If you want OR semantics for a specific scenario, encode it inside one policy with `allow-overrides` rather than splitting across two.

***

## Practical pattern

A typical setup has 3-5 policies:

```typescript
// 1. Auto-generated RBAC policy (from roles you defined)
//    algorithm: 'allow-overrides'

// 2. Business hours restriction
const businessHours = policy('business-hours')
  .target({ actions: ['create', 'update', 'delete'] })
  .algorithm('first-match')
  .rule('deny-off-hours', /* ... */)
  .rule('allow-in-hours', (r) => r.allow().on('*').of('*'))
  .build()

// 3. Content safety (banned users, owner-only deletes)
const contentSafety = policy('content-safety')
  .algorithm('deny-overrides')
  .rule('block-banned', /* ... */)
  .rule('owner-delete-only', /* ... */)
  .build()

// 4. Geo-fencing (optional)
const geoFence = policy('geo-fence')
  .target({ actions: ['*'] })
  .algorithm('first-match')
  .rule('block-restricted-regions', /* ... */)
  .rule('allow-default', (r) => r.allow().on('*').of('*'))
  .build()
```

A request must satisfy all four. Each policy handles one concern. Order doesn't matter — AND is commutative.

See the [layered example](/docs/duck-iam/core/policies/example-layered) for a complete walkthrough.