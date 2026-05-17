import type { PolicyBuilder, RoleBuilder, RuleBuilder, When } from '../builder'
import type { Engine, EngineTypes } from '../engine'
import type { AccessControl, Client, DotPath } from '../types'
import type { Validate } from '../validate'

export namespace Config {
  /**
   * Input shape for {@link createAccessConfig}. Pass `as const` arrays so the
   * factory extracts union types from each array and threads them through
   * every builder method.
   *
   * @template TActions   - Tuple of action strings declared `as const`.
   * @template TResources - Tuple of resource strings declared `as const`.
   * @template TScopes    - Tuple of scope strings declared `as const`.
   * @template TRoles     - Tuple of role ID strings declared `as const`.
   * @template TContext   - Shape of the evaluation context for typed dot-paths.
   * @example
   * ```ts
   * const input: Config.IAccessConfigInput<['read'], ['post']> = {
   *   actions: ['read'] as const,
   *   resources: ['post'] as const,
   * }
   * ```
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAccessConfigInput<
    TActions extends readonly string[],
    TResources extends readonly string[],
    TScopes extends readonly string[] = readonly string[],
    TRoles extends readonly string[] = readonly string[],
    TContext extends object = DotPath.IDefaultContext,
  > {
    /** Actions your application supports (`['create', 'read', ...]`). `as const`. */
    readonly actions: TActions
    /** Resource types your application manages. `as const`. */
    readonly resources: TResources
    /** Scope strings for multi-tenant authorization. `as const`. */
    readonly scopes?: TScopes
    /** Role IDs to constrain role builders. `as const`. */
    readonly roles?: TRoles
    /**
     * Phantom field for context type inference.
     *
     * Pass `{} as unknown as YourContext` to enable typed dot-path
     * intellisense on `.attr()`, `.resourceAttr()`, `.env()`, `.check()`.
     * Runtime value is never used - only the type information flows through.
     */
    readonly context?: TContext
  }

  /**
   * Typed configuration object returned by {@link createAccessConfig}. Every
   * builder method is constrained to the declared action / resource / scope /
   * role unions. Misspelling produces a compile-time error.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TScope    - Union of valid scope strings.
   * @template TRole     - Union of valid role ID strings.
   * @template TContext  - Shape of the evaluation context for typed dot-paths.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAccessConfig<
    TAction extends string,
    TResource extends string,
    TScope extends string = string,
    TRole extends string = string,
    TContext extends object = DotPath.IDefaultContext,
  > {
    readonly actions: readonly TAction[]
    readonly resources: readonly TResource[]
    /** Empty array if no scopes were declared. */
    readonly scopes: readonly TScope[]
    /** Empty array if no roles were declared. */
    readonly roles: readonly TRole[]

    /** Typed {@link RoleBuilder}; role ID constrained to declared roles. */
    defineRole: (id: TRole) => RoleBuilder<TAction, TResource, TRole, TScope, TContext>

    /** Typed {@link PolicyBuilder}; rules constrained to declared actions/resources/roles. */
    policy: (id: string) => PolicyBuilder<TAction, TResource, TRole, TScope, TContext>

    /** Typed standalone {@link RuleBuilder} for composing rules across policies. */
    defineRule: (id: string) => RuleBuilder<TAction, TResource, TScope, TRole, TContext>

    /** Typed {@link When} builder for reusable condition groups. */
    when: () => When<TAction, TResource, TRole, TScope, TContext>

    /**
     * Typed {@link Engine} instance. Permission checks are constrained to the
     * declared actions / resources / scopes.
     */
    createEngine: <TMode extends AccessControl.Mode = 'development'>(
      config: EngineTypes.IConfig<TAction, TResource, TRole, TScope, TMode>,
    ) => Engine<TAction, TResource, TRole, TScope, TMode>

    /**
     * Compile-time-typed pass-through for `engine.permissions()` inputs.
     */
    checks: <const T extends readonly Client.IPermissionCheck<TAction, TResource, TScope>[]>(checks: T) => T

    /** Role validation: duplicate IDs, dangling inherits, circular inheritance, empty roles. */
    validateRoles: (roles: readonly AccessControl.IRole<TAction, TResource, string, TScope>[]) => Validate.IResult

    /**
     * Validate a policy object from an untrusted source (database, API, JSON).
     * Deep shape + semantic checks.
     */
    validatePolicy: (input: unknown) => Validate.IResult
  }

  /**
   * Extracts the union of action strings from a config input.
   *
   * @template S - Config input shape with an `actions` tuple.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type InferAction<S extends { actions: readonly string[] }> = S['actions'][number]

  /**
   * Extracts the union of resource strings from a config input.
   *
   * @template S - Config input shape with a `resources` tuple.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type InferResource<S extends { resources: readonly string[] }> = S['resources'][number]

  /**
   * Extracts the union of scope strings from a config input.
   *
   * @template S - Config input shape with a `scopes` tuple.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type InferScope<S extends { scopes: readonly string[] }> = S['scopes'][number]

  /**
   * Extracts the union of role strings from a config input.
   *
   * @template S - Config input shape with a `roles` tuple.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type InferRole<S extends { roles: readonly string[] }> = S['roles'][number]
}
