import type { AccessControl, Adapter, Primitives, Request } from '../../core/types'

/** Brand symbol marking an error as retry-eligible. Internal to this adapter. */
const TRANSIENT = Symbol('duck-iam.http.transient')

/** Tags an Error as transient so `isTransientError` will pick it up. Returns the same instance. */
function makeTransient<T extends Error>(err: T): T {
  ;(err as Error & { [TRANSIENT]?: true })[TRANSIENT] = true
  return err
}

/**
 * Returns `true` if the error should trigger a retry: anything tagged with
 * {@link TRANSIENT}, fetch `AbortError`/`TypeError`, or common Node socket
 * codes (`ECONNRESET`, `ECONNREFUSED`, `ETIMEDOUT`, `ENOTFOUND`).
 */
function isTransientError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  if ((err as { [TRANSIENT]?: boolean })[TRANSIENT]) return true
  const name = (err as { name?: string }).name
  if (name === 'AbortError' || name === 'TypeError') return true
  const code = (err as { code?: string }).code
  return code === 'ECONNRESET' || code === 'ECONNREFUSED' || code === 'ETIMEDOUT' || code === 'ENOTFOUND'
}

/**
 * Composes multiple AbortSignals into one that aborts when any source aborts.
 *
 * Used to layer the per-request fetch timeout with the engine's
 * `adapterTimeoutMs` and any user-supplied `IReadOptions.signal`.
 */
function anySignal(signals: AbortSignal[]): AbortSignal | undefined {
  if (signals.length === 0) return undefined
  if (signals.length === 1) return signals[0]
  const ctrl = new AbortController()
  const onAbort = (reason: unknown) => ctrl.abort(reason)
  for (const sig of signals) {
    if (sig.aborted) {
      ctrl.abort(sig.reason)
      break
    }
    sig.addEventListener('abort', () => onAbort(sig.reason), { once: true })
  }
  return ctrl.signal
}
/**
 * HTTP adapter integration types. Type-only namespace - zero bundle cost.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Http {
  /**
   * Describes the configuration for {@link HttpAdapter}.
   *
   * Covers endpoint, fetch overrides, retry, and circuit-breaker tuning.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IConfig {
    /** Specifies the base URL of the duck-iam API (e.g. `https://api.example.com/access`). */
    baseUrl: string
    /** Overrides the default `globalThis.fetch` implementation. */
    fetch?: typeof globalThis.fetch
    /** Provides headers (e.g. auth tokens) merged into every request. */
    headers?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>)
    /**
     * Sets the per-request timeout in milliseconds.
     *
     * Layered with the engine's `adapterTimeoutMs`; whichever fires first wins.
     * Defaults to `5_000`. Set to `0` to rely solely on the engine timeout.
     */
    timeoutMs?: number
    /**
     * Caps retry attempts on transient failures (5xx, network errors, or
     * `AbortError` from a per-request timeout).
     *
     * 4xx responses are never retried. Defaults to `2` (3 total attempts).
     */
    retries?: number
    /**
     * Sets the base delay in ms for exponential backoff between retries.
     *
     * Attempt N waits `backoffMs * 2^(N-1)` plus jitter. Defaults to `100`.
     */
    backoffMs?: number
    /**
     * Opens the circuit after this many consecutive transient failures.
     *
     * Once open, requests reject immediately until the cooldown elapses. Default
     * `5`. Set to `0` to disable.
     */
    circuitBreakerThreshold?: number
    /**
     * Sets the half-open cooldown in ms.
     *
     * After this window, the next request is allowed through as a probe; success
     * closes the circuit, failure re-opens it. Default `30_000` (30 s).
     */
    circuitBreakerCooldownMs?: number
  }
}

