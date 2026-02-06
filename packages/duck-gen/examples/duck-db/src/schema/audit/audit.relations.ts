import { relations } from 'drizzle-orm'
import { auditLogs } from '../audit'
import { apiKeys } from '../sessions'
import { tenants } from '../tanants'
import { users } from '../user'

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  tenant: one(tenants, { fields: [auditLogs.tenantId], references: [tenants.id] }),
  actorUser: one(users, { fields: [auditLogs.actorUserId], references: [users.id] }),
  actorApiKey: one(apiKeys, { fields: [auditLogs.actorApiKeyId], references: [apiKeys.id] }),
}))
