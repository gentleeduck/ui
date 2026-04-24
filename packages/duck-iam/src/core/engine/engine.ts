import { LRUCache } from '../../shared/cache'
import { buildPermissionKey } from '../../shared/keys'
import { evaluate, evaluateFast } from '../evaluate'
import type { ExplainResult } from '../explain'
import { explainEvaluation } from '../explain'
import { resolveEffectiveRoles, rolesToPolicy } from '../rbac'
import type {
  AccessRequest,
  Adapter,
  Decision,
  Effect,
  Mode,
  ModePermissionMap,
  ModeResult,
  PermissionCheck,
  Policy,
  Resource,
  Role,
  Subject,
} from '../types'
import { createAdmin, enrichSubjectWithScopedRoles } from './engine.libs'
import type { EngineAdmin, EngineConfig, EngineHooks } from './engine.types'

/**
 * The authorization engine: the central runtime that evaluates access requests
 * against RBAC roles and ABAC policies.
 *
 * The engine loads roles and policies from its adapter, caches them with
 * configurable TTL, converts RBAC roles into ABAC rules via `rolesToPolicy()`,
 * and AND-combines all policies so a deny from any single policy is final.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 *
 * @example
 * ```ts
 * const engine = new Engine({ adapter, defaultEffect: 'deny' })
 *
 * const allowed = await engine.can('user-1', 'read', { type: 'post', attributes: {} })
 * const decision = await engine.check('user-1', 'update', post)
 * const trace = await engine.explain('user-1', 'delete', post)
 * ```
 */
export class Engine<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
  TMode extends Mode = 'development',
