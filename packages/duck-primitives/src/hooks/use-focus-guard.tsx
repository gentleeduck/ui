import * as React from 'react'

/** Number of active components requesting focus guards. */
let count = 0

/**
 * Renders nothing visible but ensures focus guards are present in the DOM.
 * Can be used as a component wrapper instead of calling useFocusGuards directly.
 */
function FocusGuards(props: { children?: React.ReactNode }) {
  useFocusGuards()
  return props.children
}

/**
 * Injects a pair of invisible, focusable spans at the start and end of the body.
 * These guards ensure focusin/focusout events fire consistently, which is
 * required for focus trapping to work when the scope is portalled.
 */
function useFocusGuards() {
  React.useEffect(() => {
    const edgeGuards = document.querySelectorAll('[data-slot="focus-guard"]')
    document.body.insertAdjacentElement('afterbegin', edgeGuards[0] ?? createFocusGuard())
    document.body.insertAdjacentElement('beforeend', edgeGuards[1] ?? createFocusGuard())
    count++

    return () => {
      if (count === 1) {
        document.querySelectorAll('[data-slot="focus-guard"]').forEach((node) => node.remove())
      }
      count--
    }
  }, [])
}

function createFocusGuard() {
  const element = document.createElement('span')
  element.setAttribute('data-slot', 'focus-guard')
  element.tabIndex = 0
  element.style.outline = 'none'
  element.style.opacity = '0'
  element.style.position = 'fixed'
  element.style.pointerEvents = 'none'
  return element
}

export { FocusGuards, useFocusGuards }
