import { describe, expect, it } from 'vitest'
import type { AccessControl } from '../../../core/types'
import { File, FileAdapter } from '../index'

type Action = 'read' | 'write'
type Resource = 'post'
type Role = 'viewer' | 'editor'
type Scope = 'org-1'

function makeFakeFS(initial?: string): File.IFS & { files: Map<string, string>; dirs: Set<string> } {
  const files = new Map<string, string>()
  const dirs = new Set<string>()
  if (initial) files.set('/store.json', initial)
  return {
    files,
    dirs,
    async readFile(path: string) {
      const v = files.get(path)
      if (v == null) throw new Error('ENOENT')
      return v
    },
    async writeFile(path: string, data: string) {
      files.set(path, data)
    },
    async mkdir(path: string) {
      dirs.add(path)
    },
  }
}

const policy: AccessControl.IPolicy<Action, Resource, Role> = {
  id: 'p1',
  name: 'Allow Read',
  algorithm: 'deny-overrides',
  rules: [{ id: 'r1', effect: 'allow', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } }],
}

describe('FileAdapter', () => {
  it('starts empty when file missing', async () => {
    const fs = makeFakeFS()
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/store.json', fs })
    expect(await adapter.listPolicies()).toEqual([])
    expect(await adapter.listRoles()).toEqual([])
  })

  it('savePolicy + listPolicies roundtrips through JSON', async () => {
    const fs = makeFakeFS()
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/store.json', fs })
    await adapter.savePolicy(policy)
    expect(await adapter.listPolicies()).toEqual([policy])
    // Verify on-disk JSON
    const disk = JSON.parse(fs.files.get('/store.json')!)
    expect(disk.policies.p1.name).toBe('Allow Read')
  })

  it('mkdir is called with the parent directory before first write', async () => {
    const fs = makeFakeFS()
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/data/iam/store.json', fs })
    await adapter.savePolicy(policy)
    expect(fs.dirs.has('/data/iam')).toBe(true)
  })

  it('reloads state from existing file', async () => {
    const seeded = JSON.stringify({ policies: { p1: policy }, roles: {}, assignments: {}, attributes: {} })
    const fs = makeFakeFS(seeded)
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/store.json', fs })
    const out = await adapter.getPolicy('p1')
    expect(out?.name).toBe('Allow Read')
  })

  it('assignRole + getSubjectRoles persists across calls', async () => {
    const fs = makeFakeFS()
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/store.json', fs })
    await adapter.assignRole('user-1', 'viewer')
    expect(await adapter.getSubjectRoles('user-1')).toEqual(['viewer'])
  })

  it('scoped assignments are exposed via getSubjectScopedRoles only', async () => {
    const fs = makeFakeFS()
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/store.json', fs })
    await adapter.assignRole('user-1', 'editor', 'org-1')
    expect(await adapter.getSubjectRoles('user-1')).toEqual([])
    expect(await adapter.getSubjectScopedRoles('user-1')).toEqual([{ role: 'editor', scope: 'org-1' }])
  })

  it('setSubjectAttributes merges, does not replace', async () => {
    const fs = makeFakeFS()
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/store.json', fs })
    await adapter.setSubjectAttributes('user-1', { department: 'eng' })
    await adapter.setSubjectAttributes('user-1', { status: 'active' })
    expect(await adapter.getSubjectAttributes('user-1')).toEqual({ department: 'eng', status: 'active' })
  })

  it('deletePolicy removes the entry on disk', async () => {
    const fs = makeFakeFS()
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/store.json', fs })
    await adapter.savePolicy(policy)
    await adapter.deletePolicy('p1')
    expect(await adapter.listPolicies()).toEqual([])
    const disk = JSON.parse(fs.files.get('/store.json')!)
    expect(disk.policies).toEqual({})
  })

  it('malformed JSON starts empty instead of throwing', async () => {
    const fs = makeFakeFS('not-json{')
    const adapter = new FileAdapter<Action, Resource, Role, Scope>({ path: '/store.json', fs })
    expect(await adapter.listPolicies()).toEqual([])
  })
})
