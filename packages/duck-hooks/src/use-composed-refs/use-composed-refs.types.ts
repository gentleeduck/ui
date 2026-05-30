import type * as React from 'react'

export namespace IComposeRefs {
  /**
   * Either a callback ref, a mutable RefObject, or empty (null/undefined).
   * Excludes the legacy string-ref form, which is incompatible with the
   * runtime `.current = value` write performed by `composeRefs`.
   */
  export type PossibleRef<T> =
    | React.RefCallback<T>
    | React.MutableRefObject<T | null>
    | React.RefObject<T | null>
    | null
    | undefined
}
