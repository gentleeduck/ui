import type { Adapter, Attributes, Policy, Role, ScopedRole } from '../../core/types'

export interface HttpAdapterConfig {
  /** Base URL of your duck-iam API, e.g. "https://api.example.com/access" */
  baseUrl: string
  /** Custom fetch function (defaults to globalThis.fetch) */
  fetch?: typeof globalThis.fetch
  /** Headers to include (e.g. auth tokens) */
  headers?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>)
}

/**
 * HTTP-based adapter for duck-iam.
 *
 * Implements the {@link Adapter} interface by making HTTP requests to a
 * remote duck-iam API. Useful for client-side engines that delegate storage
 * to a backend service.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 */
export class HttpAdapter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> implements Adapter<TAction, TResource, TRole, TScope>
{
  private baseUrl: string
  private _fetch: typeof globalThis.fetch
  private _headers: HttpAdapterConfig['headers']

  /** Creates a new HttpAdapter from the given config. */
  constructor(config: HttpAdapterConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this._fetch = config.fetch ?? globalThis.fetch.bind(globalThis)
    this._headers = config.headers
  }

  /** Sends an HTTP request to the API, merging headers and parsing the JSON response. */
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(typeof this._headers === 'function' ? await this._headers() : (this._headers ?? {})),
      ...((init?.headers as Record<string, string>) ?? {}),
    }

    const res = await this._fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    })

    if (!res.ok) {
      throw new Error(`duck-iam HTTP ${res.status}: ${await res.text()}`)
    }

    return res.json()
  }

  // -- PolicyStore --

  /** Returns all policies from the remote API. */
  async listPolicies(): Promise<Policy<TAction, TResource, TRole>[]> {
    return this.request('/policies')
  }
  /** Returns a single policy by ID, or null if not found. */
  async getPolicy(id: string): Promise<Policy<TAction, TResource, TRole> | null> {
    return this.request(`/policies/${id}`)
  }
  /** Saves (creates or updates) a policy via PUT. */
  async savePolicy(p: Policy<TAction, TResource, TRole>): Promise<void> {
    await this.request('/policies', {
      method: 'PUT',
      body: JSON.stringify(p),
    })
  }
  /** Deletes a policy by ID. */
  async deletePolicy(id: string): Promise<void> {
    await this.request(`/policies/${id}`, { method: 'DELETE' })
  }

  // -- RoleStore --

  /** Returns all roles from the remote API. */
  async listRoles(): Promise<Role<TAction, TResource, TRole, TScope>[]> {
    return this.request('/roles')
  }
  /** Returns a single role by ID, or null if not found. */
  async getRole(id: string): Promise<Role<TAction, TResource, TRole, TScope> | null> {
    return this.request(`/roles/${id}`)
  }
  /** Saves (creates or updates) a role via PUT. */
  async saveRole(r: Role<TAction, TResource, TRole, TScope>): Promise<void> {
    await this.request('/roles', { method: 'PUT', body: JSON.stringify(r) })
  }
  /** Deletes a role by ID. */
  async deleteRole(id: string): Promise<void> {
    await this.request(`/roles/${id}`, { method: 'DELETE' })
  }

  // -- SubjectStore --

  /** Returns the list of role IDs assigned to a subject. */
  async getSubjectRoles(subjectId: string): Promise<TRole[]> {
    return this.request(`/subjects/${subjectId}/roles`)
  }
  /** Returns scoped role assignments for a subject. */
  async getSubjectScopedRoles(subjectId: string): Promise<ScopedRole<TRole, TScope>[]> {
    return this.request(`/subjects/${subjectId}/scoped-roles`)
  }
  /** Assigns a role to a subject, optionally scoped. */
  async assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    await this.request(`/subjects/${subjectId}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roleId, scope }),
    })
  }
  /** Revokes a role from a subject, optionally filtering by scope. */
  async revokeRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    const params = scope ? `?scope=${encodeURIComponent(scope)}` : ''
    await this.request(`/subjects/${subjectId}/roles/${roleId}${params}`, {
      method: 'DELETE',
    })
  }
  /** Returns the attributes for a subject. */
  async getSubjectAttributes(subjectId: string): Promise<Attributes> {
    return this.request(`/subjects/${subjectId}/attributes`)
  }
  /** Merges the given attributes into the subject's existing attributes via PATCH. */
  async setSubjectAttributes(subjectId: string, attrs: Attributes): Promise<void> {
    await this.request(`/subjects/${subjectId}/attributes`, {
      method: 'PATCH',
      body: JSON.stringify(attrs),
    })
  }
}
