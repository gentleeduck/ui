import * as React from 'react'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { useStateMachine } from '../hooks/use-state-machine'

function usePresence(present: boolean) {
  const [node, setNode] = React.useState<HTMLElement>()
  const stylesRef = React.useRef<CSSStyleDeclaration>({} as CSSStyleDeclaration)
  const prevPresentRef = React.useRef(present)
  const prevAnimationNameRef = React.useRef<string>('none')
  const initialState = present ? 'mounted' : 'unmounted'
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: 'unmounted',
      ANIMATION_OUT: 'unmountSuspended',
    },
    unmountSuspended: {
      MOUNT: 'mounted',
      ANIMATION_END: 'unmounted',
    },
    unmounted: {
      MOUNT: 'mounted',
    },
  })

  React.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current)
    prevAnimationNameRef.current = state === 'mounted' ? currentAnimationName : 'none'
  }, [state])

  useLayoutEffect(() => {
    const styles = stylesRef.current
    const wasPresent = prevPresentRef.current
    const hasPresentChanged = wasPresent !== present

    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current
      const currentAnimationName = getAnimationName(styles)

      if (present) {
        send('MOUNT')
      } else if (currentAnimationName === 'none' || styles?.display === 'none') {
        // No exit animation or element is hidden -- unmount immediately.
        send('UNMOUNT')
      } else {
        // Detect whether an exit animation started by comparing animation-name.
        // We read computed styles here because there is no animationrun event
        // and animationstart fires only after animation-delay has elapsed.
        const isAnimating = prevAnimationName !== currentAnimationName

        if (wasPresent && isAnimating) {
          send('ANIMATION_OUT')
        } else {
          send('UNMOUNT')
        }
      }

      prevPresentRef.current = present
    }
  }, [present, send])

  useLayoutEffect(() => {
    if (node) {
      let timeoutId: number
      const ownerWindow = node.ownerDocument.defaultView ?? window

      // Only process ANIMATION_END for the currently active animation.
      // An ANIMATION_OUT during ANIMATION_IN can fire animationcancel for the
      // in-animation after we have already entered unmountSuspended.
      const handleAnimationEnd = (event: AnimationEvent) => {
        const currentAnimationName = getAnimationName(stylesRef.current)
        const isCurrentAnimation = currentAnimationName.includes(event.animationName)
        if (event.target === node && isCurrentAnimation) {
          // Set fill-mode to "forwards" to prevent a flash of visible content
          // when React 18 concurrency applies the state update a frame late.
          send('ANIMATION_END')
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode
            node.style.animationFillMode = 'forwards'
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === 'forwards') {
                node.style.animationFillMode = currentFillMode
              }
            })
          }
        }
      }
      const handleAnimationStart = (event: AnimationEvent) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current)
        }
      }
      node.addEventListener('animationstart', handleAnimationStart)
      node.addEventListener('animationcancel', handleAnimationEnd)
      node.addEventListener('animationend', handleAnimationEnd)
      return () => {
        ownerWindow.clearTimeout(timeoutId)
        node.removeEventListener('animationstart', handleAnimationStart)
        node.removeEventListener('animationcancel', handleAnimationEnd)
        node.removeEventListener('animationend', handleAnimationEnd)
      }
    } else {
      // Node removed prematurely -- transition to unmounted.
      send('ANIMATION_END')
    }
  }, [node, send])

  return {
    isPresent: ['mounted', 'unmountSuspended'].includes(state),
    ref: React.useCallback((node: HTMLElement) => {
      if (node) stylesRef.current = getComputedStyle(node)
      setNode(node)
    }, []),
  }
}

function getAnimationName(styles?: CSSStyleDeclaration) {
  return styles?.animationName || 'none'
}

/**
 * Accesses a ReactElement's ref without triggering version-specific warnings.
 * React 18 DEV warns on element.props.ref, React 19 DEV warns on element.ref.
 */
function getComponentRef(element: React.ReactElement<{ ref?: React.Ref<unknown> }>) {
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element as unknown as { ref?: React.Ref<unknown> }).ref
  }

  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return element.props.ref
  }

  return element.props.ref || (element as unknown as { ref?: React.Ref<unknown> }).ref
}

export { usePresence, getAnimationName, getComponentRef }
