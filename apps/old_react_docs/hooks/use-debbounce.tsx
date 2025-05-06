import React from 'react'

export const useDebounceCallback = <T extends (...args: any[]) => void>(callback: T, delay?: number) => {
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

export const debounceCallback = <T extends (...args: any[]) => void>(callback: T, delay?: number) => {
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
