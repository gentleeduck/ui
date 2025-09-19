'use client'

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
    item?.focus()
    setSelectedItem(item ?? null)
  }, [search])
}

export function useHandleKeyDown(props: {
  open?: boolean
  itemsRef: React.RefObject<HTMLLIElement[]>
  selectedItem: HTMLLIElement | null
  setSelectedItem: (item: HTMLLIElement) => void
  originalItemsRef: React.RefObject<HTMLLIElement[]>
  allowAxisArrowKeys?: boolean
}) {
  const { selectedItem, setSelectedItem, open, itemsRef, originalItemsRef, allowAxisArrowKeys = false } = props
  React.useEffect(() => {
    if (!open) return

    const idx = originalItemsRef.current?.indexOf(selectedItem as HTMLLIElement) ?? 0
    let originalCurrentItem = idx === -1 ? 0 : idx
    let currentItem = idx === -1 ? 0 : idx
    let inSubMenu = false

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (inSubMenu) return
        const itemIndex = currentItem === itemsRef.current.length - 1 ? 0 : currentItem + 1
        currentItem = itemIndex
        originalCurrentItem = itemIndex
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (inSubMenu) return
        const itemIndex = currentItem === 0 ? itemsRef.current.length - 1 : currentItem - 1
        currentItem = itemIndex
        originalCurrentItem = itemIndex
      } else if (e.key === 'Enter') {
        if (
          itemsRef.current[currentItem]?.hasAttribute('duck-select-item') ||
          itemsRef.current[currentItem]?.hasAttribute('duck-command-item')
        ) {
          e.preventDefault()
          e.stopPropagation()
          setSelectedItem(itemsRef.current[currentItem] as HTMLLIElement)
          itemsRef.current[currentItem]?.click()
        }
      }

      if (e.key === 'Enter' || e.key === 'Escape') {
        if (itemsRef.current[currentItem]?.hasAttribute('duck-dropdown-menu-sub-trigger')) {
          inSubMenu = !inSubMenu
        }
      }

      if (allowAxisArrowKeys) {
        const item = itemsRef.current[originalCurrentItem] as HTMLLIElement
        if (item.hasAttribute('duck-dropdown-menu-sub-trigger')) {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            inSubMenu = !inSubMenu
            item?.click()
            return
          }
        }
      }

      handleItemsSelection(currentItem, itemsRef, setSelectedItem)
    }

    document?.addEventListener('keydown', handleKeyDown)
    return () => document?.removeEventListener('keydown', handleKeyDown)
  }, [open])
}
