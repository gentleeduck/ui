import { relations } from 'drizzle-orm'
import { tenants } from '../tanants'
import { users } from '../user'
import { apiKeyEvents } from './api-key-events'
import { apiKeys } from './api-keys'
import { sessions } from './sessions'
import { tokens } from './tokens'

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  tenant: one(tenants, { fields: [sessions.tenantId], references: [tenants.id] }),
}))

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, { fields: [tokens.userId], references: [users.id] }),
  tenant: one(tenants, { fields: [tokens.tenantId], references: [tenants.id] }),
}))

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [apiKeys.tenantId],
    references: [tenants.id],
  }),
  createdBy: one(users, {
    fields: [apiKeys.createdByUserId],
    references: [users.id],
  }),
  events: many(apiKeyEvents),
}))

export const apiKeyEventsRelations = relations(apiKeyEvents, ({ one }) => ({
  apiKey: one(apiKeys, {
    fields: [apiKeyEvents.apiKeyId],
    references: [apiKeys.id],
  }),
  tenant: one(tenants, {
    fields: [apiKeyEvents.tenantId],
    references: [tenants.id],
  }),
  actor: one(users, {
    fields: [apiKeyEvents.actorUserId],
    references: [users.id],
  }),
}))
