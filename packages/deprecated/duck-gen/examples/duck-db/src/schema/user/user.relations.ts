import { relations } from 'drizzle-orm'
import { fileLinks, fileObjects } from '../file'
import { sessions } from '../sessions'
import { users } from './user'
import { userIdentities } from './user-identities'

export const usersRelations = relations(users, ({ many }) => ({
  identities: many(userIdentities),
  sessions: many(sessions),
  fileObjects: many(fileObjects),
  fileLinks: many(fileLinks),
}))

export const userIdentitiesRelations = relations(userIdentities, ({ one }) => ({
  user: one(users, { fields: [userIdentities.userId], references: [users.id] }),
}))
