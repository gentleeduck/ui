import React from 'react'
import { dstyleItem, handleItemsSelection, styleItem } from '../command/command.libs'

export function initRefs(
  groupsRef: React.RefObject<HTMLDivElement[] | null>,
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  selectedItemRef: React.RefObject<HTMLLIElement | null>,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  originalItemsRef: React.RefObject<HTMLLIElement[]>,
  onOpenChange: (open: boolean) => void,
) {
  const groups = wrapperRef.current?.querySelectorAll('[duck-dropdown-menu-group]')
  const items = wrapperRef.current?.querySelectorAll(
    '[duck-dropdown-menu-item]:not([duck-dropdown-menu-sub-trigger]):not([aria-disabled])',
  ) as unknown as HTMLLIElement[]

  console.log(items)

  groupsRef.current = Array.from(groups ?? []) as HTMLDivElement[]
  itemsRef.current = Array.from(items ?? []) as HTMLLIElement[]
  originalItemsRef.current = Array.from(items ?? []) as HTMLLIElement[]

  const selectedItem = itemsRef.current.find((item) => !item.hasAttribute('disabled'))

  if (!selectedItemRef.current) {
    styleItem(selectedItem ?? null)
    selectedItem?.focus()
    selectedItemRef.current = selectedItem ?? null
  }

  for (let i = 0; i < itemsRef.current?.length; i++) {
    const item = itemsRef.current[i] as HTMLLIElement
    item.addEventListener('mouseover', () => {
      dstyleItem(item)
      item?.blur()
    })
  }
}
