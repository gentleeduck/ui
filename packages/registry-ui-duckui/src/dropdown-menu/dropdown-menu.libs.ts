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
  originalItemsRef: React.RefObject<HTMLLIElement[]>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  onOpenChange?: (open: boolean) => void,
) {
  React.useEffect(() => {
    const html = document.documentElement
    let originalCurrentItem = 0
    let currentItem = 0
    let inSubMenu = false

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        const itemIndex = currentItem === itemsRef.current.length - 1 ? 0 : currentItem + 1
        currentItem = itemIndex
        if (!inSubMenu) originalCurrentItem = itemIndex
      } else if (e.key === 'ArrowUp') {
        const itemIndex = currentItem === 0 ? itemsRef.current.length - 1 : currentItem - 1
        currentItem = itemIndex
        if (!inSubMenu) originalCurrentItem = itemIndex
      } else if (e.key === 'Enter') {
        ;(itemsRef.current[currentItem] as HTMLLIElement)?.click()
        if (onOpenChange) onOpenChange(false)
        contentRef.current?.setAttribute('data-open', 'false')
        triggerRef.current?.setAttribute('aria-open', 'false')
      }

      if (
        (e.key === 'ArrowLeft' && html.getAttribute('dir') === 'rtl') ||
        (e.key === 'ArrowRight' && (html.getAttribute('dir') === 'ltr' || html.getAttribute('dir') === null))
      ) {
        const item = itemsRef.current[originalCurrentItem] as HTMLLIElement
        const parent = item?.parentNode as HTMLDivElement
        if (!parent?.hasAttribute('duck-dropdown-menu-sub')) return

        const subItems = Array.from(parent?.querySelectorAll('[duck-dropdown-menu-item]') as never as HTMLLIElement[])
          .splice(1, 3)
          .filter((item) => !(item.hasAttribute('disabled') || item.getAttribute('disabled') === 'true'))

        if (subItems.length <= 0) return

        item.setAttribute('data-open', 'true')
        itemsRef.current = subItems
        inSubMenu = true
        currentItem = 0
      }

      if (
        (e.key === 'ArrowRight' && html.getAttribute('dir') === 'rtl') ||
        (e.key === 'ArrowLeft' && (html.getAttribute('dir') === 'ltr' || html.getAttribute('dir') === null))
      ) {
        const subItem = itemsRef.current[currentItem] as HTMLLIElement
        subItem.removeAttribute('aria-selected')
        itemsRef.current = originalItemsRef.current.filter((item) => !item.hasAttribute('disabled'))

        const item = itemsRef.current[originalCurrentItem] as HTMLLIElement
        item.setAttribute('data-open', 'false')

        inSubMenu = false
        currentItem = originalCurrentItem
      }

      handleItemsSelection(currentItem, itemsRef, selectedItemRef)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
