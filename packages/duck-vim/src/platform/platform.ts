import type { Platform } from './platform.types'

let cachedPlatform: Platform.Kind | null = null

/**
 * Detects the OS platform from `navigator.userAgent` and caches the result.
 * Falls back to `'linux'` when navigator is unavailable (SSR).
 */
export function detectPlatform(): Platform.Kind {
  if (cachedPlatform) return cachedPlatform

  if (typeof navigator === 'undefined') {
    cachedPlatform = 'linux'
    return cachedPlatform
  }

  const ua = navigator.userAgent.toLowerCase()

  if (ua.includes('mac')) {
    cachedPlatform = 'mac'
  } else if (ua.includes('win')) {
    cachedPlatform = 'windows'
  } else {
    cachedPlatform = 'linux'
  }

  return cachedPlatform
}

/** Resolves the cross-platform `Mod` token: `meta` on Mac, `ctrl` elsewhere. */
export function resolveMod(platform?: Platform.Kind): 'meta' | 'ctrl' {
  const p = platform ?? detectPlatform()
  return p === 'mac' ? 'meta' : 'ctrl'
}

export function isMac(platform?: Platform.Kind): boolean {
  const p = platform ?? detectPlatform()
  return p === 'mac'
}

/** @internal Resets the cached platform (for tests). */
export function _resetPlatformCache(): void {
  cachedPlatform = null
}
