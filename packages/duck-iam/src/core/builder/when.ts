import type {
  AttributeValue,
  AttrValue,
  Condition,
  ConditionGroup,
  ConditionValue,
  DefaultContext,
  EnvAttrs,
  FieldValue,
  FlexibleDollarPaths,
  FlexibleDotPaths,
  Operator,
  ResolvedResourceAttrs,
  SubjectAttrs,
} from '../types'

/**
 * Fluent condition builder for duck-iam rules and role permissions.
 *
 * `When` accumulates a list of {@link Condition} and nested {@link ConditionGroup}
 * items and then emits them as an `all` (AND), `any` (OR), or `none` (NOT) group
 * via the terminal build methods. It is used as the callback argument in
 * {@link RuleBuilder.when}, {@link RuleBuilder.whenAny}, and
 * {@link RoleBuilder.grantWhen}.
 *
 * @example
 * ```ts
 * // Inside a rule
 * defineRule('expense.approve')
 *   .allow()
 *   .on('approve').of('expense')
 *   .when(w => w
 *     .attr('department', 'eq', 'engineering')
 *     .resourceAttr('amount', 'lte', 10_000)
 *   )
 *
 * // Nested OR inside an AND
 * defineRule('post.edit')
 *   .allow()
 *   .on('update').of('post')
 *   .when(w => w
 *     .or(o => o.isOwner().role('admin'))
 *     .env('time', 'gte', 9)
 *   )
 * ```
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role ID strings
 * @template TScope    - Union of valid scope strings
 * @template TContext  - Shape of the full evaluation context for typed dot-paths
 */
export class When<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
  TContext extends object = DefaultContext,
  TActiveResource extends string = string,
