import type { Platform } from './platform.types'

let cachedPlatform: Platform.Kind | null = null

/**
 * Detects the current operating system platform.
 * Caches the result after the first call.
 * Falls back to 'linux' when navigator is not available (SSR).
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

/**
 * Resolves the cross-platform 'Mod' key to the correct modifier.
 * Returns 'meta' on Mac, 'ctrl' on Windows/Linux.
 */
export function resolveMod(platform?: Platform.Kind): 'meta' | 'ctrl' {
  const p = platform ?? detectPlatform()
  return p === 'mac' ? 'meta' : 'ctrl'
}

/**
 * Returns true if the platform is Mac.
 */
export function isMac(platform?: Platform.Kind): boolean {
  const p = platform ?? detectPlatform()
  return p === 'mac'
}

/**
 * Resets the cached platform. Useful for testing.
 * @internal
 */
export function _resetPlatformCache(): void {
  cachedPlatform = null
}
