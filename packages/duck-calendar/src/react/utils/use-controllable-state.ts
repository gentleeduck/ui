import { useCallback, useState } from 'react'

/**
 * Tiny controlled/uncontrolled state helper.
 * If `controlled` is defined, it's used as the value. Otherwise, internal state manages it.
 * `onChange` is always called when `setValue` is invoked.
 */
export function useControllableState<T>(
  controlled: T | undefined,
  uncontrolled: T,
  onChange?: (val: T) => void,
): [T, (val: T) => void] {
  const [internal, setInternal] = useState<T>(uncontrolled)
  const isControlled = controlled !== undefined

  const value = isControlled ? controlled : internal

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [value, setValue]
}
