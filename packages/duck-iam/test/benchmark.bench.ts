/**
 * Benchmark: @gentleduck/iam vs every JS authorization library
 *
 * Libraries tested (7 total):
 *   1. @gentleduck/iam  — policy engine (ABAC+RBAC)
 *   2. @casl/ability     — ability-based (ABAC)
 *   3. casbin            — model-file (PERM DSL)
 *   4. accesscontrol     — fluent grants (RBAC)
 *   5. role-acl          — role + conditions (RBAC+ABAC)
 *   6. @rbac/rbac        — hierarchical RBAC
 *   7. easy-rbac         — simple hierarchical RBAC
 *
 * METHODOLOGY:
 * - Each library solves the SAME authorization problem
 * - CASL condition checks use subject() to actually evaluate conditions
 * - Libraries without ABAC are excluded from condition scenarios
 * - N=3 inner loop to reduce vitest overhead on sub-microsecond ops
 */

import { AbilityBuilder, createMongoAbility, subject } from '@casl/ability'
import RBAC from '@rbac/rbac'
import { AccessControl } from 'accesscontrol'
import { newEnforcer, newModel, StringAdapter } from 'casbin'
import EasyRBAC from 'easy-rbac'
import * as RoleAcl from 'role-acl'
import { bench, describe } from 'vitest'
import { MemoryAdapter } from '../src/adapters/memory'
import { Engine } from '../src/core/engine/engine'
import { evaluate, evaluateFast, evaluatePolicy, evaluatePolicyFast } from '../src/core/evaluate'
import type { AccessRequest, Policy } from '../src/core/types'

// ===========================================================================
// 1. DUCK IAM SETUP
// ===========================================================================

const simplePolicy: Policy = {
  id: 'simple',
  algorithm: 'deny-overrides',
  rules: [
    { id: 'allow-read', effect: 'allow', actions: ['read'], resources: ['post'], conditions: {}, priority: 0 },
    {
      id: 'allow-write-admin',
      effect: 'allow',
      actions: ['write', 'delete'],
      resources: ['post'],
      conditions: { all: [{ field: 'subject.attributes.role', operator: 'eq', value: 'admin' }] },
      priority: 0,
    },
  ],
}

const conditionPolicy: Policy = {
  id: 'condition',
  algorithm: 'deny-overrides',
  rules: [
    {
      id: 'owner-edit',
      effect: 'allow',
      actions: ['update'],
      resources: ['post'],
      conditions: {
        all: [
          { field: 'subject.id', operator: 'eq', value: '$resource.attributes.ownerId' },
          { field: 'resource.attributes.status', operator: 'in', value: ['draft', 'review'] },
        ],
      },
      priority: 0,
    },
  ],
}

const policyWithTargets: Policy = {
  id: 'targeted',
  algorithm: 'deny-overrides',
  targets: { actions: ['read'], resources: ['post'] },
  rules: [
    { id: 'allow-read', effect: 'allow', actions: ['read'], resources: ['post'], conditions: {}, priority: 0 },
  ],
}

const simpleRequest: AccessRequest = {
  subject: { id: 'user-1', roles: ['viewer'], attributes: {} },
  action: 'read',
  resource: { type: 'post', attributes: {} },
}

const conditionRequest: AccessRequest = {
  subject: { id: 'user-1', roles: ['editor'], attributes: { role: 'editor' } },
  action: 'update',
  resource: { type: 'post', id: 'post-1', attributes: { ownerId: 'user-1', status: 'draft' } },
}

const adminRequest: AccessRequest = {
  subject: { id: 'admin-1', roles: ['admin'], attributes: { role: 'admin' } },
  action: 'delete',
  resource: { type: 'post', attributes: { role: 'admin' } },
}

const adapter = new MemoryAdapter({
  policies: [simplePolicy, conditionPolicy],
  roles: [
    { id: 'viewer', name: 'Viewer', permissions: [{ action: 'read', resource: 'post' }] },
    { id: 'editor', name: 'Editor', inherits: ['viewer'], permissions: [{ action: 'update', resource: 'post' }] },
    {
      id: 'admin',
      name: 'Admin',
      inherits: ['editor'],
      permissions: [
        { action: 'write', resource: 'post' },
        { action: 'delete', resource: 'post' },
        { action: 'create', resource: 'post' },
      ],
    },
  ],
  assignments: { 'user-1': ['viewer'], 'editor-1': ['editor'], 'admin-1': ['admin'] },
  attributes: { 'user-1': { role: 'viewer' }, 'editor-1': { role: 'editor' }, 'admin-1': { role: 'admin' } },
})
const engine = new Engine({ adapter, defaultEffect: 'deny' })
await engine.can('user-1', 'read', { type: 'post', attributes: {} })
await engine.can('admin-1', 'delete', { type: 'post', attributes: {} })

