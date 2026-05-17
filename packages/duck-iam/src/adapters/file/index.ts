import type { AccessControl, Adapter, Primitives, Request } from '../../core/types'

export namespace File {
  /**
   * Describes the minimal `node:fs/promises`-compatible surface used by {@link FileAdapter}.
   *
   * Tests inject an in-memory fake; production passes the real Node module.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IFS {
    /**
     * Reads a file as UTF-8 text.
     *
     * @param path - Absolute path to read.
     * @param encoding - Must be `'utf8'`.
     * @returns The file contents as a string.
     * @author wildduck2 <https://github.com/wildduck2>
     */
    readFile(path: string, encoding: 'utf8'): Promise<string>
    /**
     * Writes a file as UTF-8 text.
     *
     * @param path - Absolute path to write.
     * @param data - String contents to persist.
     * @param encoding - Must be `'utf8'`.
     * @returns Resolves once the write completes.
     * @author wildduck2 <https://github.com/wildduck2>
     */
    writeFile(path: string, data: string, encoding: 'utf8'): Promise<void>
    /**
     * Creates a directory recursively.
     *
     * @param path - Absolute directory to create.
     * @param options - Recursive create flag.
     * @returns Resolves once the directory exists.
     * @author wildduck2 <https://github.com/wildduck2>
     */
    mkdir(path: string, options: { recursive: true }): Promise<unknown>
  }

  /**
   * Describes initialization options for {@link FileAdapter}.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IInit {
    /**
     * Specifies the absolute path of the JSON store file.
     *
     * The adapter creates the file and parent directory on first write.
     */
    path: string
    /**
     * Provides the filesystem driver. Pass `await import('node:fs/promises')`
     * in Node or Bun, or any object implementing {@link IFS} for tests.
     */
    fs: IFS
  }

  /**
   * Describes the on-disk JSON state shape held by {@link FileAdapter}.
   *
   * Exposed for typing the internal cache field; not part of the wire API.
   *
   * @template TAction - Constrains valid action strings.
   * @template TResource - Constrains valid resource strings.
   * @template TRole - Constrains valid role strings.
   * @template TScope - Constrains valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IState<
    TAction extends string,
    TResource extends string,
    TRole extends string,
    TScope extends string,
  > {
    policies: Record<string, AccessControl.IPolicy<TAction, TResource, TRole>>
    roles: Record<string, AccessControl.IRole<TAction, TResource, TRole, TScope>>
    assignments: Record<string, Array<{ role: TRole; scope?: TScope }>>
    attributes: Record<string, Primitives.Attributes>
  }
}

/**
 * Persists the access store as a single JSON file with read-through cache.
 *
 * Single-writer model: concurrent writers against the same file clobber each
 * other without external locking. Use only for CLIs, dev fixtures, and single
 * process apps with modest policy counts.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @example
 * ```ts
 * import * as fs from 'node:fs/promises'
 * const adapter = new FileAdapter({ path: '/var/lib/iam/store.json', fs })
 * await adapter.savePolicy(policy)
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export class FileAdapter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> implements Adapter.IAdapter<TAction, TResource, TRole, TScope>
{
  private readonly _path: string
  private readonly _fs: File.IFS
  private _cache: File.IState<TAction, TResource, TRole, TScope> | null = null
  private _loadInFlight: Promise<File.IState<TAction, TResource, TRole, TScope>> | null = null

  /**
   * Creates a new file-backed adapter.
   *
   * @param init - Provides the store path and filesystem driver.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  constructor(init: File.IInit) {
    this._path = init.path
    this._fs = init.fs
  }

  private async _loadState(): Promise<File.IState<TAction, TResource, TRole, TScope>> {
    if (this._cache) return this._cache
    if (this._loadInFlight) return this._loadInFlight
    this._loadInFlight = (async () => {
      let state: File.IState<TAction, TResource, TRole, TScope>
      try {
        const raw = await this._fs.readFile(this._path, 'utf8')
        const parsed = JSON.parse(raw) as Partial<File.IState<TAction, TResource, TRole, TScope>>
        state = {
          policies: parsed.policies ?? {},
          roles: parsed.roles ?? {},
          assignments: parsed.assignments ?? {},
          attributes: parsed.attributes ?? {},
        }
      } catch {
        // Missing file or malformed JSON, start empty.
        state = { policies: {}, roles: {}, assignments: {}, attributes: {} }
      }
      this._cache = state
      this._loadInFlight = null
      return state
    })()
    return this._loadInFlight
  }

  private async _flush(): Promise<void> {
    if (!this._cache) return
    const lastSlash = this._path.lastIndexOf('/')
    if (lastSlash > 0) await this._fs.mkdir(this._path.slice(0, lastSlash), { recursive: true })
    await this._fs.writeFile(this._path, JSON.stringify(this._cache, null, 2), 'utf8')
  }

  /**
   * Lists every policy persisted on disk.
   *
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns All stored policies.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async listPolicies(_opts?: Adapter.IReadOptions): Promise<AccessControl.IPolicy<TAction, TResource, TRole>[]> {
    const s = await this._loadState()
    return Object.values(s.policies)
  }

  /**
   * Fetches a single policy by ID.
   *
   * @param id - Identifies the policy to look up.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns The matching policy or `null` when absent.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getPolicy(
    id: string,
    _opts?: Adapter.IReadOptions,
  ): Promise<AccessControl.IPolicy<TAction, TResource, TRole> | null> {
    const s = await this._loadState()
    return s.policies[id] ?? null
  }

  /**
   * Stores or overwrites a policy and flushes to disk.
   *
   * @param p - Provides the policy to persist.
   * @returns Resolves once the file is rewritten.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async savePolicy(p: AccessControl.IPolicy<TAction, TResource, TRole>): Promise<void> {
    const s = await this._loadState()
    s.policies[p.id] = p
    await this._flush()
  }

  /**
   * Removes a policy by ID and flushes to disk.
   *
   * @param id - Identifies the policy to delete.
   * @returns Resolves once the file is rewritten.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async deletePolicy(id: string): Promise<void> {
    const s = await this._loadState()
    delete s.policies[id]
    await this._flush()
  }

  /**
   * Lists every role persisted on disk.
   *
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns All stored roles.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async listRoles(_opts?: Adapter.IReadOptions): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope>[]> {
    const s = await this._loadState()
    return Object.values(s.roles)
  }

  /**
   * Fetches a single role by ID.
   *
   * @param id - Identifies the role to look up.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns The matching role or `null` when absent.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getRole(
    id: string,
    _opts?: Adapter.IReadOptions,
  ): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope> | null> {
    const s = await this._loadState()
    return s.roles[id] ?? null
  }

  /**
   * Stores or overwrites a role and flushes to disk.
   *
   * @param r - Provides the role to persist.
   * @returns Resolves once the file is rewritten.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async saveRole(r: AccessControl.IRole<TAction, TResource, TRole, TScope>): Promise<void> {
    const s = await this._loadState()
    s.roles[r.id] = r
    await this._flush()
  }

  /**
   * Removes a role by ID and flushes to disk.
   *
   * @param id - Identifies the role to delete.
   * @returns Resolves once the file is rewritten.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async deleteRole(id: string): Promise<void> {
    const s = await this._loadState()
    delete s.roles[id]
    await this._flush()
  }

  /**
   * Lists unscoped (global) roles assigned to a subject.
   *
   * @param id - Identifies the subject whose global roles are read.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns Deduplicated array of role IDs without scope.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectRoles(id: string, _opts?: Adapter.IReadOptions): Promise<TRole[]> {
    const s = await this._loadState()
    const entries = s.assignments[id] ?? []
    return [...new Set(entries.filter((e) => e.scope == null).map((e) => e.role))]
  }

  /**
   * Lists scoped role assignments for a subject.
   *
   * @param id - Identifies the subject whose scoped roles are read.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns Array of `(role, scope)` pairs for scoped assignments only.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectScopedRoles(id: string, _opts?: Adapter.IReadOptions): Promise<Request.IScopedRole<TRole, TScope>[]> {
    const s = await this._loadState()
    return (s.assignments[id] ?? [])
      .filter((e) => e.scope != null)
      .map((e) => ({ role: e.role, scope: e.scope as TScope }))
  }

  /**
   * Grants a role to a subject, optionally restricted to a scope.
   *
   * Duplicate `(role, scope)` pairs are silently ignored.
   *
   * @param id - Identifies the subject receiving the role.
   * @param roleId - Specifies the role being granted.
   * @param scope - Optional scope binding the assignment.
   * @returns Resolves once the file is rewritten.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async assignRole(id: string, roleId: TRole, scope?: TScope): Promise<void> {
    const s = await this._loadState()
    let entries = s.assignments[id]
    if (!entries) {
      entries = []
      s.assignments[id] = entries
    }
    if (!entries.some((e) => e.role === roleId && e.scope === scope)) {
      entries.push({ role: roleId, scope })
    }
    await this._flush()
  }

  /**
   * Removes a role assignment from a subject.
   *
   * @param id - Identifies the subject losing the role.
   * @param roleId - Specifies the role being revoked.
   * @param scope - Optional scope to match; omit to revoke unscoped only.
   * @returns Resolves once the file is rewritten.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async revokeRole(id: string, roleId: TRole, scope?: TScope): Promise<void> {
    const s = await this._loadState()
    const entries = s.assignments[id]
    if (!entries) return
    s.assignments[id] = entries.filter((e) => !(e.role === roleId && e.scope === scope))
    await this._flush()
  }

  /**
   * Fetches the attribute bag stored for a subject.
   *
   * @param id - Identifies the subject whose attributes are read.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns The subject's attributes or `{}` when none are recorded.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectAttributes(id: string, _opts?: Adapter.IReadOptions): Promise<Primitives.Attributes> {
    const s = await this._loadState()
    return s.attributes[id] ?? {}
  }

  /**
   * Shallow-merges new attributes into the subject's existing bag.
   *
   * @param id - Identifies the subject whose attributes are written.
   * @param attrs - Provides the partial attribute patch to merge in.
   * @returns Resolves once the file is rewritten.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async setSubjectAttributes(id: string, attrs: Primitives.Attributes): Promise<void> {
    const s = await this._loadState()
    s.attributes[id] = { ...(s.attributes[id] ?? {}), ...attrs }
    await this._flush()
  }
}
