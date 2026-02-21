import React from 'react'
import { CommandContext, CommandRefsContext } from './command'
import { dstyleItem, handleItemsSelection, styleItem } from './command.libs'
import type { CommandContextType, CommandRefsContextType } from './command.types'

/**
 * Custom hook to access the CommandContext.
 *
 * @function useCommandContext
 * @returns {CommandContextType} The command context value.
 * @throws Will throw an error if the hook is used outside of a CommandProvider.
 */
export function useCommandContext(): CommandContextType {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error('useCommandContext must be used within a CommandProvider')
  }
  return context
}

/**
 * Custom hook to access the CommandRefsContext.
 *
 * @function useCommandRefsContext
 * @returns {CommandRefsContextType} The command refs context value.
 * @throws Will throw an error if the hook is used outside of a CommandProvider.
 */
export function useCommandRefsContext(): CommandRefsContextType {
  const context = React.useContext(CommandRefsContext)
  if (!context) {
    throw new Error('useCommandContext must be used within a CommandProvider')
  }
  return context
}

export function useCommandElements(commandRef: React.RefObject<HTMLDivElement | null>) {
  const itemsRef = React.useRef<HTMLLIElement[]>([])
  const filteredItemsRef = React.useRef<HTMLLIElement[]>([])
  const groupsRef = React.useRef<HTMLDivElement[]>([])
  const selectedItemRef = React.useRef<HTMLLIElement | null>(null)

  React.useEffect(() => {
    if (!commandRef.current) return
    const _items = commandRef.current.querySelectorAll('li[duck-command-item]')
    const _groups = commandRef.current.querySelectorAll('div[duck-command-group]')
    itemsRef.current = Array.from(_items) as HTMLLIElement[]
    groupsRef.current = Array.from(_groups) as HTMLDivElement[]
    filteredItemsRef.current = itemsRef.current

    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i] as HTMLLIElement
      item.addEventListener('mouseenter', () => {
        for (let i = 0; i < itemsRef.current?.length; i++) {
          const item = itemsRef.current[i] as HTMLLIElement
          dstyleItem(item)
        }

        styleItem(item)
        selectedItemRef.current = item
      })
    }

    styleItem(itemsRef.current[0] ?? null)
  }, [])

  return { filteredItemsRef, groupsRef, itemsRef, selectedItemRef }
}

export function useCommandSearch(
  itemsRef: React.RefObject<HTMLLIElement[]>,
  search: string,
  setSelectedItem: React.Dispatch<React.SetStateAction<HTMLLIElement | null>>,
  emptyRef: React.RefObject<HTMLHeadingElement | null>,
  commandRef: React.RefObject<HTMLDivElement | null>,
  groups: React.RefObject<HTMLDivElement[]>,
  filteredItems: React.RefObject<HTMLLIElement[]>,
): void {
  React.useEffect(() => {
    if (!commandRef.current || itemsRef.current.length === 0) return
    const itemsHidden = new Map<string, HTMLLIElement>()

    // Hiding the items that don't match the search query
    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i] as HTMLLIElement

      if (item.textContent?.toLowerCase().includes(search.toLowerCase())) {
        item.classList.remove('hidden')
      } else {
        item.classList.add('hidden')
        dstyleItem(item)
        itemsHidden.set(i.toString(), item)
      }
    }

    // Toggling the empty message if all items are hidden
    if (itemsHidden.size === itemsRef.current.length) {
      emptyRef.current?.classList.remove('hidden')
      setSelectedItem(null)
    } else {
      emptyRef.current?.classList.add('hidden')
      setSelectedItem(itemsRef.current[0] as HTMLLIElement)
    }

    // Setting filteredItems to the items that are not hidden
    filteredItems.current = Array.from(commandRef.current.querySelectorAll('li[duck-command-item]:not(.hidden)'))
    // Clearing all the classes from the items
    filteredItems.current.map((item) => dstyleItem(item))

    // Toggling the groups if they have no items
    for (let i = 0; i < groups.current.length; i++) {
      const group = groups.current[i] as HTMLDivElement
      const groupItems = group.querySelectorAll('li[duck-command-item]:not(.hidden)') as NodeListOf<HTMLLIElement>
      const nextSeparator = group.nextElementSibling
      const hasSeparator = nextSeparator?.hasAttribute('duck-command-separator')

      if (groupItems.length === 0) {
        group.classList.add('hidden')
        // Hiding the separator if the group has no items
        if (hasSeparator && nextSeparator) nextSeparator.classList.add('hidden')
      } else {
        group.classList.remove('hidden')
        // Showing the separator if the group has items
        if (hasSeparator && nextSeparator) nextSeparator.classList.remove('hidden')
      }
    }

    // Styling the first item after search
    const item = filteredItems.current?.[0] as HTMLLIElement
    styleItem(item ?? null)
    setSelectedItem(item ?? null)
  }, [search])
}

