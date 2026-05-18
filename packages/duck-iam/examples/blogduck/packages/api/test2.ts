import { createAccessConfig, type DefaultContext, MemoryAdapter } from '@gentleduck/iam'

export interface AppContext extends DefaultContext {
  subject: {
    id: string
    roles: string[]
    attributes: {
      status: 'active' | 'banned' | 'suspended'
    }
  }
  resource: {
    type: 'comment' | 'post' | 'user' | 'dashboard'
    id?: string
    attributes: {
      ownerId: string
      status: 'draft' | 'published' | 'archived'
    }
  }
  resourceAttributes: {
    post: { ownerId: string; status: 'draft' | 'published' | 'archived'; title: string }
    comment: { ownerId: string; body: string }
    user: { email: string; status: 'active' | 'banned' }
    dashboard: { name: string }
  }
  environment: {
    hour: number
    dayOfWeek: number[]
    maintenanceMode: boolean
    ip?: string
  }
  scope: 'public' | 'private'
}

export const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete', 'list', 'manage'] as const,
  resources: ['comment', 'post', 'user', 'dashboard'] as const,
  scopes: ['public', 'private'] as const,
  roles: ['guest', 'member', 'moderator', 'admin', 'super-admin'] as const,
  context: {} as unknown as AppContext,
})

const { defineRole, validateRoles, policy } = access

// --- Roles ---

export const guest = defineRole('guest')
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

const roles = [guest, member, moderator, admin, superAdmin]

const validation = validateRoles(roles)
if (!validation.valid) {
  throw new Error(validation.issues.map((i) => i.message).join('\n'))
}

// --- Policies ---

export const bannedUserPolicy = policy('banned-users')
  .name('Banned Users')
  .desc('Hard block on banned accounts')
  .algorithm('deny-overrides')
  .rule(
    'block-banned',
    (r) =>
      r
        .deny()
        .on('*')
        .of('*')
        .when((w) => w.attr('status', 'eq', 'banned')),
    // 'status' autocompleted, 'banned' constrained to 'active' | 'banned' | 'suspended'
  )
  .build()

export const publishedOnlyPolicy = policy('published-only')
  .name('Published Content Only')
  .desc('Guests and members can only read published posts')
  .algorithm('deny-overrides')
  .rule('deny-draft-reads', (r) =>
    r
      .deny()
      .on('read')
      .of('post')
      .when(
        (w) =>
          w
            .resourceAttr('status', 'eq', 'draft')
            // 'status' autocompleted, 'draft' constrained to 'draft' | 'published' | 'archived'
            .not((w) => w.roles('moderator', 'admin', 'super-admin')),
        // role strings constrained to your roles union
      ),
  )
  .build()

export const maintenancePolicy = policy('maintenance-mode')
  .name('Maintenance Mode')
  .desc('Deny all write operations when maintenance flag is on')
  .algorithm('deny-overrides')
  .rule('deny-writes', (r) =>
    r
      .deny()
      .on('create', 'update', 'delete', 'manage')
      .of('*')
      .when((w) =>
        w
          .env('maintenanceMode', 'eq', true)
          // 'maintenanceMode' autocompleted, value constrained to boolean
          .not((w) => w.role('super-admin')),
      ),
  )
  .build()

export const businessHoursPolicy = policy('business-hours')
  .name('Business Hours Only')
  .desc('Writes are only allowed between 9am-5pm on weekdays')
  .algorithm('first-match')
  .rule('allow-admins-anytime', (r) =>
    r
      .allow()
      .on('*')
      .of('*')
      .when((w) => w.roles('admin', 'super-admin')),
  )
  .rule('deny-off-hours', (r) =>
    r
      .deny()
      .on('create', 'update', 'delete')
      .of('*')
      .when((w) =>
        w.or((w) =>
          w
            .env('hour', 'lt', 9)
            // 'hour' autocompleted, value constrained to number
            .env('hour', 'gte', 17),
        ),
      ),
  )
  .rule(
    'deny-weekends',
    (r) =>
      r
        .deny()
        .on('create', 'update', 'delete')
        .of('*')
        .when((w) => w.env('dayOfWeek', 'in', [0, 6])),
    // 'dayOfWeek' autocompleted, values constrained to number[]
  )
  .rule('allow-in-hours', (r) => r.allow().on('*').of('*'))
  .build()

