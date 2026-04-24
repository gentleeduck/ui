import { describe, expect, it } from 'vitest'
import { MemoryAdapter } from '../../../adapters/memory'
import { Engine } from '../../../core/engine'
import type { Role } from '../../../core/types'
import { createSubjectCan, extractEnvironment, generatePermissionMap, METHOD_ACTION_MAP } from '../index'

type Action = 'read' | 'create' | 'update' | 'delete'
type Resource = 'post' | 'comment'
type RoleId = 'viewer' | 'editor'
type Scope = 'org-1'

const viewerRole: Role<Action, Resource, RoleId, Scope> = {
  id: 'viewer',
  name: 'Viewer',
  permissions: [
    { action: 'read', resource: 'post' },
    { action: 'read', resource: 'comment' },
  ],
}

const editorRole: Role<Action, Resource, RoleId, Scope> = {
  id: 'editor',
  name: 'Editor',
  inherits: ['viewer'],
  permissions: [
    { action: 'create', resource: 'post' },
    { action: 'update', resource: 'post' },
  ],
}

function createEngine() {
  const adapter = new MemoryAdapter<Action, Resource, RoleId, Scope>({
    roles: [viewerRole, editorRole],
    assignments: {
      'user-viewer': ['viewer'],
      'user-editor': ['editor'],
    },
  })
  return new Engine<Action, Resource, RoleId, Scope>({ adapter, cacheTTL: 0 })
}

describe('generatePermissionMap()', () => {
  it('generates a permission map for a subject', async () => {
    const engine = createEngine()
    const map = await generatePermissionMap(engine, 'user-viewer', [
      { action: 'read', resource: 'post' },
      { action: 'create', resource: 'post' },
    ])
    expect(map['read:post']).toBe(true)
    expect(map['create:post']).toBe(false)
  })

  it('generates correct map for editor', async () => {
    const engine = createEngine()
    const map = await generatePermissionMap(engine, 'user-editor', [
      { action: 'read', resource: 'post' },
      { action: 'create', resource: 'post' },
      { action: 'update', resource: 'post' },
      { action: 'delete', resource: 'post' },
    ])
    expect(map['read:post']).toBe(true)
    expect(map['create:post']).toBe(true)
    expect(map['update:post']).toBe(true)
    expect(map['delete:post']).toBe(false)
  })
})

describe('createSubjectCan()', () => {
  it('returns a function that checks permissions', async () => {
    const engine = createEngine()
    const can = createSubjectCan(engine, 'user-viewer')

    expect(await can('read', 'post')).toBe(true)
    expect(await can('create', 'post')).toBe(false)
  })

  it('supports resourceId parameter', async () => {
    const engine = createEngine()
    const can = createSubjectCan(engine, 'user-viewer')

    expect(await can('read', 'post', 'post-42')).toBe(true)
  })
})

describe('extractEnvironment()', () => {
  it('extracts IP and user agent from request object', () => {
    const env = extractEnvironment({
      ip: '192.168.1.1',
      headers: { 'user-agent': 'Mozilla/5.0' },
    })
    expect(env.ip).toBe('192.168.1.1')
    expect(env.userAgent).toBe('Mozilla/5.0')
    expect(env.timestamp).toBeGreaterThan(0)
  })

  it('falls back to x-forwarded-for header', () => {
    const env = extractEnvironment({
      headers: { 'x-forwarded-for': '10.0.0.1' },
    })
    expect(env.ip).toBe('10.0.0.1')
  })

  it('falls back to x-real-ip header', () => {
    const env = extractEnvironment({
      headers: { 'x-real-ip': '10.0.0.2' },
    })
    expect(env.ip).toBe('10.0.0.2')
  })

  it('handles Headers object', () => {
    const headers = new Headers()
    headers.set('user-agent', 'TestAgent')
    headers.set('x-forwarded-for', '10.0.0.3')

    const env = extractEnvironment({ headers })
    expect(env.userAgent).toBe('TestAgent')
    expect(env.ip).toBe('10.0.0.3')
  })

  it('handles missing headers gracefully', () => {
    const env = extractEnvironment({})
    expect(env.ip).toBeUndefined()
    expect(env.userAgent).toBeUndefined()
  })

  it('handles array header values', () => {
    const env = extractEnvironment({
      headers: { 'x-forwarded-for': ['10.0.0.1', '10.0.0.2'] },
    })
    expect(env.ip).toBe('10.0.0.1')
  })
})

describe('METHOD_ACTION_MAP', () => {
  it('maps GET to read', () => {
    expect(METHOD_ACTION_MAP.GET).toBe('read')
  })

  it('maps POST to create', () => {
    expect(METHOD_ACTION_MAP.POST).toBe('create')
  })

  it('maps PUT and PATCH to update', () => {
    expect(METHOD_ACTION_MAP.PUT).toBe('update')
    expect(METHOD_ACTION_MAP.PATCH).toBe('update')
  })

  it('maps DELETE to delete', () => {
    expect(METHOD_ACTION_MAP.DELETE).toBe('delete')
  })

  it('maps HEAD and OPTIONS to read', () => {
    expect(METHOD_ACTION_MAP.HEAD).toBe('read')
    expect(METHOD_ACTION_MAP.OPTIONS).toBe('read')
  })
})
