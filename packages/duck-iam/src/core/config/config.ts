import { PolicyBuilder, RoleBuilder, RuleBuilder, When } from '../builder'
import type { EngineConfig } from '../engine'
import { Engine } from '../engine'
import type { DefaultContext, Mode, PermissionCheck, Role } from '../types'
import { validatePolicy, validateRoles } from '../validate'
import type { AccessConfig, AccessConfigInput } from './config.types'

/**
 * Creates a type-safe access configuration for your application.
 *
 * This is the primary entry point for duck-iam. Pass your permission schema
 * using `as const` arrays and get back an {@link AccessConfig} with fully typed
 * builder methods.
 *
 * @param input - Your permission schema: actions, resources, and optionally scopes, roles, and context.
 * @returns A typed {@link AccessConfig} with constrained builder methods.
 *
 * @example
 * ```ts
 * const access = createAccessConfig({
 *   actions: ['create', 'read', 'update', 'delete'] as const,
 *   resources: ['post', 'comment', 'user'] as const,
 *   roles: ['viewer', 'editor', 'admin'] as const,
 *   context: {} as unknown as AppContext,
 * })
 *
 * // All builders are now type-safe:
 * access.defineRole('viewer').grant('read', 'post')   // OK
 * access.defineRole('viewer').grant('raed', 'post')   // compile error
 * ```
 */
export function createAccessConfig<
  const TActions extends readonly string[],
  const TResources extends readonly string[],
  const TScopes extends readonly string[] = readonly string[],
  const TRoles extends readonly string[] = readonly string[],
  TContext extends object = DefaultContext,
>(
  input: AccessConfigInput<TActions, TResources, TScopes, TRoles, TContext>,
): AccessConfig<TActions[number], TResources[number], TScopes[number], TRoles[number], TContext> {
  type TAction = TActions[number]
  type TResource = TResources[number]
  type TScope = TScopes[number]
  type TRole = TRoles[number]

  return {
    actions: input.actions,
    resources: input.resources,
    scopes: input.scopes ?? [],
    roles: input.roles ?? [],

    defineRole: (id: TRole) => new RoleBuilder<TAction, TResource, TRole, TScope, TContext>(id),

    policy: (id: string) => new PolicyBuilder<TAction, TResource, TRole, TScope, TContext>(id),

    defineRule: (id: string) => new RuleBuilder<TAction, TResource, TScope, TRole, TContext>(id),

    when: () => new When<TAction, TResource, TRole, TScope, TContext>(),

    createEngine: <TMode extends Mode = 'development'>(
      config: EngineConfig<TAction, TResource, TRole, TScope, TMode>,
    ) => new Engine<TAction, TResource, TRole, TScope, TMode>(config),

    checks: <const T extends readonly PermissionCheck<TAction, TResource, TScope>[]>(checks: T) => checks,

    validateRoles: (roles: readonly Role<TAction, TResource, string, TScope>[]) => validateRoles(roles),

    validatePolicy: (input: unknown) => validatePolicy(input),
  }
}
