export const useDebounce = <const T extends (...args: unknown[]) => void>(callback: T, delay?: number) => {
  let timeoutRef: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutRef) {
      clearTimeout(timeoutRef)
    }

    timeoutRef = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

export const debounce = <const T extends (...args: unknown[]) => void>(callback: T, delay?: number) => {
  let timeoutRef: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutRef) {
      clearTimeout(timeoutRef)
    }

    timeoutRef = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