// ===========================================================================
// 2. CASL SETUP — conditions use subject() for real evaluation
// ===========================================================================

function buildCaslAbility() {
  const { can, build } = new AbilityBuilder(createMongoAbility)
  can('read', 'Post')
  can(['write', 'delete'], 'Post', { role: 'admin' })
  can('update', 'Post', { ownerId: 'user-1', status: { $in: ['draft', 'review'] } })
  return build()
}
const caslAbility = buildCaslAbility()
const caslPostForCondition = subject('Post', { ownerId: 'user-1', status: 'draft' })
const caslPostForAdmin = subject('Post', { role: 'admin' })

// ===========================================================================
// 3. CASBIN SETUP — real RBAC model with role inheritance
// ===========================================================================

const casbinModel = newModel()
casbinModel.addDef('r', 'r', 'sub, obj, act')
casbinModel.addDef('p', 'p', 'sub, obj, act')
casbinModel.addDef('g', 'g', '_, _')
casbinModel.addDef('e', 'e', 'some(where (p.eft == allow))')
casbinModel.addDef('m', 'm', 'g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act')
const casbinPolicy = new StringAdapter(
  'p, viewer, post, read\np, editor, post, update\np, admin, post, delete\np, admin, post, write\ng, editor, viewer\ng, admin, editor',
)
const casbinEnforcer = await newEnforcer(casbinModel, casbinPolicy)

// ===========================================================================
// 4. ACCESSCONTROL SETUP — fluent grants, RBAC only
// ===========================================================================

const ac = new AccessControl()
ac.grant('viewer').readAny('post')
ac.grant('editor').extend('viewer').updateOwn('post')
ac.grant('admin').extend('editor').deleteAny('post').createAny('post')

// ===========================================================================
// 5. ROLE-ACL SETUP — role + conditions
// ===========================================================================

const roleAcl = new RoleAcl.AccessControl()
roleAcl.grant('viewer').execute('read').on('post')
roleAcl.grant('editor').extend('viewer').execute('update').on('post')
roleAcl.grant('admin').extend('editor').execute('delete').on('post').execute('write').on('post')

// ===========================================================================
// 6. @RBAC/RBAC SETUP — hierarchical RBAC
// ===========================================================================

const rbacRbac = RBAC({ enableLogger: false })({
  viewer: { can: ['post:read'] },
  editor: { can: ['post:read', 'post:update'], inherits: ['viewer'] },
  admin: { can: ['post:read', 'post:update', 'post:delete', 'post:write'], inherits: ['editor'] },
})

// ===========================================================================
// 7. EASY-RBAC SETUP — simple hierarchical RBAC
// ===========================================================================

const easyRbac = new EasyRBAC({
  viewer: { can: ['post:read'] },
  editor: { can: ['post:read', 'post:update'], inherits: ['viewer'] },
  admin: { can: ['post:read', 'post:update', 'post:delete', 'post:write'], inherits: ['editor'] },
})

// ===========================================================================
// BENCHMARKS
// ===========================================================================

const N = 3

// ---------------------------------------------------------------------------
// 1. Simple RBAC: "can viewer read post?"
// ---------------------------------------------------------------------------

describe('Simple RBAC: can viewer read post?', () => {
  bench('@gentleduck/iam — evaluateFast() [PROD]', () => {
    for (let i = 0; i < N; i++) evaluateFast([simplePolicy], simpleRequest)
  })

  bench('@gentleduck/iam — evaluatePolicyFast() [PROD]', () => {
    for (let i = 0; i < N; i++) evaluatePolicyFast(simplePolicy, simpleRequest)
  })

  bench('@gentleduck/iam — evaluate() [DEV]', () => {
    for (let i = 0; i < N; i++) evaluate([simplePolicy], simpleRequest)
  })

  bench('@gentleduck/iam — evaluatePolicy() [DEV]', () => {
    for (let i = 0; i < N; i++) evaluatePolicy(simplePolicy, simpleRequest)
  })

  bench('@casl/ability', () => {
    for (let i = 0; i < N; i++) caslAbility.can('read', 'Post')
  })

  bench('casbin', async () => {
    for (let i = 0; i < N; i++) await casbinEnforcer.enforce('viewer', 'post', 'read')
  })

  bench('accesscontrol', () => {
    for (let i = 0; i < N; i++) ac.can('viewer').readAny('post')
  })

  bench('role-acl', async () => {
    for (let i = 0; i < N; i++) await roleAcl.can('viewer').execute('read').on('post')
  })

  bench('@rbac/rbac', async () => {
    for (let i = 0; i < N; i++) await rbacRbac.can('viewer', 'post:read')
  })

  bench('easy-rbac', async () => {
    for (let i = 0; i < N; i++) await easyRbac.can('viewer', 'post:read')
  })
})

