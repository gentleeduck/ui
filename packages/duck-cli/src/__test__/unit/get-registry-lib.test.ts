import { describe, expect, it } from 'vitest'
import { checkStatus, getRegistryUrl, isUrl } from '~/utils/get-registry/get-registry.lib'

describe('isUrl', () => {
  it('returns true for valid http URLs', () => {
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('http://localhost:3000')).toBe(true)
    expect(isUrl('https://gentleduck.org/r/components/button.json')).toBe(true)
  })

  it('returns false for non-URL strings', () => {
    expect(isUrl('button')).toBe(false)
    expect(isUrl('/components/button.json')).toBe(false)
    expect(isUrl('index.json')).toBe(false)
    expect(isUrl('')).toBe(false)
  })
})

describe('getRegistryUrl', () => {
  it('returns the URL as-is for absolute URLs', () => {
    expect(getRegistryUrl('https://example.com/component.json')).toBe('https://example.com/component.json')
  })

  it('prepends REGISTRY_URL for relative paths', () => {
    const result = getRegistryUrl('index.json')
    expect(result).toContain('index.json')
    expect(result).toMatch(/^https?:\/\//)
  })

  it('prepends REGISTRY_URL for component paths', () => {
    const result = getRegistryUrl('/components/button.json')
    expect(result).toContain('/components/button.json')
  })

  it('appends /json suffix for v0 registry URLs with /chat/b/ path', () => {
    const result = getRegistryUrl('https://v0.dev/chat/b/some-id')
    expect(result).toBe('https://v0.dev/chat/b/some-id/json')
  })

  it('does not double-append /json for v0 URLs that already end with /json', () => {
    const result = getRegistryUrl('https://v0.dev/chat/b/some-id/json')
    expect(result).toBe('https://v0.dev/chat/b/some-id/json')
  })
})

describe('checkStatus', () => {
  it('throws for 401 with authentication message', () => {
    expect(() => checkStatus(401, 'Unauthorized', 'https://example.com', '')).toThrow('not authorized')
  })

  it('throws for 404 with not found message', () => {
    expect(() => checkStatus(404, 'Not Found', 'https://example.com', '')).toThrow('was not found')
  })

  it('throws for 403 with access denied message', () => {
    expect(() => checkStatus(403, 'Forbidden', 'https://example.com', '')).toThrow('do not have access')
  })

  it('throws with error from JSON body for other status codes', () => {
    const body = JSON.stringify({ error: 'Rate limit exceeded' })
    expect(() => checkStatus(429, 'Too Many Requests', 'https://example.com', body)).toThrow('Rate limit exceeded')
  })

  it('throws with statusText for non-JSON body', () => {
    expect(() => checkStatus(500, 'Internal Server Error', 'https://example.com', 'plain text error')).toThrow(
      'Internal Server Error',
    )
  })
})
