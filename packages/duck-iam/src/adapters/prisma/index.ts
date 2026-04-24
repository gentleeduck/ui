import type { Adapter, Attributes, Policy, Role, ScopedRole } from '../../core/types'

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
 * Prisma adapter for duck-iam.
 *
 * Implements the {@link Adapter} interface backed by Prisma Client queries.
 * Expects four Prisma models: `accessPolicy`, `accessRole`, `accessAssignment`,
 * and `accessSubjectAttr`. JSON columns are handled natively by Prisma.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 */
export class PrismaAdapter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> implements Adapter<TAction, TResource, TRole, TScope>
{
  /** Creates a new Prisma adapter wrapping the given Prisma client instance. */
  constructor(private prisma: PrismaLike) {}

  /** Returns all policies from the database. */
  async listPolicies(): Promise<Policy<TAction, TResource, TRole>[]> {
    const rows = await this.prisma.accessPolicy.findMany()
    return rows.map(toPolicy) as Policy<TAction, TResource, TRole>[]
  }

  /** Returns a policy by ID, or `null` if not found. */
  async getPolicy(id: string): Promise<Policy<TAction, TResource, TRole> | null> {
    const row = await this.prisma.accessPolicy.findUnique({ where: { id } })
    return row ? (toPolicy(row) as Policy<TAction, TResource, TRole>) : null
  }

  /** Creates or updates a policy via upsert. */
  async savePolicy(p: Policy<TAction, TResource, TRole>): Promise<void> {
    const data = fromPolicy(p)
    await this.prisma.accessPolicy.upsert({
      where: { id: p.id },
      create: data,
      update: data,
    })
  }

  /** Deletes a policy by ID. */
  async deletePolicy(id: string): Promise<void> {
    await this.prisma.accessPolicy.delete({ where: { id } })
  }

  /** Returns all roles from the database. */
  async listRoles(): Promise<Role<TAction, TResource, TRole, TScope>[]> {
    const rows = await this.prisma.accessRole.findMany()
    return rows.map(toRole) as Role<TAction, TResource, TRole, TScope>[]
  }

  /** Returns a role by ID, or `null` if not found. */
  async getRole(id: string): Promise<Role<TAction, TResource, TRole, TScope> | null> {
    const row = await this.prisma.accessRole.findUnique({ where: { id } })
    return row ? (toRole(row) as Role<TAction, TResource, TRole, TScope>) : null
  }

  /** Creates or updates a role via upsert. */
  async saveRole(r: Role<TAction, TResource, TRole, TScope>): Promise<void> {
    const data = fromRole(r)
    await this.prisma.accessRole.upsert({
      where: { id: r.id },
      create: data,
      update: data,
    })
  }

  /** Deletes a role by ID. */
  async deleteRole(id: string): Promise<void> {
    await this.prisma.accessRole.delete({ where: { id } })
  }

  /** Returns all roles assigned to a subject (both scoped and unscoped). */
  async getSubjectRoles(subjectId: string): Promise<TRole[]> {
    const rows = await this.prisma.accessAssignment.findMany({
      where: { subjectId },
    })
    return [...new Set(rows.map((r) => r.roleId as TRole))]
  }

  /** Returns only the scoped role assignments for a subject. */
  async getSubjectScopedRoles(subjectId: string): Promise<ScopedRole<TRole, TScope>[]> {
    const rows = await this.prisma.accessAssignment.findMany({
      where: { subjectId },
    })
    return rows.filter((r) => r.scope != null).map((r) => ({ role: r.roleId as TRole, scope: r.scope as TScope }))
  }

  /** Assigns a role to a subject, optionally within a scope. */
  async assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    await this.prisma.accessAssignment.create({
      data: { subjectId, roleId, scope: scope ?? null },
    })
  }

  /** Revokes a role from a subject, optionally within a specific scope. */
  async revokeRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void> {
    await this.prisma.accessAssignment.deleteMany({
      where: { subjectId, roleId, ...(scope ? { scope } : {}) },
    })
  }

  /** Returns the attributes map for a subject, or an empty object if none exist. */
  async getSubjectAttributes(subjectId: string): Promise<Attributes> {
    const row = await this.prisma.accessSubjectAttr.findUnique({
      where: { subjectId },
    })
    return (row?.data as Attributes) ?? {}
  }

  /** Merges the given attributes into the subject's existing attributes via upsert. */
  async setSubjectAttributes(subjectId: string, attrs: Attributes): Promise<void> {
    const existing = await this.getSubjectAttributes(subjectId)
    const merged = { ...existing, ...attrs }
    await this.prisma.accessSubjectAttr.upsert({
      where: { subjectId },
      create: { subjectId, data: merged },
      update: { data: merged },
    })
  }
}

/** Converts a {@link PolicyRow} database row into a {@link Policy} domain object. */
function toPolicy(row: PolicyRow): Policy {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    version: row.version,
    algorithm: row.algorithm as Policy['algorithm'],
    rules: row.rules as Policy['rules'],
    targets: (row.targets as Policy['targets']) ?? undefined,
  }
}

/** Converts a {@link Policy} domain object into a flat record suitable for Prisma create/update. */
function fromPolicy(p: Policy): Record<string, unknown> {
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

/** Converts a {@link RoleRow} database row into a {@link Role} domain object. */
function toRole(row: RoleRow): Role {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    permissions: row.permissions as Role['permissions'],
    inherits: row.inherits ?? [],
    scope: row.scope ?? undefined,
    metadata: (row.metadata as Role['metadata']) ?? undefined,
  }
}

/** Converts a {@link Role} domain object into a flat record suitable for Prisma create/update. */
function fromRole(r: Role): Record<string, unknown> {
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
