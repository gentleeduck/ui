import type { PermissionMap } from './client'
import type { Attributes, AttributeValue } from './primitives'

/**
 * The outcome a rule produces when it matches: either grant or block access.
 */
export type Effect = 'allow' | 'deny'

/**
 * Comparison operators supported by the condition engine.
 *
 * | Operator | Meaning |
 * |---|---|
 * | `eq` | Equals |
 * | `neq` | Not equals |
 * | `gt` | Greater than |
 * | `gte` | Greater than or equal |
 * | `lt` | Less than |
 * | `lte` | Less than or equal |
 * | `in` | Value is in the given array |
 * | `nin` | Value is not in the given array |
 * | `contains` | Array field contains the value |
 * | `not_contains` | Array field does not contain the value |
 * | `starts_with` | String field starts with the value |
 * | `ends_with` | String field ends with the value |
 * | `matches` | String field matches the regex pattern |
 * | `exists` | Field is defined and non-null |
 * | `not_exists` | Field is undefined or null |
 * | `subset_of` | Array field is a subset of the given array |
 * | `superset_of` | Array field is a superset of the given array |
 */
export type Operator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'matches'
  | 'exists'
  | 'not_exists'
  | 'subset_of'
  | 'superset_of'

/**
 * A single leaf-level condition that compares a dot-path field against a value
 * using an {@link Operator}.
 *
 * Conditions are the building blocks of {@link ConditionGroup} trees. The engine
 * resolves `field` against the {@link AccessRequest} at evaluation time.
 *
 * @example
 * ```ts
 * const cond: Condition = {
 *   field: 'subject.attributes.status',
 *   operator: 'eq',
 *   value: 'active',
 * }
 * ```
 */
export interface Condition {
  /** Dot-path to the attribute being tested (e.g. `'subject.attributes.status'`). */
  readonly field: string
  /** The comparison operator to apply. */
  readonly operator: Operator
  /** The right-hand side value. Omit for unary operators like `exists`. */
  readonly value?: AttributeValue
}

/**
 * A recursive tree of conditions combined with boolean logic.
 *
 * Exactly one key must be present:
 *
 * - `all` -- every child must hold (AND)
 * - `any` -- at least one child must hold (OR)
 * - `none` -- no child may hold (NOT / NOR)
 *
 * Children can be leaf {@link Condition} objects or nested `ConditionGroup` trees,
 * allowing arbitrarily deep boolean expressions.
 */
export type ConditionGroup =
  | { readonly all: ReadonlyArray<Condition | ConditionGroup> }
  | { readonly any: ReadonlyArray<Condition | ConditionGroup> }
  | { readonly none: ReadonlyArray<Condition | ConditionGroup> }

/**
 * The atomic unit of an ABAC policy.
 *
 * Each rule declares an {@link Effect}, the actions and resources it covers,
 * an optional priority for conflict resolution, and a {@link ConditionGroup}
 * tree that must hold for the rule to fire.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 */
export interface Rule<TAction extends string = string, TResource extends string = string> {
  /** Unique identifier within the parent policy. */
  readonly id: string
  /** Whether this rule grants or blocks access when matched. */
  readonly effect: Effect
  /** Human-readable description for audit logs and explain output. */
  readonly description?: string
  /** Evaluation priority. Higher values are evaluated first under `highest-priority` and `first-match` algorithms. */
  readonly priority: number
  /** The actions this rule applies to. `'*'` matches all actions. */
  readonly actions: readonly (TAction | '*')[]
  /** The resources this rule applies to. `'*'` matches all resources. */
  readonly resources: readonly (TResource | '*')[]
  /** The condition tree that must hold for the rule to fire. */
  readonly conditions: ConditionGroup
  /** Arbitrary metadata for admin dashboards, audit logs, or application bookkeeping. */
  readonly metadata?: Readonly<Attributes>
}

/**
 * Strategy for resolving conflicts between multiple matching rules within a policy.
 *
 * | Algorithm | Behavior |
 * |---|---|
 * | `deny-overrides` | Any deny wins. Default. Best for restriction policies. |
 * | `allow-overrides` | Any allow wins. Best for RBAC / permissive rules. |
 * | `first-match` | First matching rule (by priority order) wins. Best for firewall-style ordered lists. |
 * | `highest-priority` | Rule with the highest priority number wins. Best for emergency overrides. |
 */
export type CombiningAlgorithm = 'deny-overrides' | 'allow-overrides' | 'first-match' | 'highest-priority'

/**
 * An ABAC policy: a named collection of {@link Rule} objects with a
 * {@link CombiningAlgorithm} for conflict resolution.
 *
 * Policies are the top-level grouping for access control rules. The engine
 * AND-combines all policies: a deny from any single policy is final,
 * regardless of what other policies allow.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings (used by `targets.roles`)
 */