> {
  private adapter: Adapter<TAction, TResource, TRole, TScope>
  private defaultEffect: Effect
  private mode: Mode
  private hooks: EngineHooks<TAction, TResource, TScope>
  private policyCache: LRUCache<Policy[]>
  private roleCache: LRUCache<Role[]>
  private rbacPolicyCache: LRUCache<Policy>
  private subjectCache: LRUCache<Subject>

  constructor(config: EngineConfig<TAction, TResource, TRole, TScope, TMode>) {
    this.adapter = config.adapter
    this.defaultEffect = config.defaultEffect ?? 'deny'
    this.mode = config.mode ?? ('development' as Mode)
    this.hooks = config.hooks ?? {}

    const ttl = (config.cacheTTL ?? 60) * 1000
    const maxSize = config.maxCacheSize ?? 1000

    this.policyCache = new LRUCache(1, ttl) // single entry
    this.roleCache = new LRUCache(1, ttl)
    this.rbacPolicyCache = new LRUCache(1, ttl)
    this.subjectCache = new LRUCache(maxSize, ttl)
  }

  /** Load all policies from the adapter, using the cache if available. */
  private async loadPolicies(): Promise<Policy[]> {
    const cached = this.policyCache.get('all')
    if (cached) return cached
    const policies = await this.adapter.listPolicies()
    this.policyCache.set('all', policies as Policy[])
    return policies as Policy[]
  }

  /** Load all roles from the adapter, using the cache if available. */
  private async loadRoles(): Promise<Role[]> {
    const cached = this.roleCache.get('all')
    if (cached) return cached
    const roles = await this.adapter.listRoles()
    this.roleCache.set('all', roles as Role[])
    return roles as Role[]
  }

  /** Resolve a subject's roles, scoped roles, and attributes, using the cache if available. */
  private async resolveSubject(subjectId: string): Promise<Subject> {
    const cached = this.subjectCache.get(subjectId)
    if (cached) return cached

    const [assignedRoles, attributes, allRoles] = await Promise.all([
      this.adapter.getSubjectRoles(subjectId),
      this.adapter.getSubjectAttributes(subjectId),
      this.loadRoles(),
    ])

    const roles = resolveEffectiveRoles(assignedRoles, allRoles)

    // Load scoped roles if adapter supports it
    const scopedRoles = this.adapter.getSubjectScopedRoles
      ? await this.adapter.getSubjectScopedRoles(subjectId)
      : undefined

    const subject: Subject = { id: subjectId, roles, scopedRoles, attributes }
    this.subjectCache.set(subjectId, subject)
    return subject
  }

  /**
   * Load RBAC + ABAC policies for evaluation.
   * Each user-defined policy keeps its own combining algorithm.
   * The RBAC-generated policy uses allow-overrides (set by rolesToPolicy).
   * The rolesToPolicy() conversion is cached to avoid recomputation.
   */
  private async loadAllPolicies(): Promise<Policy[]> {
    const [policies, roles] = await Promise.all([this.loadPolicies(), this.loadRoles()])

    let rbacPolicy = this.rbacPolicyCache.get('rbac')
    if (!rbacPolicy) {
      rbacPolicy = rolesToPolicy(roles)
      this.rbacPolicyCache.set('rbac', rbacPolicy)
    }

    return [rbacPolicy, ...policies]
  }

  /**
   * Full authorization check with a complete AccessRequest.
   *
   * In `'production'` mode, returns a plain `boolean`.
   * In `'development'` mode, returns a full {@link Decision}.
   */
  async authorize(request: AccessRequest<TAction, TResource, TScope>): Promise<ModeResult<TMode>> {
    let req = request

    try {
      // Enrich subject with scoped roles matching the request scope
      if (req.scope && req.subject.scopedRoles?.length) {
        req = { ...req, subject: enrichSubjectWithScopedRoles(req.subject, req.scope) }
      }

      if (this.hooks.beforeEvaluate) {
        req = await this.hooks.beforeEvaluate(req)
      }

      const allPolicies = await this.loadAllPolicies()

      // Production fast path — plain boolean, no allocations
      if (this.mode === 'production') {
        const allowed = evaluateFast(allPolicies, req as AccessRequest, this.defaultEffect)
        return allowed as ModeResult<TMode>
      }

      const decision = evaluate(allPolicies, req as AccessRequest, this.defaultEffect)

      if (this.hooks.afterEvaluate) {
        await this.hooks.afterEvaluate(req, decision)
      }
      if (!decision.allowed && this.hooks.onDeny) {
        await this.hooks.onDeny(req, decision)
      }

      return decision as ModeResult<TMode>
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      if (this.hooks.onError) {
        await this.hooks.onError(err, req)
      }
      if (this.mode === 'production') {
        return false as ModeResult<TMode>
      }
      return {
        allowed: false,
        effect: 'deny',
        reason: 'Evaluation error',
        duration: 0,
        timestamp: Date.now(),
      } as ModeResult<TMode>
    }
  }

  /**
   * Simple boolean check: can this user do this action on this resource?
   * Always returns a plain `boolean` regardless of engine mode.
   */
  async can(
    subjectId: string,
    action: TAction,
    resource: Resource<TResource>,
    environment?: AccessRequest<TAction, TResource, TScope>['environment'],
    scope?: TScope,
  ): Promise<boolean> {
    const subject = await this.resolveSubject(subjectId)
    const result = await this.authorize({ subject, action, resource, environment, scope })
    // In production mode result is already a boolean; in dev mode extract .allowed
    return typeof result === 'boolean' ? result : (result as Decision).allowed
  }

  /**
   * Same as `can` but returns the full Decision in development mode,
   * or a plain boolean in production mode.
   */
  async check(
    subjectId: string,
    action: TAction,
    resource: Resource<TResource>,
    environment?: AccessRequest<TAction, TResource, TScope>['environment'],
    scope?: TScope,
  ): Promise<ModeResult<TMode>> {
    const subject = await this.resolveSubject(subjectId)
    return this.authorize({ subject, action, resource, environment, scope })
  }

  /**
   * Debug tool: returns a full evaluation trace showing exactly why
   * a permission was granted or denied. Shows which policies matched,
   * which rules fired, which conditions passed/failed with actual vs
   * expected values, and a human-readable summary.
   *
   * Only available in `'development'` mode. Throws in `'production'` mode.
   *
   * Does NOT trigger afterEvaluate/onDeny/onError hooks (read-only).
   * Does apply beforeEvaluate hook since it affects the evaluation.
   */
  async explain(
    this: Engine<TAction, TResource, TRole, TScope, 'development'>,
    subjectId: string,
    action: TAction,
    resource: Resource<TResource>,
    environment?: AccessRequest<TAction, TResource, TScope>['environment'],
    scope?: TScope,
  ): Promise<ExplainResult> {
    if (this.mode === 'production') {
      throw new Error('explain() is not available in production mode')
    }
    const subject = await this.resolveSubject(subjectId)
    const originalRoles = [...subject.roles] as string[]

    let enrichedSubject = subject
    if (scope && subject.scopedRoles?.length) {
      enrichedSubject = enrichSubjectWithScopedRoles(subject, scope)
    }

    const scopedRolesApplied = (enrichedSubject.roles as string[]).filter((r) => !originalRoles.includes(r))

    let req: AccessRequest<TAction, TResource, TScope> = {
      subject: enrichedSubject,
      action,
      resource,
      environment,
      scope,
    }

    // Apply beforeEvaluate hook (it may modify the request)
    if (this.hooks.beforeEvaluate) {
      req = await this.hooks.beforeEvaluate(req)
    }

    const allPolicies = await this.loadAllPolicies()

    return explainEvaluation(allPolicies, req as AccessRequest, this.defaultEffect, {
      subjectId,
      originalRoles,
      scopedRolesApplied,
    })
  }

  /**
   * Batch check: evaluate many permissions at once for a single subject.
   * Returns a PermissionMap keyed by "action:resource" or "scope:action:resource".
   * Loads DB data once, evaluates many.
   * Each check goes through scoped role enrichment and hooks, consistent with authorize().
   *
   * In `'production'` mode, returns `Record<string, boolean>`.
   * In `'development'` mode, returns the full typed `PermissionMap`.
   */
  async permissions(
    subjectId: string,
    checks: readonly PermissionCheck<TAction, TResource, TScope>[],
    environment?: AccessRequest<TAction, TResource, TScope>['environment'],
  ): Promise<ModePermissionMap<TMode, TAction, TResource, TScope>> {
    const [subject, allPolicies] = await Promise.all([this.resolveSubject(subjectId), this.loadAllPolicies()])

    const map = {} as Record<string, boolean>

    for (const c of checks) {
      const key = buildPermissionKey(c.action, c.resource, c.resourceId, c.scope)

      try {
        let req: AccessRequest<TAction, TResource, TScope> = {
          subject,
          action: c.action,
          resource: { type: c.resource, id: c.resourceId, attributes: {} },
          environment,
          scope: c.scope,
        }

        // Enrich with scoped roles matching this check's scope
        if (req.scope && req.subject.scopedRoles?.length) {
          req = { ...req, subject: enrichSubjectWithScopedRoles(req.subject, req.scope) }
        }

        if (this.hooks.beforeEvaluate) {
          req = await this.hooks.beforeEvaluate(req)
        }

        // Production fast path
        if (this.mode === 'production') {
          map[key] = evaluateFast(allPolicies, req as AccessRequest, this.defaultEffect)
          continue
        }

        const decision = evaluate(allPolicies, req as AccessRequest, this.defaultEffect)

        if (this.hooks.afterEvaluate) {
          await this.hooks.afterEvaluate(req, decision)
        }
        if (!decision.allowed && this.hooks.onDeny) {
          await this.hooks.onDeny(req, decision)
        }

        map[key] = decision.allowed
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        if (this.hooks.onError) {
          await this.hooks.onError(err, {
            subject,
            action: c.action,
            resource: { type: c.resource, id: c.resourceId, attributes: {} },
            environment,
            scope: c.scope,
          })
        }
        map[key] = false
      }
    }

    return map as ModePermissionMap<TMode, TAction, TResource, TScope>
  }

  private _admin?: EngineAdmin<TAction, TResource, TRole, TScope>

  /** Lazily-created admin interface for CRUD operations on policies, roles, and subjects. */
  get admin(): EngineAdmin<TAction, TResource, TRole, TScope> {
    if (this._admin) return this._admin
    this._admin = createAdmin<TAction, TResource, TRole, TScope>(this.adapter, this)
    return this._admin
  }

  /** Clear all caches */
  invalidate(): void {
    this.policyCache.clear()
    this.roleCache.clear()
    this.rbacPolicyCache.clear()
    this.subjectCache.clear()
  }

  /** Clear only a specific subject's cached data */
  invalidateSubject(subjectId: string): void {
    this.subjectCache.delete(subjectId)
  }

  /** Clear cached policies (after policy CRUD) */
  invalidatePolicies(): void {
    this.policyCache.clear()
  }

  /** Clear cached roles, RBAC policy, and all subjects (subjects cache resolved roles) */
  invalidateRoles(): void {
    this.roleCache.clear()
    this.rbacPolicyCache.clear()
    this.subjectCache.clear()
  }
}
