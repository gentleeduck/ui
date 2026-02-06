import { relations } from 'drizzle-orm'
import { memberships, tenantInviteRoles, tenants } from '../tanants'
import { membershipRoles } from './membership-roles'
import { permissions } from './permissions'
import { rolePermissions } from './role-permissions'
import { roles } from './roles'

export const rolesRelations = relations(roles, ({ one, many }) => ({
  tenant: one(tenants, { fields: [roles.tenantId], references: [tenants.id] }),
  rolePermissions: many(rolePermissions),
  membershipRoles: many(membershipRoles),
  inviteRoles: many(tenantInviteRoles),
}))

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}))

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}))

export const membershipRolesRelations = relations(membershipRoles, ({ one }) => ({
  membership: one(memberships, { fields: [membershipRoles.membershipId], references: [memberships.id] }),
  role: one(roles, { fields: [membershipRoles.roleId], references: [roles.id] }),
}))
