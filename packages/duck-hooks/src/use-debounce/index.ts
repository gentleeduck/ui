/**
 * Returns a debounced version of `callback`. Fires after `delay` ms of inactivity.
 * Plain factory with no React state — safe in non-hook contexts; see also {@link debounce}.
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

/** Non-hook alias for {@link useDebounce}. */
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