/**
 * @deprecated Use {@link Http.IConfig}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IHttpAdapterConfig = Http.IConfig

/**
 * Backs the access store with a remote duck-iam HTTP API.
 *
 * Useful for client-side engines that delegate storage to a backend service.
 * Adds per-request timeout, exponential-backoff retry, and a circuit breaker.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @example
 * ```ts
 * const adapter = new HttpAdapter({
 *   baseUrl: 'https://api.example.com/access',
 *   headers: { Authorization: 'Bearer ...' },
 * })
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export class HttpAdapter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> implements Adapter.IAdapter<TAction, TResource, TRole, TScope>
{
  private _baseUrl: string
  private _fetch: typeof globalThis.fetch
  private _headers: Http.IConfig['headers']
  private _timeoutMs: number
  private _retries: number
  private _backoffMs: number
  private _cbThreshold: number
  private _cbCooldownMs: number
  // Circuit-breaker state. closed -> too many transients -> open -> cooldown
  // expires -> half-open -> success closes / failure re-opens.
  private _cbConsecutiveFailures = 0
  private _cbOpenedAt: number | null = null
  private _cbHalfOpenInFlight = false

  /**
   * Creates a new HTTP adapter.
   *
   * @param config - Provides endpoint, fetch overrides, retry, and breaker tuning.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  constructor(config: Http.IConfig) {
    this._baseUrl = config.baseUrl.replace(/\/$/, '')
    this._fetch = config.fetch ?? globalThis.fetch.bind(globalThis)
    this._headers = config.headers
    this._timeoutMs = config.timeoutMs ?? 5_000
    this._retries = config.retries ?? 2
    this._backoffMs = config.backoffMs ?? 100
    this._cbThreshold = config.circuitBreakerThreshold ?? 5
    this._cbCooldownMs = config.circuitBreakerCooldownMs ?? 30_000
  }

  /**
   * Gates fetch attempts based on circuit state.
   *
   * - closed: pass through.
   * - open: reject immediately until the cooldown elapses.
   * - half-open: allow exactly one probe; concurrent callers reject while the
   *   probe is in flight. The probe's outcome closes or re-opens the circuit.
   */
  private _circuitState(): 'closed' | 'open' | 'half-open' {
    if (this._cbThreshold <= 0 || this._cbOpenedAt === null) return 'closed'
    return Date.now() - this._cbOpenedAt < this._cbCooldownMs ? 'open' : 'half-open'
  }

  private _onCircuitSuccess(): void {
    this._cbConsecutiveFailures = 0
    this._cbOpenedAt = null
    this._cbHalfOpenInFlight = false
  }

  private _onCircuitFailure(): void {
    this._cbConsecutiveFailures++
    this._cbHalfOpenInFlight = false
    if (this._cbThreshold > 0 && this._cbConsecutiveFailures >= this._cbThreshold) {
      this._cbOpenedAt = Date.now()
    }
  }

  /** Sends an HTTP request to the API, merging headers and parsing the JSON response. */
  private async _request<T>(path: string, init?: RequestInit, readOpts?: Adapter.IReadOptions): Promise<T> {
    const res = await this._fetchWithRetry(path, init, readOpts)
    if (!res.ok) {
      throw new Error(`duck-iam HTTP ${res.status}: ${await res.text()}`)
    }
    return res.json()
  }

  /**
   * Same as {@link _request} but treats `404 Not Found` as a missing-resource
   * signal and returns `null` instead of throwing. The `Adapter.IAdapter`
   * contract for `getPolicy`/`getRole` is "the role, or null if not found";
   * the previous throw-on-every-non-2xx behaviour broke that contract and
   * caused engine.resolve() to bubble up a hard error on every cold miss.
   */
  private async _requestOrNull<T>(
    path: string,
    init?: RequestInit,
    readOpts?: Adapter.IReadOptions,
  ): Promise<T | null> {
    const res = await this._fetchWithRetry(path, init, readOpts)
    if (res.status === 404) return null
    if (!res.ok) {
      throw new Error(`duck-iam HTTP ${res.status}: ${await res.text()}`)
    }
    return res.json()
  }

  /**
   * Fetches with per-request timeout and exponential-backoff retry on transient
   * failures.
   *
   * Transient covers 5xx, network errors, or our own timeout abort. 4xx is
   * treated as a definitive answer and returned without retry.
   */
  private async _fetchWithRetry(
    path: string,
    init: RequestInit | undefined,
    readOpts?: Adapter.IReadOptions,
  ): Promise<Response> {
    const state = this._circuitState()
    if (state === 'open') {
      throw new Error('duck-iam HttpAdapter: circuit open - refusing request')
    }
    if (state === 'half-open') {
      if (this._cbHalfOpenInFlight) {
        throw new Error('duck-iam HttpAdapter: circuit half-open probe in flight')
      }
      this._cbHalfOpenInFlight = true
    }

    let attempt = 0
    let lastError: unknown
    while (attempt <= this._retries) {
      try {
        const res = await this._fetchOnce(path, init, readOpts)
        this._onCircuitSuccess()
        return res
      } catch (err) {
        lastError = err
        if (!isTransientError(err) || attempt === this._retries) {
          this._onCircuitFailure()
          throw err
        }
        const delay = this._backoffMs * 2 ** attempt + Math.floor(Math.random() * this._backoffMs)
        await new Promise((r) => setTimeout(r, delay))
        attempt++
      }
    }
    this._onCircuitFailure()
    throw lastError as Error
  }

  private async _fetchOnce(
    path: string,
    init: RequestInit | undefined,
    readOpts?: Adapter.IReadOptions,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(typeof this._headers === 'function' ? await this._headers() : (this._headers ?? {})),
      ...((init?.headers as Record<string, string>) ?? {}),
    }
    const controllers = [readOpts?.signal, this._timeoutSignal()].filter((s): s is AbortSignal => !!s)
    const signal = anySignal(controllers)
    const res = await this._fetch(`${this._baseUrl}${path}`, { ...init, headers, signal })
    if (res.status >= 500) {
      const body = await res.text().catch(() => '')
      throw makeTransient(new Error(`duck-iam HTTP ${res.status}: ${body}`))
    }
    return res
  }

  private _timeoutSignal(): AbortSignal | undefined {
    if (this._timeoutMs <= 0) return undefined
    const ctrl = new AbortController()
    setTimeout(
      () => ctrl.abort(makeTransient(new Error(`HttpAdapter request timed out after ${this._timeoutMs}ms`))),
      this._timeoutMs,
    )
    return ctrl.signal
  }

  /**
   * Lists every policy from the remote API.
   *
   * @param opts - Optional read options forwarded to fetch.
   * @returns Array of policies returned by `GET /policies`.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async listPolicies(opts?: Adapter.IReadOptions): Promise<AccessControl.IPolicy<TAction, TResource, TRole>[]> {
    return this._request('/policies', undefined, opts)
  }
  /**
   * Fetches a single policy by ID.
   *
   * @param id - Identifies the policy to look up.
   * @param opts - Optional read options forwarded to fetch.
   * @returns The matching policy or `null` when the API returns 404.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getPolicy(
    id: string,
    opts?: Adapter.IReadOptions,
  ): Promise<AccessControl.IPolicy<TAction, TResource, TRole> | null> {
    return this._requestOrNull(`/policies/${id}`, undefined, opts)
  }
  /**
   * Stores or overwrites a policy via PUT.
   *
   * @param p - Provides the policy to persist.
   * @returns Resolves once the API acknowledges the write.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async savePolicy(p: AccessControl.IPolicy<TAction, TResource, TRole>): Promise<void> {
    await this._request('/policies', {
      method: 'PUT',
      body: JSON.stringify(p),
    })
  }
  /**
   * Removes a policy by ID via DELETE.
   *
   * @param id - Identifies the policy to delete.
   * @returns Resolves once the API acknowledges the delete.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async deletePolicy(id: string): Promise<void> {
    await this._request(`/policies/${id}`, { method: 'DELETE' })
  }

  /**
   * Lists every role from the remote API.
   *
   * @param opts - Optional read options forwarded to fetch.
   * @returns Array of roles returned by `GET /roles`.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async listRoles(opts?: Adapter.IReadOptions): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope>[]> {
    return this._request('/roles', undefined, opts)
  }
  /**
   * Fetches a single role by ID.
   *
   * @param id - Identifies the role to look up.
   * @param opts - Optional read options forwarded to fetch.
   * @returns The matching role or `null` when the API returns 404.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getRole(
    id: string,
    opts?: Adapter.IReadOptions,
  ): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope> | null> {
    return this._requestOrNull(`/roles/${id}`, undefined, opts)
  }
  /**
   * Stores or overwrites a role via PUT.
   *
   * @param r - Provides the role to persist.
   * @returns Resolves once the API acknowledges the write.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async saveRole(r: AccessControl.IRole<TAction, TResource, TRole, TScope>): Promise<void> {
    await this._request('/roles', { method: 'PUT', body: JSON.stringify(r) })
  }
  /**
   * Removes a role by ID via DELETE.
   *
   * @param id - Identifies the role to delete.
   * @returns Resolves once the API acknowledges the delete.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async deleteRole(id: string): Promise<void> {
    await this._request(`/roles/${id}`, { method: 'DELETE' })
  }

  /**
   * Lists role IDs assigned to a subject.
   *
   * @param subjectId - Identifies the subject whose roles are read.
   * @param opts - Optional read options forwarded to fetch.
   * @returns Array of role IDs returned by `GET /subjects/{id}/roles`.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectRoles(subjectId: string, opts?: Adapter.IReadOptions): Promise<TRole[]> {
    return this._request(`/subjects/${subjectId}/roles`, undefined, opts)
  }
  /**
   * Lists scoped role assignments for a subject.
   *
   * @param subjectId - Identifies the subject whose scoped roles are read.
   * @param opts - Optional read options forwarded to fetch.
   * @returns Array of `(role, scope)` pairs.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectScopedRoles(
    subjectId: string,
    opts?: Adapter.IReadOptions,
  ): Promise<Request.IScopedRole<TRole, TScope>[]> {
    return this._request(`/subjects/${subjectId}/scoped-roles`, undefined, opts)
  }
  /**
   * Grants a role to a subject, optionally restricted to a scope.
   *
   * @param subjectId - Identifies the subject receiving the role.
   * @param roleId - Specifies the role being granted.
   * @param scope - Optional scope binding the assignment.
   * @returns Resolves once the API acknowledges the write.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    await this._request(`/subjects/${subjectId}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roleId, scope }),
    })
  }
  /**
   * Removes a role assignment from a subject.
   *
   * @param subjectId - Identifies the subject losing the role.
   * @param roleId - Specifies the role being revoked.
   * @param scope - Optional scope filter passed as a query param.
   * @returns Resolves once the API acknowledges the delete.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async revokeRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    const params = scope ? `?scope=${encodeURIComponent(scope)}` : ''
    await this._request(`/subjects/${subjectId}/roles/${roleId}${params}`, {
      method: 'DELETE',
    })
  }
  /**
   * Fetches the attribute bag stored for a subject.
   *
   * @param subjectId - Identifies the subject whose attributes are read.
   * @param opts - Optional read options forwarded to fetch.
   * @returns The subject's attribute map.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectAttributes(subjectId: string, opts?: Adapter.IReadOptions): Promise<Primitives.Attributes> {
    return this._request(`/subjects/${subjectId}/attributes`, undefined, opts)
  }
  /**
   * Shallow-merges new attributes into the subject's existing bag via PATCH.
   *
   * @param subjectId - Identifies the subject whose attributes are written.
   * @param attrs - Provides the partial attribute patch to merge in.
   * @returns Resolves once the API acknowledges the write.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async setSubjectAttributes(subjectId: string, attrs: Primitives.Attributes): Promise<void> {
    await this._request(`/subjects/${subjectId}/attributes`, {
      method: 'PATCH',
      body: JSON.stringify(attrs),
    })
  }
}
