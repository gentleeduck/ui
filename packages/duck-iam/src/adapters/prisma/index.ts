import type { AccessControl, Adapter, Primitives, Request } from '../../core/types'

/**
 * Row shapes expected from Prisma models.
 * Your Prisma schema should match these column names.
 */
interface PolicyRow {
  id: string
  name: string
  description: string | null
  version: number
  algorithm: string
  rules: unknown
  targets: unknown | null
}

/** Database row shape for the `accessRole` Prisma model. */
interface RoleRow {
  id: string
  name: string
  description: string | null
  permissions: unknown
  inherits: string[] | null
  scope: string | null
  metadata: unknown | null
}

/** Database row shape for the `accessAssignment` Prisma model. */
interface AssignmentRow {
  subjectId: string
  roleId: string
  scope: string | null
}

/** Database row shape for the `accessSubjectAttr` Prisma model. */
interface AttrRow {
  subjectId: string
  data: unknown
}

/**
 * Generic Prisma client type so we don't require @prisma/client as a hard dep.
 * Your PrismaClient just needs these models.
 */
interface PrismaLike {
  accessPolicy: {
    findMany: (args?: unknown) => Promise<PolicyRow[]>
    findUnique: (args: { where: { id: string } }) => Promise<PolicyRow | null>
    upsert: (args: {
      where: { id: string }
      create: Record<string, unknown>
      update: Record<string, unknown>
    }) => Promise<PolicyRow>
    delete: (args: { where: { id: string } }) => Promise<PolicyRow>
  }
  accessRole: {
    findMany: (args?: unknown) => Promise<RoleRow[]>
    findUnique: (args: { where: { id: string } }) => Promise<RoleRow | null>
    upsert: (args: {
      where: { id: string }
      create: Record<string, unknown>
      update: Record<string, unknown>
    }) => Promise<RoleRow>
    delete: (args: { where: { id: string } }) => Promise<RoleRow>
  }
  accessAssignment: {
    findMany: (args: { where: { subjectId: string } }) => Promise<AssignmentRow[]>
    create: (args: { data: Record<string, unknown> }) => Promise<AssignmentRow>
    deleteMany: (args: { where: Record<string, unknown> }) => Promise<{ count: number }>
  }
  accessSubjectAttr: {
    findUnique: (args: { where: { subjectId: string } }) => Promise<AttrRow | null>
    upsert: (args: {
      where: { subjectId: string }
      create: Record<string, unknown>
      update: Record<string, unknown>
    }) => Promise<AttrRow>
  }
}

