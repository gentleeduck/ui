import type { AccessControl, Adapter, Primitives, Request } from '../../core/types'

/**
 * Row shapes returned by Drizzle queries.
 */
interface PolicyRow {
  id: string
  name: string
  description: string | null
  version: number
  algorithm: string
  rules: string | unknown
  targets: string | unknown | null
}

/** Database row shape for the roles table. */
interface RoleRow {
  id: string
  name: string
  description: string | null
  permissions: string | unknown
  inherits: string | unknown | null
  scope: string | null
  metadata: string | unknown | null
}

/** Database row shape for the role-to-subject assignments table. */
interface AssignmentRow {
  subjectId: string
  roleId: string
  scope: string | null
}

/** Database row shape for the subject attributes table. */
interface AttrRow {
  subjectId: string
  data: string | unknown
}

/**
 * Drizzle adapter integration types. Type-only namespace - zero bundle cost.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Drizzle {
  /**
   * Describes the wiring required to instantiate a {@link DrizzleAdapter}.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IConfig {
    /** Provides the Drizzle database instance with select/insert/delete builders. */
    db: {
      select: () => { from: (table: unknown) => DrizzleQuery }
      insert: (table: unknown) => { values: (data: Record<string, unknown>) => DrizzleInsert }
      delete: (table: unknown) => { where: (condition: unknown) => Promise<unknown> }
    }
    /** Provides references to the four Drizzle table schemas used by the adapter. */
    tables: {
      policies: DrizzleTable
      roles: DrizzleTable
      assignments: DrizzleTable
      attrs: DrizzleTable
    }
    /** Provides Drizzle operator functions for building WHERE clauses. */
    ops: {
      eq: (col: unknown, val: unknown) => unknown
      and: (...conditions: unknown[]) => unknown
    }
  }
}

/**
 * @deprecated Use {@link Drizzle.IConfig}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IDrizzleConfig = Drizzle.IConfig

/** Minimal shape of a Drizzle table object with optional column references. */
interface DrizzleTable {
  id?: unknown
  subjectId?: unknown
  roleId?: unknown
  scope?: unknown
  [key: string]: unknown
}

/** Minimal shape of a chainable Drizzle SELECT query. */
interface DrizzleQuery {
  where: (condition: unknown) => { limit: (n: number) => Promise<Record<string, unknown>[]> }
  limit: (n: number) => Promise<Record<string, unknown>[]>
  then: (onfulfilled: (value: Record<string, unknown>[]) => unknown) => Promise<unknown>
  [Symbol.iterator]?: unknown
}

/** Minimal shape of a chainable Drizzle INSERT query with conflict handling. */
interface DrizzleInsert {
  onConflictDoUpdate: (args: { target: unknown; set: Record<string, unknown> }) => Promise<unknown>
  onConflictDoNothing: () => Promise<unknown>
}

