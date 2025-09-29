/**
 * Function to style the selected item
 * @function styleItem
 * @param {HTMLLIElement} item
 * @returns {void}
 */
export function styleItem(item: HTMLLIElement | null): void {
  if (!item) return
  if (item.hasAttribute('duck-select-item') || item.hasAttribute('duck-command-item')) {
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
  item.setAttribute('aria-selected', '')
  item.focus()
}

/**
 * Function to unstyle the selected item
 * @function dstyleItem
 * @param {HTMLLIElement} item
 * @returns {void}
 */
export function dstyleItem(item: HTMLLIElement | null): void {
  if (!item) return
  item.removeAttribute('aria-selected')
  item.blur()
}

export function handleItemsSelection(
  currentItem: number,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  setSelectedItem: (item: HTMLLIElement) => void,
) {
  // This will remove the class from all filteredItems.and add it to the right one.
  for (let i = 0; i < itemsRef.current.length; i++) {
    const item = itemsRef.current[i] as HTMLLIElement
    dstyleItem(item)

    if (i === currentItem) {
      styleItem(item)
      setSelectedItem(item)
    }
  }
}
