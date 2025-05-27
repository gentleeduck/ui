/**
 * Function to style the selected item
 * @function styleItem
 * @param {HTMLLIElement} item
 * @returns {void}
 */
export function styleItem(item: HTMLLIElement | null): void {
  if (!item) return
  item.scrollIntoView({ block: 'center', behavior: 'smooth' })
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

/**
 * Function to handle the keydown event
 * @function handleKeyDown
 * @param {KeyboardEvent} e
 * @param {number} currentItem
 * @param {React.RefObject<HTMLLIElement[]>} filteredItems
 * @param {string} search
 * @param {React.RefObject<HTMLLIElement[]>} items
 * @returns {void}
 */
export function handleKeyDown(
  e: KeyboardEvent,
  currentItem: number,
  filteredItems: React.RefObject<HTMLLIElement[]>,
  search: string,
  items: React.RefObject<HTMLLIElement[]>,
): void {
  if (e.key === 'ArrowDown') {
    currentItem = currentItem === filteredItems.current.length - 1 ? 0 : currentItem + 1
  } else if (e.key === 'ArrowUp') {
    currentItem = currentItem === 0 ? filteredItems.current.length - 1 : currentItem - 1
  } else if (e.key === 'Enter') {
    ;(filteredItems.current[currentItem] as HTMLLIElement)?.click()
  }

  // Resetting the position when the search query is empty
  if (search.toLowerCase().trim() === '') {
    filteredItems.current = items.current
  }
}
