import { LRUCache } from '../../shared/cache'
import { buildPermissionKey } from '../../shared/keys'
import { evaluate, evaluateFast } from '../evaluate'
import type { Explain } from '../explain'
import { explainEvaluation } from '../explain'
import { resolveEffectiveRoles, rolesToPolicy } from '../rbac'
import type { AccessControl, Adapter, Client, Request } from '../types'
import { createAdmin, deepFreezePolicy, enrichSubjectWithScopedRoles } from './engine.libs'
import type { EngineTypes } from './engine.types'
/**
 * Central runtime that evaluates access requests against RBAC roles and ABAC
 * policies.
 *
 * Loads roles + policies from its adapter, caches them with configurable TTL,
 * converts RBAC roles into ABAC rules via {@link rolesToPolicy}, and merges
 * decisions across all policies according to its `policyCombine` setting
 * (default `'and'`; see {@link AccessControl.PolicyCombine}).
 *
 * @template TAction   - Union of valid action strings.
 * @template TResource - Union of valid resource strings.
 * @template TRole     - Union of valid role IDs.
 * @template TScope    - Union of valid scope strings.
 * @template TMode     - Engine mode (`'development'` or `'production'`) that
 *   determines whether return types are `IDecision` or plain `boolean`.
 *
 * @example
 * ```ts
 * const engine = new Engine({ adapter, defaultEffect: 'deny' })
 *
 * const allowed = await engine.can('user-1', 'read', { type: 'post', attributes: {} })
 * const decision = await engine.check('user-1', 'update', post)
 * const trace = await engine.explain('user-1', 'delete', post)
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export class Engine<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
  TMode extends AccessControl.Mode = 'development',
> {
  private _adapter: Adapter.IAdapter<TAction, TResource, TRole, TScope>
  private _defaultEffect: AccessControl.Effect
  private _mode: AccessControl.Mode
  private _policyCombine: AccessControl.PolicyCombine
  private _hooks: EngineTypes.IHooks<TAction, TResource, TScope>
  private _maxPolicies: number
  private _maxRoles: number
  private _adapterTimeoutMs: number
  private _invalidator?: EngineTypes.IInvalidator<TRole>
  private _invalidatorUnsub: (() => void) | null = null
  private _policyCache: LRUCache<AccessControl.IPolicy[]>
  private _roleCache: LRUCache<AccessControl.IRole[]>
  private _rbacPolicyCache: LRUCache<AccessControl.IPolicy>
  private _mergedPolicyCache: LRUCache<AccessControl.IPolicy[]>
  private _subjectCache: LRUCache<Request.ISubject>
  // Single-flight: coalesce concurrent cache-misses so a cold start under load
  // doesn't fan out N identical adapter calls. Cleared once the promise settles.
  private _policiesInFlight: Promise<AccessControl.IPolicy[]> | null = null
  private _rolesInFlight: Promise<AccessControl.IRole[]> | null = null
  private _rbacInFlight: Promise<AccessControl.IPolicy> | null = null
  private _subjectsInFlight = new Map<string, Promise<Request.ISubject>>()

  /**
   * Constructs a new engine wired to the given adapter and configuration.
   *
   * @param config - Engine configuration (adapter, mode, caches, hooks).
   * @author wildduck2 <https://github.com/wildduck2>
   */
  constructor(config: EngineTypes.IConfig<TAction, TResource, TRole, TScope, TMode>) {
    this._adapter = config.adapter
    this._defaultEffect = config.defaultEffect ?? 'deny'
    this._mode = config.mode ?? ('development' as AccessControl.Mode)
    this._policyCombine = config.policyCombine ?? 'and'
    this._hooks = config.hooks ?? {}

    // `evaluateFast` cannot distinguish "rule fired" from "default applied"
    // (returns a plain boolean), so it can't implement `first-applicable`
    // faithfully. Fail loudly at construction instead of returning silently
    // different decisions in production vs development.
    if (this._mode === 'production' && this._policyCombine === 'first-applicable') {
      throw new Error(
        "duck-iam: policyCombine 'first-applicable' requires mode 'development'; the production fast path cannot represent it correctly.",
      )
    }

    // Fail-open guard: `defaultEffect: 'allow'` in production is almost always
    // a misconfiguration. Refuse it unless the operator explicitly opts in.
    if (this._mode === 'production' && this._defaultEffect === 'allow' && !config.allowFailOpen) {
      throw new Error(
        "duck-iam: defaultEffect 'allow' in production mode is a fail-open footgun. Pass `allowFailOpen: true` to confirm intent.",
      )
    }

    this._maxPolicies = config.maxPolicies ?? 10_000
    this._maxRoles = config.maxRoles ?? 10_000
    this._adapterTimeoutMs = config.adapterTimeoutMs ?? 5_000

    const ttl = (config.cacheTTL ?? 60) * 1000
    const maxSize = config.maxCacheSize ?? 1000

    this._policyCache = new LRUCache(1, ttl) // single entry
    this._roleCache = new LRUCache(1, ttl)
    this._rbacPolicyCache = new LRUCache(1, ttl)
    this._mergedPolicyCache = new LRUCache(1, ttl)
    this._subjectCache = new LRUCache(maxSize, ttl)

    if (config.invalidator) {
      this._invalidator = config.invalidator
      this._invalidatorUnsub = config.invalidator.subscribe((event) => this._applyInvalidateEvent(event))
    }
  }

  /**
   * Wrap an adapter read with the engine's configured timeout. Creates a
   * fresh `AbortController` per call so a slow upstream gets hard-cancelled
   * once `adapterTimeoutMs` elapses; the timeout error routes through
   * `authorize`'s catch and produces a fail-closed deny.
   *
   * Returns the adapter call result. Throws on timeout. Adapters that don't
   * honor `signal` still get their result discarded - the engine just
   * doesn't wait for them.
   */
  private _withTimeout<T>(fn: (opts: { signal: AbortSignal }) => Promise<T>, label: string): Promise<T> {
    if (this._adapterTimeoutMs <= 0) {
      return fn({ signal: new AbortController().signal })
    }
    const ctrl = new AbortController()
    let timer: ReturnType<typeof setTimeout> | null = null
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        ctrl.abort()
        reject(new Error(`duck-iam: ${label} timed out after ${this._adapterTimeoutMs}ms`))
      }, this._adapterTimeoutMs)
    })
    return Promise.race([fn({ signal: ctrl.signal }), timeout]).finally(() => {
      if (timer) clearTimeout(timer)
    }) as Promise<T>
  }

  /** Apply a cross-instance invalidate event to local caches. */
  private _applyInvalidateEvent(event: EngineTypes.IInvalidateEvent<TRole>): void {
    switch (event.kind) {
      case 'all':
        this.invalidate({ broadcast: false })
        return
      case 'policies':
        this.invalidatePolicies({ broadcast: false })
        return
      case 'roles':
        this.invalidateRoles(event.roleId, { broadcast: false })
        return
      case 'subject':
        this.invalidateSubject(event.subjectId, { broadcast: false })
    }
  }

  /**
   * Release the invalidator subscription. Call when discarding the engine.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  dispose(): void {
    this._invalidatorUnsub?.()
    this._invalidatorUnsub = null
  }

  /** Load all policies from the adapter, using the cache if available. */
  private async _loadPolicies(): Promise<AccessControl.IPolicy[]> {
    const cached = this._policyCache.get('all')
    if (cached) return cached
    if (this._policiesInFlight) return this._policiesInFlight

    // Sentinel-compare on resolve: if invalidate() happened while we were
    // awaiting, our slot was nulled - don't overwrite the freshly-cleared cache.
    let pending!: Promise<AccessControl.IPolicy[]>
    pending = (async () => {
      try {
        const policies = (await this._withTimeout(
          (opts) => this._adapter.listPolicies(opts),
          'listPolicies',
        )) as AccessControl.IPolicy[]
        if (policies.length > this._maxPolicies) {
          throw new Error(
            `duck-iam: adapter returned ${policies.length} policies; maxPolicies is ${this._maxPolicies}. Raise the limit or fix the adapter.`,
          )
        }
        if (this._policiesInFlight === pending) {
          this._policyCache.set('all', policies)
        }
        return policies
      } finally {
        if (this._policiesInFlight === pending) this._policiesInFlight = null
      }
    })()
    this._policiesInFlight = pending
    return pending
  }

  /** Load all roles from the adapter, using the cache if available. */
  private async _loadRoles(): Promise<AccessControl.IRole[]> {
    const cached = this._roleCache.get('all')
    if (cached) return cached
    if (this._rolesInFlight) return this._rolesInFlight

    let pending!: Promise<AccessControl.IRole[]>
    pending = (async () => {
      try {
        const roles = (await this._withTimeout(
          (opts) => this._adapter.listRoles(opts),
          'listRoles',
        )) as AccessControl.IRole[]
        if (roles.length > this._maxRoles) {
          throw new Error(
            `duck-iam: adapter returned ${roles.length} roles; maxRoles is ${this._maxRoles}. Raise the limit or fix the adapter.`,
          )
        }
        if (this._rolesInFlight === pending) {
          this._roleCache.set('all', roles)
        }
        return roles
      } finally {
        if (this._rolesInFlight === pending) this._rolesInFlight = null
      }
    })()
    this._rolesInFlight = pending
    return pending
  }

  /** Resolve a subject's roles, scoped roles, and attributes, using the cache if available. */
  private async _resolveSubject(subjectId: string): Promise<Request.ISubject> {
    const cached = this._subjectCache.get(subjectId)
    if (cached) return cached
    const inFlight = this._subjectsInFlight.get(subjectId)
    if (inFlight) return inFlight

    let pending!: Promise<Request.ISubject>
    pending = (async () => {
      try {
        const [assignedRoles, attributes, allRoles] = await Promise.all([
          this._withTimeout((opts) => this._adapter.getSubjectRoles(subjectId, opts), 'getSubjectRoles'),
          this._withTimeout((opts) => this._adapter.getSubjectAttributes(subjectId, opts), 'getSubjectAttributes'),
          this._loadRoles(),
        ])

        const roles = resolveEffectiveRoles(assignedRoles, allRoles)

        const scopedRolesFn = this._adapter.getSubjectScopedRoles
        const scopedRoles = scopedRolesFn
          ? await this._withTimeout(
              (opts) => scopedRolesFn.call(this._adapter, subjectId, opts),
              'getSubjectScopedRoles',
            )
          : undefined

        const subject: Request.ISubject = { id: subjectId, roles, scopedRoles, attributes }
        if (this._subjectsInFlight.get(subjectId) === pending) {
          this._subjectCache.set(subjectId, subject)
        }
        return subject
      } finally {
        if (this._subjectsInFlight.get(subjectId) === pending) {
          this._subjectsInFlight.delete(subjectId)
        }
      }
    })()
    this._subjectsInFlight.set(subjectId, pending)
    return pending
  }

  /**
   * Load RBAC + ABAC policies for evaluation.
   * Each user-defined policy keeps its own combining algorithm.
   * The RBAC-generated policy uses allow-overrides (set by rolesToPolicy).
   * The rolesToPolicy() conversion is cached to avoid recomputation.
   */
  private async _loadAllPolicies(): Promise<AccessControl.IPolicy[]> {
    const cached = this._mergedPolicyCache.get('merged')
    if (cached) return cached
    const [policies, rbacPolicy] = await Promise.all([this._loadPolicies(), this._loadRbacPolicy()])
    // Skip the RBAC policy entirely when it has no rules - including it would
    // contribute a default-effect deny under AND combine and short-circuit
    // every request, even when explicit ABAC policies allow.
    const merged = rbacPolicy.rules.length === 0 ? policies : [rbacPolicy, ...policies]
    this._mergedPolicyCache.set('merged', merged)
    return merged
  }

  /**
   * Build the auto-generated RBAC policy from the role graph.
   *
   * Single-flighted so concurrent callers after a TTL eviction share one
   * rebuild promise. The build itself is sync but `loadRoles()` is async on
   * cold-miss, so the await window is where double-compute would otherwise
   * happen.
   *
   * Cached output is **deep-frozen** - every consumer (`evaluate`, `explain`,
   * `evaluateFast`) reads the same reference, and a callee that mutates a
   * shared rule's `actions` array would corrupt every future request.
   */
  private async _loadRbacPolicy(): Promise<AccessControl.IPolicy> {
    const cached = this._rbacPolicyCache.get('rbac')
    if (cached) return cached
    if (this._rbacInFlight) return this._rbacInFlight

    let pending!: Promise<AccessControl.IPolicy>
    pending = (async () => {
      try {
        const roles = await this._loadRoles()
        const built = deepFreezePolicy(rolesToPolicy(roles))
        if (this._rbacInFlight === pending) this._rbacPolicyCache.set('rbac', built)
        return built
      } finally {
        if (this._rbacInFlight === pending) this._rbacInFlight = null
      }
    })()
    this._rbacInFlight = pending
    return pending
  }

  /**
   * Bridges the runtime `this._mode` branch to the static `AccessControl.ModeResult<TMode>`
   * conditional type. Centralized so the assertion is named and grep-able
   * instead of scattered across each return statement.
   */
  private _asResult(value: boolean | AccessControl.IDecision): AccessControl.ModeResult<TMode> {
    return value as AccessControl.ModeResult<TMode>
  }

  /**
   * Full authorization check with a complete {@link Request.IAccessRequest}.
   *
   * In `'production'` mode, returns a plain `boolean`.
   * In `'development'` mode, returns a full {@link AccessControl.IDecision}.
   *
   * @param request - The access request to evaluate.
   * @returns The decision shape determined by the engine's mode.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async authorize(
    request: Request.IAccessRequest<TAction, TResource, TScope>,
  ): Promise<AccessControl.ModeResult<TMode>> {
    let req = request
    const t0 = this._hooks.onMetrics ? performance.now() : 0

    try {
      if (req.scope && req.subject.scopedRoles?.length) {
        const enriched = enrichSubjectWithScopedRoles(req.subject, req.scope)
        if (enriched !== req.subject) req = { ...req, subject: enriched }
      }

      if (this._hooks.beforeEvaluate) {
        req = await this._hooks.beforeEvaluate(req)
      }

      const allPolicies = await this._loadAllPolicies()

      const onPolicyErrorHook = this._hooks.onPolicyError
      const onPolicyError = onPolicyErrorHook
        ? (err: Error, policy: AccessControl.IPolicy) => onPolicyErrorHook(err, policy.id)
        : undefined

      if (this._mode === 'production') {
        const allowed = evaluateFast(
          allPolicies,
          req as Request.IAccessRequest,
          this._defaultEffect,
          this._policyCombine,
          onPolicyError,
        )
        this._emitMetrics(req, allowed, t0)
        return this._asResult(allowed)
      }

      const decision = evaluate(
        allPolicies,
        req as Request.IAccessRequest,
        this._defaultEffect,
        this._policyCombine,
        onPolicyError,
      )

      if (this._hooks.afterEvaluate) await this._hooks.afterEvaluate(req, decision)
      if (!decision.allowed && this._hooks.onDeny) await this._hooks.onDeny(req, decision)
      this._emitMetrics(req, decision.allowed, t0)

      return this._asResult(decision)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      if (this._hooks.onError) await this._hooks.onError(err, req)
      this._emitMetrics(req, false, t0)
      if (this._mode === 'production') return this._asResult(false)
      return this._asResult({
        allowed: false,
        effect: 'deny',
        reason: 'Evaluation error',
        duration: 0,
        timestamp: Date.now(),
      })
    }
  }

  /**
   * Fires the `onMetrics` hook if configured. Synchronous; takes the start
   * timestamp captured at the top of `authorize` so the caller doesn't pay
   * `performance.now()` cost when no hook is wired.
   */
  private _emitMetrics(req: Request.IAccessRequest<TAction, TResource, TScope>, allowed: boolean, t0: number): void {
    const hook = this._hooks.onMetrics
    if (!hook) return
    hook({
      subjectId: req.subject.id,
      action: req.action,
      resource: req.resource.type,
      allowed,
      durationMs: performance.now() - t0,
      mode: this._mode,
    })
  }

  /**
   * Simple boolean check: can this user do this action on this resource?
   * Always returns a plain `boolean` regardless of engine mode.
   *
   * @param subjectId   - Subject ID to resolve via the adapter.
   * @param action      - Action the subject wants to perform.
   * @param resource    - Target resource.
   * @param environment - Optional request-time environment.
   * @param scope       - Optional scope for multi-tenant checks.
   * @returns `true` when the subject is authorized to perform the action.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async can(
    subjectId: string,
    action: TAction,
    resource: Request.IResource<TResource>,
    environment?: Request.IAccessRequest<TAction, TResource, TScope>['environment'],
    scope?: TScope,
  ): Promise<boolean> {
    try {
      const subject = await this._resolveSubject(subjectId)
      const result = await this.authorize({ subject, action, resource, environment, scope })
      return typeof result === 'boolean' ? result : (result as AccessControl.IDecision).allowed
    } catch (error) {
      // Subject-resolution errors (adapter down, listRoles limit hit) escape
      // authorize()'s try/catch. Translate to a fail-closed deny so callers
      // never see an unhandled rejection from the entry-point methods.
      const err = error instanceof Error ? error : new Error(String(error))
      await this._hooks.onError?.(err, {
        subject: { id: subjectId, roles: [], attributes: {} },
        action,
        resource,
        environment,
        scope,
      } as Request.IAccessRequest<TAction, TResource, TScope>)
      return false
    }
  }

  /**
   * Same as `can` but returns the full {@link AccessControl.IDecision} in development mode,
   * or a plain boolean in production mode.
   *
   * @param subjectId   - Subject ID to resolve via the adapter.
   * @param action      - Action the subject wants to perform.
   * @param resource    - Target resource.
   * @param environment - Optional request-time environment.
   * @param scope       - Optional scope for multi-tenant checks.
   * @returns Mode-dependent result: `boolean` in production, `IDecision` in development.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async check(
    subjectId: string,
    action: TAction,
    resource: Request.IResource<TResource>,
    environment?: Request.IAccessRequest<TAction, TResource, TScope>['environment'],
    scope?: TScope,
  ): Promise<AccessControl.ModeResult<TMode>> {
    try {
      const subject = await this._resolveSubject(subjectId)
      return await this.authorize({ subject, action, resource, environment, scope })
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      const req = {
        subject: { id: subjectId, roles: [], attributes: {} },
        action,
        resource,
        environment,
        scope,
      } as Request.IAccessRequest<TAction, TResource, TScope>
      await this._hooks.onError?.(err, req)
      if (this._mode === 'production') return this._asResult(false)
      return this._asResult({
        allowed: false,
        effect: 'deny',
        reason: 'Subject resolution error',
        duration: 0,
        timestamp: Date.now(),
      })
    }
  }

  /**
   * Returns a full evaluation trace showing why a permission was granted or
   * denied. Shows which policies matched, which rules fired, which conditions
   * passed/failed with actual vs expected values, and a human-readable summary.
   *
   * Only available in `'development'` mode. Throws in `'production'` mode.
   *
   * Does NOT trigger afterEvaluate/onDeny/onError hooks (read-only).
   * Does apply beforeEvaluate hook since it affects the evaluation.
   *
   * @param subjectId   - Subject ID to resolve via the adapter.
   * @param action      - Action the subject wants to perform.
   * @param resource    - Target resource.
   * @param environment - Optional request-time environment.
   * @param scope       - Optional scope for multi-tenant checks.
   * @returns A full {@link Explain.IResult} describing the evaluation.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async explain(
    this: Engine<TAction, TResource, TRole, TScope, 'development'>,
    subjectId: string,
    action: TAction,
    resource: Request.IResource<TResource>,
    environment?: Request.IAccessRequest<TAction, TResource, TScope>['environment'],
    scope?: TScope,
  ): Promise<Explain.IResult> {
    if (this._mode === 'production') {
      throw new Error('explain() is not available in production mode')
    }
    const subject = await this._resolveSubject(subjectId)
    const originalRoles = [...subject.roles] as string[]

    let enrichedSubject = subject
    if (scope && subject.scopedRoles?.length) {
      enrichedSubject = enrichSubjectWithScopedRoles(subject, scope)
    }

    const scopedRolesApplied = (enrichedSubject.roles as string[]).filter((r) => !originalRoles.includes(r))

    let req: Request.IAccessRequest<TAction, TResource, TScope> = {
      subject: enrichedSubject,
      action,
      resource,
      environment,
      scope,
    }

    // Apply beforeEvaluate hook (it may modify the request)
    if (this._hooks.beforeEvaluate) {
      req = await this._hooks.beforeEvaluate(req)
    }

    const allPolicies = await this._loadAllPolicies()

    return explainEvaluation(
      allPolicies,
      req as Request.IAccessRequest,
      this._defaultEffect,
      { subjectId, originalRoles, scopedRolesApplied },
      this._policyCombine,
    )
  }

  /**
   * Batch check: evaluate many permissions at once for a single subject.
   * Returns a map keyed by "action:resource" or "scope:action:resource".
   * Loads adapter data once, then evaluates each check.
   * Each check goes through scoped role enrichment and hooks, consistent with authorize().
   *
   * In `'production'` mode, returns `Record<string, boolean>`.
   * In `'development'` mode, returns the full typed {@link Client.PermissionMap}.
   *
   * @param subjectId   - Subject ID to resolve via the adapter.
   * @param checks      - Array of {@link Client.IPermissionCheck} descriptors.
   * @param environment - Optional request-time environment shared by all checks.
   * @returns Mode-dependent permission map.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async permissions(
    subjectId: string,
    checks: readonly Client.IPermissionCheck<TAction, TResource, TScope>[],
    environment?: Request.IAccessRequest<TAction, TResource, TScope>['environment'],
  ): Promise<AccessControl.ModePermissionMap<TMode, TAction, TResource, TScope>> {
    const [subject, allPolicies] = await Promise.all([this._resolveSubject(subjectId), this._loadAllPolicies()])

    const map = {} as Record<string, boolean>
    // Memo per scope: N checks sharing a scope must not rebuild the merged role list N times.
    const enrichedByScope = new Map<TScope, Request.ISubject>()

    for (const c of checks) {
      const key = buildPermissionKey(c.action, c.resource, c.resourceId, c.scope)

      try {
        let enrichedSubject = subject
        if (c.scope && subject.scopedRoles?.length) {
          const cached = enrichedByScope.get(c.scope)
          if (cached) {
            enrichedSubject = cached
          } else {
            enrichedSubject = enrichSubjectWithScopedRoles(subject, c.scope)
            enrichedByScope.set(c.scope, enrichedSubject)
          }
        }

        let req: Request.IAccessRequest<TAction, TResource, TScope> = {
          subject: enrichedSubject,
          action: c.action,
          resource: { type: c.resource, id: c.resourceId, attributes: {} },
          environment,
          scope: c.scope,
        }

        if (this._hooks.beforeEvaluate) {
          req = await this._hooks.beforeEvaluate(req)
        }

        // Production fast path
        if (this._mode === 'production') {
          map[key] = evaluateFast(allPolicies, req as Request.IAccessRequest, this._defaultEffect, this._policyCombine)
          continue
        }

        const decision = evaluate(allPolicies, req as Request.IAccessRequest, this._defaultEffect, this._policyCombine)

        if (this._hooks.afterEvaluate) {
          await this._hooks.afterEvaluate(req, decision)
        }
        if (!decision.allowed && this._hooks.onDeny) {
          await this._hooks.onDeny(req, decision)
        }

        map[key] = decision.allowed
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        if (this._hooks.onError) {
          await this._hooks.onError(err, {
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

    return map as AccessControl.ModePermissionMap<TMode, TAction, TResource, TScope>
  }

  private _admin?: EngineTypes.IAdmin<TAction, TResource, TRole, TScope>

  /**
   * Lazily-built admin interface for CRUD operations on policies, roles, subjects.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  get admin(): EngineTypes.IAdmin<TAction, TResource, TRole, TScope> {
    this._admin ??= createAdmin<TAction, TResource, TRole, TScope>(this._adapter, this)
    return this._admin
  }

  /**
   * Cache hit / miss counters, segmented by cache. Counters accumulate from
   * construction; call {@link resetStats} to zero them (e.g. for periodic
   * sampling). Use this to alert on hit-rate regressions in production.
   *
   * @returns Per-cache hit/miss/size counters.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  stats(): {
    policies: { hits: number; misses: number; size: number }
    roles: { hits: number; misses: number; size: number }
    rbacPolicy: { hits: number; misses: number; size: number }
    mergedPolicies: { hits: number; misses: number; size: number }
    subjects: { hits: number; misses: number; size: number }
  } {
    return {
      policies: this._policyCache.stats,
      roles: this._roleCache.stats,
      rbacPolicy: this._rbacPolicyCache.stats,
      mergedPolicies: this._mergedPolicyCache.stats,
      subjects: this._subjectCache.stats,
    }
  }

  /**
   * Zero the counters returned by {@link stats}.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  resetStats(): void {
    this._policyCache.resetStats()
    this._roleCache.resetStats()
    this._rbacPolicyCache.resetStats()
    this._mergedPolicyCache.resetStats()
    this._subjectCache.resetStats()
  }

  /**
   * Clear all caches.
   *
   * Also drops in-flight resolver promises: without this, a load started
   * before the call could settle after the cache clear and silently
   * re-populate stale data, defeating the invalidation.
   *
   * @param opts - Optional flags; set `broadcast: false` to suppress invalidator publish.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  invalidate(opts: { broadcast?: boolean } = {}): void {
    this._policyCache.clear()
    this._roleCache.clear()
    this._rbacPolicyCache.clear()
    this._subjectCache.clear()
    this._policiesInFlight = null
    this._rolesInFlight = null
    this._rbacInFlight = null
    this._mergedPolicyCache.clear()
    this._subjectsInFlight.clear()
    if (opts.broadcast !== false && this._invalidator) {
      void this._invalidator.publish({ kind: 'all' })
    }
  }

  /**
   * Clear only a specific subject's cached data.
   *
   * @param subjectId - The subject ID whose cache entry should be dropped.
   * @param opts      - Optional flags; set `broadcast: false` to suppress invalidator publish.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  invalidateSubject(subjectId: string, opts: { broadcast?: boolean } = {}): void {
    this._subjectCache.delete(subjectId)
    this._subjectsInFlight.delete(subjectId)
    if (opts.broadcast !== false && this._invalidator) {
      void this._invalidator.publish({ kind: 'subject', subjectId })
    }
  }

  /**
   * Clear cached policies (after policy CRUD).
   *
   * @param opts - Optional flags; set `broadcast: false` to suppress invalidator publish.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  invalidatePolicies(opts: { broadcast?: boolean } = {}): void {
    this._policyCache.clear()
    this._policiesInFlight = null
    this._mergedPolicyCache.clear()
    if (opts.broadcast !== false && this._invalidator) {
      void this._invalidator.publish({ kind: 'policies' })
    }
  }

  /**
   * Clear cached roles and the derived RBAC policy. Subjects cache resolved
   * roles, so any subject that touched the changed role is invalidated too.
   *
   * @param roleId - When provided, only subjects whose resolved roles or
   *   scoped roles reference this id are dropped. When omitted, the entire
   *   subject cache is cleared (use for bulk role imports).
   * @param opts - Optional flags; set `broadcast: false` to suppress invalidator publish.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  invalidateRoles(roleId?: TRole, opts: { broadcast?: boolean } = {}): void {
    this._roleCache.clear()
    this._rbacPolicyCache.clear()
    this._rolesInFlight = null
    this._rbacInFlight = null
    this._mergedPolicyCache.clear()
    if (roleId === undefined) {
      this._subjectCache.clear()
      this._subjectsInFlight.clear()
    } else {
      for (const [subjectId, subject] of this._subjectCache.entries()) {
        const inRoles = (subject.roles as readonly string[]).includes(roleId)
        const inScoped = subject.scopedRoles?.some((sr) => (sr.role as string) === roleId) ?? false
        if (inRoles || inScoped) {
          this._subjectCache.delete(subjectId)
          this._subjectsInFlight.delete(subjectId)
        }
      }
    }
    if (opts.broadcast !== false && this._invalidator) {
      void this._invalidator.publish({ kind: 'roles', roleId })
    }
  }

  /**
   * Warm `mergedPolicyCache` so the first request after boot doesn't pay the
   * full load + index cost. Bench shows ~15x speedup on the first call vs
   * cold. Recommended to call once at app startup.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async preload(): Promise<void> {
    await this._loadAllPolicies()
  }

  /**
   * Liveness + readiness probe. Performs one timed-out adapter round-trip
   * (`listPolicies`) and snapshots cache hit rates. Cheap enough to wire to
   * a `/healthz` route at the configured interval; returns `ok: false` if the
   * adapter is unreachable so an orchestrator can pull the instance out of
   * rotation.
   *
   * @returns A {@link EngineTypes.IHealth} snapshot.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async healthCheck(): Promise<EngineTypes.IHealth> {
    const t0 = performance.now()
    let adapter: 'ok' | 'fail' = 'ok'
    let lastError: string | undefined
    try {
      await this._withTimeout((opts) => this._adapter.listPolicies(opts), 'healthCheck.listPolicies')
    } catch (err) {
      adapter = 'fail'
      lastError = err instanceof Error ? err.message : String(err)
    }
    const s = this.stats()
    const total =
      s.policies.hits +
      s.policies.misses +
      s.roles.hits +
      s.roles.misses +
      s.rbacPolicy.hits +
      s.rbacPolicy.misses +
      s.mergedPolicies.hits +
      s.mergedPolicies.misses +
      s.subjects.hits +
      s.subjects.misses
    const hits = s.policies.hits + s.roles.hits + s.rbacPolicy.hits + s.mergedPolicies.hits + s.subjects.hits
    return {
      ok: adapter === 'ok',
      adapter,
      cacheHitRate: total === 0 ? 0 : hits / total,
      adapterLatencyMs: Math.round(performance.now() - t0),
      lastError,
    }
  }
}
