/**
 * Seed script for Duck-Business control-plane (SaaS backbone).
 *
 * What it seeds:
 * - Auth: users, user_identities, sessions, access_tokens, tokens (otp/reset/etc), api_keys
 * - Tenancy: tenants, tenant_domains, memberships, tenant_invites (+ invite roles)
 * - IAM: roles, permissions, role_permissions, membership_roles
 * - Audit: audit_logs
 * - Billing hooks: billing_customers, subscriptions
 *
 * How to run:
 * 1) Set DATABASE_URL
 *    DATABASE_URL=postgres://user:pass@localhost:5432/dbname
 *
 * 2) Run:
 *    pnpm tsx seed.ts
 *
 * Options:
 * - SEED_TRUNCATE=1        Truncate control-plane tables first (CASCADE)
 * - SEED_TAG=your_tag      Deterministic seed tag (IDs and strings become reproducible)
 * - SEED_SCALE=1           Multiplies sizes (ex: 0.2 for small, 2 for big)
 * - SEED_CHUNK=750         Insert chunk size (default 750)
 *
 * Notes:
 * - IDs are deterministic when SEED_TAG is set (useful for repeatable tests).
 * - Emails/usernames include the seed tag to avoid collisions without truncation.
 */

/* Run: DATABASE_URL=postgres://... pnpm tsx seed.ts */
/* Optional: SEED_TRUNCATE=1 SEED_TAG=dev SEED_SCALE=0.2 SEED_CHUNK=500 */

