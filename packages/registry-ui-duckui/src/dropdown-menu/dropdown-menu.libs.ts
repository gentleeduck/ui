import React from 'react'
import { styleItem } from '../command/command.libs'

export function handleItemsSelection(
  currentItem: number,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  selectedItemRef: React.RefObject<HTMLLIElement | null>,
) {
  // This will remove the class from all filteredItems.and add it to the right one.
  for (let i = 0; i < itemsRef.current.length; i++) {
    const item = itemsRef.current[i] as HTMLLIElement
    item.blur()
    item.removeAttribute('aria-selected')

    if (i === currentItem) {
      styleItem(item)
      selectedItemRef.current = item
      item.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
}

export function useHandleKeyDown(
  itemsRef: React.RefObject<HTMLLIElement[]>,
  selectedItemRef: React.RefObject<HTMLLIElement | null>,
) {
  React.useEffect(() => {
    let currentItem = 0

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        currentItem = currentItem === itemsRef.current.length - 1 ? 0 : currentItem + 1
      } else if (e.key === 'ArrowUp') {
        currentItem = currentItem === 0 ? itemsRef.current.length - 1 : currentItem - 1
      } else if (e.key === 'Enter') {
        ;(itemsRef.current[currentItem] as HTMLLIElement)?.click()
      }
      handleItemsSelection(currentItem, itemsRef, selectedItemRef)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
