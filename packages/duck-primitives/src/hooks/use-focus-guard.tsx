import * as React from 'react'

let count = 0

/** Component wrapper for `useFocusGuards`. */
function FocusGuards(props: { children?: React.ReactNode }) {
  useFocusGuards()
  return props.children
}

/**
 * Insert invisible focusable spans at the start/end of document.body. Required so
 * focusin/focusout fire consistently for focus-trap when the scope is portalled outside
 * the trap's container.
 */
function useFocusGuards() {
  React.useEffect(() => {
    const edgeGuards = document.querySelectorAll('[data-slot="focus-guard"]')
    document.body.insertAdjacentElement('afterbegin', edgeGuards[0] ?? createFocusGuard())
    document.body.insertAdjacentElement('beforeend', edgeGuards[1] ?? createFocusGuard())
    count++

    return () => {
      if (count === 1) {
        for (const node of document.querySelectorAll('[data-slot="focus-guard"]')) {
          node.remove()
        }
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
