import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Policy, Role } from '../../../core/types'
import { HttpAdapter } from '../index'

type A = 'read' | 'write'
type R = 'post'
type Ro = 'editor'
type S = 'org-1'

interface RecordedCall {
  url: string
  init: RequestInit | undefined
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
    json: async () => body,
  } as unknown as Response
}

function makeFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  const calls: RecordedCall[] = []
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init })
    return handler(url, init)
  })
  return { fetch: fetch as unknown as typeof globalThis.fetch, calls }
}

describe('HttpAdapter', () => {
  describe('config', () => {
    it('strips trailing slash from baseUrl', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse([]))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://api.example.com/access/', fetch })
      await adapter.listPolicies()
      expect(calls[0]?.url).toBe('https://api.example.com/access/policies')
    })

    it('merges static headers with content-type', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse([]))
      const adapter = new HttpAdapter<A, R, Ro, S>({
        baseUrl: 'https://api.example.com',
        fetch,
        headers: { authorization: 'Bearer xyz' },
      })
      await adapter.listPolicies()
      const headers = calls[0]?.init?.headers as Record<string, string>
      expect(headers['Content-Type']).toBe('application/json')
      expect(headers.authorization).toBe('Bearer xyz')
    })

    it('supports async header function', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse([]))
      const adapter = new HttpAdapter<A, R, Ro, S>({
        baseUrl: 'https://api.example.com',
        fetch,
        headers: async () => ({ 'x-tenant': 't1' }),
      })
      await adapter.listPolicies()
      const headers = calls[0]?.init?.headers as Record<string, string>
      expect(headers['x-tenant']).toBe('t1')
    })

    it('throws on non-ok response with status + body', async () => {
      const { fetch } = makeFetch(() => jsonResponse('boom', false, 500))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://api.example.com', fetch })
      await expect(adapter.listPolicies()).rejects.toThrow(/duck-iam HTTP 500: boom/)
    })

    it('uses globalThis.fetch when no fetch supplied', async () => {
      const original = globalThis.fetch
      const stub = vi.fn(async () => jsonResponse([]))
      globalThis.fetch = stub as unknown as typeof globalThis.fetch
      try {
        const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://api.example.com' })
        await adapter.listPolicies()
        expect(stub).toHaveBeenCalledOnce()
      } finally {
        globalThis.fetch = original
      }
    })
  })

  describe('PolicyStore', () => {
    const policy: Policy<A, R, Ro> = { id: 'p1', name: 'P', algorithm: 'deny-overrides', rules: [] }

    it('listPolicies GET /policies', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse([policy]))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      const out = await adapter.listPolicies()
      expect(out).toEqual([policy])
      expect(calls[0]?.url).toBe('https://x/policies')
    })

    it('getPolicy GET /policies/:id', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse(policy))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      const out = await adapter.getPolicy('p1')
      expect(out).toEqual(policy)
      expect(calls[0]?.url).toBe('https://x/policies/p1')
    })

    it('savePolicy PUT /policies', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ ok: true }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.savePolicy(policy)
      expect(calls[0]?.url).toBe('https://x/policies')
      expect(calls[0]?.init?.method).toBe('PUT')
      expect(calls[0]?.init?.body).toBe(JSON.stringify(policy))
    })

    it('deletePolicy DELETE /policies/:id', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ ok: true }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.deletePolicy('p1')
      expect(calls[0]?.url).toBe('https://x/policies/p1')
      expect(calls[0]?.init?.method).toBe('DELETE')
    })
  })

  describe('RoleStore', () => {
    const role: Role<A, R, Ro, S> = { id: 'editor', name: 'Editor', permissions: [] }

    it('listRoles GET /roles', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse([role]))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      const out = await adapter.listRoles()
      expect(out).toEqual([role])
      expect(calls[0]?.url).toBe('https://x/roles')
    })

    it('getRole GET /roles/:id', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse(role))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.getRole('editor')
      expect(calls[0]?.url).toBe('https://x/roles/editor')
    })

    it('saveRole PUT /roles', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ ok: true }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.saveRole(role)
      expect(calls[0]?.init?.method).toBe('PUT')
      expect(calls[0]?.init?.body).toBe(JSON.stringify(role))
    })

    it('deleteRole DELETE /roles/:id', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ ok: true }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.deleteRole('editor')
      expect(calls[0]?.url).toBe('https://x/roles/editor')
      expect(calls[0]?.init?.method).toBe('DELETE')
    })
  })

  describe('SubjectStore', () => {
    it('getSubjectRoles GET /subjects/:id/roles', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse(['editor']))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      const out = await adapter.getSubjectRoles('user-1')
      expect(out).toEqual(['editor'])
      expect(calls[0]?.url).toBe('https://x/subjects/user-1/roles')
    })

    it('getSubjectScopedRoles GET /subjects/:id/scoped-roles', async () => {
      const scoped = [{ role: 'editor', scope: 'org-1' }]
      const { fetch, calls } = makeFetch(() => jsonResponse(scoped))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      const out = await adapter.getSubjectScopedRoles('user-1')
      expect(out).toEqual(scoped)
      expect(calls[0]?.url).toBe('https://x/subjects/user-1/scoped-roles')
    })

    it('assignRole POST with body', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ ok: true }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.assignRole('user-1', 'editor', 'org-1')
      expect(calls[0]?.url).toBe('https://x/subjects/user-1/roles')
      expect(calls[0]?.init?.method).toBe('POST')
      expect(JSON.parse(calls[0]?.init?.body as string)).toEqual({ roleId: 'editor', scope: 'org-1' })
    })

    it('revokeRole DELETE without scope', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ ok: true }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.revokeRole('user-1', 'editor')
      expect(calls[0]?.url).toBe('https://x/subjects/user-1/roles/editor')
      expect(calls[0]?.init?.method).toBe('DELETE')
    })

    it('revokeRole DELETE encodes scope query', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ ok: true }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.revokeRole('user-1', 'editor', 'org one' as S)
      expect(calls[0]?.url).toBe('https://x/subjects/user-1/roles/editor?scope=org%20one')
    })

    it('getSubjectAttributes GET', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ team: 'A' }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      const out = await adapter.getSubjectAttributes('user-1')
      expect(out).toEqual({ team: 'A' })
      expect(calls[0]?.url).toBe('https://x/subjects/user-1/attributes')
    })

    it('setSubjectAttributes PATCH with body', async () => {
      const { fetch, calls } = makeFetch(() => jsonResponse({ ok: true }))
      const adapter = new HttpAdapter<A, R, Ro, S>({ baseUrl: 'https://x', fetch })
      await adapter.setSubjectAttributes('user-1', { team: 'A' })
      expect(calls[0]?.init?.method).toBe('PATCH')
      expect(JSON.parse(calls[0]?.init?.body as string)).toEqual({ team: 'A' })
    })
  })
})