// ---------------------------------------------------------------------------
// 2. ABAC condition: "can owner update own draft?"
//    Only libs with real condition evaluation are included.
// ---------------------------------------------------------------------------

describe('ABAC condition: can owner update own draft?', () => {
  bench('@gentleduck/iam — evaluateFast() [PROD]', () => {
    for (let i = 0; i < N; i++) evaluateFast([conditionPolicy], conditionRequest)
  })

  bench('@gentleduck/iam — evaluate() [DEV]', () => {
    for (let i = 0; i < N; i++) evaluate([conditionPolicy], conditionRequest)
  })

  bench('@casl/ability — subject()', () => {
    for (let i = 0; i < N; i++) caslAbility.can('update', caslPostForCondition)
  })

  // accesscontrol, casbin RBAC model, @rbac/rbac, easy-rbac: no ABAC conditions
})

// ---------------------------------------------------------------------------
// 3. Role + condition: "can admin delete post?"
// ---------------------------------------------------------------------------

describe('Role + condition: can admin delete post?', () => {
  bench('@gentleduck/iam', () => {
    for (let i = 0; i < N; i++) evaluate([simplePolicy], adminRequest)
  })

  bench('@casl/ability — subject()', () => {
    for (let i = 0; i < N; i++) caslAbility.can('delete', caslPostForAdmin)
  })

  bench('casbin', async () => {
    for (let i = 0; i < N; i++) await casbinEnforcer.enforce('admin', 'post', 'delete')
  })

  bench('accesscontrol', () => {
    for (let i = 0; i < N; i++) ac.can('admin').deleteAny('post')
  })

  bench('role-acl', async () => {
    for (let i = 0; i < N; i++) await roleAcl.can('admin').execute('delete').on('post')
  })

  bench('@rbac/rbac', async () => {
    for (let i = 0; i < N; i++) await rbacRbac.can('admin', 'post:delete')
  })

  bench('easy-rbac', async () => {
    for (let i = 0; i < N; i++) await easyRbac.can('admin', 'post:delete')
  })
})

// ---------------------------------------------------------------------------
// 4. Deny path: "viewer cannot delete post"
// ---------------------------------------------------------------------------

describe('Deny path: viewer cannot delete', () => {
  const denyRequest: AccessRequest = { ...simpleRequest, action: 'delete' }

  bench('@gentleduck/iam', () => {
    for (let i = 0; i < N; i++) evaluate([simplePolicy], denyRequest)
  })

  bench('@casl/ability', () => {
    for (let i = 0; i < N; i++) caslAbility.can('delete', subject('Post', {}))
  })

  bench('casbin', async () => {
    for (let i = 0; i < N; i++) await casbinEnforcer.enforce('viewer', 'post', 'delete')
  })

  bench('role-acl', async () => {
    for (let i = 0; i < N; i++) await roleAcl.can('viewer').execute('delete').on('post')
  })

  bench('@rbac/rbac', async () => {
    for (let i = 0; i < N; i++) await rbacRbac.can('viewer', 'post:delete')
  })

  bench('easy-rbac', async () => {
    for (let i = 0; i < N; i++) await easyRbac.can('viewer', 'post:delete').catch(() => false)
  })
})

// ---------------------------------------------------------------------------
// 5. Target optimization (duck-iam only)
// ---------------------------------------------------------------------------

describe('Target optimization (duck-iam only)', () => {
  bench('target match — evaluates rules', () => {
    for (let i = 0; i < N; i++) evaluatePolicy(policyWithTargets, simpleRequest)
  })

  bench('target skip — skips entire policy', () => {
    for (let i = 0; i < N; i++) evaluatePolicy(policyWithTargets, adminRequest)
  })
})

