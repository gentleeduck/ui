import { describe, expect, it } from 'vitest'
import type { AccessRequest } from '../../types'
import { matchesAction, matchesResource, matchesResourceHierarchical, matchesScope, resolve } from '../resolve'

const baseRequest: AccessRequest = {
  subject: {
    id: 'user-1',
    roles: ['editor', 'viewer'],
    attributes: { department: 'engineering', level: 3 },
  },
  action: 'update',
  resource: {
    type: 'post',
    id: 'post-42',
    attributes: { ownerId: 'user-1', published: true },
  },
  scope: 'org-1',
  environment: { ip: '10.0.0.1', userAgent: 'test-agent' },
}

describe('resolve()', () => {
  it('resolves action shorthand', () => {
    expect(resolve(baseRequest, 'action')).toBe('update')
  })

  it('resolves scope shorthand', () => {
    expect(resolve(baseRequest, 'scope')).toBe('org-1')
  })

  it('resolves scope as null when missing', () => {
    const req = { ...baseRequest, scope: undefined }
    expect(resolve(req, 'scope')).toBeNull()
  })

  it('resolves subject.id', () => {
    expect(resolve(baseRequest, 'subject.id')).toBe('user-1')
  })

  it('resolves subject.roles', () => {
    expect(resolve(baseRequest, 'subject.roles')).toEqual(['editor', 'viewer'])
  })

  it('resolves subject.attributes.*', () => {
    expect(resolve(baseRequest, 'subject.attributes.department')).toBe('engineering')
    expect(resolve(baseRequest, 'subject.attributes.level')).toBe(3)
  })

  it('resolves resource.type', () => {
    expect(resolve(baseRequest, 'resource.type')).toBe('post')
  })

  it('resolves resource.id', () => {
    expect(resolve(baseRequest, 'resource.id')).toBe('post-42')
  })

  it('resolves resource.attributes.*', () => {
    expect(resolve(baseRequest, 'resource.attributes.ownerId')).toBe('user-1')
    expect(resolve(baseRequest, 'resource.attributes.published')).toBe(true)
  })

  it('resolves environment.*', () => {
    expect(resolve(baseRequest, 'environment.ip')).toBe('10.0.0.1')
  })

  it('returns null for missing paths', () => {
    expect(resolve(baseRequest, 'subject.attributes.missing')).toBeNull()
  })

  it('rejects paths with disallowed root prefix', () => {
    expect(resolve(baseRequest, 'nonexistent')).toBeNull()
    expect(resolve(baseRequest, 'deeply.nested.missing.path')).toBeNull()
    expect(resolve(baseRequest, 'toString')).toBeNull()
  })

  it('blocks __proto__ traversal', () => {
    expect(resolve(baseRequest, 'subject.__proto__')).toBeNull()
    expect(resolve(baseRequest, 'resource.__proto__.constructor')).toBeNull()
  })

  it('blocks constructor traversal', () => {
    expect(resolve(baseRequest, 'subject.constructor')).toBeNull()
    expect(resolve(baseRequest, 'resource.constructor.name')).toBeNull()
  })

  it('blocks prototype traversal', () => {
    expect(resolve(baseRequest, 'subject.prototype')).toBeNull()
  })
})

describe('matchesAction()', () => {
  it('wildcard matches everything', () => {
    expect(matchesAction('*', 'read')).toBe(true)
    expect(matchesAction('*', 'anything')).toBe(true)
  })

  it('exact match', () => {
    expect(matchesAction('read', 'read')).toBe(true)
    expect(matchesAction('read', 'write')).toBe(false)
  })

  it('prefix wildcard: posts:* matches posts:read', () => {
    expect(matchesAction('posts:*', 'posts:read')).toBe(true)
    expect(matchesAction('posts:*', 'posts:write')).toBe(true)
    expect(matchesAction('posts:*', 'users:read')).toBe(false)
  })

  it('non-wildcard does not match prefix', () => {
    expect(matchesAction('posts', 'posts:read')).toBe(false)
  })
})

describe('matchesResource()', () => {
  it('wildcard matches everything', () => {
    expect(matchesResource('*', 'post')).toBe(true)
  })

  it('exact match', () => {
    expect(matchesResource('post', 'post')).toBe(true)
    expect(matchesResource('post', 'comment')).toBe(false)
  })

  it('prefix wildcard: org:* matches org:project', () => {
    expect(matchesResource('org:*', 'org:project')).toBe(true)
    expect(matchesResource('org:*', 'org:project:doc')).toBe(true)
    expect(matchesResource('org:*', 'user')).toBe(false)
  })

  it('hierarchical: parent matches children', () => {
    expect(matchesResource('org', 'org:project')).toBe(true)
    expect(matchesResource('org', 'org:project:doc')).toBe(true)
    expect(matchesResource('org', 'organization')).toBe(false)
  })
})

describe('matchesResourceHierarchical()', () => {
  it('wildcard matches everything', () => {
    expect(matchesResourceHierarchical('*', 'dashboard')).toBe(true)
  })

  it('exact match', () => {
    expect(matchesResourceHierarchical('dashboard', 'dashboard')).toBe(true)
    expect(matchesResourceHierarchical('dashboard', 'settings')).toBe(false)
  })

  it('dot wildcard: dashboard.* matches children', () => {
    expect(matchesResourceHierarchical('dashboard.*', 'dashboard.users')).toBe(true)
    expect(matchesResourceHierarchical('dashboard.*', 'dashboard.users.settings')).toBe(true)
    // does NOT match dashboard itself
    expect(matchesResourceHierarchical('dashboard.*', 'dashboard')).toBe(false)
  })

  it('parent matches dot-children', () => {
    expect(matchesResourceHierarchical('dashboard', 'dashboard.users')).toBe(true)
    expect(matchesResourceHierarchical('dashboard', 'dashboard.users.settings')).toBe(true)
    expect(matchesResourceHierarchical('dashboard', 'dashboards')).toBe(false)
  })
})

describe('matchesScope()', () => {
  it('undefined/null pattern matches any scope', () => {
    expect(matchesScope(undefined, 'org-1')).toBe(true)
    expect(matchesScope(null, 'org-1')).toBe(true)
    expect(matchesScope(undefined, undefined)).toBe(true)
  })

  it('wildcard matches any scope', () => {
    expect(matchesScope('*', 'org-1')).toBe(true)
    expect(matchesScope('*', undefined)).toBe(true)
  })

  it('specific pattern requires matching scope', () => {
    expect(matchesScope('org-1', 'org-1')).toBe(true)
    expect(matchesScope('org-1', 'org-2')).toBe(false)
  })

  it('specific pattern does not match missing scope', () => {
    expect(matchesScope('org-1', undefined)).toBe(false)
    expect(matchesScope('org-1', null)).toBe(false)
  })
})
