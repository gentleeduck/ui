import { describe, expect, it, vi } from 'vitest'
import type { PermissionMap } from '../../../core/types'
import { AccessClient } from '../index'

type Action = 'read' | 'create' | 'update' | 'delete'
type Resource = 'post' | 'comment'
type Scope = 'org-1'

/** Cast a plain permission record to the typed PermissionMap. */
function perms(map: Record<string, boolean>): PermissionMap<Action, Resource, Scope> {
  return map as PermissionMap<Action, Resource, Scope>
}

describe('AccessClient', () => {
  it('can() returns true for allowed permissions', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({ 'read:post': true, 'create:post': false }))
    expect(client.can('read', 'post')).toBe(true)
    expect(client.can('create', 'post')).toBe(false)
  })

  it('can() returns false for unknown permissions', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({}))
    expect(client.can('read', 'post')).toBe(false)
  })

  it('cannot() is the negation of can()', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({ 'read:post': true }))
    expect(client.cannot('read', 'post')).toBe(false)
    expect(client.cannot('create', 'post')).toBe(true)
  })

  it('can() works with scoped keys', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({ 'org-1:read:post': true }))
    expect(client.can('read', 'post', undefined, 'org-1')).toBe(true)
  })

  it('can() works with resourceId keys', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({ 'read:post:post-42': true }))
    expect(client.can('read', 'post', 'post-42')).toBe(true)
  })

  it('permissions getter returns the permissions map', () => {
    const p = perms({ 'read:post': true })
    const client = new AccessClient<Action, Resource, Scope>(p)
    expect(client.permissions).toEqual(p)
  })

  it('defaults to empty permissions when none provided', () => {
    const client = new AccessClient()
    expect(client.permissions).toEqual({})
  })

  it('update() replaces permissions and notifies subscribers', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({}))
    const listener = vi.fn()
    client.subscribe(listener)

    const newPerms = perms({ 'read:post': true })
    client.update(newPerms)

    expect(client.can('read', 'post')).toBe(true)
    expect(listener).toHaveBeenCalledWith(newPerms)
  })

  it('merge() merges new permissions into existing', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({ 'read:post': true }))
    client.merge(perms({ 'create:post': true }))
    expect(client.can('read', 'post')).toBe(true)
    expect(client.can('create', 'post')).toBe(true)
  })

  it('subscribe() returns an unsubscribe function', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({}))
    const listener = vi.fn()
    const unsub = client.subscribe(listener)

    client.update(perms({ 'read:post': true }))
    expect(listener).toHaveBeenCalledTimes(1)

    unsub()
    client.update(perms({ 'read:post': false }))
    expect(listener).toHaveBeenCalledTimes(1) // not called again
  })

  it('allowedActions() returns exact allowed actions for a resource', () => {
    const client = new AccessClient<Action, Resource, Scope>(
      perms({ 'read:post': true, 'create:post': true, 'delete:post': false, 'read:comment': true }),
    )
    const actions = client.allowedActions('post')
    expect(actions).toEqual(expect.arrayContaining(['read', 'create']))
    expect(actions).toHaveLength(2)
    expect(actions).not.toContain('delete')
  })

  it('allowedActions() handles scoped keys', () => {
    const client = new AccessClient<Action, Resource, Scope>(
      perms({ 'org-1:read:post': true, 'org-1:create:post': true }),
    )
    const actions = client.allowedActions('post')
    expect(actions).toEqual(expect.arrayContaining(['read', 'create']))
    expect(actions).toHaveLength(2)
  })

  it('allowedActions() deduplicates actions', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({ 'read:post': true, 'org-1:read:post': true }))
    const actions = client.allowedActions('post')
    expect(actions).toEqual(['read'])
  })

  it('hasAnyOn() returns true when any permission exists on resource', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({ 'read:post': true }))
    expect(client.hasAnyOn('post')).toBe(true)
    expect(client.hasAnyOn('comment')).toBe(false)
  })

  it('hasAnyOn() returns false when all permissions are false', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({ 'read:post': false, 'create:post': false }))
    expect(client.hasAnyOn('post')).toBe(false)
  })

  it('listener errors do not prevent other listeners from firing', () => {
    const client = new AccessClient<Action, Resource, Scope>(perms({}))
    const results: string[] = []
    client.subscribe(() => {
      results.push('first')
      throw new Error('boom')
    })
    client.subscribe(() => {
      results.push('second')
    })

    client.update(perms({ 'read:post': true }))
    expect(results).toEqual(['first', 'second'])
  })
})
