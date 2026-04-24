import type { PolicyBuilder, RoleBuilder, RuleBuilder, When } from '../builder'
import type { Engine, EngineConfig } from '../engine'
import type { DefaultContext, Mode, PermissionCheck, Role } from '../types'
import type { ValidationResult } from '../validate'

// ------------------------------------------------------------
// Input
// ------------------------------------------------------------

/**
 * Input shape for {@link createAccessConfig}.
 *
 * Pass `as const` arrays for compile-time type safety. The factory extracts
 * union types from each array and threads them through every builder method.
 *
 * @template TActions   - Literal tuple of action strings (inferred via `as const`)
 * @template TResources - Literal tuple of resource strings (inferred via `as const`)
 * @template TScopes    - Literal tuple of scope strings (optional, inferred via `as const`)
 * @template TRoles     - Literal tuple of role strings (optional, inferred via `as const`)
 * @template TContext   - Custom context type for typed dot-path intellisense
 *
 * @example
 * ```ts
 * createAccessConfig({
 *   actions: ['create', 'read', 'update', 'delete'] as const,
 *   resources: ['post', 'comment'] as const,
 *   roles: ['viewer', 'editor', 'admin'] as const,
 *   context: {} as unknown as AppContext,
 * })
 * ```
 */
export interface AccessConfigInput<
  TActions extends readonly string[],
  TResources extends readonly string[],
  TScopes extends readonly string[] = readonly string[],
  TRoles extends readonly string[] = readonly string[],
  TContext extends object = DefaultContext,
> {
  /** The actions your application supports (e.g. `['create', 'read', 'update', 'delete']`). Requires `as const`. */
  readonly actions: TActions
  /** The resource types your application manages (e.g. `['post', 'comment', 'user']`). Requires `as const`. */
  readonly resources: TResources
  /** Optional scope strings for multi-tenant authorization (e.g. `['org-acme', 'org-globex']`). Requires `as const`. */
  readonly scopes?: TScopes
  /** Optional role IDs to constrain role builders (e.g. `['viewer', 'editor', 'admin']`). Requires `as const`. */
  readonly roles?: TRoles
  /**
   * Phantom field for context type inference.
   *
   * Pass `{} as unknown as YourContext` to enable typed dot-path intellisense
   * on `.attr()`, `.resourceAttr()`, `.env()`, and `.check()`. The runtime value
   * is never used -- only the type information flows through to the builders.
   */
  readonly context?: TContext
}

// ------------------------------------------------------------
// Output
// ------------------------------------------------------------

/**
 * The typed configuration object returned by {@link createAccessConfig}.
 *
 * Every builder method on this object is constrained to the action, resource,
 * scope, and role unions declared in the input. Misspelling an action, referencing
 * a resource that does not exist, or passing an invalid role ID produces a
 * compile-time error.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TScope    - Union of valid scope strings
 * @template TRole     - Union of valid role strings
 * @template TContext  - Custom context type for typed dot-path intellisense
 */
export interface AccessConfig<
  TAction extends string,
  TResource extends string,
  TScope extends string = string,
  TRole extends string = string,
  TContext extends object = DefaultContext,
> {
  /** The action strings declared in the config input. */
  readonly actions: readonly TAction[]
  /** The resource strings declared in the config input. */
  readonly resources: readonly TResource[]
  /** The scope strings declared in the config input (empty array if omitted). */
  readonly scopes: readonly TScope[]
  /** The role strings declared in the config input (empty array if omitted). */
  readonly roles: readonly TRole[]

  /**
   * Creates a typed {@link RoleBuilder}. The role ID is constrained to the
   * declared roles, and all grant methods are constrained to declared actions/resources.
   */
  defineRole: (id: TRole) => RoleBuilder<TAction, TResource, TRole, TScope, TContext>

  /**
   * Creates a typed {@link PolicyBuilder}. Rules within the policy are
   * constrained to declared actions, resources, and roles.
   */
  policy: (id: string) => PolicyBuilder<TAction, TResource, TRole, TScope, TContext>

  /**
   * Creates a typed standalone {@link RuleBuilder}. Useful when composing
   * rules across policies via `policy.addRule()`.
   */
  defineRule: (id: string) => RuleBuilder<TAction, TResource, TScope, TRole, TContext>

  /**
   * Creates a typed {@link When} condition builder for reusable condition groups.
   * Role references via `.role()` and `.roles()` are constrained to declared roles.
   */
  when: () => When<TAction, TResource, TRole, TScope, TContext>

  /**
   * Creates a typed {@link Engine} instance. Permission checks on this engine
   * are constrained to declared actions, resources, and scopes.
   */
  createEngine: <TMode extends Mode = 'development'>(
    config: EngineConfig<TAction, TResource, TRole, TScope, TMode>,
  ) => Engine<TAction, TResource, TRole, TScope, TMode>

  /**
   * Pure typing utility that returns the input array as-is but constrains
   * the types at compile time. Use with `engine.permissions()` for type-safe
   * batch permission checks.
   */
  checks: <const T extends readonly PermissionCheck<TAction, TResource, TScope>[]>(checks: T) => T

  /**
   * Validates role definitions for common configuration mistakes:
   * duplicate IDs, dangling inherits, circular inheritance, and empty roles.
   */
  validateRoles: (roles: readonly Role<TAction, TResource, string, TScope>[]) => ValidationResult

  /**
   * Validates a policy object from an untrusted source (database, API, JSON).
   * Deeply checks the entire structure including rules, conditions, and operators.
   */
  validatePolicy: (input: unknown) => ValidationResult
}

// ------------------------------------------------------------
// Inference helpers
// ------------------------------------------------------------

/**
 * Extracts the union of action strings from a config input.
 *
 * @example
 * ```ts
 * type Actions = InferAction<typeof configInput>
 * // = 'create' | 'read' | 'update' | 'delete'
 * ```
 */
export type InferAction<S extends { actions: readonly string[] }> = S['actions'][number]

/**
 * Extracts the union of resource strings from a config input.
 *
 * @example
 * ```ts
 * type Resources = InferResource<typeof configInput>
 * // = 'post' | 'comment' | 'user'
 * ```
 */
export type InferResource<S extends { resources: readonly string[] }> = S['resources'][number]

/**
 * Extracts the union of scope strings from a config input.
 *
 * @example
 * ```ts
 * type Scopes = InferScope<typeof configInput>
 * // = 'org-acme' | 'org-globex'
 * ```
 */
export type InferScope<S extends { scopes: readonly string[] }> = S['scopes'][number]

/**
 * Extracts the union of role strings from a config input.
 *
 * @example
 * ```ts
 * type Roles = InferRole<typeof configInput>
 * // = 'viewer' | 'editor' | 'admin'
 * ```
 */
export type InferRole<S extends { roles: readonly string[] }> = S['roles'][number]