export const dashboardPolicy = policy('dashboard-access')
  .name('Dashboard Access')
  .desc('Only admins and above can access the dashboard')
  .algorithm('deny-overrides')
  .rule('deny-non-admins', (r) =>
    r
      .deny()
      .on('*')
      .of('dashboard')
      .when((w) => w.not((w) => w.roles('admin', 'super-admin'))),
  )
  .build()

// -- Resource-narrowed policies (resourceAttr narrows by .of()) --

// .of('post') narrows resourceAttr to post keys: 'ownerId' | 'status' | 'title'
export const postTitlePolicy = policy('post-title-required')
  .name('Post Title Required')
  .desc('Deny creating posts without a title')
  .algorithm('deny-overrides')
  .rule(
    'deny-empty-title',
    (r) =>
      r
        .deny()
        .on('create', 'update')
        .of('post')
        .when((w) => w.not((w) => w.resourceAttr('title', 'exists'))),
    // 'title' autocompletes from post attrs, not available on comment/user/dashboard
  )
  .build()

// .of('comment') narrows resourceAttr to comment keys: 'ownerId' | 'body'
export const commentLengthPolicy = policy('comment-body-required')
  .name('Comment Body Required')
  .desc('Deny empty comments')
  .algorithm('deny-overrides')
  .rule(
    'deny-empty-body',
    (r) =>
      r
        .deny()
        .on('create')
        .of('comment')
        .when((w) => w.not((w) => w.resourceAttr('body', 'exists'))),
    // 'body' autocompletes from comment attrs, not available on post/user/dashboard
  )
  .build()

// .of('user') narrows resourceAttr to user keys: 'email' | 'status'
export const userEmailPolicy = policy('user-email-access')
  .name('User Email Access')
  .desc('Only admins can read user email addresses')
  .algorithm('deny-overrides')
  .rule('deny-email-access', (r) =>
    r
      .deny()
      .on('read')
      .of('user')
      .when((w) =>
        w
          .resourceAttr('email', 'exists')
          // 'email' autocompletes from user attrs only
          .not((w) => w.roles('admin', 'super-admin')),
      ),
  )
  .build()

// .of('dashboard') narrows resourceAttr to dashboard keys: 'name'
export const dashboardNamePolicy = policy('dashboard-named')
  .name('Dashboard Named Access')
  .desc('Deny access to unnamed dashboards for non-admins')
  .algorithm('deny-overrides')
  .rule('deny-unnamed', (r) =>
    r
      .deny()
      .on('read')
      .of('dashboard')
      .when((w) =>
        w
          .resourceAttr('name', 'eq', '')
          // 'name' autocompletes from dashboard attrs only
          .not((w) => w.roles('admin', 'super-admin')),
      ),
  )
  .build()

// .of('*') shows all keys across all resources: ownerId, status, title, body, email, name
export const globalOwnerPolicy = policy('global-owner')
  .name('Global Owner Check')
  .desc('Deny non-owners from deleting any resource')
  .algorithm('deny-overrides')
  .rule('deny-non-owner-delete', (r) =>
    r
      .deny()
      .on('delete')
      .of('*')
      .when((w) =>
        w
          .not((w) => w.resourceAttr('ownerId', 'eq', '$subject.id'))
          // '$subject.id' gets full autocomplete via DollarPaths -- no 'as string' cast needed
          // 'ownerId' available because it exists on post + comment (union of all)
          .not((w) => w.roles('admin', 'super-admin')),
      ),
  )
  .build()

// grantWhen also narrows: .grantWhen('update', 'post', ...) narrows to post attrs
export const author = defineRole('member')
  .name('Author')
  .desc('Can update own posts if they are still drafts')
  .grantWhen(
    'update',
    'post',
    (w) => w.isOwner().resourceAttr('status', 'eq', 'draft'),
    // 'status' narrows to 'draft' | 'published' | 'archived' (post attrs)
  )
  .build()

const policies = [
  bannedUserPolicy,
  publishedOnlyPolicy,
  maintenancePolicy,
  businessHoursPolicy,
  dashboardPolicy,
  postTitlePolicy,
  commentLengthPolicy,
  userEmailPolicy,
  dashboardNamePolicy,
  globalOwnerPolicy,
]

// --- Engine ---

const adapter = new MemoryAdapter({
  roles,
  policies,
  assignments: {
    'user-alice': ['member'],
    'user-bob': ['member'],
    'user-mod': ['moderator'],
    'user-admin': ['admin'],
  },
})

