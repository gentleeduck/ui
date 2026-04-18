import * as React from 'react'
import { useLayoutEffect } from './use-layout-effect'

// Prevent bundlers from trying to optimize the import.
const useInsertionEffect: typeof useLayoutEffect =
  ((React as Record<string, unknown>)[' useInsertionEffect '.trim().toString()] as typeof useLayoutEffect) ||
  useLayoutEffect

type ChangeHandler<T> = (state: T) => void
type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>

interface IUseControllableStateParams<T> {
  prop?: T | undefined
  defaultProp: T
  onChange?: ChangeHandler<T> | undefined
  caller?: string | undefined
}

/**
 * Manages a value that can be either controlled (via `prop`) or uncontrolled
 * (via `defaultProp`). Warns in development when switching between modes.
 * Returns a [value, setValue] tuple matching React.useState semantics.
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
  caller,
}: IUseControllableStateParams<T>): [T, SetStateFn<T>] {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange,
  })
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp

  // Warn in development when switching between controlled and uncontrolled.
  // Hooks are called conditionally here but always in the same environment,
  // so bundlers can strip this block entirely in production.
  /* eslint-disable react-hooks/rules-of-hooks */
  if (process.env.NODE_ENV !== 'production') {
    // biome-ignore lint/correctness/useHookAtTopLevel: hooks are intentionally called inside a NODE_ENV check  -  the condition is static per build so hook order is stable at runtime
    const isControlledRef = React.useRef(prop !== undefined)
    // biome-ignore lint/correctness/useHookAtTopLevel: hooks are intentionally called inside a NODE_ENV check  -  the condition is static per build so hook order is stable at runtime
    React.useEffect(() => {
      const wasControlled = isControlledRef.current
      if (wasControlled !== isControlled) {
        const from = wasControlled ? 'controlled' : 'uncontrolled'
        const to = isControlled ? 'controlled' : 'uncontrolled'
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        )
      }
      isControlledRef.current = isControlled
    }, [isControlled, caller])
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  const setValue = React.useCallback<SetStateFn<T>>(
    (nextValue) => {
      if (isControlled) {
        const value = isFunction(nextValue) ? nextValue(prop) : nextValue
        if (value !== prop) {
          onChangeRef.current?.(value)
        }
      } else {
        setUncontrolledProp(nextValue)
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef],
  )

  return [value, setValue]
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<IUseControllableStateParams<T>, 'prop'>): [
  Value: T,
  setValue: React.Dispatch<React.SetStateAction<T>>,
  OnChangeRef: React.RefObject<ChangeHandler<T> | undefined>,
] {
  const [value, setValue] = React.useState(defaultProp)
  const prevValueRef = React.useRef(value)

  const onChangeRef = React.useRef(onChange)
  useInsertionEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value)
      prevValueRef.current = value
    }
  }, [value])

  return [value, setValue, onChangeRef]
}

function isFunction<T>(value: React.SetStateAction<T>): value is (prevState: T) => T {
  return typeof value === 'function'
}
