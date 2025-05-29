import React from 'react'
import { CommandContextType, CommandRefsContextType } from './command.types'
import { CommandContext, CommandRefsContext } from './command'
import { dstyleItem } from './command.libs'

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

/**
 * Custom hook to access the Command elements.
 * @function useCommandElements
 * @returns {{ items: React.RefObject<HTMLLIElement[]>, groups: React.RefObject<HTMLDivElement[]> }} An object containing the items and groups.
 * @throws Will throw an error if the hook is used outside of a CommandProvider.
 */
export function useCommandElements(commandRef: React.RefObject<HTMLDivElement | null>): {
  items: React.RefObject<HTMLLIElement[]>
  groups: React.RefObject<HTMLDivElement[]>
} {
  const items = React.useRef<HTMLLIElement[]>([])
  const groups = React.useRef<HTMLDivElement[]>([])

  React.useEffect(() => {
    if (!commandRef.current) return
    const _items = commandRef.current.querySelectorAll('li[duck-command-item]')
    const _groups = commandRef.current.querySelectorAll('div[duck-command-group]')
    items.current = Array.from(_items) as HTMLLIElement[]
    groups.current = Array.from(_groups) as HTMLDivElement[]
  }, [])

  return { items, groups }
}

/**
 * Custom hook to handle searching through the command items.
 * @function useCommandSearch
 * @returns {void}
 * @throws Will throw an error if the hook is used outside of a CommandProvider.
 */
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
    // setSelectedItem(items.current[0] as HTMLLIElement)
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
  }, [search])
}
