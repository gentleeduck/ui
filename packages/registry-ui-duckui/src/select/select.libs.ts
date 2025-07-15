import { dstyleItem, handleItemsSelection, styleItem } from '../command'

export function initRefs(
  open: boolean,
  groupsRef: React.RefObject<HTMLUListElement[] | null>,
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  selectedItemRef: React.RefObject<HTMLLIElement | null>,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  setSelectedItem: (item: HTMLLIElement) => void,
  onOpenChange: (open: boolean) => void,
  value: string,
  onValueChange: (value: string) => void,
) {
  const items = wrapperRef.current?.querySelectorAll('[duck-select-item]') as never as HTMLLIElement[]
  const groups = wrapperRef.current?.querySelectorAll('[duck-select-group]') as never as HTMLUListElement[]

  itemsRef.current = Array.from(items)
  groupsRef.current = Array.from(groups)

  itemsRef.current = itemsRef.current.filter(
    (item) => !(item.hasAttribute('aria-disabled') || item.getAttribute('aria-disabled') === 'true'),
  )

  for (let i = 0; i < itemsRef.current?.length; i++) {
    const item = itemsRef.current[i] as HTMLLIElement
    if (String(item.value) === value) {
      styleItem(item)
      selectedItemRef.current = item
    }

    item.addEventListener('mouseenter', () => {
      if (open) {
        for (let i = 0; i < itemsRef.current?.length; i++) {
          const item = itemsRef.current[i] as HTMLLIElement
          dstyleItem(item)
        }

        item?.setAttribute('aria-selected', '')
        item?.focus()
        selectedItemRef.current = item
      }
    })

    item.addEventListener('click', () => {
      selectedItemRef.current = item
      setSelectedItem(item)
      // styleItem(item)
      // console.log()
      // handleItemsSelection(, itemsRef, (value) => setSelectedItem(value))
      onValueChange((item.getAttribute('value') as string) ?? '')
      onOpenChange(false)
      wrapperRef.current?.querySelector('[duck-select-value]')?.setHTMLUnsafe(item.children[0]?.getHTML() ?? '')
    })

    // if ((item.getAttribute('data-value') === String(value) && !selectedItemRef.current )) {
    if (selectedItemRef.current?.getAttribute('value') === item.getAttribute('value')) {
      styleItem(item)
      selectedItemRef.current = item
      setSelectedItem(item)
    }
  }

  // if (!selectedItemRef.current) {
  //   const item = itemsRef.current?.[0] as HTMLLIElement
  //   styleItem(item ?? null)
  //   item?.focus()
  //   selectedItemRef.current = item
  // }
}
