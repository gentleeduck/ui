import { afterEach, describe, expect, it, vi } from 'vitest'
import { _resetPlatformCache, detectPlatform, isMac, resolveMod } from '../platform'

describe('platform', () => {
  afterEach(() => {
    _resetPlatformCache()
    vi.restoreAllMocks()
  })

  describe('detectPlatform', () => {
    it('detects mac from user agent', () => {
      vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' })
      expect(detectPlatform()).toBe('mac')
    })

    it('detects windows from user agent', () => {
      vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' })
      expect(detectPlatform()).toBe('windows')
    })

    it('detects linux from user agent', () => {
      vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' })
      expect(detectPlatform()).toBe('linux')
    })

    it('falls back to linux when navigator is undefined', () => {
      vi.stubGlobal('navigator', undefined)
      expect(detectPlatform()).toBe('linux')
    })

    it('caches the result', () => {
      vi.stubGlobal('navigator', { userAgent: 'Macintosh' })
      expect(detectPlatform()).toBe('mac')
      vi.stubGlobal('navigator', { userAgent: 'Windows' })
      expect(detectPlatform()).toBe('mac') // still cached
    })
  })

  describe('resolveMod', () => {
    it('returns meta for mac', () => {
      expect(resolveMod('mac')).toBe('meta')
    })

    it('returns ctrl for windows', () => {
      expect(resolveMod('windows')).toBe('ctrl')
    })

    it('returns ctrl for linux', () => {
      expect(resolveMod('linux')).toBe('ctrl')
    })
  })

  describe('isMac', () => {
    it('returns true for mac', () => {
      expect(isMac('mac')).toBe(true)
    })

    it('returns false for windows', () => {
      expect(isMac('windows')).toBe(false)
    })

    it('returns false for linux', () => {
      expect(isMac('linux')).toBe(false)
    })
  })
})
