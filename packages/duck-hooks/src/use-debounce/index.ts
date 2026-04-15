/**
 * Hook that returns a debounced version of `callback`.
 *
 * Each call resets the delay timer; the callback fires only after
 * `delay` ms of inactivity.
 *
 * **Note:** because this is a plain factory (no React state), it is
 * suitable for both hook and non-hook contexts. For a non-hook alias
 * see {@link debounce}.
 */
export const useDebounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay?: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutRef: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    if (timeoutRef) {
      clearTimeout(timeoutRef)
    }

    timeoutRef = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

/**
 * Non-hook alias for {@link useDebounce}.
 *
 * Returns a debounced wrapper around `callback` that waits `delay` ms
 * of inactivity before invoking.
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay?: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutRef: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    if (timeoutRef) {
      clearTimeout(timeoutRef)
    }

    timeoutRef = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
