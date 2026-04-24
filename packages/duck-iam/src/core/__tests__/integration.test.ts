import { describe, expect, it } from 'vitest'
import { MemoryAdapter } from '../../adapters/memory'
import { createAccessConfig } from '../config'

describe('Integration: config → engine → evaluate', () => {
  const access = createAccessConfig({
    actions: ['create', 'read', 'update', 'delete'] as const,
    resources: ['post', 'comment'] as const,
    roles: ['viewer', 'editor', 'admin'] as const,
    scopes: ['org-1', 'org-2'] as const,
  })

  const viewer = access.defineRole('viewer').name('Viewer').grantRead('post', 'comment').build()

  const editor = access
    .defineRole('editor')
    .name('Editor')
    .inherits('viewer')
    .grant('create', 'post')
    .grant('update', 'post')
    .grantWhen('delete', 'post', (w) => w.isOwner())
    .build()

  const admin = access
    .defineRole('admin')
    .name('Admin')
    .inherits('editor')
    .grantCRUD('post')
    .grantCRUD('comment')
    .build()

  it('full flow: roles → engine → can/check/explain', async () => {
    const adapter = new MemoryAdapter({
      roles: [viewer, editor, admin],
      assignments: {
        alice: ['viewer'],
        bob: ['editor'],
        charlie: ['admin'],
      },
    })

    const engine = access.createEngine({ adapter, cacheTTL: 0 })

    // viewer can read, cannot create
    expect(await engine.can('alice', 'read', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('alice', 'create', { type: 'post', attributes: {} })).toBe(false)

    // editor inherits read, can create
    expect(await engine.can('bob', 'read', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('bob', 'create', { type: 'post', attributes: {} })).toBe(true)

    // editor can delete own post
    expect(await engine.can('bob', 'delete', { type: 'post', id: 'p1', attributes: { ownerId: 'bob' } })).toBe(true)

    // editor cannot delete someone else's post
    expect(await engine.can('bob', 'delete', { type: 'post', id: 'p1', attributes: { ownerId: 'alice' } })).toBe(false)

    // admin can do everything
    expect(await engine.can('charlie', 'delete', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('charlie', 'delete', { type: 'comment', attributes: {} })).toBe(true)

    // check returns full decision
    const decision = await engine.check('alice', 'read', { type: 'post', attributes: {} })
    expect(decision.allowed).toBe(true)
    expect(decision.effect).toBe('allow')
    expect(decision.duration).toBeGreaterThanOrEqual(0)

    // explain returns trace
    const trace = await engine.explain('alice', 'read', { type: 'post', attributes: {} })
    expect(trace.decision.allowed).toBe(true)
    expect(trace.summary).toContain('ALLOWED')
    expect(trace.policies.length).toBeGreaterThan(0)
  })

  it('batch permissions returns correct map', async () => {
    const adapter = new MemoryAdapter({
      roles: [viewer, editor],
      assignments: { bob: ['editor'] },
    })
    const engine = access.createEngine({ adapter, cacheTTL: 0 })

    const map = await engine.permissions(
      'bob',
      access.checks([
        { action: 'read', resource: 'post' },
        { action: 'create', resource: 'post' },
        { action: 'delete', resource: 'comment' },
      ]),
    )

    expect(map['read:post']).toBe(true)
    expect(map['create:post']).toBe(true)
    expect(map['delete:comment']).toBe(false)
  })

  it('ABAC deny policy blocks RBAC allow for matching conditions', async () => {
    // A deny-overrides policy that only targets delete+post and has both
    // a conditional deny and a fallback allow
    const denyDraftPolicy = access
      .policy('deny-draft-delete')
      .name('No deleting drafts')
      .algorithm('deny-overrides')
      .target({ actions: ['delete'], resources: ['post'] })
      .rule('allow-delete', (r) => r.allow().on('delete').of('post'))
      .rule('deny-draft', (r) =>
        r
          .deny()
          .on('delete')
          .of('post')
          .when((w) => w.resourceAttr('status', 'eq', 'draft')),
      )
      .build()

    const adapter = new MemoryAdapter({
      roles: [admin],
      assignments: { charlie: ['admin'] },
      policies: [denyDraftPolicy],
    })
    const engine = access.createEngine({ adapter, cacheTTL: 0 })

    // Admin can delete published posts (deny condition doesn't match, allow wins)
    expect(
      await engine.can('charlie', 'delete', {
        type: 'post',
        id: 'p1',
        attributes: { status: 'published' },
      }),
    ).toBe(true)

    // Admin cannot delete drafts (deny-overrides: deny rule matches and wins)
    expect(
      await engine.can('charlie', 'delete', {
        type: 'post',
        id: 'p2',
        attributes: { status: 'draft' },
      }),
    ).toBe(false)
  })

  it('validateRoles detects issues in role definitions', () => {
    const result = access.validateRoles([viewer, editor, admin])
    expect(result.valid).toBe(true)
    expect(result.issues.filter((i) => i.type === 'error')).toHaveLength(0)
  })
})