/**
 * Persists the access store via Drizzle ORM queries.
 *
 * Requires four tables (policies, roles, assignments, subject attributes). JSON
 * columns (rules, permissions, targets, metadata) are serialized on write and
 * parsed on read automatically.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @example
 * ```ts
 * import { drizzle } from 'drizzle-orm/node-postgres'
 * import { eq, and } from 'drizzle-orm'
 * const adapter = new DrizzleAdapter({ db: drizzle(pool), tables, ops: { eq, and } })
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export class DrizzleAdapter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> implements Adapter.IAdapter<TAction, TResource, TRole, TScope>
{
  private _db: Drizzle.IConfig['db']
  private _t: Drizzle.IConfig['tables']
  private _eq: Drizzle.IConfig['ops']['eq']
  private _and: Drizzle.IConfig['ops']['and']

  /**
   * Creates a new Drizzle adapter.
   *
   * @param config - Provides the Drizzle db, tables, and operator functions.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  constructor(config: Drizzle.IConfig) {
    this._db = config.db
    this._t = config.tables
    this._eq = config.ops.eq
    this._and = config.ops.and
  }

  /**
   * Lists every policy in the database.
   *
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns All policies parsed from the policies table.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async listPolicies(_opts?: Adapter.IReadOptions): Promise<AccessControl.IPolicy<TAction, TResource, TRole>[]> {
    const rows = (await this._db.select().from(this._t.policies)) as unknown as PolicyRow[]
    return rows.map(parsePolicy) as AccessControl.IPolicy<TAction, TResource, TRole>[]
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
    const rows = (await this._db
      .select()
      .from(this._t.policies)
      .where(this._eq(this._t.policies.id, id))
      .limit(1)) as unknown as PolicyRow[]
    return rows[0] ? (parsePolicy(rows[0]) as AccessControl.IPolicy<TAction, TResource, TRole>) : null
  }

  /**
   * Upserts a policy (inserts or updates on conflict).
   *
   * @param p - Provides the policy to persist.
   * @returns Resolves once the upsert completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async savePolicy(p: AccessControl.IPolicy<TAction, TResource, TRole>): Promise<void> {
    const data = serializePolicy(p)
    await this._db.insert(this._t.policies).values(data).onConflictDoUpdate({ target: this._t.policies.id, set: data })
  }

  /**
   * Removes a policy by ID.
   *
   * @param id - Identifies the policy to delete.
   * @returns Resolves once the delete completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async deletePolicy(id: string): Promise<void> {
    await this._db.delete(this._t.policies).where(this._eq(this._t.policies.id, id))
  }

  /**
   * Lists every role in the database.
   *
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns All roles parsed from the roles table.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async listRoles(_opts?: Adapter.IReadOptions): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope>[]> {
    const rows = (await this._db.select().from(this._t.roles)) as unknown as RoleRow[]
    return rows.map(parseRole) as AccessControl.IRole<TAction, TResource, TRole, TScope>[]
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
    const rows = (await this._db
      .select()
      .from(this._t.roles)
      .where(this._eq(this._t.roles.id, id))
      .limit(1)) as unknown as RoleRow[]
    return rows[0] ? (parseRole(rows[0]) as AccessControl.IRole<TAction, TResource, TRole, TScope>) : null
  }

  /**
   * Upserts a role (inserts or updates on conflict).
   *
   * @param r - Provides the role to persist.
   * @returns Resolves once the upsert completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async saveRole(r: AccessControl.IRole<TAction, TResource, TRole, TScope>): Promise<void> {
    const data = serializeRole(r)
    await this._db.insert(this._t.roles).values(data).onConflictDoUpdate({ target: this._t.roles.id, set: data })
  }

  /**
   * Removes a role by ID.
   *
   * @param id - Identifies the role to delete.
   * @returns Resolves once the delete completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async deleteRole(id: string): Promise<void> {
    await this._db.delete(this._t.roles).where(this._eq(this._t.roles.id, id))
  }

  /**
   * Lists deduplicated role IDs assigned to a subject.
   *
   * @param subjectId - Identifies the subject whose roles are read.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns Deduplicated array of role IDs.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectRoles(subjectId: string, _opts?: Adapter.IReadOptions): Promise<TRole[]> {
    const rows = (await this._db
      .select()
      .from(this._t.assignments)
      .where(this._eq(this._t.assignments.subjectId, subjectId))) as unknown as AssignmentRow[]
    return [...new Set(rows.map((r) => r.roleId as TRole))]
  }

  /**
   * Lists scoped role assignments for a subject (excludes unscoped).
   *
   * @param subjectId - Identifies the subject whose scoped roles are read.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns Array of `(role, scope)` pairs.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectScopedRoles(
    subjectId: string,
    _opts?: Adapter.IReadOptions,
  ): Promise<Request.IScopedRole<TRole, TScope>[]> {
    const rows = (await this._db
      .select()
      .from(this._t.assignments)
      .where(this._eq(this._t.assignments.subjectId, subjectId))) as unknown as AssignmentRow[]
    return rows.filter((r) => r.scope != null).map((r) => ({ role: r.roleId as TRole, scope: r.scope as TScope }))
  }

  /**
   * Grants a role to a subject, optionally restricted to a scope.
   *
   * No-ops on duplicate `(subject, role, scope)` rows.
   *
   * @param subjectId - Identifies the subject receiving the role.
   * @param roleId - Specifies the role being granted.
   * @param scope - Optional scope binding the assignment.
   * @returns Resolves once the insert completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    await this._db
      .insert(this._t.assignments)
      .values({ subjectId, roleId, scope: scope ?? null })
      .onConflictDoNothing()
  }

  /**
   * Removes role assignments matching the given filters.
   *
   * @param subjectId - Identifies the subject losing the role.
   * @param roleId - Specifies the role being revoked.
   * @param scope - Optional scope filter to narrow the delete.
   * @returns Resolves once the delete completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async revokeRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    const conditions = [
      this._eq(this._t.assignments.subjectId, subjectId),
      this._eq(this._t.assignments.roleId, roleId),
    ]
    if (scope) conditions.push(this._eq(this._t.assignments.scope, scope))
    await this._db.delete(this._t.assignments).where(this._and(...conditions))
  }

  /**
   * Fetches the attribute bag stored for a subject.
   *
   * @param subjectId - Identifies the subject whose attributes are read.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns The subject's attributes or `{}` when none are recorded.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectAttributes(subjectId: string, _opts?: Adapter.IReadOptions): Promise<Primitives.Attributes> {
    const rows = (await this._db
      .select()
      .from(this._t.attrs)
      .where(this._eq(this._t.attrs.subjectId, subjectId))
      .limit(1)) as unknown as AttrRow[]
    if (!rows[0]) return {}
    const data = rows[0].data
    return typeof data === 'string' ? JSON.parse(data) : ((data as Primitives.Attributes) ?? {})
  }

  /**
   * Shallow-merges new attributes into the subject's existing bag (upsert).
   *
   * @param subjectId - Identifies the subject whose attributes are written.
   * @param attrs - Provides the partial attribute patch to merge in.
   * @returns Resolves once the upsert completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async setSubjectAttributes(subjectId: string, attrs: Primitives.Attributes): Promise<void> {
    const existing = await this.getSubjectAttributes(subjectId)
    const merged = JSON.stringify({ ...existing, ...attrs })
    await this._db
      .insert(this._t.attrs)
      .values({ subjectId, data: merged })
      .onConflictDoUpdate({ target: this._t.attrs.subjectId, set: { data: merged } })
  }
}

/** Converts a database row into a Policy object, deserializing JSON columns. */
function parsePolicy(row: PolicyRow): AccessControl.IPolicy {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    version: row.version,
    algorithm: row.algorithm as AccessControl.IPolicy['algorithm'],
    rules: typeof row.rules === 'string' ? JSON.parse(row.rules) : (row.rules as AccessControl.IPolicy['rules']),
    targets: row.targets
      ? typeof row.targets === 'string'
        ? JSON.parse(row.targets)
        : (row.targets as AccessControl.IPolicy['targets'])
      : undefined,
  }
}