export const engine = access.createEngine({ adapter, defaultEffect: 'deny' })

// --- Typed checks ---

const alicePost = {
  type: 'post' as const,
  id: 'post-1',
  attributes: { ownerId: 'user-alice', status: 'published' as const },
}

const aliceDeletesOwn = await engine.can('user-alice', 'delete', alicePost)
console.log(aliceDeletesOwn) // true

const bobDeletesAlice = await engine.can('user-bob', 'delete', alicePost)
console.log(bobDeletesAlice) // false

const decision = await engine.check('user-bob', 'delete', alicePost)
console.log(decision.allowed)
console.log(decision.reason)

const modDeletesAlice = await engine.can('user-mod', 'delete', alicePost)
console.log(modDeletesAlice) // true

const privatePost = {
  type: 'post' as const,
  id: 'post-2',
  attributes: { ownerId: 'user-alice', status: 'published' as const },
}
const bobReadsPrivate = await engine.can('user-bob', 'read', privatePost, undefined, 'private')
console.log(bobReadsPrivate) // false

const _perms = await engine.permissions(
  'user-bob',
  access.checks([
    { action: 'read', resource: 'post' },
    { action: 'create', resource: 'post' },
    { action: 'update', resource: 'post', resourceId: 'post-1' },
    { action: 'delete', resource: 'post', resourceId: 'post-1' },
    { action: 'manage', resource: 'user' },
    // invalid actions/resources are compile errors here
  ]),
)

// --- DollarPaths: typed $-variable cross-references ---
//
// Values starting with '$' are resolved at runtime against the request context.
// DollarPaths<TContext> provides full autocomplete for these references.
// Type '$' in any value position and your editor suggests all valid paths:
//
//   '$subject.id'                  -- the requesting user's ID
//   '$subject.roles'               -- the user's role array
//   '$subject.attributes.status'   -- a subject attribute (autocompleted from AppContext)
//   '$resource.type'               -- the resource type
//   '$resource.id'                 -- the resource instance ID
//   '$resource.attributes.ownerId' -- a resource attribute (autocompleted)
//   '$environment.hour'            -- an environment value (autocompleted)

// 1. Using $ with .resourceAttr() -- compare resource owner to current user
const _ownerPolicy = policy('dollar-owner-demo')
  .name('Owner Only Updates')
  .desc('Only the owner can update their own posts')
  .algorithm('deny-overrides')
  .rule(
    'deny-non-owner',
    (r) =>
      r
        .deny()
        .on('update', 'delete')
        .of('post')
        .when((w) => w.resourceAttr('ownerId', 'neq', '$subject.id')),
    // '$subject.id' gets autocomplete -- no 'as string' cast needed
  )
  .build()

// 2. Using $ with .attr() -- compare subject attribute to a resource attribute
const _matchStatusPolicy = policy('dollar-status-demo')
  .name('Status Match')
  .desc('Deny if subject status matches the resource status (e.g. both banned)')
  .algorithm('deny-overrides')
  .rule(
    'deny-status-match',
    (r) =>
      r
        .deny()
        .on('*')
        .of('post')
        .when((w) => w.attr('status', 'eq', '$resource.attributes.status')),
    // '$resource.attributes.status' resolves at runtime to the post's status value
  )
  .build()

// 3. Using $ with .check() -- full dot-path on both sides
const _crossAttrPolicy = policy('dollar-cross-attr-demo')
  .name('Cross-Attribute Check')
  .desc('Compare any two fields from the request context')
  .algorithm('deny-overrides')
  .rule(
    'deny-self-action',
    (r) =>
      r
        .deny()
        .on('delete')
        .of('user')
        .when((w) => w.check('resource.id', 'eq', '$subjec')),
    // Deny users from deleting their own account -- resource.id == subject.id
  )
  .build()

// 4. Using $ with .env() -- compare environment value to a resource attribute
const _envCrossRefPolicy = policy('dollar-env-demo')
  .name('Env Cross-Reference')
  .desc('Deny if current IP matches a resource attribute')
  .algorithm('deny-overrides')
  .rule(
    'deny-ip-match',
    (r) =>
      r
        .deny()
        .on('read')
        .of('*')
        .when((w) => w.env('ip', 'eq', '$resource.attributes.ownerId')),
    // Silly example but shows env() also accepts $ refs with autocomplete
  )
  .build()
