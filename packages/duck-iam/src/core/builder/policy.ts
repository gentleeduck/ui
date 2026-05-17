import type { AccessControl, DotPath } from '../types'
import { RuleBuilder } from './rule'

/**
 * Fluent builder for constructing ABAC {@link AccessControl.IPolicy} objects.
 *
 * Policies define attribute-based access control rules that go beyond simple
 * role-permission mappings. Use them for time-based restrictions, IP/geo-fencing,
 * cross-attribute checks, dynamic deny rules, and maintenance-mode guards.
 *
 * The combining algorithm chosen via `.algorithm(...)` controls *intra*-policy
 * rule conflicts. Decisions across multiple policies are merged by the engine's
 * configured `policyCombine` (defaults to `'and'`; see {@link AccessControl.PolicyCombine}).
 *
 * @template TAction   - Union of valid action strings.
 * @template TResource - Union of valid resource strings.
 * @template TRole     - Union of valid role strings.
 * @template TScope    - Union of valid scope strings.
 * @template TContext  - Shape of the full evaluation context for typed dot-paths.
 *
 * @example
 * ```typescript
 * import { policy } from '@gentleduck/iam'
 *
 * const weekendDeny = policy('deny-weekends')
 *   .name('Deny on Weekends')
 *   .desc('Block all write operations on weekends')
 *   .version(1)
 *   .algorithm('deny-overrides')
 *   .rule('r-deny-weekends', r => r
 *     .deny()
 *     .on('create', 'update', 'delete')
 *     .of('*')
 *     .when(w => w.env('dayOfWeek', 'in', [0, 6]))
 *   )
 *   .build()
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export class PolicyBuilder<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
  TContext extends object = DotPath.IDefaultContext,
> {
  private _id: string
  private _name: string
  private _description?: string
  private _algorithm: AccessControl.CombiningAlgorithm = 'deny-overrides'
  private _rules: AccessControl.IRule<TAction, TResource>[] = []
  private _targets?: AccessControl.IPolicy<TAction, TResource, TRole>['targets']
  private _version?: number

  constructor(id: string) {
    this._id = id
    this._name = id
  }

  /**
   * Sets a human-readable name for the policy.
   *
   * Defaults to the policy `id` if not called.
   *
   * @param n - Display name.
   * @returns `this` for chaining.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  name(n: string): this {
    this._name = n
    return this
  }

  /**
   * Sets an optional description for the policy.
   *
   * @param d - Description text.
   * @returns `this` for chaining.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  desc(d: string): this {
    this._description = d
    return this
  }

  /**
   * Sets a version number for tracking policy changes over time.
   *
   * @param v - Version number.
   * @returns `this` for chaining.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  version(v: number): this {
    this._version = v
    return this
  }

  /**
   * Sets the combining algorithm used to resolve conflicts between rules
   * within this policy.
   *
   * | Algorithm | Behavior |
   * |---|---|
   * | `deny-overrides` | Any deny wins. Default. Best for restriction policies. |
   * | `allow-overrides` | Any allow wins. Best for RBAC / permissive rules. |
   * | `first-match` | First matching rule wins. Best for firewall-style ordered lists. |
   * | `highest-priority` | Highest priority number wins. Best for emergency overrides. |
   *
   * Defaults to `'deny-overrides'`.
   *
   * @param a - Combining algorithm.
   * @returns `this` for chaining.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  algorithm(a: AccessControl.CombiningAlgorithm): this {
    this._algorithm = a
    return this
  }

  /**
   * Scopes this policy to specific actions, resources, or roles.
   *
   * If an incoming request does not match all specified targets, the policy is
   * skipped entirely - its rules are not evaluated. This is useful for
   * restriction policies that only apply to a subset of operations.
   *
   * @param t - Target constraints to match against.
   *
   * @example
   * ```typescript
   * policy('write-restrictions')
   *   .target({
   *     actions: ['create', 'update', 'delete'],
   *     resources: ['post', 'comment'],
   *   })
   * ```
   * @returns `this` for chaining.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  target(t: NonNullable<AccessControl.IPolicy<TAction, TResource, TRole>['targets']>): this {
    this._targets = t
    return this
  }

  /**
   * Adds a rule to the policy using an inline {@link RuleBuilder} callback.
   *
   * Rules are the individual allow/deny statements inside a policy. Each rule
   * specifies an effect, the actions and resources it applies to, an optional
   * priority, and attribute-based conditions.
   *
   * @param id - Unique identifier for the rule within this policy.
   * @param fn - Builder callback that configures and returns the rule.
   *
   * @example
   * ```typescript
   * policy('ip-guard')
   *   .rule('block-bad-ips', r => r
   *     .deny()
   *     .on('*')
   *     .of('*')
   *     .when(w => w.env('ip', 'in', ['10.0.0.99', '10.0.0.100']))
   *   )
   * ```
   * @returns `this` for chaining.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  rule(
    id: string,
    fn: (
      r: RuleBuilder<TAction, TResource, TScope, TRole, TContext>,
      // biome-ignore lint/suspicious/noExplicitAny: TActiveResource is an opaque internal generic
    ) => RuleBuilder<TAction, TResource, TScope, TRole, TContext, any>,
  ): this {
    const builder = new RuleBuilder<TAction, TResource, TScope, TRole, TContext>(id)
    fn(builder)
    this._rules.push(builder.build())
    return this
  }

  /**
   * Adds a pre-built {@link AccessControl.IRule} object directly to the policy.
   *
   * Use this when you have rules defined separately via `defineRule` and want
   * to compose them into a policy without the inline callback form.
   *
   * @param rule - A fully constructed `Rule` object.
   *
   * @example
   * ```typescript
   * import { defineRule } from '@gentleduck/iam'
   *
   * const denyDrafts = defineRule('deny-drafts')
   *   .deny()
   *   .on('read')
   *   .of('post')
   *   .when(w => w.resourceAttr('status', 'eq', 'draft'))
   *   .build()
   *
   * policy('post-access').addRule(denyDrafts)
   * ```
   * @returns `this` for chaining.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  addRule(rule: AccessControl.IRule<TAction, TResource>): this {
    this._rules.push(rule)
    return this
  }

  /**
   * Produces the final {@link AccessControl.IPolicy} object.
   *
   * Call this after all builder methods have been chained. The resulting object
   * can be passed to an adapter or registered with the engine directly.
   *
   * @returns The constructed `Policy`.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  build(): AccessControl.IPolicy<TAction, TResource, TRole> {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      version: this._version,
      algorithm: this._algorithm,
      rules: this._rules,
      targets: this._targets,
    }
  }
}

/**
 * Creates a new {@link PolicyBuilder} for the given policy ID.
 *
 * This is the primary entry point for defining ABAC policies. Prefer this
 * factory over constructing `PolicyBuilder` directly.
 *
 * @template TAction   - Union of valid action strings.
 * @template TResource - Union of valid resource strings.
 * @template TRole     - Union of valid role strings.
 * @template TScope    - Union of valid scope strings.
 * @template TContext  - Shape of the full evaluation context for typed dot-paths.
 *
 * @param id - Unique identifier for the policy. Also used as the default name.
 * @returns A new `PolicyBuilder` instance.
 *
 * @example
 * ```typescript
 * import { policy } from '@gentleduck/iam'
 *
 * const maintenanceMode = policy('maintenance-mode')
 *   .name('Maintenance Mode')
 *   .desc('Deny all writes when the maintenance flag is active')
 *   .algorithm('deny-overrides')
 *   .rule('deny-writes', r => r
 *     .deny()
 *     .on('create', 'update', 'delete')
 *     .of('*')
 *     .when(w => w.env('maintenanceMode', 'eq', true))
 *   )
 *   .build()
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const policy = <
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
  TContext extends object = DotPath.IDefaultContext,
>(
  id: string,
) => new PolicyBuilder<TAction, TResource, TRole, TScope, TContext>(id)