/** Converts a Policy object into a flat record with JSON-stringified columns for storage. */
function serializePolicy(p: AccessControl.IPolicy): Record<string, unknown> {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    version: p.version ?? 1,
    algorithm: p.algorithm,
    rules: JSON.stringify(p.rules),
    targets: p.targets ? JSON.stringify(p.targets) : null,
  }
}

/** Converts a database row into a Role object, deserializing JSON columns. */
function parseRole(row: RoleRow): AccessControl.IRole {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    permissions:
      typeof row.permissions === 'string'
        ? JSON.parse(row.permissions)
        : (row.permissions as AccessControl.IRole['permissions']),
    inherits: typeof row.inherits === 'string' ? JSON.parse(row.inherits) : ((row.inherits as string[]) ?? []),
    scope: row.scope ?? undefined,
    metadata: row.metadata
      ? typeof row.metadata === 'string'
        ? JSON.parse(row.metadata)
        : (row.metadata as AccessControl.IRole['metadata'])
      : undefined,
  }
}

/** Converts a Role object into a flat record with JSON-stringified columns for storage. */
function serializeRole(r: AccessControl.IRole): Record<string, unknown> {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    permissions: JSON.stringify(r.permissions),
    inherits: JSON.stringify(r.inherits ?? []),
    scope: r.scope ?? null,
    metadata: r.metadata ? JSON.stringify(r.metadata) : null,
  }
}