> {
  private items: Array<Condition | ConditionGroup> = []

  /**
   * Appends a raw {@link Condition} to the builder with fully typed dot-path
   * field access. The `field` parameter is constrained to valid paths within
   * `TContext`, and `value` is inferred from the type at that path.
   *
   * @param field - Dot-path to the attribute being tested (e.g. `'subject.attributes.tier'`)
   * @param op    - The {@link Operator} to apply
   * @param value - The right-hand side value (omit for `exists`)
   * @returns `this` for chaining
   *
   * @example
   * ```ts
   * w.check('subject.attributes.status', 'eq', 'banned')   // OK
   * w.check('environment.hour', 'gte', 9)                  // OK
   * w.check('resource.attributes.status', 'eq', 'deleted') // ERROR if 'deleted' not in type
   * w.check('subject.attributes.age', 'eq', 30)            // ERROR if 'age' not in type
   * ```
   */
  check<P extends FlexibleDotPaths<TContext>>(
    field: P,
    op: Operator,
    value?: FieldValue<TContext, P> | FlexibleDollarPaths<TContext>,
  ): this {
    this.items.push({ field, operator: op, value })
    return this
  }

  // ---------------------------------------------------------------------------
  // Operator shorthands
  // ---------------------------------------------------------------------------

  /**
   * Asserts `field == value`.
   *
   * @param field - Typed dot-path attribute path
   * @param value - Expected value (inferred from path type)
   * @returns `this` for chaining
   */
  eq<P extends FlexibleDotPaths<TContext>>(
    field: P,
    value: FieldValue<TContext, P> | FlexibleDollarPaths<TContext>,
  ): this {
    this.items.push({ field, operator: 'eq', value })
    return this
  }

  /**
   * Asserts `field != value`.
   *
   * @param field - Typed dot-path attribute path
   * @param value - Value the field must not equal
   * @returns `this` for chaining
   */
  neq<P extends FlexibleDotPaths<TContext>>(
    field: P,
    value: FieldValue<TContext, P> | FlexibleDollarPaths<TContext>,
  ): this {
    this.items.push({ field, operator: 'neq', value })
    return this
  }

  /**
   * Asserts `field` is one of the given `values`.
   *
   * @param field  - Typed dot-path attribute path
   * @param values - Array of acceptable values
   * @returns `this` for chaining
   */
  in<P extends FlexibleDotPaths<TContext>>(
    field: P,
    values: Array<FieldValue<TContext, P> | FlexibleDollarPaths<TContext>>,
  ): this {
    this.items.push({ field, operator: 'in', value: values as AttributeValue })
    return this
  }

  /**
   * Asserts that the array at `field` contains `value`.
   *
   * Commonly used to check role membership:
   * `w.contains('subject.roles', 'admin')`.
   *
   * @param field - Typed dot-path attribute path pointing to an array
   * @param value - The value that must be present in the array
   * @returns `this` for chaining
   */
  contains<P extends FlexibleDotPaths<TContext>>(field: P, value: string): this {
    this.items.push({ field, operator: 'contains', value })
    return this
  }

  /**
   * Asserts that `field` exists (is defined and non-null).
   *
   * @param field - Typed dot-path attribute path to check for existence
   * @returns `this` for chaining
   */
  exists<P extends FlexibleDotPaths<TContext>>(field: P): this {
    this.items.push({ field, operator: 'exists' })
    return this
  }

  /**
   * Asserts `field > value`.
   *
   * @param field - Typed dot-path attribute path
   * @param value - Numeric lower bound (exclusive)
   * @returns `this` for chaining
   */
  gt<P extends FlexibleDotPaths<TContext>>(field: P, value: number): this {
    this.items.push({ field, operator: 'gt', value })
    return this
  }

  /**
   * Asserts `field >= value`.
   *
   * @param field - Typed dot-path attribute path
   * @param value - Numeric lower bound (inclusive)
   * @returns `this` for chaining
   */
  gte<P extends FlexibleDotPaths<TContext>>(field: P, value: number): this {
    this.items.push({ field, operator: 'gte', value })
    return this
  }

  /**
   * Asserts `field < value`.
   *
   * @param field - Typed dot-path attribute path
   * @param value - Numeric upper bound (exclusive)
   * @returns `this` for chaining
   */
  lt<P extends FlexibleDotPaths<TContext>>(field: P, value: number): this {
    this.items.push({ field, operator: 'lt', value })
    return this
  }

  /**
   * Asserts `field <= value`.
   *
   * @param field - Typed dot-path attribute path
   * @param value - Numeric upper bound (inclusive)
   * @returns `this` for chaining
   */
  lte<P extends FlexibleDotPaths<TContext>>(field: P, value: number): this {
    this.items.push({ field, operator: 'lte', value })
    return this
  }

  /**
   * Asserts that `field` matches the given regular expression string.
   *
   * @param field - Typed dot-path attribute path
   * @param regex - Regular expression pattern (as a string)
   * @returns `this` for chaining
   */
  matches<P extends FlexibleDotPaths<TContext>>(field: P, regex: string): this {
    this.items.push({ field, operator: 'matches', value: regex })
    return this
  }

  // ---------------------------------------------------------------------------
  // Semantic shortcuts
  // ---------------------------------------------------------------------------

  /**
   * Asserts the subject holds the given role.
   *
   * Equivalent to `w.contains('subject.roles', roleId)`.
   *
   * @param roleId - The role ID that must be present in `subject.roles`
   * @returns `this` for chaining
   */
  role(roleId: TRole): this {
    this.items.push({ field: 'subject.roles', operator: 'contains', value: roleId })
    return this
  }

  /**
   * Asserts the subject holds at least one of the given roles.
   *
   * Equivalent to `w.check('subject.roles', 'in', roleIds)`.
   *
   * @param roleIds - Role IDs to test membership against
   * @returns `this` for chaining
   */
  roles(...roleIds: TRole[]): this {
    this.items.push({ field: 'subject.roles', operator: 'in', value: roleIds as string[] })
    return this
  }

  /**
   * Asserts the request is made within a specific scope.
   *
   * Equivalent to `w.check('scope', 'eq', id)`.
   *
   * @param id - The scope the request must be in
   * @returns `this` for chaining
   */
  scope(id: TScope): this {
    this.items.push({ field: 'scope', operator: 'eq', value: id })
    return this
  }

  /**
   * Asserts the request is made within one of the given scopes.
   *
   * Equivalent to `w.check('scope', 'in', ids)`.
   *
   * @param ids - Acceptable scope IDs
   * @returns `this` for chaining
   */
  scopes(...ids: TScope[]): this {
    this.items.push({ field: 'scope', operator: 'in', value: ids as string[] })
    return this
  }

  /**
   * Asserts the subject is the owner of the resource.
   *
   * Checks that `ownerField` equals the special variable `'$subject.id'`,
   * which the engine resolves to the current subject's ID at evaluation time.
   *
   * @example
   * ```ts
   * // Using the default owner field
   * w.isOwner()
   *
   * // Custom owner field
   * w.isOwner('resource.attributes.createdBy')
   * ```
   *
   * @param ownerField - Dot-path to the owner attribute on the resource.
   *   Defaults to `'resource.attributes.ownerId'`.
   * @returns `this` for chaining
   */
  isOwner(ownerField: FlexibleDotPaths<TContext> = 'resource.attributes.ownerId' as FlexibleDotPaths<TContext>): this {
    this.items.push({ field: ownerField, operator: 'eq', value: '$subject.id' })
    return this
  }

  /**
   * Asserts the resource's type is one of the given values.
   *
   * Equivalent to `w.check('resource.type', 'in', types)`.
   *
   * @param types - Acceptable resource type strings
   * @returns `this` for chaining
   */
  resourceType(...types: (TResource | '*')[]): this {
    this.items.push({ field: 'resource.type', operator: 'in', value: types as string[] })
    return this
  }

  /**
   * Asserts a subject attribute at the given path.
   *
   * Prefixes `path` with `'subject.attributes.'` automatically.
   *
   * @example
   * ```ts
   * w.attr('department', 'eq', 'engineering')
   * // evaluates: subject.attributes.department == 'engineering'
   * ```
   *
   * @param path  - Typed attribute key under `subject.attributes`
   * @param op    - The {@link Operator} to apply
   * @param value - Right-hand side value (inferred from type)
   * @returns `this` for chaining
   */
  attr<K extends keyof SubjectAttrs<TContext> & string>(
    path: K,
    op: Operator,
    value?: ConditionValue<TContext, AttrValue<SubjectAttrs<TContext>, K>> | FlexibleDollarPaths<TContext>,
  ): this {
    this.items.push({ field: `subject.attributes.${path}`, operator: op, value })
    return this
  }

  /**
   * Asserts a resource attribute at the given path.
   *
   * Prefixes `path` with `'resource.attributes.'` automatically.
   *
   * @example
   * ```ts
   * w.resourceAttr('status', 'eq', 'published')
   * // evaluates: resource.attributes.status == 'published'
   * ```
   *
   * @param path  - Typed attribute key under `resource.attributes`
   * @param op    - The {@link Operator} to apply
   * @param value - Right-hand side value (inferred from type)
   * @returns `this` for chaining
   */
  resourceAttr<K extends keyof ResolvedResourceAttrs<TContext, TActiveResource> & string>(
    path: K,
    op: Operator,
    value?:
      | ConditionValue<TContext, AttrValue<ResolvedResourceAttrs<TContext, TActiveResource>, K>>
      | FlexibleDollarPaths<TContext>,
  ): this {
    this.items.push({ field: `resource.attributes.${path}`, operator: op, value })
    return this
  }

  /**
   * Asserts an environment attribute at the given path.
   *
   * Prefixes `path` with `'environment.'` automatically. Useful for
   * time-based or context-based conditions.
   *
   * @example
   * ```ts
   * w.env('hour', 'gte', 9).env('hour', 'lte', 17)
   * // evaluates: environment.hour >= 9 AND environment.hour <= 17
   * ```
   *
   * @param path  - Typed attribute key under `environment`
   * @param op    - The {@link Operator} to apply
   * @param value - Right-hand side value (inferred from type)
   * @returns `this` for chaining
   */
  env<K extends keyof EnvAttrs<TContext> & string>(
    path: K,
    op: Operator,
    value?: ConditionValue<TContext, AttrValue<EnvAttrs<TContext>, K>> | FlexibleDollarPaths<TContext>,
  ): this {
    this.items.push({ field: `environment.${path}`, operator: op, value })
    return this
  }

  // ---------------------------------------------------------------------------
  // Nesting
  // ---------------------------------------------------------------------------

  /**
   * Appends a nested ALL-of (AND) condition group.
   *
   * Every condition added inside the callback must hold. The nested group is
   * treated as a single item within the outer builder's condition list.
   *
   * @example
   * ```ts
   * w.and(a => a.attr('tier', 'eq', 'premium').env('region', 'eq', 'us'))
   * ```
   *
   * @param fn - Callback that receives a nested {@link When} and returns it
   * @returns `this` for chaining
   */
  and(
    fn: (
      w: When<TAction, TResource, TRole, TScope, TContext, TActiveResource>,
    ) => When<TAction, TResource, TRole, TScope, TContext, TActiveResource>,
  ): this {
    const nested = new When<TAction, TResource, TRole, TScope, TContext, TActiveResource>()
    fn(nested)
    this.items.push(nested.buildAll())
    return this
  }

  /**
   * Appends a nested ANY-of (OR) condition group.
   *
   * At least one condition inside the callback must hold.
   *
   * @example
   * ```ts
   * w.or(o => o.isOwner().role('admin'))
   * // passes if subject is owner OR has the admin role
   * ```
   *
   * @param fn - Callback that receives a nested {@link When} and returns it
   * @returns `this` for chaining
   */
  or(
    fn: (
      w: When<TAction, TResource, TRole, TScope, TContext, TActiveResource>,
    ) => When<TAction, TResource, TRole, TScope, TContext, TActiveResource>,
  ): this {
    const nested = new When<TAction, TResource, TRole, TScope, TContext, TActiveResource>()
    fn(nested)
    this.items.push(nested.buildAny())
    return this
  }

  /**
   * Appends a nested NONE-of (NOT) condition group.
   *
   * None of the conditions inside the callback may hold. Equivalent to
   * negating an OR group.
   *
   * @example
   * ```ts
   * w.not(n => n.attr('status', 'eq', 'banned'))
   * // passes if subject.attributes.status is NOT 'banned'
   * ```
   *
   * @param fn - Callback that receives a nested {@link When} and returns it
   * @returns `this` for chaining
   */
  not(
    fn: (
      w: When<TAction, TResource, TRole, TScope, TContext, TActiveResource>,
    ) => When<TAction, TResource, TRole, TScope, TContext, TActiveResource>,
  ): this {
    const nested = new When<TAction, TResource, TRole, TScope, TContext, TActiveResource>()
    fn(nested)
    this.items.push(nested.buildNone())
    return this
  }

  // ---------------------------------------------------------------------------
  // Terminal build methods
  // ---------------------------------------------------------------------------

  /**
   * Emits the accumulated conditions as an ALL-of (`{ all: [...] }`) group.
   *
   * Every condition in the list must hold. This is the default used by
   * {@link RuleBuilder.when} and {@link RoleBuilder.grantWhen}.
   *
   * @returns A readonly `all` condition group
   */
  buildAll(): { readonly all: ReadonlyArray<Condition | ConditionGroup> } {
    return { all: this.items }
  }

  /**
   * Emits the accumulated conditions as an ANY-of (`{ any: [...] }`) group.
   *
   * At least one condition in the list must hold. Used by
   * {@link RuleBuilder.whenAny}.
   *
   * @returns A readonly `any` condition group
   */
  buildAny(): { readonly any: ReadonlyArray<Condition | ConditionGroup> } {
    return { any: this.items }
  }

  /**
   * Emits the accumulated conditions as a NONE-of (`{ none: [...] }`) group.
   *
   * None of the conditions in the list may hold. Produced by the {@link not}
   * nesting helper.
   *
   * @returns A readonly `none` condition group
   */
  buildNone(): { readonly none: ReadonlyArray<Condition | ConditionGroup> } {
    return { none: this.items }
  }
}

/**
 * Creates a standalone {@link When} condition builder.
 *
 * Useful when you need to construct a {@link ConditionGroup} outside of a
 * rule or role builder — for example, to build a reusable condition and
 * spread it across multiple rules.
 *
 * @example
 * ```ts
 * import { when } from '@gentleduck/iam'
 *
 * const ownerOrAdmin = when()
 *   .or(o => o.isOwner().role('admin'))
 *   .buildAll()
 * ```
 *
 * @returns A new {@link When} instance
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role ID strings
 * @template TScope    - Union of valid scope strings
 * @template TContext  - Shape of the full evaluation context for typed dot-paths
 */
export const when = <
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
  TRole extends string = string,
  TContext extends object = DefaultContext,
  TActiveResource extends string = string,
>() => new When<TAction, TResource, TRole, TScope, TContext, TActiveResource>()
