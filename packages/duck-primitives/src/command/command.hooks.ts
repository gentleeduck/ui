import * as React from 'react'
import { focusFirst, getNavigationCandidates, NAVIGATION_KEYS } from '../libs/list-navigation'

/**
 * Discovers command items and groups from the DOM via data attributes.
 */
export function useCommandElements(commandRef: React.RefObject<HTMLDivElement | null>) {
  const itemsRef = React.useRef<HTMLLIElement[]>([])
  const filteredItemsRef = React.useRef<HTMLLIElement[]>([])
  const groupsRef = React.useRef<HTMLDivElement[]>([])

  React.useEffect(() => {
    if (!commandRef.current) return
    const _items = commandRef.current.querySelectorAll('li[data-slot="command-item"]')
    const _groups = commandRef.current.querySelectorAll('div[data-slot="command-group"]')
    itemsRef.current = Array.from(_items) as HTMLLIElement[]
    groupsRef.current = Array.from(_groups) as HTMLDivElement[]
    filteredItemsRef.current = itemsRef.current
  }, [])

  return { filteredItemsRef, groupsRef, itemsRef }
}

/**
 * Filters command items based on the search string by toggling the hidden class.
 * Also manages empty state visibility and group visibility.
 */
export function useCommandSearch(
  itemsRef: React.RefObject<HTMLLIElement[]>,
  search: string,
  setSelectedItem: React.Dispatch<React.SetStateAction<HTMLLIElement | null>>,
  emptyRef: React.RefObject<HTMLDivElement | null>,
  commandRef: React.RefObject<HTMLDivElement | null>,
  groups: React.RefObject<HTMLDivElement[]>,
  filteredItems: React.RefObject<HTMLLIElement[]>,
): void {
  React.useEffect(() => {
    if (!commandRef.current || itemsRef.current.length === 0) return
    let hiddenCount = 0

    // Hide items that don't match the search query
    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i] as HTMLLIElement
      if (item.textContent?.toLowerCase().includes(search.toLowerCase())) {
        item.classList.remove('hidden')
      } else {
        item.classList.add('hidden')
        hiddenCount++
      }
    }

    // Toggle the empty message
    if (hiddenCount === itemsRef.current.length) {
      emptyRef.current?.classList.remove('hidden')
      setSelectedItem(null)
    } else {
      emptyRef.current?.classList.add('hidden')
    }

    // Update filteredItems to non-hidden items
    filteredItems.current = Array.from(commandRef.current.querySelectorAll('li[data-slot="command-item"]:not(.hidden)'))

    // Toggle groups based on whether they have visible items
    for (let i = 0; i < groups.current.length; i++) {
      const group = groups.current[i] as HTMLDivElement
      const groupItems = group.querySelectorAll('li[data-slot="command-item"]:not(.hidden)') as NodeListOf<HTMLLIElement>
      const nextSeparator = group.nextElementSibling
      const hasSeparator = nextSeparator?.getAttribute('data-slot') === 'command-separator'

      if (groupItems.length === 0) {
        group.classList.add('hidden')
        if (hasSeparator && nextSeparator) nextSeparator.classList.add('hidden')
      } else {
        group.classList.remove('hidden')
        if (hasSeparator && nextSeparator) nextSeparator.classList.remove('hidden')
      }
    }

    // Track the first visible item for consumers (no focus steal -- input keeps focus)
    const firstVisible = filteredItems.current[0] ?? null
    setSelectedItem(firstVisible)
  }, [search])
}

/**
 * Keyboard navigation using shared list-navigation utilities.
 * Scoped to the command container. Handles ArrowUp/Down, Home/End, Tab.
 * Skips disabled items. Redirects character keys to input.
 * Enter/Space handled by item's own onKeyDown (same as select item pattern).
 */
export function useCommandKeyDown(
  commandRef: React.RefObject<HTMLDivElement | null>,
  filteredItems: React.RefObject<HTMLLIElement[]>,
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  React.useEffect(() => {
    const container = commandRef.current
    if (!container) return

    function handleKeyDown(e: KeyboardEvent) {
      // Prevent Tab from navigating outside the command
      if (e.key === 'Tab') {
        e.preventDefault()
        return
      }

      if ((NAVIGATION_KEYS as readonly string[]).includes(e.key)) {
        // Get visible, non-disabled items
        const items = filteredItems.current.filter((item) => !item.hasAttribute('data-disabled'))
        const candidateNodes = getNavigationCandidates(items, e.key, document.activeElement)

        // When no candidates remain on ArrowUp, return focus to the input
        if (e.key === 'ArrowUp' && candidateNodes.length === 0 && inputRef.current) {
          e.preventDefault()
          inputRef.current.focus({ preventScroll: true })
          return
        }

        e.preventDefault()
        setTimeout(() => focusFirst(candidateNodes))
        return
      }

      // Redirect printable character keys to the input when an item is focused
      const isModifierKey = e.ctrlKey || e.altKey || e.metaKey
      if (!isModifierKey && e.key.length === 1 && e.key !== ' ') {
        const focused = document.activeElement as HTMLElement
        if (focused?.getAttribute('data-slot') === 'command-item' && inputRef.current) {
          inputRef.current.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [commandRef, filteredItems, inputRef])
}
