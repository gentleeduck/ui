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
    if (!result) throw new Error('expected getRegistryIndex to return a populated array')
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(3)
    expect(result[0].name).toBe('button')
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
    if (!result) throw new Error('expected getRegistryItem to return an entry')
    expect(result.name).toBe('button')
    expect(result.type).toBe('registry:ui')
  })

  it('returns null for nonexistent component', async () => {
    const { getRegistryItem } = await import('~/utils/get-registry')
    const result = await getRegistryItem('nonexistent')
    expect(result).toBeNull()
  })

  it('fetches a component by full URL from an allowlisted host', async () => {
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
    const result = await getRegistryItem('https://gentleduck.org/r/components/button.json')
    if (!result) throw new Error('expected getRegistryItem to return an entry')
    expect(result.name).toBe('remote-button')
  })

  it('returns null when the full URL points to an untrusted host', async () => {
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
    expect(result).toBeNull()
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
    expect(result).toBeNull()
  })
})

describe('getRegistryThemesIndex', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', createMockFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches and parses the themes index', async () => {
    const { getRegistryThemesIndex } = await import('~/utils/get-registry')
    const result = await getRegistryThemesIndex()
    if (!result) throw new Error('expected getRegistryThemesIndex to return entries')
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0]).toHaveProperty('name')
    expect(result[0]).toHaveProperty('label')
  })

  it('returns null on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')))
    const { getRegistryThemesIndex } = await import('~/utils/get-registry')
    const result = await getRegistryThemesIndex()
    expect(result).toBeNull()
  })

  it('returns null when response is not an array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ not: 'an array' }),
        text: () => Promise.resolve('{}'),
      }),
    )
    const { getRegistryThemesIndex } = await import('~/utils/get-registry')
    const result = await getRegistryThemesIndex()
    expect(result).toBeNull()
  })
})

describe('getRegistryTheme', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', createMockFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches a theme by name', async () => {
    const { getRegistryTheme } = await import('~/utils/get-registry')
    const result = await getRegistryTheme('zinc')
    if (!result) throw new Error('expected getRegistryTheme to return a theme')
    expect(result.name).toBe('zinc')
    expect(result.light).toBeDefined()
    expect(result.dark).toBeDefined()
  })

  it('lowercases the theme name before lookup', async () => {
    const { getRegistryTheme } = await import('~/utils/get-registry')
    const result = await getRegistryTheme('ZINC')
    expect(result?.name).toBe('zinc')
  })

  it('returns null for missing theme', async () => {
    const { getRegistryTheme } = await import('~/utils/get-registry')
    const result = await getRegistryTheme('nonexistent')
    expect(result).toBeNull()
  })
})
