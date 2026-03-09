import { describe, expect, it } from 'vitest'
import { check_status, get_registry_url, is_url } from '~/utils/get-registry/get-registry.lib'

describe('is_url', () => {
  it('returns true for valid http URLs', () => {
    expect(is_url('https://example.com')).toBe(true)
    expect(is_url('http://localhost:3000')).toBe(true)
    expect(is_url('https://ui.gentleduck.org/r/components/button.json')).toBe(true)
  })

  it('returns false for non-URL strings', () => {
    expect(is_url('button')).toBe(false)
    expect(is_url('/components/button.json')).toBe(false)
    expect(is_url('index.json')).toBe(false)
    expect(is_url('')).toBe(false)
  })
})

describe('get_registry_url', () => {
  it('returns the URL as-is for absolute URLs', () => {
    expect(get_registry_url('https://example.com/component.json')).toBe('https://example.com/component.json')
  })

  it('prepends REGISTRY_URL for relative paths', () => {
    const result = get_registry_url('index.json')
    expect(result).toContain('index.json')
    expect(result).toMatch(/^https?:\/\//)
  })

  it('prepends REGISTRY_URL for component paths', () => {
    const result = get_registry_url('/components/button.json')
    expect(result).toContain('/components/button.json')
  })

  it('appends /json suffix for v0 registry URLs with /chat/b/ path', () => {
    const result = get_registry_url('https://v0.dev/chat/b/some-id')
    expect(result).toBe('https://v0.dev/chat/b/some-id/json')
  })

  it('does not double-append /json for v0 URLs that already end with /json', () => {
    const result = get_registry_url('https://v0.dev/chat/b/some-id/json')
    expect(result).toBe('https://v0.dev/chat/b/some-id/json')
  })
})

describe('check_status', () => {
  it('throws for 401 with authentication message', () => {
    expect(() => check_status(401, 'Unauthorized', 'https://example.com', '')).toThrow('not authorized')
  })

  it('throws for 404 with not found message', () => {
    expect(() => check_status(404, 'Not Found', 'https://example.com', '')).toThrow('was not found')
  })

  it('throws for 403 with access denied message', () => {
    expect(() => check_status(403, 'Forbidden', 'https://example.com', '')).toThrow('do not have access')
  })

  it('throws with error from JSON body for other status codes', () => {
    const body = JSON.stringify({ error: 'Rate limit exceeded' })
    expect(() => check_status(429, 'Too Many Requests', 'https://example.com', body)).toThrow('Rate limit exceeded')
  })

  it('throws with statusText for non-JSON body', () => {
    expect(() => check_status(500, 'Internal Server Error', 'https://example.com', 'plain text error')).toThrow(
      'Internal Server Error',
    )
  })
})