/**
 * Persists the access store via a Prisma Client.
 *
 * Expects four models: `accessPolicy`, `accessRole`, `accessAssignment`, and
 * `accessSubjectAttr`. JSON columns are handled natively by Prisma.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @example
 * ```ts
 * import { PrismaClient } from '@prisma/client'
 * const adapter = new PrismaAdapter(new PrismaClient())
 * await adapter.savePolicy(policy)
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export class PrismaAdapter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> implements Adapter.IAdapter<TAction, TResource, TRole, TScope>
{
  /**
   * Creates a new Prisma adapter.
   *
   * @param prisma - Provides the Prisma client instance with required models.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  constructor(private prisma: PrismaLike) {}

  /**
   * Lists every policy in the database.
   *
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns All policies parsed from `accessPolicy` rows.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async listPolicies(_opts?: Adapter.IReadOptions): Promise<AccessControl.IPolicy<TAction, TResource, TRole>[]> {
    const rows = await this.prisma.accessPolicy.findMany()
    return rows.map(toPolicy) as AccessControl.IPolicy<TAction, TResource, TRole>[]
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
    const row = await this.prisma.accessPolicy.findUnique({ where: { id } })
    return row ? (toPolicy(row) as AccessControl.IPolicy<TAction, TResource, TRole>) : null
  }

  /**
   * Upserts a policy through Prisma.
   *
   * @param p - Provides the policy to persist.
   * @returns Resolves once the upsert completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async savePolicy(p: AccessControl.IPolicy<TAction, TResource, TRole>): Promise<void> {
    const data = fromPolicy(p)
    await this.prisma.accessPolicy.upsert({
      where: { id: p.id },
      create: data,
      update: data,
    })
  }

  /**
   * Removes a policy by ID.
   *
   * @param id - Identifies the policy to delete.
   * @returns Resolves once the delete completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async deletePolicy(id: string): Promise<void> {
    await this.prisma.accessPolicy.delete({ where: { id } })
  }

  /**
   * Lists every role in the database.
   *
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns All roles parsed from `accessRole` rows.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async listRoles(_opts?: Adapter.IReadOptions): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope>[]> {
    const rows = await this.prisma.accessRole.findMany()
    return rows.map(toRole) as AccessControl.IRole<TAction, TResource, TRole, TScope>[]
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
    const row = await this.prisma.accessRole.findUnique({ where: { id } })
    return row ? (toRole(row) as AccessControl.IRole<TAction, TResource, TRole, TScope>) : null
  }

  /**
   * Upserts a role through Prisma.
   *
   * @param r - Provides the role to persist.
   * @returns Resolves once the upsert completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async saveRole(r: AccessControl.IRole<TAction, TResource, TRole, TScope>): Promise<void> {
    const data = fromRole(r)
    await this.prisma.accessRole.upsert({
      where: { id: r.id },
      create: data,
      update: data,
    })
  }

  /**
   * Removes a role by ID.
   *
   * @param id - Identifies the role to delete.
   * @returns Resolves once the delete completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async deleteRole(id: string): Promise<void> {
    await this.prisma.accessRole.delete({ where: { id } })
  }

  /**
   * Lists deduplicated role IDs assigned to a subject (scoped or unscoped).
   *
   * @param subjectId - Identifies the subject whose roles are read.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns Deduplicated array of role IDs.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectRoles(subjectId: string, _opts?: Adapter.IReadOptions): Promise<TRole[]> {
    const rows = await this.prisma.accessAssignment.findMany({
      where: { subjectId },
    })
    return [...new Set(rows.map((r) => r.roleId as TRole))]
  }

  /**
   * Lists scoped role assignments for a subject.
   *
   * @param subjectId - Identifies the subject whose scoped roles are read.
   * @param _opts - Ignored read options accepted for interface compatibility.
   * @returns Array of `(role, scope)` pairs for scoped assignments only.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async getSubjectScopedRoles(
    subjectId: string,
    _opts?: Adapter.IReadOptions,
  ): Promise<Request.IScopedRole<TRole, TScope>[]> {
    const rows = await this.prisma.accessAssignment.findMany({
      where: { subjectId },
    })
    return rows.filter((r) => r.scope != null).map((r) => ({ role: r.roleId as TRole, scope: r.scope as TScope }))
  }

  /**
   * Grants a role to a subject, optionally restricted to a scope.
   *
   * @param subjectId - Identifies the subject receiving the role.
   * @param roleId - Specifies the role being granted.
   * @param scope - Optional scope binding the assignment.
   * @returns Resolves once the row is inserted.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    await this.prisma.accessAssignment.create({
      data: { subjectId, roleId, scope: scope ?? null },
    })
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
    await this.prisma.accessAssignment.deleteMany({
      where: { subjectId, roleId, ...(scope ? { scope } : {}) },
    })
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
    const row = await this.prisma.accessSubjectAttr.findUnique({
      where: { subjectId },
    })
    return (row?.data as Primitives.Attributes) ?? {}
  }

  /**
   * Shallow-merges new attributes into the subject's existing bag via upsert.
   *
   * @param subjectId - Identifies the subject whose attributes are written.
   * @param attrs - Provides the partial attribute patch to merge in.
   * @returns Resolves once the upsert completes.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  async setSubjectAttributes(subjectId: string, attrs: Primitives.Attributes): Promise<void> {
    const existing = await this.getSubjectAttributes(subjectId)
    const merged = { ...existing, ...attrs }
    await this.prisma.accessSubjectAttr.upsert({
      where: { subjectId },
      create: { subjectId, data: merged },
      update: { data: merged },
    })
  }
}

/** Converts a {@link PolicyRow} database row into a {@link AccessControl.IPolicy} domain object. */
function toPolicy(row: PolicyRow): AccessControl.IPolicy {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    version: row.version,
    algorithm: row.algorithm as AccessControl.IPolicy['algorithm'],
    rules: row.rules as AccessControl.IPolicy['rules'],
    targets: (row.targets as AccessControl.IPolicy['targets']) ?? undefined,
  }
}

/** Converts a {@link AccessControl.IPolicy} domain object into a flat record suitable for Prisma create/update. */
function fromPolicy(p: AccessControl.IPolicy): Record<string, unknown> {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    version: p.version ?? 1,
    algorithm: p.algorithm,
    rules: p.rules,
    targets: p.targets ?? null,
  }
}

/** Converts a {@link RoleRow} database row into a {@link AccessControl.IRole} domain object. */
function toRole(row: RoleRow): AccessControl.IRole {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    permissions: row.permissions as AccessControl.IRole['permissions'],
    inherits: row.inherits ?? [],
    scope: row.scope ?? undefined,
    metadata: (row.metadata as AccessControl.IRole['metadata']) ?? undefined,
  }
}

/** Converts a {@link AccessControl.IRole} domain object into a flat record suitable for Prisma create/update. */
function fromRole(r: AccessControl.IRole): Record<string, unknown> {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    permissions: r.permissions,
    inherits: r.inherits ?? [],
    scope: r.scope ?? null,
    metadata: r.metadata ?? null,
  }
}
