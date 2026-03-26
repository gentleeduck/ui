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

  describe('detectPlatform - additional user agents', () => {
    it('detects mac from iPad user agent', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)',
      })
      expect(detectPlatform()).toBe('mac')
    })

    it('detects mac from iPhone user agent (contains no mac, falls through)', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like iOS)',
      })
      // 'iPhone' does not contain 'mac' or 'win', so falls to linux
      expect(detectPlatform()).toBe('linux')
    })

    it('detects windows from Edge user agent', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edg/120.0',
      })
      expect(detectPlatform()).toBe('windows')
    })

    it('detects linux from Android user agent', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7)',
      })
      expect(detectPlatform()).toBe('linux')
    })

    it('detects linux from ChromeOS user agent', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0)',
      })
      expect(detectPlatform()).toBe('linux')
    })

    it('falls back to linux for unknown user agent', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'SomeUnknownBrowser/1.0',
      })
      expect(detectPlatform()).toBe('linux')
    })

    it('falls back to linux for empty user agent', () => {
      vi.stubGlobal('navigator', { userAgent: '' })
      expect(detectPlatform()).toBe('linux')
    })
  })

  describe('detectPlatform - server side / no navigator', () => {
    it('returns linux when navigator is undefined (SSR)', () => {
      vi.stubGlobal('navigator', undefined)
      expect(detectPlatform()).toBe('linux')
    })

    it('caches linux result from SSR and does not re-detect', () => {
      vi.stubGlobal('navigator', undefined)
      expect(detectPlatform()).toBe('linux')
      // Even after navigator becomes available, cache holds
      vi.stubGlobal('navigator', { userAgent: 'Macintosh' })
      expect(detectPlatform()).toBe('linux')
    })
  })

  describe('detectPlatform - caching behavior', () => {
    it('cache persists across calls until reset', () => {
      vi.stubGlobal('navigator', { userAgent: 'Windows NT' })
      expect(detectPlatform()).toBe('windows')

      vi.stubGlobal('navigator', { userAgent: 'Macintosh' })
      expect(detectPlatform()).toBe('windows') // still cached

      _resetPlatformCache()
      expect(detectPlatform()).toBe('mac') // re-detects after reset
    })

    it('reset allows new detection', () => {
      vi.stubGlobal('navigator', { userAgent: 'Macintosh' })
      expect(detectPlatform()).toBe('mac')

      _resetPlatformCache()

      vi.stubGlobal('navigator', { userAgent: 'Linux x86_64' })
      expect(detectPlatform()).toBe('linux')
    })
  })

  describe('resolveMod - edge cases', () => {
    it('resolves mod using detected platform when no argument given (mac)', () => {
      vi.stubGlobal('navigator', { userAgent: 'Macintosh' })
      expect(resolveMod()).toBe('meta')
    })

    it('resolves mod using detected platform when no argument given (windows)', () => {
      vi.stubGlobal('navigator', { userAgent: 'Windows NT 10.0' })
      expect(resolveMod()).toBe('ctrl')
    })

    it('resolves mod using detected platform when no argument given (linux/SSR)', () => {
      vi.stubGlobal('navigator', undefined)
      expect(resolveMod()).toBe('ctrl')
    })
  })

  describe('isMac - with auto-detection (no argument)', () => {
    it('returns true when detected platform is mac', () => {
      vi.stubGlobal('navigator', { userAgent: 'Macintosh' })
      expect(isMac()).toBe(true)
    })

    it('returns false when detected platform is windows', () => {
      vi.stubGlobal('navigator', { userAgent: 'Windows NT' })
      expect(isMac()).toBe(false)
    })

    it('returns false when detected platform is linux (SSR)', () => {
      vi.stubGlobal('navigator', undefined)
      expect(isMac()).toBe(false)
    })
  })
})
