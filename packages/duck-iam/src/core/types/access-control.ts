import type { Client } from './client'
import type { Primitives } from './primitives'

export namespace AccessControl {
  /**
   * The outcome a rule produces when it matches: grant or block access.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Effect = 'allow' | 'deny'

  /**
   * Comparison operators supported by the condition engine.
   *
   * | Operator | Meaning |
   * |---|---|
   * | `eq` / `neq` | Equals / not equals |
   * | `gt` / `gte` / `lt` / `lte` | Numeric comparisons |
   * | `in` / `nin` | Value is / is not in the given array |
   * | `contains` / `not_contains` | Array contains / does not contain the value |
   * | `starts_with` / `ends_with` | String prefix / suffix |
   * | `matches` | String matches a regex pattern |
   * | `exists` / `not_exists` | Field is / is not defined |
   * | `subset_of` / `superset_of` | Array subset / superset check |
   *
   * @author wildduck2 <https://github.com/wildduck2>
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
   * Leaf condition: compares a dot-path field against a value via an
   * {@link Operator}. Building block of {@link IConditionGroup} trees.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface ICondition {
    /** Dot-path to the attribute being tested (e.g. `'subject.attributes.status'`). */
    readonly field: string
    /** Comparison operator to apply. */
    readonly operator: Operator
    /** Right-hand side value. Omit for unary operators like `exists`. */
    readonly value?: Primitives.AttributeValue
  }

  /**
   * Recursive tree of conditions combined with boolean logic. Exactly one key
   * must be present: `all` (AND), `any` (OR), or `none` (NOT / NOR).
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type IConditionGroup =
    | { readonly all: ReadonlyArray<ICondition | IConditionGroup> }
    | { readonly any: ReadonlyArray<ICondition | IConditionGroup> }
    | { readonly none: ReadonlyArray<ICondition | IConditionGroup> }

  /**
   * Atomic unit of an ABAC policy. Declares an {@link Effect}, the actions /
   * resources it covers, an optional priority, and a condition tree that must
   * hold for the rule to fire.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IRule<TAction extends string = string, TResource extends string = string> {
    readonly id: string
    readonly effect: Effect
    /** Human-readable description for audit logs and explain output. */
    readonly description?: string
    /** Higher values evaluated first under `highest-priority` and `first-match`. */
    readonly priority: number
    /** Actions this rule applies to. `'*'` matches all actions. */
    readonly actions: readonly (TAction | '*')[]
    /** Resources this rule applies to. `'*'` matches all resources. */
    readonly resources: readonly (TResource | '*')[]
    readonly conditions: IConditionGroup
    /** Arbitrary metadata for admin dashboards, audit logs, or app bookkeeping. */
    readonly metadata?: Readonly<Primitives.Attributes>
  }

  /**
   * Intra-policy rule conflict resolution.
   *
   * | Algorithm | Behavior |
   * |---|---|
   * | `deny-overrides` | Any deny wins. Default. |
   * | `allow-overrides` | Any allow wins. Best for RBAC / permissive rules. |
   * | `first-match` | Highest-priority match wins; ties resolved by source order. |
   * | `highest-priority` | Rule with the highest priority number wins. |
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type CombiningAlgorithm = 'deny-overrides' | 'allow-overrides' | 'first-match' | 'highest-priority'

  /**
   * Cross-policy combine strategy.
   *
   * | Mode | Behavior |
   * |---|---|
   * | `and` | Every policy must allow. Any deny is final. Default. |
   * | `allow-overrides` | Any policy that allows wins. |
   * | `first-applicable` | First policy whose targets+rules produce a non-default decision wins. |
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type PolicyCombine = 'and' | 'allow-overrides' | 'first-applicable'

  /**
   * An ABAC policy: named collection of {@link IRule} objects plus a
   * {@link CombiningAlgorithm}. Cross-policy decisions are merged by the
   * engine according to its `policyCombine` setting (default `'and'`).
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TRole     - Union of valid role IDs targeted by `targets.roles`.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IPolicy<
    TAction extends string = string,
    TResource extends string = string,
    TRole extends string = string,
  > {
    readonly id: string
    readonly name: string
    readonly description?: string
    /** Version for tracking policy changes over time. */
    readonly version?: number
    readonly algorithm: CombiningAlgorithm
    readonly rules: readonly IRule<TAction, TResource>[]
    /**
     * Optional target constraints. The policy is skipped (NotApplicable) when
     * any specified dimension does not match the request.
     */
    readonly targets?: {
      readonly actions?: readonly (TAction | '*')[]
      readonly resources?: readonly (TResource | '*')[]
      readonly roles?: readonly TRole[]
    }
  }

  /**
   * A single action/resource permission entry within an {@link IRole}. RBAC
   * primitive - at evaluation time `rolesToPolicy()` turns each permission
   * into an allow rule that flows through the ABAC engine.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IPermission<
    TAction extends string = string,
    TResource extends string = string,
    TScope extends string = string,
  > {
    /** Action this permission grants, or `'*'` for all. */
    readonly action: TAction | '*'
    /** Resource this permission applies to, or `'*'` for all. */
    readonly resource: TResource | '*'
    /** Optional scope restriction. */
    readonly scope?: TScope | '*'
    /** Optional conditions (used by `grantWhen`). */
    readonly conditions?: IConditionGroup
  }

  /**
   * An RBAC role: named set of {@link IPermission} entries with optional
   * inheritance. `rolesToPolicy()` converts every role into ABAC rules so
   * RBAC + ABAC compose through the same engine.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TId       - Literal string type of the role ID.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IRole<
    TAction extends string = string,
    TResource extends string = string,
    TId extends string = string,
    TScope extends string = string,
  > {
    readonly id: TId
    readonly name: string
    readonly description?: string
    readonly permissions: readonly IPermission<TAction, TResource, TScope>[]
    /** Parent role IDs to inherit permissions from (resolved recursively). */
    readonly inherits?: readonly string[]
    /** Default scope applied to all permissions in this role. */
    readonly scope?: TScope
    readonly metadata?: Readonly<Primitives.Attributes>
  }

  /**
   * Result of an authorization evaluation. Final verdict plus diagnostic info
   * about which rule and policy produced the decision.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IDecision {
    readonly allowed: boolean
    readonly effect: Effect
    readonly rule?: IRule
    /** ID of the policy that produced this decision (if any). */
    readonly policy?: string
    readonly reason: string
    /** Time in milliseconds the evaluation took. */
    readonly duration: number
    /** Unix timestamp (ms) when the decision was made. */
    readonly timestamp: number
    /**
     * `false` when the policy's targets did not match the request - the policy
     * is NotApplicable and contributes nothing to the cross-policy combine.
     * Omitted (or `true`) for applicable decisions.
     */
    readonly applicable?: boolean
  }

  /**
   * Engine execution mode.
   *
   * - `'development'` returns rich {@link IDecision} objects with timing,
   *   reasons, rule references, and the full explain/debug API. Default.
   * - `'production'` returns plain booleans. No timing overhead, no
   *   allocation, no reason strings. Enables dead-code elimination of debug paths.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Mode = 'development' | 'production'

  /**
   * Conditional return type based on engine mode. Production -> `boolean`,
   * development -> {@link IDecision}.
   *
   * @template M - The engine {@link Mode}.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type ModeResult<M extends Mode> = M extends 'production' ? boolean : IDecision

  /**
   * Conditional permission map type based on engine mode. Production ->
   * `Record<string, boolean>`, development -> typed {@link Client.PermissionMap}.
   *
   * @template M         - The engine {@link Mode}.
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type ModePermissionMap<
    M extends Mode,
    TAction extends string = string,
    TResource extends string = string,
    TScope extends string = string,
  > = M extends 'production' ? Record<string, boolean> : Client.PermissionMap<TAction, TResource, TScope>

  /**
   * Function signature for a single operator implementation evaluating a
   * `(field, value)` pair from a condition.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type OpFn = (field: Primitives.AttributeValue, value: Primitives.AttributeValue) => boolean
}
