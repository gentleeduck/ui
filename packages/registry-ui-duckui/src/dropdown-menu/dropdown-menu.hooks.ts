import React from 'react'
import { DropdownMenuContext } from './dropdown-menu'
import { styleItem } from '../command/command.libs'

export const useDropdownMenuContext = () => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('useDropdownMenuContext must be used within a DropdownMenu')
  }
  return context
}

export function useDropdownMenuActions(open: boolean, onOpenChange?: (open: boolean) => void) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const groupsRef = React.useRef<HTMLDivElement[]>([])
  const itemsRef = React.useRef<HTMLLIElement[]>([])
  const originalItemsRef = React.useRef<HTMLLIElement[]>([])
  const selectedItemRef = React.useRef<HTMLLIElement | null>(null)

  React.useEffect(() => {
    console.log(open)
    contentRef.current?.setAttribute('data-open', String(open))
  }, [open])

  React.useEffect(() => {
    triggerRef.current?.addEventListener('click', () => {
      const open = contentRef.current?.getAttribute('data-open') === 'true'

      if (!groupsRef.current.length || !itemsRef.current.length) {
        const groups = wrapperRef.current?.querySelectorAll('[duck-dropdown-menu-group]')
        const items = wrapperRef.current?.querySelectorAll(
          '[duck-dropdown-menu-group]>[duck-dropdown-menu-item], [duck-dropdown-menu-group]>*>[duck-dropdown-menu-item], *>[duck-dropdown-menu-item]',
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
        selectedItemRef.current = selectedITem ?? null
      }

      if (onOpenChange) onOpenChange(!open)
      contentRef.current?.setAttribute('data-open', String(!open))
      triggerRef.current?.setAttribute('aria-open', String(!open))
    })
    // console.log(itemsRef.current)
  }, [])

  //TODO: clear the listeners
  //TODO: handle the close
  // overlayRef.current?.addEventListener('click', () => {
  //   contentRef.current?.setAttribute('data-open', 'false')
  // })
  return {
    wrapperRef,
    triggerRef,
    contentRef,
    overlayRef,
    groupsRef,
    itemsRef,
    originalItemsRef,
    selectedItemRef,
  }
}