export interface Policy<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
> {
  /** Unique identifier for this policy. */
  readonly id: string
  /** Human-readable display name. */
  readonly name: string
  /** Optional description for documentation and audit purposes. */
  readonly description?: string
  /** Version number for tracking policy changes over time. */
  readonly version?: number
  /** Strategy for resolving conflicts between rules within this policy. */
  readonly algorithm: CombiningAlgorithm
  /** The rules that make up this policy, evaluated according to the algorithm. */
  readonly rules: readonly Rule<TAction, TResource>[]
  /**
   * Optional target constraints. If set, the policy is skipped entirely
   * when the incoming request does not match all specified targets.
   */
  readonly targets?: {
    /** Actions this policy applies to. If set, requests for other actions skip this policy. */
    readonly actions?: readonly (TAction | '*')[]
    /** Resources this policy applies to. If set, requests for other resources skip this policy. */
    readonly resources?: readonly (TResource | '*')[]
    /** Roles this policy applies to. If set, subjects without these roles skip this policy. */
    readonly roles?: readonly TRole[]
  }
}

/**
 * A single action/resource permission entry within a {@link Role}.
 *
 * Permissions are the RBAC primitives. At evaluation time, `rolesToPolicy()`
 * converts each permission into an allow rule that flows through the ABAC engine.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TScope    - Union of valid scope strings
 */
export interface Permission<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> {
  /** The action this permission grants, or `'*'` for all actions. */
  readonly action: TAction | '*'
  /** The resource this permission applies to, or `'*'` for all resources. */
  readonly resource: TResource | '*'
  /** Optional scope restriction. When set, the permission only applies within this scope. */
  readonly scope?: TScope | '*'
  /** Optional conditions that must hold for this permission to apply (used by `grantWhen`). */
  readonly conditions?: ConditionGroup
}

/**
 * An RBAC role: a named set of {@link Permission} entries with optional inheritance.
 *
 * Roles are the RBAC side of duck-iam. At evaluation time, `rolesToPolicy()`
 * converts every role into ABAC rules so RBAC and ABAC compose naturally
 * through the same engine.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TId       - Literal string type of the role ID
 * @template TScope    - Union of valid scope strings
 */
export interface Role<
  TAction extends string = string,
  TResource extends string = string,
  TId extends string = string,
  TScope extends string = string,
> {
  /** Unique identifier for this role. */
  readonly id: TId
  /** Human-readable display name. */
  readonly name: string
  /** Optional description for documentation and admin dashboards. */
  readonly description?: string
  /** The permissions this role directly grants. */
  readonly permissions: readonly Permission<TAction, TResource, TScope>[]
  /** IDs of parent roles to inherit permissions from (resolved recursively). */
  readonly inherits?: readonly string[]
  /** Default scope applied to all permissions in this role. */
  readonly scope?: TScope
  /** Arbitrary metadata for admin dashboards, audit logs, or application bookkeeping. */
  readonly metadata?: Readonly<Attributes>
}

/**
 * The result of an authorization evaluation.
 *
 * Contains the final allow/deny verdict along with diagnostic information
 * about which rule and policy produced the decision.
 */
export interface Decision {
  /** Whether the action is permitted. */
  readonly allowed: boolean
  /** The effect that produced this decision (`'allow'` or `'deny'`). */
  readonly effect: Effect
  /** The specific rule that produced this decision (if any). */
  readonly rule?: Rule
  /** The ID of the policy that produced this decision (if any). */
  readonly policy?: string
  /** Human-readable explanation of why this decision was reached. */
  readonly reason: string
  /** Time in milliseconds the evaluation took. */
  readonly duration: number
  /** Unix timestamp (ms) when the decision was made. */
  readonly timestamp: number
}

// ---------------------------------------------------------------------------
// Engine mode — controls return types and performance characteristics
// ---------------------------------------------------------------------------

/**
 * Engine execution mode.
 *
 * - `'development'` — returns rich {@link Decision} objects with timing, reasons,
 *   rule references, and full explain/debug API. Default.
 * - `'production'` — returns plain booleans. No timing overhead, no object
 *   allocation, no reason strings. Enables dead-code elimination of debug paths.
 */
export type Mode = 'development' | 'production'

/**
 * Conditional return type based on engine mode.
 *
 * In `'production'` mode, authorization checks return a plain `boolean`.
 * In `'development'` mode, they return a full {@link Decision} with diagnostics.
 */
export type ModeResult<M extends Mode> = M extends 'production' ? boolean : Decision

/**
 * Conditional permission map type based on engine mode.
 *
 * In `'production'` mode, `permissions()` returns `Record<string, boolean>`.
 * In `'development'` mode, it returns the full typed `PermissionMap`.
 */
export type ModePermissionMap<
  M extends Mode,
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> = M extends 'production' ? Record<string, boolean> : PermissionMap<TAction, TResource, TScope>
