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
        // Cancel any in-flight exit animation; otherwise its animationend
        // would fire and accidentally unmount the re-opened content.
        if (node) {
          ;(node as HTMLElement).style.animationName = 'none'
          void (node as HTMLElement).offsetWidth
          ;(node as HTMLElement).style.animationName = ''
        }
        send('MOUNT')
      } else if (currentAnimationName === 'none' || styles?.display === 'none') {
        // No exit animation, or hidden -> unmount immediately
        send('UNMOUNT')
      } else {
        // No `animationrun` event exists, and `animationstart` waits for animation-delay;
        // detect an exit animation by diffing computed animation-name instead.
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

      // ANIMATION_OUT interrupting ANIMATION_IN fires animationcancel for the in-anim
      // AFTER we've entered unmountSuspended; only treat events for the active animation as END.
      const handleAnimationEnd = (event: AnimationEvent) => {
        const currentAnimationName = getAnimationName(stylesRef.current)
        const isCurrentAnimation = currentAnimationName.includes(event.animationName)
        if (event.target === node && isCurrentAnimation) {
          // forwards fill-mode prevents content-flash when React 18 concurrency applies the
          // state update a frame late
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
      // node removed before animation completed
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

/** Read element ref without tripping DEV warnings (React 18: props.ref, React 19: element.ref). */
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

export { getAnimationName, getComponentRef, usePresence }
