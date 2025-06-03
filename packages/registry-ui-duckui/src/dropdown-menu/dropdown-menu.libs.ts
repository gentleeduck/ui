import React from 'react'
import { dstyleItem, handleItemsSelection, styleItem } from '../command/command.libs'

export function initRefs(
  groupsRef: React.RefObject<HTMLDivElement[] | null>,
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  selectedItemRef: React.RefObject<HTMLLIElement | null>,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  originalItemsRef: React.RefObject<HTMLLIElement[]>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
) {
  const groups = wrapperRef.current?.querySelectorAll('[duck-dropdown-menu-group]')
  const items = wrapperRef.current?.querySelectorAll(
    '[duck-dropdown-menu-group]>[duck-dropdown-menu-item], [duck-dropdown-menu-group]>*>[duck-dropdown-menu-item]',
  ) as never as HTMLLIElement[]
  groupsRef.current = Array.from(groups ?? []) as HTMLDivElement[]
  itemsRef.current = Array.from(items ?? []) as HTMLLIElement[]
  originalItemsRef.current = Array.from(items ?? []) as HTMLLIElement[]

  const selectedITem = itemsRef.current.find((item) => !item.hasAttribute('disabled'))

  styleItem(selectedITem ?? null)
  selectedITem?.focus()
  itemsRef.current = itemsRef.current.filter(
    (item) => !(item.hasAttribute('disabled') || item.getAttribute('disabled') === 'true'),
  )
  console.log(itemsRef.current)
  selectedItemRef.current = selectedITem ?? null

  for (let i = 0; i < itemsRef.current?.length; i++) {
    const item = itemsRef.current[i] as HTMLLIElement

    item.addEventListener('mouseover', () => {
      if (item.hasAttribute('aria-checked')) return
      dstyleItem(item)
      item?.blur()
    })

    item.addEventListener('click', () => {
      const currentItem = itemsRef.current?.findIndex((_item) => _item.id === item.id)
      handleItemsSelection(currentItem, itemsRef, () => {
        selectedItemRef.current = item
      })
      wrapperRef.current?.querySelector('[duck-select-value]')?.setHTMLUnsafe(item.children[0]?.getHTML() ?? '')
      item.setAttribute('aria-checked', 'true')
      triggerRef.current?.setAttribute('data-open', 'false')
      contentRef.current?.setAttribute('data-open', 'false')
    })
  }
}