export function useHandleKeyDown(props: {
  containerRef: React.RefObject<HTMLDivElement | null>
  open?: boolean
  itemsRef: React.RefObject<HTMLLIElement[]>
  selectedItem: HTMLLIElement | null
  setSelectedItem: (item: HTMLLIElement) => void
  originalItemsRef: React.RefObject<HTMLLIElement[]>
  allowAxisArrowKeys?: boolean
}) {
  const { open = false, itemsRef, setSelectedItem, allowAxisArrowKeys = false } = props

  const currentRef = React.useRef(-1)
  const originalRef = React.useRef(-1)
  const inSubMenuRef = React.useRef(false)

  // Always reset when closed
  React.useEffect(() => {
    if (!open) {
      currentRef.current = -1
      originalRef.current = -1
      inSubMenuRef.current = false
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      const n = itemsRef.current.length
      if (n === 0) return

      // Sync currentRef with the currently highlighted item (may have changed via mouse hover)
      const highlightedIdx = itemsRef.current.findIndex((item) => item.hasAttribute('aria-selected'))
      if (highlightedIdx >= 0) {
        currentRef.current = highlightedIdx
        originalRef.current = highlightedIdx
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (inSubMenuRef.current) return

        const cur = currentRef.current
        const next = cur === -1 ? 0 : cur === n - 1 ? 0 : cur + 1

        currentRef.current = next
        originalRef.current = next
        handleItemsSelection(next, itemsRef, setSelectedItem)
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (inSubMenuRef.current) return

        const cur = currentRef.current
        const next = cur === -1 ? n - 1 : cur === 0 ? n - 1 : cur - 1

        currentRef.current = next
        originalRef.current = next
        handleItemsSelection(next, itemsRef, setSelectedItem)
        return
      }

      if (e.key === 'Enter') {
        const cur = currentRef.current < 0 ? 0 : currentRef.current

        const item = itemsRef.current[cur]
        if (!item) return

        if (item.hasAttribute('duck-select-item') || item.hasAttribute('duck-command-item')) {
          e.preventDefault()
          e.stopPropagation()
          setSelectedItem(item)
          item.click()
        }
        return
      }

      if (e.key === 'Enter' || e.key === 'Escape') {
        const cur = currentRef.current
        if (cur < 0) return
        const item = itemsRef.current[cur]
        if (item?.hasAttribute('duck-dropdown-menu-sub-trigger')) {
          inSubMenuRef.current = !inSubMenuRef.current
        }
      }

      if (allowAxisArrowKeys && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const cur = originalRef.current
        if (cur < 0) return
        const item = itemsRef.current[cur]
        if (item?.hasAttribute('duck-dropdown-menu-sub-trigger')) {
          e.preventDefault()
          inSubMenuRef.current = !inSubMenuRef.current
          item.click()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, itemsRef, setSelectedItem, allowAxisArrowKeys])
}
