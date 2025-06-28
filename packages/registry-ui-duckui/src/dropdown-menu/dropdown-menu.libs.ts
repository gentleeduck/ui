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
    '[duck-dropdown-menu-group]>[duck-dropdown-menu-item], [duck-dropdown-menu-group]>*>[duck-dropdown-menu-item]',
  ) as never as HTMLLIElement[]
  groupsRef.current = Array.from(groups ?? []) as HTMLDivElement[]
  itemsRef.current = Array.from(items ?? []) as HTMLLIElement[]
  originalItemsRef.current = Array.from(items ?? []) as HTMLLIElement[]

  const selectedITem = itemsRef.current.find((item) => !item.hasAttribute('disabled'))

  itemsRef.current = itemsRef.current.filter(
    (item) => !(item.hasAttribute('aria-disabled') || item.getAttribute('aria-disabled') === 'true'),
  )
  if (!selectedItemRef.current) {
    styleItem(selectedITem ?? null)
    selectedITem?.focus()
    selectedItemRef.current = selectedITem ?? null
  }

  for (let i = 0; i < itemsRef.current?.length; i++) {
    const item = itemsRef.current[i] as HTMLLIElement
    item.addEventListener('mouseover', () => {
      dstyleItem(item)
      item?.blur()
    })

    item.addEventListener('click', () => {
      onOpenChange(false)
    })
  }
}
