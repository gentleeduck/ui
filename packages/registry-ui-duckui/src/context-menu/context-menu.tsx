'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  useDropdownMenuContext,
} from '../dropdown-menu'

function ContextMenu(props: React.ComponentPropsWithoutRef<typeof DropdownMenu>) {
  return <DropdownMenu contextMenu {...props} data-slot="context-menu" />
}

function ContextMenuTrigger(props: React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>) {
  const { triggerRef, open, onOpenChange } = useDropdownMenuContext()

  React.useLayoutEffect(() => {
    triggerRef.current?.addEventListener('click', (e) => {
      e.preventDefault()
    })

    triggerRef.current?.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      if (open) return

      const trigger = triggerRef.current
      const content = trigger?.nextSibling as HTMLDivElement
      if (!trigger || !content) return

      const mouseX = e.clientX
      const mouseY = e.clientY

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let left = mouseX + 4
      let top = mouseY + 4

      if (mouseX > viewportWidth * 0.5) {
        left = mouseX - 210
      }

      if (mouseY > viewportHeight * 0.6) {
        top = mouseY - 310
      }

      content.style.transform = 'translate(0,0)'
      content.style.left = `${left}px`
      content.style.top = `${top}px`
      content.style.zIndex = '9999'
      setTimeout(() => {
        onOpenChange(true)
      }, 100)
    })
  }, [])

  return (
    <DropdownMenuTrigger
      {...props}
      className={cn(
        'h-[200px] w-[300px] justify-center border-dashed bg-background p-2 hover:bg-background',
        props.className,
      )}
      data-slot="context-menu-trigger"
    />
  )
}

function ContextMenuGroup(props: React.ComponentPropsWithoutRef<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup {...props} data-slot="context-menu-group" />
}

function ContextMenuSub(props: React.ComponentPropsWithoutRef<typeof DropdownMenuSub>) {
  return <DropdownMenuSub {...props} data-slot="context-menu-sub" />
}

function ContextMenuRadioGroup(props: React.ComponentPropsWithoutRef<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup {...props} data-slot="context-menu-radio-group" />
}

function ContextMenuSubTrigger(props: React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>) {
  return <DropdownMenuSubTrigger {...props} data-slot="context-menu-sub-trigger" />
}

function ContextMenuSubContent(props: React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent>) {
  return <DropdownMenuSubContent {...props} data-slot="context-menu-sub-content" />
}

function ContextMenuContent(props: React.ComponentPropsWithoutRef<typeof DropdownMenuContent>) {
  return <DropdownMenuContent {...props} className={cn('fixed', props.className)} data-slot="context-menu-content" />
}

function ContextMenuItem(props: React.ComponentPropsWithoutRef<typeof DropdownMenuItem>) {
  return <DropdownMenuItem {...props} data-slot="context-menu-item" />
}

function ContextMenuCheckboxItem(props: React.ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItem>) {
  return <DropdownMenuCheckboxItem {...props} data-slot="context-menu-checkbox-item" />
}

function ContextMenuRadioItem(props: React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem>) {
  return <DropdownMenuRadioItem {...props} data-slot="context-menu-radio-item" />
}

function ContextMenuLabel(props: React.ComponentPropsWithoutRef<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel {...props} data-slot="context-menu-label" />
}

function ContextMenuSeparator(props: React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator {...props} data-slot="context-menu-separator" />
}

function ContextMenuShortcut(props: React.ComponentPropsWithoutRef<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut {...props} data-slot="context-menu-shortcut" />
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
