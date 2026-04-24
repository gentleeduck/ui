import { describe, expect, it } from 'vitest'
import { buildPermissionKey } from '../keys'

describe('buildPermissionKey()', () => {
  it('action:resource', () => {
    expect(buildPermissionKey('read', 'post')).toBe('read:post')
  })

  it('action:resource:resourceId', () => {
    expect(buildPermissionKey('read', 'post', 'post-42')).toBe('read:post:post-42')
  })

  it('scope:action:resource', () => {
    expect(buildPermissionKey('read', 'post', undefined, 'org-1')).toBe('org-1:read:post')
  })

  it('scope:action:resource:resourceId', () => {
    expect(buildPermissionKey('read', 'post', 'post-42', 'org-1')).toBe('org-1:read:post:post-42')
  })

  it('handles empty resourceId', () => {
    expect(buildPermissionKey('read', 'post', undefined)).toBe('read:post')
  })

  it('handles both scope and resourceId', () => {
    expect(buildPermissionKey('update', 'post', 'p-1', 'org-1')).toBe('org-1:update:post:p-1')
  })
})
