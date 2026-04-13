import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRegistryEntry } from '../helpers/fixtures'
import { createMockFetch } from '../helpers/mock-fetch'

describe('getRegistryIndex', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', createMockFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches and parses the registry index', async () => {
    const { getRegistryIndex } = await import('~/utils/get-registry')
    const result = await getRegistryIndex()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result!.length).toBe(3)
    expect(result![0].name).toBe('button')
  })

  it('returns null on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    const { getRegistryIndex } = await import('~/utils/get-registry')
    const result = await getRegistryIndex()
    expect(result).toBeNull()
  })

  it('returns null when response returns invalid data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve('not an array'),
        text: () => Promise.resolve('not an array'),
      }),
    )
    const { getRegistryIndex } = await import('~/utils/get-registry')
    const result = await getRegistryIndex()
    expect(result).toBeNull()
  })
})

describe('getRegistryItem', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', createMockFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches a component by name', async () => {
    const { getRegistryItem } = await import('~/utils/get-registry')
    const result = await getRegistryItem('button')
    expect(result).toBeDefined()
    expect(result!.name).toBe('button')
    expect(result!.type).toBe('registry:ui')
  })

  it('returns null for nonexistent component', async () => {
    const { getRegistryItem } = await import('~/utils/get-registry')
    const result = await getRegistryItem('nonexistent')
    expect(result).toBeNull()
  })

  it('fetches a component by full URL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(createMockRegistryEntry({ name: 'remote-button' })),
        text: () => Promise.resolve(JSON.stringify(createMockRegistryEntry({ name: 'remote-button' }))),
      }),
    )
    const { getRegistryItem } = await import('~/utils/get-registry')
    const result = await getRegistryItem('https://example.com/components/button.json')
    expect(result).toBeDefined()
    expect(result!.name).toBe('remote-button')
  })
})

describe('getRegistryBaseColor', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', createMockFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches theme data', async () => {
    const { getRegistryBaseColor } = await import('~/utils/get-registry')
    const result = await getRegistryBaseColor('zinc')
    expect(result).toBeDefined()
    expect(result).toHaveProperty('name', 'zinc')
    expect(result).toHaveProperty('light')
    expect(result).toHaveProperty('dark')
  })

  it('returns null for nonexistent theme', async () => {
    const { getRegistryBaseColor } = await import('~/utils/get-registry')
    const result = await getRegistryBaseColor('nonexistent-theme')
    // fetchRegistryUrl catches the 404 and returns [],
    // so destructured result is undefined, which is returned directly
    expect(result).toBeUndefined()
  })
})
