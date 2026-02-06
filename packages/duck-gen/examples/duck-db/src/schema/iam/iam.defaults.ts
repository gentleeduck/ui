// Duck Business IAM defaults (tenant + system scopes), fully type-safe catalogs + role templates.

export type Scope = 'tenant' | 'system'

/* -------------------------------- Permissions ------------------------------- */

const TENANT_IDENTITY_PERMISSIONS = [
  'user:users.read',
  'user:users.manage',
  'user:user_identities.read',
  'user:user_identities.manage',
  'auth:api_keys.read',
  'auth:api_keys.manage',
  'auth:api_key_events.read',
] as const

const TENANT_TENANCY_PERMISSIONS = [
  'tenant:tenants.read',
  'tenant:tenants.manage',
  'tenant:tenant_domains.read',
  'tenant:tenant_domains.manage',
  'tenant:tenant_invites.read',
  'tenant:tenant_invites.manage',
  'tenant:tenant_invite_roles.read',
  'tenant:tenant_invite_roles.manage',
  'tenant:memberships.read',
  'tenant:memberships.manage',
  'tenant:settings.read',
  'tenant:settings.manage',
] as const

const TENANT_ACCESS_PERMISSIONS = [
  'iam:roles.read',
  'iam:roles.manage',

  // Tenants can READ the global permission catalog to build roles,
  // but should not be able to mutate the catalog keys.
  'iam:permissions.read',

  'iam:role_permissions.read',
  'iam:role_permissions.manage',
  'iam:membership_roles.read',
  'iam:membership_roles.manage',
] as const

const TENANT_SESSIONS_PERMISSIONS = [
  'auth:sessions.read',
  'auth:sessions.manage',
  'auth:tokens.read',
  'auth:tokens.manage',
] as const

const TENANT_BILLING_PERMISSIONS = [
  'billing:billing_customers.read',
  'billing:billing_customers.manage',
  'billing:subscriptions.read',
  'billing:subscriptions.manage',
] as const

const TENANT_STORAGE_PERMISSIONS = [
  // Preferred (policy-friendly) keys
  'file:file_objects.read_own',
  'file:file_objects.manage_own',
  'file:file_objects.read_any',
  'file:file_objects.manage_any',
  'file:file_links.read_own',
  'file:file_links.manage_own',
  'file:file_links.read_any',
  'file:file_links.manage_any',

  // Deprecated aliases (keep for backwards compatibility; avoid using in new code)
  'file:file_objects.read',
  'file:file_objects.manage',
  'file:file_links.read',
  'file:file_links.manage',
] as const

const TENANT_AUDIT_PERMISSIONS = ['audit:audit_logs.read'] as const

export const TENANT_PERMISSIONS = [
  ...TENANT_IDENTITY_PERMISSIONS,
  ...TENANT_TENANCY_PERMISSIONS,
  ...TENANT_ACCESS_PERMISSIONS,
  ...TENANT_SESSIONS_PERMISSIONS,
  ...TENANT_BILLING_PERMISSIONS,
  ...TENANT_STORAGE_PERMISSIONS,
  ...TENANT_AUDIT_PERMISSIONS,
] as const

export type TenantPermission = (typeof TENANT_PERMISSIONS)[number]

const SYSTEM_PERMISSIONS_CORE = [
  'system:tenants.read',
  'system:tenants.manage',
  'system:tenant_domains.read',
  'system:tenant_domains.manage',
  'system:tenant_invites.read',
  'system:tenant_invites.manage',
  'system:tenant_invite_roles.read',
  'system:tenant_invite_roles.manage',
  'system:memberships.read',
  'system:memberships.manage',
  'system:users.read',
  'system:users.manage',
  'system:user_identities.read',
  'system:user_identities.manage',
  'system:roles.read',
  'system:roles.manage',
  'system:permissions.read',
  'system:permissions.manage',
  'system:role_permissions.read',
  'system:role_permissions.manage',
  'system:membership_roles.read',
  'system:membership_roles.manage',
  'system:sessions.read',
  'system:sessions.manage',
  'system:tokens.read',
  'system:tokens.manage',
  'system:api_keys.read',
  'system:api_keys.manage',
  'system:api_key_events.read',
  'system:billing_customers.read',
  'system:billing_customers.manage',
  'system:subscriptions.read',
  'system:subscriptions.manage',

  // Preferred (policy-friendly) keys
  'system:file_objects.read_own',
  'system:file_objects.manage_own',
  'system:file_objects.read_any',
  'system:file_objects.manage_any',
  'system:file_links.read_own',
  'system:file_links.manage_own',
  'system:file_links.read_any',
  'system:file_links.manage_any',

  // Deprecated aliases
  'system:file_objects.read',
  'system:file_objects.manage',
  'system:file_links.read',
  'system:file_links.manage',

  'system:audit_logs.read',
] as const

export const SYSTEM_PERMISSIONS = SYSTEM_PERMISSIONS_CORE
export type SystemPermission = (typeof SYSTEM_PERMISSIONS)[number]

// Backwards-compatible aliases
export const PLATFORM_PERMISSIONS = SYSTEM_PERMISSIONS
export type PlatformPermission = SystemPermission

export type PermissionKey = TenantPermission | SystemPermission

/* -------------------------- Permission type utilities ------------------------ */

