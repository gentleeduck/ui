## When to Use Policies

Roles cover the common case: "editors can update posts." Some requirements need more than roles can express:

- **Time-based restrictions** — deny writes on weekends or outside business hours
- **IP/geo-fencing** — allow access only from trusted networks
- **Cross-attribute checks** — allow updates only when subject and resource share a department
- **Dynamic deny rules** — block specific users or flag suspicious behavior without changing role assignments
- **Maintenance mode** — deny all writes globally when a feature flag is on

ABAC policies share the role evaluation pipeline. The engine **AND-combines policies** — a deny from any policy is final.

---

## Reading order

Each topic has its own page:

| Page | Covers |
| --- | --- |
| [building policies](/docs/duck-iam/core/policies/building) | `policy()` builder, `defineRule()`, wildcards, hierarchical resources |
| [rules](/docs/duck-iam/core/policies/rules) | Rule structure, effect, priority, scopes, metadata |
| [conditions](/docs/duck-iam/core/policies/conditions) | The `When` builder — operators, semantic shortcuts, field paths |
| [`$`-variable references](/docs/duck-iam/core/policies/dollar-variables) | Compare two fields on the same request via `$subject.id` etc. |
| [nesting and/or/not](/docs/duck-iam/core/policies/nesting) | Compose AND/OR/NOT groups, `whenAny()`, depth limit |
| [policy targets](/docs/duck-iam/core/policies/targets) | Pre-filter policies by action, resource, or role |
| [combining algorithms](/docs/duck-iam/core/policies/combining-algorithms) | `deny-overrides`, `allow-overrides`, `first-match`, `highest-priority` |
| [layered example](/docs/duck-iam/core/policies/example-layered) | Full RBAC + ABAC example, evaluation walkthrough |

---

## Quick example

```typescript
import { policy } from '@gentleduck/iam'

const weekendDeny = policy('deny-weekends')
  .name('Deny on Weekends')
  .desc('Block all write operations on weekends')
  .version(1)
  .algorithm('deny-overrides')
  .rule('r-deny-weekends', (r) =>
    r
      .deny()
      .on('create', 'update', 'delete')
      .of('*')
      .when((w) => w.env('dayOfWeek', 'in', [0, 6])),
  )
  .build()
```

This policy:

- Has algorithm `deny-overrides` (any deny rule that matches → policy returns deny)
- Targets writes only (not reads)
- Uses `env('dayOfWeek', 'in', [0, 6])` — Sunday or Saturday → deny

---

## FAQ

  
    Why should I use policy targets instead of only rule conditions?
    
      Targets are a fast pre-filter. They let the engine skip entire policies before it ever inspects individual
      rules or conditions, which keeps large policy sets easier to reason about and cheaper to evaluate.
    
  

  
    Can a policy deny something that a role allows?
    
      Yes. Roles are converted into an allow-oriented RBAC policy, but your custom policies are still evaluated
      alongside it. If a deny rule in another policy matches, the final AND-combined result is deny.
    
  

  
    How do I decide between grantWhen() on a role and a standalone policy rule?
    
      Reach for <code className="rounded bg-muted px-2 py-1">grantWhen()</code> when the condition belongs to a single role's
      permission semantics. Reach for a standalone policy when the rule spans many roles, acts as a global deny layer, or needs a
      separate combining algorithm and operational lifecycle.
    
  

  
    How do targets, rule action/resource filters, and conditions layer together?
    
      Think of them as concentric filters. Targets decide whether the policy is worth evaluating at all. Rule action/resource
      filters decide which rules are even candidates. Conditions are the final contextual checks on those candidate rules.
      Put broad preconditions in targets, rule-local matching in actions/resources, and contextual logic in conditions.