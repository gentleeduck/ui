import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type { ClassValue }

/**
 * Merge Tailwind class names via `clsx` + `tailwind-merge`.
 * Peer deps: `clsx ^2.1.1`, `tailwind-merge ^3.4.0`.
 * Hot-path callers should hoist stable strings or use `cnMemo`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const CN_MEMO_MAX = 256
const cnCache = new Map<string, string>()

/**
 * Memoized `cn` for primitive string inputs (LRU, bounded by `CN_MEMO_MAX`).
 * Non-string `ClassValue`s would collide on `toString()` keys, so signature is narrowed.
 */
export function cnMemo(...inputs: string[]): string {
  const key = inputs.join('|')
  const cached = cnCache.get(key)
  if (cached !== undefined) {
    cnCache.delete(key)
    cnCache.set(key, cached)
    return cached
  }
  const result = twMerge(clsx(inputs))
  if (cnCache.size >= CN_MEMO_MAX) {
    const oldest = cnCache.keys().next().value
    if (oldest !== undefined) cnCache.delete(oldest)
  }
  cnCache.set(key, result)
  return result
}

/** @internal */
export function _cnMemoClear(): void {
  cnCache.clear()
}

/** @internal */
export function _cnMemoSize(): number {
  return cnCache.size
}
