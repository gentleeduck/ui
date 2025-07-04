import React from 'react'
import { CommandContext, CommandRefsContext } from './command'
import { dstyleItem, handleItemsSelection, styleItem } from './command.libs'
import { CommandContextType, CommandRefsContextType } from './command.types'

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

export function useCommandElements(
  commandRef: React.RefObject<HTMLDivElement | null>,
  setSelectedItem: React.Dispatch<React.SetStateAction<HTMLLIElement | null>>,
) {
  const items = React.useRef<HTMLLIElement[]>([])
  const filteredItems = React.useRef<HTMLLIElement[]>([])
  const groups = React.useRef<HTMLDivElement[]>([])

  React.useEffect(() => {
    if (!commandRef.current) return
    const _items = commandRef.current.querySelectorAll('li[duck-command-item]')
    const _groups = commandRef.current.querySelectorAll('div[duck-command-group]')
    items.current = Array.from(_items) as HTMLLIElement[]
    groups.current = Array.from(_groups) as HTMLDivElement[]
    filteredItems.current = items.current

    const item = items.current?.[0] as HTMLLIElement

    styleItem(item ?? null)
    item?.focus()
    setSelectedItem(item ?? null)
  }, [])

  return { items, groups, filteredItems }
}

export function useCommandSearch(
  items: React.RefObject<HTMLLIElement[]>,
  search: string,
  setSelectedItem: React.Dispatch<React.SetStateAction<HTMLLIElement | null>>,
  emptyRef: React.RefObject<HTMLHeadingElement | null>,
  commandRef: React.RefObject<HTMLDivElement | null>,
  groups: React.RefObject<HTMLDivElement[]>,
  filteredItems: React.RefObject<HTMLLIElement[]>,
): void {
  React.useEffect(() => {
    if (!commandRef.current || items.current.length === 0) return
    const itemsHidden = new Map<string, HTMLLIElement>()

    // Hiding the items that don't match the search query
    for (let i = 0; i < items.current.length; i++) {
      const item = items.current[i] as HTMLLIElement

      if (item.textContent?.toLowerCase().includes(search.toLowerCase())) {
        item.classList.remove('hidden')
      } else {
        item.classList.add('hidden')
        item.removeAttribute('aria-selected')
        itemsHidden.set(i.toString(), item)
      }
    }

    // Toggling the empty message if all items are hidden
    if (itemsHidden.size === items.current.length) {
      emptyRef.current?.classList.remove('hidden')
      setSelectedItem(null)
    } else {
      emptyRef.current?.classList.add('hidden')
      setSelectedItem(items.current[0] as HTMLLIElement)
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

    const item = filteredItems.current?.[0] as HTMLLIElement
    styleItem(item ?? null)
    item?.focus()
    setSelectedItem(item ?? null)
  }, [search])
}

export function useHandleKeyDown({
  selectedItem,
  setSelectedItem,
  open,
  itemsRef,
  onOpenChange,
  originalItemsRef,
  allowAxisArrowKeys = false,
}: {
  open?: boolean
  itemsRef: React.RefObject<HTMLLIElement[]>
  selectedItem: HTMLLIElement | null
  setSelectedItem: (item: HTMLLIElement) => void
  originalItemsRef: React.RefObject<HTMLLIElement[]>
  onOpenChange?: (open: boolean) => void
  allowAxisArrowKeys?: boolean
}) {
  React.useEffect(() => {
    if (!open) return

    const idx = originalItemsRef.current?.findIndex((item) => item === selectedItem)
    const html = document.documentElement
    let originalCurrentItem = idx === -1 ? 0 : idx
    let currentItem = idx === -1 ? 0 : idx
    let inSubMenu = false

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        if (inSubMenu) return
        const itemIndex = currentItem === itemsRef.current.length - 1 ? 0 : currentItem + 1
        currentItem = itemIndex
        originalCurrentItem = itemIndex
      } else if (e.key === 'ArrowUp') {
        if (inSubMenu) return
        const itemIndex = currentItem === 0 ? itemsRef.current.length - 1 : currentItem - 1
        currentItem = itemIndex
        originalCurrentItem = itemIndex
      } else if (e.key === 'Enter' || e.key === 'Escape') {
        if (itemsRef.current[currentItem]?.hasAttribute('duck-select-item')) {
          itemsRef.current[currentItem]?.click()
        }
        if (itemsRef.current[currentItem]?.hasAttribute('duck-dropdown-menu-sub-trigger')) {
          inSubMenu = !inSubMenu
        }
      }

      if (allowAxisArrowKeys) {
        const item = itemsRef.current[originalCurrentItem] as HTMLLIElement
        if (
          (e.key === 'ArrowLeft' && html.getAttribute('dir') === 'rtl') ||
          (e.key === 'ArrowRight' && (html.getAttribute('dir') === 'ltr' || html.getAttribute('dir') === null))
        ) {
          item?.click()
          return
        }

        if (
          (e.key === 'ArrowRight' && html.getAttribute('dir') === 'rtl') ||
          (e.key === 'ArrowLeft' && (html.getAttribute('dir') === 'ltr' || html.getAttribute('dir') === null))
        ) {
          item?.click()
          return
        }
      }

      handleItemsSelection(currentItem, itemsRef, setSelectedItem)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  React.useEffect(() => {
    if (!open && itemsRef.current?.[0]) {
      setSelectedItem(itemsRef.current[0])
    }
  }, [open])
}
