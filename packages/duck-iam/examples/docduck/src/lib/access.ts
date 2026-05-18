import { type Adapter, createAccessConfig } from '@gentleduck/iam'
import { DrizzleAdapter, type DrizzleConfig } from '@gentleduck/iam/adapters/drizzle'
import { and, eq, isNull } from 'drizzle-orm'
import { db } from './db'
import { accessAssignments, accessPolicies, accessRoles, accessSubjectAttrs } from './db/schema'

// ── Typed context for ABAC policies ────────────────────────────────

interface DocDuckContext {
  subject: {
    id: string
    attributes: { workspaceRole: string }
  }
  resource: {
    type: string
    id?: string
    attributes: { ownerId: string; isPublic: boolean }
  }
  environment: Record<string, never>
}

// ── Config ─────────────────────────────────────────────────────────

export const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete', 'share', 'manage'] as const,
  resources: ['document', 'workspace', 'member'] as const,
  context: {} as unknown as DocDuckContext,
})

export type AppAction = (typeof access.actions)[number]
export type AppResource = (typeof access.resources)[number]

// ── Roles (workspace-scoped via assignments) ───────────────────────

export const viewer = access
  .defineRole('viewer')
  .name('Viewer')
  .grant('read', 'document')
  .grant('read', 'workspace')
  .grant('read', 'member')
  .build()

export const editor = access
  .defineRole('editor')
  .name('Editor')
  .inherits('viewer')
  .grant('create', 'document')
  .grant('update', 'document')
  .build()

export const admin = access
  .defineRole('admin')
  .name('Admin')
  .inherits('editor')
  .grant('delete', 'document')
  .grant('share', 'document')
  .grant('manage', 'member')
  .grant('update', 'workspace')
  .build()

export const owner = access.defineRole('owner').name('Owner').inherits('admin').grant('delete', 'workspace').build()

export const allRoles = [viewer, editor, admin, owner]

// ── ABAC Policies ──────────────────────────────────────────────────

export const docOwnershipPolicy = access
  .policy('doc-ownership')
  .name('Document Ownership')
  .desc('Editors can only update/delete their own documents; admins/owners bypass')
  .target({ actions: ['update', 'delete'], resources: ['document'] })
  .algorithm('deny-overrides')
  .rule('deny-non-owner-edit', (r) =>
    r
      .deny()
      .on('update', 'delete')
      .of('document')
      .when((w) => w.in('subject.attributes.workspaceRole', ['editor']).resourceAttr('ownerId', 'neq', '$subject.id')),
  )
  .build()

export const publicDocsPolicy = access
  .policy('public-docs')
  .name('Public Documents')
  .desc('Public documents are readable by any workspace member')
  .target({ actions: ['read'], resources: ['document'] })
  .algorithm('allow-overrides')
  .rule('allow-public-read', (r) =>
    r
      .allow()
      .on('read')
      .of('document')
      .when((w) => w.resourceAttr('isPublic', 'eq', true)),
  )
  .build()

// NOTE: ABAC policies are defined but NOT seeded to the DB.
// The engine AND-combines all policies, and when a policy's targets
// don't match a request, it defaults to deny. This means any policy
// stored in the DB will deny requests outside its target scope.
// For this example, RBAC roles provide all needed permissions.
// To use ABAC policies, ensure every policy covers all action/resource
// combinations (or fix the target-mismatch behavior upstream).
export const allPolicies: (typeof docOwnershipPolicy)[] = []

// ── Adapter ────────────────────────────────────────────────────────

// Wrap DrizzleAdapter to fix getSubjectRoles: only return UNSCOPED roles.
// The default adapter returns all roles (including scoped ones), which bleeds
// permissions across workspaces. Scoped roles are handled separately via
// getSubjectScopedRoles + enrichSubjectWithScopedRoles in the engine.
const baseAdapter = new DrizzleAdapter({
  db,
  tables: {
    policies: accessPolicies,
    roles: accessRoles,
    assignments: accessAssignments,
    attrs: accessSubjectAttrs,
  },
  ops: { eq, and },
} as unknown as DrizzleConfig) as unknown as Adapter<AppAction, AppResource, string, string>

// Create a proxy that intercepts getSubjectRoles to only return unscoped assignments
const adapter = new Proxy(baseAdapter, {
  get(target, prop, receiver) {
    if (prop === 'getSubjectRoles') {
      return async (subjectId: string) => {
        // Only return roles from unscoped assignments (scope IS NULL).
        // Our app uses only scoped assignments, so this returns [].
        // The engine then uses getSubjectScopedRoles for workspace-specific roles.
        const rows = await db
          .select()
          .from(accessAssignments)
          .where(and(eq(accessAssignments.subjectId, subjectId), isNull(accessAssignments.scope)))
        return [...new Set(rows.map((r) => r.roleId))]
      }
    }
    return Reflect.get(target, prop, receiver)
  },
})

// ── Engine ─────────────────────────────────────────────────────────

export const engine = access.createEngine({
  adapter,
  cacheTTL: 30,
})

// ── Permission checks for the frontend ─────────────────────────────

export const CHECKS = access.checks([
  { action: 'create', resource: 'document' },
  { action: 'read', resource: 'document' },
  { action: 'update', resource: 'document' },
  { action: 'delete', resource: 'document' },
  { action: 'share', resource: 'document' },
  { action: 'read', resource: 'workspace' },
  { action: 'update', resource: 'workspace' },
  { action: 'delete', resource: 'workspace' },
  { action: 'manage', resource: 'member' },
  { action: 'read', resource: 'member' },
])
