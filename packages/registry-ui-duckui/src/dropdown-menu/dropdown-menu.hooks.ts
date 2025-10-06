import React from 'react'
import { DropdownMenuContext } from './dropdown-menu'
import { initRefs } from './dropdown-menu.libs'

export const useDropdownMenuContext = () => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('useDropdownMenuContext must be used within a DropdownMenu')
  }
  return context
}

export function useDropdownMenuInit(open: boolean, onOpenChange: (open: boolean) => void, sub: boolean) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const groupsRef = React.useRef<HTMLDivElement[]>([])
  const itemsRef = React.useRef<HTMLLIElement[]>([])
  const originalItemsRef = React.useRef<HTMLLIElement[]>([])
  const selectedItemRef = React.useRef<HTMLLIElement | null>(null)

  React.useEffect(() => {
    setTimeout(() => {
      initRefs(groupsRef, contentRef, selectedItemRef, itemsRef, originalItemsRef, onOpenChange, sub)
    }, 0)
  }, [open])

  return {
    contentRef,
    groupsRef,
    itemsRef,
    originalItemsRef,
    selectedItemRef,
    triggerRef,
  }
}