import { createHash, randomUUID } from 'node:crypto'
import { inArray, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// schema exports are camelCase (users, rolePermissions, accessTokens, tenantInvites, etc.)
const {
  users,
  userIdentities,
  tenants,
  tenantDomains,
  memberships,
  tenantInvites,
  tenantInviteRoles,

  roles,
  permissions,
  rolePermissions,
  membershipRoles,

  sessions,
  tokens,
  apiKeys,

  auditLogs,
  billingCustomers,
  subscriptions,
} = schema

type Id = string

type SeedCfg = {
  users: number
  tenants: number
  membershipsPerTenant: number
  sessionsPerUserMin: number
  sessionsPerUserMax: number

  invitesPerTenant: number
  tokenHistoryPerUserPurpose: number
  auditLogsPerTenant: number
  tenantsWithDomainRate: number
  tenantsWithBillingRate: number
  insertChunkSize: number
}

const BASE_CFG: SeedCfg = {
  users: 5000,
  tenants: 500,
  membershipsPerTenant: 30, // includes owner
  sessionsPerUserMin: 1,
  sessionsPerUserMax: 3,

  invitesPerTenant: 5,
  tokenHistoryPerUserPurpose: 3, // extra used/inactive tokens per purpose
  auditLogsPerTenant: 200,
  tenantsWithDomainRate: 0.35,
  tenantsWithBillingRate: 0.25,
  insertChunkSize: 750,
}

function envNum(name: string, fallback: number): number {
  const v = process.env[name]
  if (!v) return fallback
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function buildCfg(): SeedCfg {
  const scale = Math.max(0, envNum('SEED_SCALE', 1))
  const chunkSize = Math.max(50, Math.floor(envNum('SEED_CHUNK', BASE_CFG.insertChunkSize)))

  const scaled = (n: number) => Math.max(1, Math.floor(n * scale))

  return {
    ...BASE_CFG,
    users: scaled(BASE_CFG.users),
    tenants: scaled(BASE_CFG.tenants),
    membershipsPerTenant: Math.max(2, Math.floor(BASE_CFG.membershipsPerTenant * scale)),
    auditLogsPerTenant: Math.max(5, Math.floor(BASE_CFG.auditLogsPerTenant * scale)),
    insertChunkSize: chunkSize,
  }
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

function randInt(seed: number): () => number {
  // xorshift32
  let x = seed >>> 0
  return () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return (x >>> 0) / 0xffffffff
  }
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]!
}

function dateRandomPast(rng: () => number, maxDaysBack: number): Date {
  const days = Math.floor(rng() * maxDaysBack)
  const hours = Math.floor(rng() * 24)
  const mins = Math.floor(rng() * 60)
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  d.setUTCHours(d.getUTCHours() - hours)
  d.setUTCMinutes(d.getUTCMinutes() - mins)
  return d
}

function makeSeedTag(): string {
  const t = Date.now().toString(36)
  const r = sha256Hex(randomUUID()).slice(0, 8)
  return `seed_${t}_${r}`
}

function bytesToUuidV4(b: Uint8Array): string {
  // Force v4 + RFC4122 variant
  b[6] = (b[6]! & 0x0f) | 0x40
  b[8] = (b[8]! & 0x3f) | 0x80

  const hex = Buffer.from(b).toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

function makeIdFactory(seedTag: string) {
  let counter = 0
  return (ns: string, hint?: string | number): Id => {
    counter++
    const h = createHash('sha256')
      .update(`${seedTag}:${ns}:${String(hint ?? '')}:${counter}`)
      .digest()
    return bytesToUuidV4(h.subarray(0, 16))
  }
}

function buildPermissionKeys(): Array<{ key: string; description: string }> {
  const actions = ['read', 'write', 'delete', 'manage'] as const
  const extra = ['export', 'import', 'approve', 'cancel', 'retry'] as const

  const domains: Array<{ ns: string; entities: string[] }> = [
    { ns: 'auth', entities: ['sessions', 'tokens', 'users'] },
    { ns: 'admin', entities: ['users', 'tenants', 'roles', 'permissions', 'memberships', 'audit'] },
    { ns: 'tenant', entities: ['members', 'invites', 'settings'] },
    { ns: 'rbac', entities: ['roles', 'permissions'] },
    { ns: 'parcel', entities: ['parcels', 'events', 'labels', 'hubs'] },
    { ns: 'inventory', entities: ['items', 'locations', 'adjustments'] },
    { ns: 'orders', entities: ['orders', 'fulfillment', 'returns', 'status'] },
    { ns: 'webhook', entities: ['endpoints', 'deliveries', 'events'] },
    { ns: 'billing', entities: ['plans', 'subscriptions', 'invoices'] },
    { ns: 'settings', entities: ['general', 'security', 'integrations'] },
    { ns: 'reports', entities: ['usage', 'activity', 'exports'] },
  ]

  const keys: Array<{ key: string; description: string }> = []

  for (const d of domains) {
    for (const e of d.entities) {
      for (const a of actions) {
        const key = `${d.ns}:${e}.${a}`
        keys.push({ key, description: `${d.ns} ${e} ${a}` })
      }
    }
  }

  for (const a of actions) keys.push({ key: `platform:${a}`, description: `platform ${a}` })
  for (const a of extra) keys.push({ key: `parcel:parcels.${a}`, description: `parcel parcels ${a}` })
  for (const a of extra) keys.push({ key: `orders:orders.${a}`, description: `orders orders ${a}` })
  for (const a of extra) keys.push({ key: `webhook:deliveries.${a}`, description: `webhook deliveries ${a}` })

  const seen = new Set<string>()
  return keys.filter((x) => (seen.has(x.key) ? false : (seen.add(x.key), true)))
}

async function insertInChunks<T>(db: any, table: any, rows: T[], size: number, opts?: { onConflict?: boolean }) {
  for (const part of chunk(rows, size)) {
    const q = db.insert(table).values(part)
    if (opts?.onConflict) await q.onConflictDoNothing()
    else await q
  }
}

async function main() {
  const CFG = buildCfg()

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL is required')

  const seedTag = process.env.SEED_TAG?.trim() || makeSeedTag()
  const makeId = makeIdFactory(seedTag)
  const rng = randInt(Number.parseInt(sha256Hex(seedTag).slice(0, 8), 16))

  const client = postgres(databaseUrl, { max: 10 })
  const db = drizzle(client, { schema })

  console.log(`seed start: ${seedTag}`)
  console.log({ cfg: CFG })

  if (process.env.SEED_TRUNCATE === '1') {
    console.log('truncating control-plane tables...')
    await db.execute(sql`
      TRUNCATE TABLE
        sessions,
        api_keys,
        tokens,
        tenant_invite_roles,
        tenant_invites,
        membership_roles,
        role_permissions,
        memberships,
        roles,
        permissions,
        tenant_domains,
        tenants,
        user_identities,
        users,
        audit_logs,
        billing_customers,
        subscriptions
      CASCADE
    `)
  }

  // ---------------------------------------------------------------------------
  // USERS + IDENTITIES
  // ---------------------------------------------------------------------------

  console.log('seeding users + identities...')

  const userIds: Id[] = []
  const userRows: Array<typeof users.$inferInsert> = []
  const identityRows: Array<typeof userIdentities.$inferInsert> = []

  // constant bcrypt hash (example password): "Password123!"
  const bcryptHash = '$2b$10$R0L0cfa9ro3taVBfoLm.p.HgH.3znhR2lF8SO9ImYnuGg1jk2tpa2'

  const avatarUrls = [
    'https://react-beautiful-dnd.netlify.app/static/media/jake-min.cc34aede.png',
    'https://react-beautiful-dnd.netlify.app/static/media/bmo-min.9c65ecdf.png',
    'https://react-beautiful-dnd.netlify.app/static/media/finn-min.0a5700c4.png',
    'https://react-beautiful-dnd.netlify.app/static/media/princess-min.34218e29.png',
  ]

  for (let i = 0; i < CFG.users; i++) {
    const id = makeId('user', i)
    userIds.push(id)

    const isActive = rng() > 0.03
    const lastLoginAt = rng() > 0.15 ? dateRandomPast(rng, 120) : null

    userRows.push({
      id,
      email: `${seedTag}.user${i}@seed.local`,
      username: `${seedTag}_user_${i}`,
      firstName: `First${i}`,
      lastName: `Last${i}`,
      avatarUrl: rng() > 0.1 ? pick(rng, avatarUrls) : null,
      isActive,
      lastLoginAt: lastLoginAt ?? undefined,
      settings: { theme: rng() > 0.5 ? 'dark' : 'light', seed: seedTag },
      version: 1,
      deletedAt: undefined,
    })

    identityRows.push({
      id: makeId('identity', i),
      userId: id,
      provider: 'password',
      providerUserId: null,
      passwordHash: bcryptHash,
      emailVerifiedAt: rng() > 0.35 ? dateRandomPast(rng, 90) : null,
      deletedAt: undefined,
    })
  }

  await insertInChunks(db, users, userRows, CFG.insertChunkSize)
  await insertInChunks(db, userIdentities, identityRows, CFG.insertChunkSize)

  // ---------------------------------------------------------------------------
  // TENANTS + DOMAINS
  // ---------------------------------------------------------------------------

  console.log('seeding tenants + domains...')

  const tenantIds: Id[] = []
  const tenantOwnerByTenant = new Map<Id, Id>()
  const tenantRows: Array<typeof tenants.$inferInsert> = []
  const domainRows: Array<typeof tenantDomains.$inferInsert> = []

  for (let i = 0; i < CFG.tenants; i++) {
    const id = makeId('tenant', i)
    tenantIds.push(id)

    const ownerUserId = userIds[i % userIds.length]!
    tenantOwnerByTenant.set(id, ownerUserId)

    tenantRows.push({
      id,
      name: `Tenant ${seedTag} ${i}`,
      slug: `${seedTag}-tenant-${i}`,
      ownerUserId,
      isActive: rng() > 0.02,
      settings: { plan: rng() > 0.85 ? 'pro' : 'starter', seed: seedTag },
      deletedAt: undefined,
    })

    if (rng() < CFG.tenantsWithDomainRate) {
      domainRows.push({
        id: makeId('tenant_domain', i),
        tenantId: id,
        domain: `${seedTag}-t${i}.example.local`,
        isPrimary: true,
        verifiedAt: rng() > 0.25 ? dateRandomPast(rng, 60) : null,
        deletedAt: undefined,
      })
    }
  }

  await insertInChunks(db, tenants, tenantRows, CFG.insertChunkSize)
  if (domainRows.length) await insertInChunks(db, tenantDomains, domainRows, CFG.insertChunkSize)

  // ---------------------------------------------------------------------------
  // ROLES (system + per-tenant)
  // ---------------------------------------------------------------------------

  console.log('seeding roles...')

  const systemRoleIds: Record<string, Id> = {}
  const tenantRoleIds = new Map<Id, { owner: Id; admin: Id; member: Id; viewer: Id }>()
  const roleRows: Array<typeof roles.$inferInsert> = []

  // System roles
  for (const name of ['system_admin', 'support', 'billing'] as const) {
    const id = makeId('role_system', name)
    systemRoleIds[name] = id
    roleRows.push({
      id,
      scope: 'system',
      tenantId: null,
      name,
      description: `System role: ${name}`,
      deletedAt: undefined,
    })
  }

  // Tenant roles per tenant
  for (let i = 0; i < tenantIds.length; i++) {
    const tenantId = tenantIds[i]!

    const ownerId = makeId('role_owner', tenantId)
    const adminId = makeId('role_admin', tenantId)
    const memberId = makeId('role_member', tenantId)
    const viewerId = makeId('role_viewer', tenantId)

    tenantRoleIds.set(tenantId, { owner: ownerId, admin: adminId, member: memberId, viewer: viewerId })

    roleRows.push(
      {
        id: ownerId,
        scope: 'tenant',
        tenantId,
        name: 'owner',
        description: 'Full access (tenant owner)',
        deletedAt: undefined,
      },
      {
        id: adminId,
        scope: 'tenant',
        tenantId,
        name: 'admin',
        description: 'Admin access',
        deletedAt: undefined,
      },
      {
        id: memberId,
        scope: 'tenant',
        tenantId,
        name: 'member',
        description: 'Standard member',
        deletedAt: undefined,
      },
      {
        id: viewerId,
        scope: 'tenant',
        tenantId,
        name: 'viewer',
        description: 'Read-only member',
        deletedAt: undefined,
      },
    )
  }

  await insertInChunks(db, roles, roleRows, CFG.insertChunkSize, { onConflict: true })

  // ---------------------------------------------------------------------------
  // PERMISSIONS + ROLE_PERMISSIONS
  // ---------------------------------------------------------------------------

  console.log('seeding permissions + role_permissions...')

  const permKeys = buildPermissionKeys()
  const permissionRows: Array<typeof permissions.$inferInsert> = permKeys.map((p, i) => ({
    id: makeId('perm', i),
    key: p.key,
    description: p.description,
  }))

  await insertInChunks(db, permissions, permissionRows, CFG.insertChunkSize, { onConflict: true })

  const permissionIdByKey = new Map<string, Id>()
  {
    const rows = await db
      .select({ id: permissions.id, key: permissions.key })
      .from(permissions)
      .where(
        inArray(
          permissions.key,
          permKeys.map((p) => p.key),
        ),
      )
    for (const r of rows) permissionIdByKey.set(r.key, r.id)
  }

  const keysByPrefix = (prefix: string) => permKeys.filter((p) => p.key.startsWith(prefix)).map((p) => p.key)
  const readOnlyKeys = permKeys.filter((p) => p.key.endsWith('.read') || p.key.endsWith(':read')).map((p) => p.key)

  const opsKeys = [
    ...keysByPrefix('parcel:'),
    ...keysByPrefix('inventory:'),
    ...keysByPrefix('orders:'),
    ...keysByPrefix('webhook:'),
  ]

  const adminKeys = [
    ...keysByPrefix('admin:'),
    ...keysByPrefix('tenant:'),
    ...keysByPrefix('rbac:'),
    ...keysByPrefix('auth:'),
    ...keysByPrefix('settings:'),
    ...keysByPrefix('reports:'),
  ]

  const allKeys = permKeys.map((p) => p.key)

  function keysToRolePermRows(roleId: Id, keys: string[]) {
    const out: Array<typeof rolePermissions.$inferInsert> = []
    for (const k of keys) {
      const pid = permissionIdByKey.get(k)
      if (!pid) continue
      out.push({ roleId, permissionId: pid })
    }
    return out
  }

  const rolePermRows: Array<typeof rolePermissions.$inferInsert> = []

  rolePermRows.push(...keysToRolePermRows(systemRoleIds.system_admin!, allKeys))
  rolePermRows.push(
    ...keysToRolePermRows(systemRoleIds.support!, [
      ...readOnlyKeys,
      ...keysByPrefix('auth:'),
      ...keysByPrefix('admin:'),
    ]),
  )
  rolePermRows.push(
    ...keysToRolePermRows(systemRoleIds.billing!, [...keysByPrefix('billing:'), ...keysByPrefix('reports:')]),
  )

  for (const tenantId of tenantIds) {
    const r = tenantRoleIds.get(tenantId)!
    rolePermRows.push(...keysToRolePermRows(r.owner, allKeys))
    rolePermRows.push(...keysToRolePermRows(r.admin, Array.from(new Set([...allKeys, ...adminKeys]))))
    rolePermRows.push(...keysToRolePermRows(r.member, Array.from(new Set([...opsKeys, ...readOnlyKeys]))))
    rolePermRows.push(...keysToRolePermRows(r.viewer, readOnlyKeys))
  }

  await insertInChunks(db, rolePermissions, rolePermRows, CFG.insertChunkSize, { onConflict: true })

  // ---------------------------------------------------------------------------
  // MEMBERSHIPS + MEMBERSHIP_ROLES (multi-role SaaS)
  // ---------------------------------------------------------------------------

  console.log('seeding memberships + membership_roles...')

  const userTenantMap = new Map<Id, Id[]>()
  const membershipRows: Array<typeof memberships.$inferInsert> = []
  const membershipRoleRows: Array<typeof membershipRoles.$inferInsert> = []

  function addUserTenant(userId: Id, tenantId: Id) {
    const arr = userTenantMap.get(userId)
    if (!arr) userTenantMap.set(userId, [tenantId])
    else arr.push(tenantId)
  }

  for (let t = 0; t < tenantIds.length; t++) {
    const tenantId = tenantIds[t]!
    const ownerUserId = tenantOwnerByTenant.get(tenantId)!
    const roleSet = tenantRoleIds.get(tenantId)!

    const ownerMembershipId = makeId('membership_owner', tenantId)
    membershipRows.push({
      id: ownerMembershipId,
      tenantId,
      userId: ownerUserId,
      status: 'active',
      deletedAt: undefined,
    })
    membershipRoleRows.push({ membershipId: ownerMembershipId, roleId: roleSet.owner })
    addUserTenant(ownerUserId, tenantId)

    const used = new Set<Id>([ownerUserId])
    const target = CFG.membershipsPerTenant - 1

    for (let j = 0; j < target; j++) {
      let uid: Id
      for (;;) {
        uid = userIds[Math.floor(rng() * userIds.length)]!
        if (!used.has(uid)) break
      }
      used.add(uid)

      const roll = rng()
      const primaryRoleId = roll < 0.08 ? roleSet.admin : roll < 0.75 ? roleSet.member : roleSet.viewer
      const status = roll < 0.92 ? 'active' : roll < 0.97 ? 'invited' : 'suspended'

      const mid = makeId('membership', `${tenantId}:${uid}`)
      membershipRows.push({
        id: mid,
        tenantId,
        userId: uid,
        status,
        deletedAt: undefined,
      })
      membershipRoleRows.push({ membershipId: mid, roleId: primaryRoleId })

      // Sometimes add a second role to test multi-role behavior
      if (status === 'active' && rng() < 0.12 && primaryRoleId !== roleSet.viewer) {
        const extraRole = rng() < 0.7 ? roleSet.viewer : roleSet.member
        if (extraRole !== primaryRoleId) membershipRoleRows.push({ membershipId: mid, roleId: extraRole })
      }

      addUserTenant(uid, tenantId)
    }
  }

  await insertInChunks(db, memberships, membershipRows, CFG.insertChunkSize)
  await insertInChunks(db, membershipRoles, membershipRoleRows, CFG.insertChunkSize, { onConflict: true })

  // ---------------------------------------------------------------------------
  // TENANT INVITES + INVITE ROLES
  // ---------------------------------------------------------------------------

  console.log('seeding tenant_invites + tenant_invite_roles...')

  const inviteRows: Array<typeof tenantInvites.$inferInsert> = []
  const inviteRoleRows: Array<typeof tenantInviteRoles.$inferInsert> = []

  for (let t = 0; t < tenantIds.length; t++) {
    const tenantId = tenantIds[t]!
    const ownerUserId = tenantOwnerByTenant.get(tenantId)!
    const roleSet = tenantRoleIds.get(tenantId)!

    for (let j = 0; j < CFG.invitesPerTenant; j++) {
      const statusRoll = rng()
      const status =
        statusRoll < 0.75 ? 'pending' : statusRoll < 0.9 ? 'accepted' : statusRoll < 0.97 ? 'revoked' : 'expired'

      const email = `${seedTag}.invite_t${t}_u${j}@seed.local`
      const inviteTokenHash = sha256Hex(`${seedTag}:invite:${tenantId}:${email}`)

      const createdAt = dateRandomPast(rng, 40)
      const expiresAt = new Date(createdAt)
      expiresAt.setUTCDate(expiresAt.getUTCDate() + 7)

      const inviteId = makeId('invite', `${tenantId}:${j}`)

      const acceptedByUserId = status === 'accepted' ? pick(rng, userIds) : null
      const acceptedAt = status === 'accepted' ? dateRandomPast(rng, 10) : null
      const revokedAt = status === 'revoked' ? dateRandomPast(rng, 10) : null

      inviteRows.push({
        id: inviteId,
        tenantId,
        email,
        invitedByUserId: rng() > 0.05 ? ownerUserId : null,
        acceptedByUserId,
        inviteTokenHash,
        status,
        expiresAt,
        acceptedAt,
        revokedAt,
        createdAt,
      })

      // role assignment for invite (multi-role)
      const r1 = statusRoll < 0.2 ? roleSet.admin : roleSet.member
      inviteRoleRows.push({ inviteId, roleId: r1 })

      if (rng() < 0.15) inviteRoleRows.push({ inviteId, roleId: roleSet.viewer })
    }
  }

  await insertInChunks(db, tenantInvites, inviteRows, CFG.insertChunkSize, { onConflict: true })
  await insertInChunks(db, tenantInviteRoles, inviteRoleRows, CFG.insertChunkSize, { onConflict: true })

  // ---------------------------------------------------------------------------
  // SESSIONS + ACCESS TOKENS
  // ---------------------------------------------------------------------------

  console.log('seeding sessions + access_tokens...')

  const sessionRows: Array<typeof sessions.$inferInsert> = []

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i]!
    const count = CFG.sessionsPerUserMin + Math.floor(rng() * (CFG.sessionsPerUserMax - CFG.sessionsPerUserMin + 1))

    const userTenants = userTenantMap.get(userId) ?? []
    for (let s = 0; s < count; s++) {
      const sid = makeId('session', `${userId}:${s}`)

      const tenantId = userTenants.length ? pick(rng, userTenants) : null
      const createdAt = dateRandomPast(rng, 60)
      const expiresAt = new Date(createdAt)
      expiresAt.setUTCDate(expiresAt.getUTCDate() + 30)

      const statusRoll = rng()
      const status =
        statusRoll < 0.82 ? 'active' : statusRoll < 0.9 ? 'revoked' : statusRoll < 0.97 ? 'rotated' : 'expired'

      const sessionTokenHash = sha256Hex(`${seedTag}:session:${sid}:${userId}`)

      sessionRows.push({
        id: sid,
        userId,
        tenantId,
        sessionTokenHash,
        status,
        ip: rng() > 0.5 ? `10.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}` : null,
        userAgent: rng() > 0.5 ? 'seed-agent/1.0' : 'seed-agent/2.0',
        lastUsedAt: rng() > 0.2 ? dateRandomPast(rng, 20) : null,
        revokedAt: status === 'revoked' ? dateRandomPast(rng, 30) : null,
        expiresAt,
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
      })
    }
  }

  await insertInChunks(db, sessions, sessionRows, CFG.insertChunkSize)

  // ---------------------------------------------------------------------------
  // SHORT-LIVED TOKENS (OTP / RESET / MFA)
  // ---------------------------------------------------------------------------

  console.log('seeding tokens (otp/reset/mfa)...')

  const tokenRows: Array<typeof tokens.$inferInsert> = []
  const purposes: Array<(typeof schema.TOKEN_PURPOSE_VALUES)[number]> = ['email_verify', 'password_reset', 'login_otp']

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i]!
    const userTenants = userTenantMap.get(userId) ?? []
    const tenantId = userTenants.length ? pick(rng, userTenants) : null

    for (const p of purposes) {
      // one "active" token
      {
        const createdAt = dateRandomPast(rng, 10)
        const expiresAt = new Date(createdAt)
        expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() + 10)

        tokenRows.push({
          id: makeId('token_active', `${userId}:${p}`),
          tenantId,
          userId,
          purpose: p,
          status: 'active',
          tokenHash: sha256Hex(`${seedTag}:token:${userId}:${p}:active`),
          attempts: Math.floor(rng() * 2),
          meta: { seed: seedTag, purpose: p },
          expiresAt,
          usedAt: null,
          revokedAt: null,
          createdAt,
        })
      }

      // history tokens
      for (let h = 0; h < CFG.tokenHistoryPerUserPurpose; h++) {
        const createdAt = dateRandomPast(rng, 30)
        const expiresAt = new Date(createdAt)
        expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() + 10)

        const used = rng() > 0.35
        const st = used ? 'used' : rng() > 0.5 ? 'expired' : 'revoked'

        tokenRows.push({
          id: makeId('token_hist', `${userId}:${p}:${h}`),
          tenantId,
          userId,
          purpose: p,
          status: st,
          tokenHash: sha256Hex(`${seedTag}:token:${userId}:${p}:hist:${h}`),
          attempts: Math.floor(rng() * 6),
          meta: { seed: seedTag, purpose: p, hist: h },
          expiresAt,
          usedAt: used ? dateRandomPast(rng, 25) : null,
          revokedAt: st === 'revoked' ? dateRandomPast(rng, 25) : null,
          createdAt,
        })
      }
    }

    // some MFA challenges
    if (rng() < 0.08) {
      const createdAt = dateRandomPast(rng, 14)
      const expiresAt = new Date(createdAt)
      expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() + 5)
      tokenRows.push({
        id: makeId('token_mfa', userId),
        tenantId,
        userId,
        purpose: 'mfa_challenge',
        status: rng() < 0.7 ? 'used' : 'expired',
        tokenHash: sha256Hex(`${seedTag}:token:${userId}:mfa`),
        attempts: Math.floor(rng() * 3),
        meta: { seed: seedTag, purpose: 'mfa_challenge' },
        expiresAt,
        usedAt: rng() < 0.7 ? dateRandomPast(rng, 10) : null,
        revokedAt: null,
        createdAt,
      })
    }
  }

  await insertInChunks(db, tokens, tokenRows, CFG.insertChunkSize, { onConflict: true })

  // ---------------------------------------------------------------------------
  // API KEYS (tenant-scoped)
  // ---------------------------------------------------------------------------

  console.log('seeding api_keys...')

  const apiKeyRows: Array<typeof apiKeys.$inferInsert> = []
  for (let t = 0; t < tenantIds.length; t++) {
    const tenantId = tenantIds[t]!
    const n = rng() < 0.2 ? 0 : rng() < 0.75 ? 1 : 2
    for (let k = 0; k < n; k++) {
      const raw = `${seedTag}:apikey:${tenantId}:${k}`
      apiKeyRows.push({
        id: makeId('api_key', `${tenantId}:${k}`),
        tenantId,
        name: k === 0 ? 'default' : `key_${k}`,
        keyHash: sha256Hex(raw),
        lastUsedAt: rng() < 0.5 ? dateRandomPast(rng, 30) : null,
        revokedAt: rng() < 0.05 ? dateRandomPast(rng, 20) : null,
        deletedAt: null,
      })
    }
  }
  if (apiKeyRows.length) await insertInChunks(db, apiKeys, apiKeyRows, CFG.insertChunkSize, { onConflict: true })

  // ---------------------------------------------------------------------------
  // BILLING (hooks)
  // ---------------------------------------------------------------------------

  console.log('seeding billing...')

  const billingCustomerRows: Array<typeof billingCustomers.$inferInsert> = []
  const subscriptionRows: Array<typeof subscriptions.$inferInsert> = []

  for (let t = 0; t < tenantIds.length; t++) {
    const tenantId = tenantIds[t]!
    if (rng() >= CFG.tenantsWithBillingRate) continue

    const provider = 'stripe'
    const customerId = `cus_${sha256Hex(`${seedTag}:${tenantId}`).slice(0, 12)}`
    billingCustomerRows.push({
      id: makeId('billing_customer', tenantId),
      tenantId,
      provider,
      providerCustomerId: customerId,
    })

    const planKey = rng() > 0.75 ? 'pro' : 'starter'
    const status = rng() > 0.12 ? 'active' : 'trialing'
    const subId = `sub_${sha256Hex(`${seedTag}:${tenantId}:sub`).slice(0, 12)}`
    const now = new Date()
    const end = new Date(now)
    end.setUTCDate(end.getUTCDate() + 30)

    subscriptionRows.push({
      id: makeId('subscription', tenantId),
      tenantId,
      provider,
      providerSubscriptionId: subId,
      planKey,
      status,
      currentPeriodEnd: end,
    })
  }

  if (billingCustomerRows.length) await insertInChunks(db, billingCustomers, billingCustomerRows, CFG.insertChunkSize)
  if (subscriptionRows.length) await insertInChunks(db, subscriptions, subscriptionRows, CFG.insertChunkSize)

  // ---------------------------------------------------------------------------
  // AUDIT LOGS
  // ---------------------------------------------------------------------------

  console.log('seeding audit_logs...')

  const actions = [
    'auth.login',
    'auth.logout',
    'auth.refresh',
    'tenant.create',
    'tenant.member.add',
    'tenant.member.remove',
    'rbac.role.create',
    'rbac.role.update',
    'rbac.permission.assign',
    'session.revoke',
    'invite.create',
    'invite.accept',
    'billing.subscription.update',
  ] as const

  const auditBatch: Array<typeof auditLogs.$inferInsert> = []
  const flushAuditBatch = async () => {
    if (!auditBatch.length) return
    await db.insert(auditLogs).values(auditBatch.splice(0, auditBatch.length))
  }

  const apiKeyIdsByTenant = new Map<Id, Id[]>()
  for (const r of apiKeyRows) {
    const arr = apiKeyIdsByTenant.get(r.tenantId) ?? []
    arr.push(r.id as string)
    apiKeyIdsByTenant.set(r.tenantId, arr)
  }

  for (let t = 0; t < tenantIds.length; t++) {
    const tenantId = tenantIds[t]!
    const ownerUserId = tenantOwnerByTenant.get(tenantId)!

    const actorPool: Id[] = [ownerUserId]
    for (let i = 0; i < 8; i++) actorPool.push(userIds[Math.floor(rng() * userIds.length)]!)

    const tenantApiKeys = apiKeyIdsByTenant.get(tenantId) ?? []

    for (let j = 0; j < CFG.auditLogsPerTenant; j++) {
      const createdAt = dateRandomPast(rng, 45)
      const action = pick(rng, actions as unknown as string[])

      const actorRoll = rng()
      const actorType = actorRoll < 0.9 ? 'user' : tenantApiKeys.length ? 'api_key' : 'system'
      const actorUserId = actorType === 'user' ? pick(rng, actorPool) : null
      const actorApiKeyId = actorType === 'api_key' ? pick(rng, tenantApiKeys) : null

      auditBatch.push({
        id: makeId('audit', `${tenantId}:${j}`),
        tenantId,
        actorType,
        actorUserId,
        actorApiKeyId,
        action,
        targetType: rng() > 0.5 ? 'user' : rng() > 0.5 ? 'role' : 'tenant',
        targetId: rng() > 0.6 ? pick(rng, userIds) : null,
        requestId: `req_${sha256Hex(`${seedTag}:${tenantId}:${j}`).slice(0, 12)}`,
        metadata: { seed: seedTag, n: j, tenant: t, ok: true },
        ip: rng() > 0.5 ? `172.16.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}` : null,
        userAgent: rng() > 0.5 ? 'seed-agent/1.0' : 'seed-agent/2.0',
        createdAt,
      })

      if (auditBatch.length >= CFG.insertChunkSize) await flushAuditBatch()
    }
  }
  await flushAuditBatch()

  await client.end({ timeout: 5 })

  console.log(`seed complete: ${seedTag}`)
  console.log({
    users: CFG.users,
    tenants: CFG.tenants,
    permissions: permKeys.length,
    roles: roleRows.length,
    memberships: membershipRows.length,
    membershipRoles: membershipRoleRows.length,
    sessions: sessionRows.length,

    invites: inviteRows.length,
    inviteRoles: inviteRoleRows.length,
    tokens: tokenRows.length,
    apiKeys: apiKeyRows.length,
    billingCustomers: billingCustomerRows.length,
    subscriptions: subscriptionRows.length,
    auditLogs: CFG.tenants * CFG.auditLogsPerTenant,
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