export type TenantReadPermission = Extract<TenantPermission, `${string}.read`>
export type SystemReadPermission = Extract<SystemPermission, `${string}.read`>

function isReadPermission<P extends string>(p: P): p is Extract<P, `${string}.read`> {
  return p.endsWith('.read')
}

const TENANT_READ_PERMISSIONS = TENANT_PERMISSIONS.filter(isReadPermission)
const SYSTEM_READ_PERMISSIONS = SYSTEM_PERMISSIONS.filter(isReadPermission)

/* ---------------------------------- Roles ---------------------------------- */

export type RoleTemplate<S extends Scope, P extends string> = {
  key: string
  name: string
  scope: S
  description?: string
  permissions: readonly P[]
  system: boolean
}

const ALL_TENANT = TENANT_PERMISSIONS
const ALL_SYSTEM = SYSTEM_PERMISSIONS

// Tenant role building blocks (keep these strict and boring)
const TENANT_IAM_MANAGER_PERMISSIONS = [
  'iam:roles.read',
  'iam:roles.manage',
  'iam:permissions.read',
  'iam:role_permissions.read',
  'iam:role_permissions.manage',
  'iam:membership_roles.read',
  'iam:membership_roles.manage',
  'tenant:tenant_invites.read',
  'tenant:tenant_invites.manage',
  'tenant:memberships.read',
  'tenant:memberships.manage',
  'auth:api_keys.read',
  'auth:api_keys.manage',
  'audit:audit_logs.read',
] as const satisfies readonly TenantPermission[]

const TENANT_MEMBER_EXTRA_PERMISSIONS = [
  // Day-to-day ops (keep this minimal; avoid IAM/billing/session/token admin)
  'file:file_objects.read_own',
  'file:file_objects.manage_own',
  'file:file_links.read_own',
  'file:file_links.manage_own',
] as const satisfies readonly TenantPermission[]

const TENANT_MEMBER_PERMISSIONS = Array.from(
  new Set<TenantPermission>([...TENANT_READ_PERMISSIONS, ...TENANT_MEMBER_EXTRA_PERMISSIONS]),
)

const SYSTEM_BILLING_PERMISSIONS = [
  'system:billing_customers.read',
  'system:billing_customers.manage',
  'system:subscriptions.read',
  'system:subscriptions.manage',
] as const satisfies readonly SystemPermission[]

export const TENANT_ROLE_TEMPLATES = [
  {
    key: 'owner',
    name: 'Owner',
    scope: 'tenant',
    description: 'Full access to everything in this tenant.',
    permissions: ALL_TENANT,
    system: true,
  },
  {
    key: 'admin',
    name: 'Admin',
    scope: 'tenant',
    description: 'Tenant administration and configuration.',
    permissions: ALL_TENANT,
    system: true,
  },
  {
    key: 'iam_manager',
    name: 'IAM Manager',
    scope: 'tenant',
    description: 'Manages members, roles, and API keys (no billing by default).',
    permissions: TENANT_IAM_MANAGER_PERMISSIONS,
    system: true,
  },
  {
    key: 'member',
    name: 'Member',
    scope: 'tenant',
    description: 'Day-to-day work. No access control, billing, or token/session admin.',
    permissions: TENANT_MEMBER_PERMISSIONS,
    system: true,
  },
  {
    key: 'viewer',
    name: 'Viewer',
    scope: 'tenant',
    description: 'Read-only access across tenant resources.',
    permissions: TENANT_READ_PERMISSIONS,
    system: true,
  },
] as const satisfies readonly RoleTemplate<'tenant', TenantPermission>[]

export const SYSTEM_ROLE_TEMPLATES = [
  {
    key: 'system_admin',
    name: 'System Admin',
    scope: 'system',
    description: 'Full access to the platform.',
    permissions: ALL_SYSTEM,
    system: true,
  },
  {
    key: 'support',
    name: 'Support',
    scope: 'system',
    description: 'Read-only access for customer support and audits.',
    permissions: SYSTEM_READ_PERMISSIONS,
    system: true,
  },
  {
    key: 'billing',
    name: 'Billing',
    scope: 'system',
    description: 'Billing operations and subscription management.',
    permissions: SYSTEM_BILLING_PERMISSIONS,
    system: true,
  },
] as const satisfies readonly RoleTemplate<'system', SystemPermission>[]

// Backwards-compatible alias
export const PLATFORM_ROLE_TEMPLATES = SYSTEM_ROLE_TEMPLATES

/* ------------------------------- Small helpers ------------------------------ */

export function isTenantPermission(p: PermissionKey): p is TenantPermission {
  return (TENANT_PERMISSIONS as readonly string[]).includes(p)
}

export function isSystemPermission(p: PermissionKey): p is SystemPermission {
  return (SYSTEM_PERMISSIONS as readonly string[]).includes(p)
}

export function isPlatformPermission(p: PermissionKey): p is PlatformPermission {
  return isSystemPermission(p)
}

// UI gating helpers (works for tenant + system)
export function canAll<P extends string>(set: ReadonlySet<P>, required: readonly P[]) {
  for (const p of required) if (!set.has(p)) return false
  return true
}

export function canAny<P extends string>(set: ReadonlySet<P>, required: readonly P[]) {
  for (const p of required) if (set.has(p)) return true
  return false
}
