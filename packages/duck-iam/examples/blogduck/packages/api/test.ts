import { createAccessConfig, defineRole, Engine, MemoryAdapter, validateRoles } from '@gentleduck/iam'

export const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete', 'list', 'manage'] as const,
  resources: ['comment', 'post', 'user', 'dashboard'] as const,
  scopes: ['public', 'private'] as const,
  roles: ['guest', 'member', 'moderator', 'admin', 'super-admin'] as const,
})
// const { defineRole, validateRoles } = access

export const guest = access
  .defineRole('guest')
  .name('Guest')
  .desc('Unauthenticated read-only access to public content')
  .grantScoped('public', 'read', 'post')
  .grantScoped('public', 'read', 'comment')
  .build()

export const member = defineRole('member')
  .name('Member')
  .desc('Authenticated user with ability to create and manage own content')
  .inherits('guest')
  .grant('create', 'post')
  .grant('create', 'comment')
  .grant('list', 'post')
  .grant('list', 'comment')
  .grantWhen('update', 'post', (w) => w.isOwner())
  .grantWhen('delete', 'post', (w) => w.isOwner())
  .grantWhen('update', 'comment', (w) => w.isOwner())
  .grantWhen('delete', 'comment', (w) => w.isOwner())
  .build()

export const moderator = defineRole('moderator')
  .name('Moderator')
  .desc('Can manage all user-generated content regardless of ownership')
  .inherits('member')
  .grant('update', 'post')
  .grant('delete', 'post')
  .grant('update', 'comment')
  .grant('delete', 'comment')
  .grant('list', 'user')
  .grant('read', 'user')
  .build()

export const admin = defineRole('admin')
  .name('Admin')
  .desc('Full control over all resources except super-admin operations')
  .inherits('moderator')
  .grantCRUD('user')
  .grantCRUD('dashboard')
  .grant('manage', 'post')
  .grant('manage', 'comment')
  .build()

export const superAdmin = defineRole('super-admin')
  .name('Super Admin')
  .desc('Unrestricted access to everything')
  .grantAll('*')
  .build()

const validation = validateRoles([guest, member, moderator, admin, superAdmin])
if (!validation.valid) {
  throw new Error(validation.issues.map((i) => i.message).join('\n'))
}

/* --------------------------------------------------------------------------------------------- */

const adapter = new MemoryAdapter({
  roles: [guest, member, moderator, admin, superAdmin],
  assignments: {
    'user-alice': ['member'],
    'user-bob': ['member'],
    'user-mod': ['moderator'],
  },
})

export const engine = new Engine({ adapter, defaultEffect: 'deny' })

// Setup: alice owns post-1, bob does not
const alicePost = {
  type: 'post',
  id: 'post-1',
  attributes: { ownerId: 'user-alice' },
}

// --- member deleting their OWN post -> allowed
const aliceDeletesOwn = await engine.can('user-alice', 'delete', alicePost)
console.log(aliceDeletesOwn) // true

// --- member deleting someone ELSE's post -> denied
const bobDeletesAlice = await engine.can('user-bob', 'delete', alicePost)
console.log(bobDeletesAlice) // false

// --- use check() to see WHY it was denied
const decision = await engine.check('user-bob', 'delete', alicePost)
console.log(decision.allowed) // false
console.log(decision.reason) // "No matching rules -> deny"

// --- moderator deleting alice's post -> allowed (no isOwner restriction)
const modDeletesAlice = await engine.can('user-mod', 'delete', alicePost)
console.log(modDeletesAlice) // true

// --- member trying to read a private post (guest only has public scope)
const privatePost = {
  type: 'post',
  id: 'post-2',
  attributes: { ownerId: 'user-alice' },
}
const bobReadsPrivate = await engine.can('user-bob', 'read', privatePost, undefined, 'private')
console.log(bobReadsPrivate) // false -- member inherits guest's public-only read

// --- batch check what bob can actually do
const perms = await engine.permissions('user-bob', [
  { action: 'read', resource: 'post' },
  { action: 'create', resource: 'post' },
  { action: 'update', resource: 'post', resourceId: 'post-1' },
  { action: 'delete', resource: 'post', resourceId: 'post-1' },
  { action: 'manage', resource: 'user' },
])
console.log(perms)
