import type * as React from 'react'

/**
 * Read the ref off a React element without tripping the React 18 vs 19 deprecation
 * warning. React 18 attaches `ref` to `element.props.ref`; React 19 moved it to
 * `element.ref`. Both versions flag the wrong-side access via an `isReactWarning`
 * marker on the descriptor getter — we probe both descriptors and read whichever
 * side does NOT warn. Shared between `slot/slot.tsx` and `presence/presence.libs.tsx`.
 *
 * https://github.com/facebook/react/blob/main/packages/react/src/ReactElement.js
 */
export function getComponentRef(element: React.ReactElement): React.Ref<unknown> | undefined {
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element as unknown as { ref?: React.Ref<unknown> }).ref
  }

  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref
  }

  return (element.props as { ref?: React.Ref<unknown> }).ref || (element as unknown as { ref?: React.Ref<unknown> }).ref
}
