import { bench, describe } from 'vitest'
import type { Request } from '../../types'
import { matchesAction, matchesResource, matchesResourceHierarchical, resolve } from '../resolve'

const req: Request.IAccessRequest = {
  subject: { id: 'u1', roles: ['editor'], attributes: { status: 'active', level: 3 } },
  action: 'read',
  resource: { type: 'post', id: 'post-42', attributes: { ownerId: 'u1', published: true } },
  environment: { ip: '10.0.0.1', timestamp: Date.now() },
}

describe('resolve', () => {
  bench('shorthand (action)', () => {
    resolve(req, 'action')
  })

  bench('one level (subject.id)', () => {
    resolve(req, 'subject.id')
  })

  bench('two levels (subject.attributes.status)', () => {
    resolve(req, 'subject.attributes.status')
  })

  bench('three levels (resource.attributes.ownerId)', () => {
    resolve(req, 'resource.attributes.ownerId')
  })

  bench('cache miss then hit (alternates)', () => {
    // Path cache should hit for repeat lookups.
    resolve(req, 'subject.attributes.status')
    resolve(req, 'resource.attributes.ownerId')
  })
})

describe('matchesAction', () => {
  bench('exact match', () => {
    matchesAction('read', 'read')
  })

  bench('star wildcard', () => {
    matchesAction('*', 'read')
  })

  bench('colon-prefix wildcard', () => {
    matchesAction('posts:*', 'posts:read')
  })

  bench('no match', () => {
    matchesAction('read', 'write')
  })
})

describe('matchesResource', () => {
  bench('exact', () => {
    matchesResource('post', 'post')
  })

  bench('parent-prefix (org -> org:project)', () => {
    matchesResource('org', 'org:project')
  })

  bench('colon-wildcard', () => {
    matchesResource('org:*', 'org:project')
  })
})

describe('matchesResourceHierarchical', () => {
  bench('exact', () => {
    matchesResourceHierarchical('dashboard', 'dashboard')
  })

  bench('parent-prefix (dashboard -> dashboard.users)', () => {
    matchesResourceHierarchical('dashboard', 'dashboard.users')
  })

  bench('dot-wildcard', () => {
    matchesResourceHierarchical('dashboard.*', 'dashboard.users')
  })
})
