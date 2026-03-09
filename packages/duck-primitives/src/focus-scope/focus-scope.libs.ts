type FocusableTarget = HTMLElement | { focus(): void }

/**
 * Attempts to focus the first element in a list of candidates.
 * Stops as soon as focus has actually moved.
 */
function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement
  for (const candidate of candidates) {
    focus(candidate, { select })
    if (document.activeElement !== previouslyFocusedElement) return
  }
}

/**
 * Returns the first and last tabbable elements inside a container.
 */
function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container)
  const first = findVisible(candidates, container)
  const last = findVisible(candidates.reverse(), container)
  return [first, last] as const
}

/**
 * Returns a list of potential tabbable candidates using TreeWalker.
 *
 * This is an approximation -- it does not account for computed visibility.
 * Those cases are handled separately via findVisible/isHidden.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 */
function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Node) => {
      if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP
      const isHiddenInput = node.tagName === 'INPUT' && (node as HTMLInputElement).type === 'hidden'
      if (node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP
      if ('disabled' in node && node.disabled) return NodeFilter.FILTER_SKIP
      // .tabIndex reflects the runtime tabbability of the element,
      // automatically accounting for all natively focusable elements.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

/**
 * Returns the first visible element in a list.
 * Checks visibility up to (but not including) the container.
 */
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

/**
 * Programmatically focuses an element without scrolling.
 * Optionally selects input content after focusing.
 */
function focus(element?: FocusableTarget | null, { select = false } = {}) {
  if (element?.focus) {
    const previouslyFocusedElement = document.activeElement
    element.focus({ preventScroll: true })
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select()
  }
}

/**
 * Filters out anchor (<a>) elements from a list.
 * Used to prevent auto-focusing links on mount.
 */
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
export { focusFirst, getTabbableEdges, getTabbableCandidates, focus, removeLinks, focusScopesStack }