// ---------------------------------------------------------------------------
// 6. Batch: 20 permission checks
// ---------------------------------------------------------------------------

describe('Batch: 20 permission checks', () => {
  const actions = ['read', 'write', 'update', 'delete'] as const
  const checks = Array.from({ length: 20 }, (_, i) => actions[i % 4] as (typeof actions)[number])
  // Pre-allocate request objects to avoid spread overhead unfairly penalizing duck-iam
  const batchRequests = checks.map((action) => ({
    ...simpleRequest,
    action,
  }))

  bench('@gentleduck/iam — evaluateFast() x20 [PROD]', () => {
    for (let i = 0; i < 20; i++) evaluateFast([simplePolicy], batchRequests[i]!)
  })

  bench('@gentleduck/iam — evaluate() x20 [DEV]', () => {
    for (let i = 0; i < 20; i++) evaluate([simplePolicy], batchRequests[i]!)
  })

  bench('@casl/ability x20', () => {
    for (const action of checks) caslAbility.can(action, 'Post')
  })

  bench('casbin x20', async () => {
    for (const action of checks) await casbinEnforcer.enforce('viewer', 'post', action)
  })

  bench('accesscontrol x20', () => {
    for (const action of checks) {
      if (action === 'read') ac.can('viewer').readAny('post')
      else if (action === 'update') ac.can('editor').updateOwn('post')
      else if (action === 'delete') ac.can('admin').deleteAny('post')
      else ac.can('admin').createAny('post')
    }
  })

  bench('role-acl x20', async () => {
    for (const action of checks) await roleAcl.can('viewer').execute(action).on('post')
  })

  bench('@rbac/rbac x20', async () => {
    for (const action of checks) await rbacRbac.can('viewer', `post:${action}`)
  })

  bench('easy-rbac x20', async () => {
    for (const action of checks) {
      try {
        await easyRbac.can('viewer', `post:${action}`)
      } catch {
        // deny throws
      }
    }
  })
})

// ---------------------------------------------------------------------------
// 7. Engine.can() cached (duck-iam only)
// ---------------------------------------------------------------------------

describe('Engine.can() — cached (duck-iam only)', () => {
  bench('@gentleduck/iam — engine.can()', async () => {
    for (let i = 0; i < N; i++) await engine.can('user-1', 'read', { type: 'post', attributes: {} })
  })
})

// ---------------------------------------------------------------------------
// 8. Cold start: build + first check
// ---------------------------------------------------------------------------

describe('Cold start: build + first check', () => {
  bench('@gentleduck/iam', async () => {
    const a = new MemoryAdapter({
      policies: [simplePolicy],
      roles: [{ id: 'viewer', name: 'Viewer', permissions: [{ action: 'read', resource: 'post' }] }],
      assignments: { 'user-1': ['viewer'] },
      attributes: { 'user-1': {} },
    })
    const e = new Engine({ adapter: a, defaultEffect: 'deny' })
    await e.can('user-1', 'read', { type: 'post', attributes: {} })
  })

  bench('@casl/ability', () => {
    const { can, build } = new AbilityBuilder(createMongoAbility)
    can('read', 'Post')
    const ability = build()
    ability.can('read', 'Post')
  })

  bench('casbin', async () => {
    const m = newModel()
    m.addDef('r', 'r', 'sub, obj, act')
    m.addDef('p', 'p', 'sub, obj, act')
    m.addDef('g', 'g', '_, _')
    m.addDef('e', 'e', 'some(where (p.eft == allow))')
    m.addDef('m', 'm', 'g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act')
    const p = new StringAdapter('p, viewer, post, read')
    const e = await newEnforcer(m, p)
    await e.enforce('viewer', 'post', 'read')
  })

  bench('accesscontrol', () => {
    const a = new AccessControl()
    a.grant('viewer').readAny('post')
    a.can('viewer').readAny('post')
  })

  bench('role-acl', async () => {
    const a = new RoleAcl.AccessControl()
    a.grant('viewer').execute('read').on('post')
    await a.can('viewer').execute('read').on('post')
  })

  bench('@rbac/rbac', async () => {
    const r = RBAC({ enableLogger: false })({ viewer: { can: ['post:read'] } })
    await r.can('viewer', 'post:read')
  })

  bench('easy-rbac', async () => {
    const r = new EasyRBAC({ viewer: { can: ['post:read'] } })
    await r.can('viewer', 'post:read')
  })
})
