type FocusableTarget = HTMLElement | { focus(): void }

/** Focus first candidate that actually accepts focus. */
function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement
  for (const candidate of candidates) {
    focus(candidate, { select })
    if (document.activeElement !== previouslyFocusedElement) return
  }
}

/** First and last visible tabbable elements inside a container. */
function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container)
  const first = findVisible(candidates, container)
  const last = findVisible(candidates.reverse(), container)
  return [first, last] as const
}

/**
 * Tabbable candidates via TreeWalker. Approximation: does not account for computed
 * visibility (use findVisible/isHidden for that). Relies on `.tabIndex` for runtime tabbability.
 */
function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Node) => {
      if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP
      const isHiddenInput = node.tagName === 'INPUT' && (node as HTMLInputElement).type === 'hidden'
      if (node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP
      if ('disabled' in node && node.disabled) return NodeFilter.FILTER_SKIP
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

/** First visible element; visibility checked up to (excluding) the container. */
function findVisible(elements: HTMLElement[], container: HTMLElement) {
  for (const element of elements) {
    if (!isHidden(element, { upTo: container })) return element
  }
}

function isHidden(node: HTMLElement, { upTo }: { upTo?: HTMLElement }) {
  if (getComputedStyle(node).visibility === 'hidden') return true
  while (node) {
    if (upTo !== undefined && node === upTo) return false
    if (getComputedStyle(node).display === 'none') return true
    node = node.parentElement as HTMLElement
  }
  return false
}

function isSelectableInput(element: unknown): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element
}

/** Focus with preventScroll; optionally select input contents. */
function focus(element?: FocusableTarget | null, { select = false } = {}) {
  if (element?.focus) {
    const previouslyFocusedElement = document.activeElement
    element.focus({ preventScroll: true })
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select()
  }
}

/** Strip anchors; prevents auto-focusing links on mount. */
function removeLinks(items: HTMLElement[]) {
  return items.filter((item) => item.tagName !== 'A')
}

type FocusScopeAPI = { paused: boolean; pause(): void; resume(): void }

function createFocusScopesStack() {
  let stack: FocusScopeAPI[] = []

  return {
    add(focusScope: FocusScopeAPI) {
      const activeFocusScope = stack[0]
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause()
      }
      stack = arrayRemove(stack, focusScope)
      stack.unshift(focusScope)
    },

    remove(focusScope: FocusScopeAPI) {
      stack = arrayRemove(stack, focusScope)
      stack[0]?.resume()
    },
  }
}

function arrayRemove<T>(array: T[], item: T) {
  const updatedArray = [...array]
  const index = updatedArray.indexOf(item)
  if (index !== -1) {
    updatedArray.splice(index, 1)
  }
  return updatedArray
}

const focusScopesStack = createFocusScopesStack()

export type { FocusableTarget, FocusScopeAPI }
export { focus, focusFirst, focusScopesStack, getTabbableCandidates, getTabbableEdges, removeLinks }
