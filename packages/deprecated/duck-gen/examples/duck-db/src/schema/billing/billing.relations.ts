import { relations } from 'drizzle-orm'
import { tenants } from '../tanants'
import { billingCustomers } from './billing-customers'
import { subscriptions } from './subscriptions'

export const billingCustomersRelations = relations(billingCustomers, ({ one }) => ({
  tenant: one(tenants, { fields: [billingCustomers.tenantId], references: [tenants.id] }),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  tenant: one(tenants, { fields: [subscriptions.tenantId], references: [tenants.id] }),
}))
