export function styleItem(item: HTMLLIElement | null) {
  if (!item) return
  item.classList.add('bg-secondary')
  item.scrollIntoView({ block: 'center', behavior: 'smooth' })
  item.setAttribute('duck-item-selected', '')
  item.focus()
}

export function dstyleItem(item: HTMLLIElement | null) {
  if (!item) return
  item.classList.remove('bg-secondary')
  item.removeAttribute('duck-item-selected')
  item.blur()
}

export function handleItemsSelection(
  search: string,
  setSelectedItem: React.Dispatch<React.SetStateAction<HTMLLIElement | null>>,
  filteredItems: React.RefObject<HTMLLIElement[]>,
  currentItem: number,
  items: React.RefObject<HTMLLIElement[]>,
) {
  // Resetting the position when the search query is empty
  if (search.toLowerCase().trim() === '') {
    filteredItems.current = items.current
    // styleItem(filteredItems.current[0] as HTMLLIElement)
    // setSelectedItem(filteredItems.current[0] as HTMLLIElement)
  }

  // This will remove the class from all filteredItems.and add it to the right one.
  for (let i = 0; i < filteredItems.current.length; i++) {
    const item = filteredItems.current[i] as HTMLLIElement
    item.classList.remove('bg-secondary')
    item.blur()
    item.removeAttribute('duck-item-selected')

    if (i === currentItem) {
      styleItem(item)
      setSelectedItem(item)
      item.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
}

export function handleKeyDown(
  e: KeyboardEvent,
  currentItem: number,
  filteredItems: React.RefObject<HTMLLIElement[]>,
  setSelectedItem: React.Dispatch<React.SetStateAction<HTMLLIElement | null>>,
  search: string,
  items: React.RefObject<HTMLLIElement[]>,
) {
  if (e.key === 'ArrowDown') {
    currentItem = currentItem === filteredItems.current.length - 1 ? 0 : currentItem + 1
    filteredItems.current.map((item) => item.classList.remove('bg-secondary'))
    // handleItemsSelection(search, setSelectedItem, filteredItems, currentItem, items)
  } else if (e.key === 'ArrowUp') {
    currentItem = currentItem === 0 ? filteredItems.current.length - 1 : currentItem - 1
    // handleItemsSelection(search, setSelectedItem, filteredItems, currentItem, items)
  } else if (e.key === 'Enter') {
    ;(filteredItems.current[currentItem] as HTMLLIElement)?.click()
  }
  handleItemsSelection(search, setSelectedItem, filteredItems, currentItem, items)
}
