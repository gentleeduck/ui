import { relations } from 'drizzle-orm'
import { fileLinks, fileObjects } from '../file'
import { roles } from '../iam'
import { users } from '../user'
import { memberships } from './memberships'
import { tenantDomains } from './tenant-domains'
import { tenantInviteRoles } from './tenant-invite-roles'
import { tenantInvites } from './tenant-invites'
import { tenants } from './tenants'

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  owner: one(users, { fields: [tenants.ownerUserId], references: [users.id] }),
  memberships: many(memberships),
  domains: many(tenantDomains),
  invites: many(tenantInvites),
  fileObjects: many(fileObjects),
  fileLinks: many(fileLinks),
}))

export const tenantDomainsRelations = relations(tenantDomains, ({ one }) => ({
  tenant: one(tenants, { fields: [tenantDomains.tenantId], references: [tenants.id] }),
}))

export const membershipsRelations = relations(memberships, ({ one }) => ({
  tenant: one(tenants, { fields: [memberships.tenantId], references: [tenants.id] }),
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
}))

export const tenantInvitesRelations = relations(tenantInvites, ({ one, many }) => ({
  tenant: one(tenants, { fields: [tenantInvites.tenantId], references: [tenants.id] }),
  invitedBy: one(users, { fields: [tenantInvites.invitedByUserId], references: [users.id] }),
  acceptedBy: one(users, { fields: [tenantInvites.acceptedByUserId], references: [users.id] }),
  roles: many(tenantInviteRoles),
}))

export const tenantInviteRolesRelations = relations(tenantInviteRoles, ({ one }) => ({
  invite: one(tenantInvites, { fields: [tenantInviteRoles.inviteId], references: [tenantInvites.id] }),
  role: one(roles, { fields: [tenantInviteRoles.roleId], references: [roles.id] }),
}))
