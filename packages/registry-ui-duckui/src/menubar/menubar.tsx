'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import { buttonVariants } from '../button'
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
} from '../dropdown-menu'

export type MenubarContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  wrapperRef: React.RefObject<HTMLDivElement | null>
  triggersRef: React.RefObject<HTMLButtonElement[]>
  contentsRef: React.RefObject<HTMLDialogElement[]>
  selectedItemRef: React.RefObject<HTMLButtonElement | null>
  clickedItemRef: React.RefObject<HTMLButtonElement | null>
}
const menubarContext = React.createContext<MenubarContextType | null>(null)

function useMenubarContext() {
  const context = React.useContext(menubarContext)
  if (!context) {
    throw new Error('useMenubarContext must be used within a Menubar')
  }
  return context
}

function Menubar({ children, className, ...props }: React.HTMLProps<HTMLDivElement>) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const triggersRef = React.useRef<HTMLButtonElement[]>([])
  const contentsRef = React.useRef<HTMLDialogElement[]>([])
  const selectedItemRef = React.useRef<HTMLButtonElement | null>(null)
  const clickedItemRef = React.useRef<HTMLButtonElement | null>(null)

  const triggerHandlersRef = React.useRef(
    new WeakMap<
      HTMLButtonElement,
      {
        click: EventListenerOrEventListenerObject
        focus: EventListenerOrEventListenerObject
        mouseover: EventListenerOrEventListenerObject
      }
    >(),
  )
  const contentHandlersRef = React.useRef(new WeakMap<HTMLDialogElement, (e: KeyboardEvent) => void>())

  React.useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const collectTriggers = () => {
      const list = Array.from(wrapper.querySelectorAll('[duck-menubar-trigger]')) as HTMLButtonElement[]
      triggersRef.current = list
      if (!selectedItemRef.current && list.length > 0) {
        selectedItemRef.current = list[0] as HTMLButtonElement
      } else if (selectedItemRef.current && !list.includes(selectedItemRef.current)) {
        selectedItemRef.current = list[0] ?? null
      }
      return list
    }

    collectTriggers()

    const focusSelected = () => {
      requestAnimationFrame(() => {
        selectedItemRef.current?.focus()
      })
    }

    const moveSelectedBy = (delta: number) => {
      const list = triggersRef.current
      if (list.length === 0) return
      const currentIndex = Math.max(0, list.indexOf(selectedItemRef.current as HTMLButtonElement))
      let nextIndex = currentIndex + delta
      if (nextIndex < 0) nextIndex = list.length - 1
      if (nextIndex >= list.length) nextIndex = 0
      selectedItemRef.current = list[nextIndex] as HTMLButtonElement
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        moveSelectedBy(e.key === 'ArrowRight' ? 1 : -1)
        focusSelected()
      }

      if (e.key === 'Enter') {
        clickedItemRef.current = selectedItemRef.current
      }
    }

    const handleContentKeydownFactory = (content: HTMLDialogElement) => {
      const handler = (e: KeyboardEvent) => {
        // collect actionable items inside the content
        const items = Array.from(
          content.querySelectorAll('[duck-dropdown-menu-item]:not([aria-disabled]), [duck-dropdown-menu-sub-trigger]'),
        ) as HTMLElement[]

        // UP / DOWN: navigate items inside the dropdown content and prevent page scroll
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          if (items.length === 0) return
          e.preventDefault() // <- prevents page scrolling

          // find current selected item (aria-selected) or activeElement fallback
          let currentIndex = items.findIndex((it) => it.getAttribute('aria-selected') !== null)
          if (currentIndex === -1) {
            const active = document?.activeElement
            currentIndex = items.indexOf(active as HTMLElement)
          }

          const delta = e.key === 'ArrowDown' ? 1 : -1
          const nextIndex =
            currentIndex === -1
              ? delta === 1
                ? 0
                : items.length - 1
              : (currentIndex + delta + items.length) % items.length

          const prev = items[currentIndex]
          const next = items[nextIndex]

          if (prev) prev.removeAttribute('aria-selected')
          if (next) {
            next.setAttribute('aria-selected', 'true')
            // focus the item on next animation frame
            requestAnimationFrame(() => {
              ;(next as HTMLElement).focus()
            })
          }
          return
        }

        // LEFT / RIGHT: keep the existing menubar logic (switch menubar items)
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const selected = items.find((it) => it.getAttribute('aria-selected') !== null)

          if (!selected?.hasAttribute('duck-dropdown-menu-sub-trigger')) {
            e.preventDefault()
            const delta = e.key === 'ArrowRight' ? 1 : -1
            moveSelectedBy(delta)
            clickedItemRef.current = selectedItemRef.current
            selectedItemRef.current?.click()
          }
        }
      }
      return handler
    }

    wrapper.addEventListener('keydown', handleKeydown)

    // attach handlers to triggers (only once each)
    const triggers = triggersRef.current
    triggers.forEach((trigger) => {
      if (triggerHandlersRef.current.has(trigger)) return

      const onClick = () => {
        const contents = Array.from(document?.querySelectorAll('[duck-menubar-content]')) as HTMLDialogElement[]
        contentsRef.current = contents

        triggersRef.current.forEach((t) => {
          if (t !== trigger && t.dataset.open === 'true') {
            t.click()
          }
        })

        contents.forEach((content) => {
          if (!contentHandlersRef.current.has(content)) {
            const handler = handleContentKeydownFactory(content)
            content.addEventListener('keydown', handler)
            contentHandlersRef.current.set(content, handler)
          }
        })
      }
      const onFocus = () => {
        selectedItemRef.current = trigger
      }

      const onMouseOver = () => {
        // if any trigger is currently open, hovering should switch the open menu
        const anyOpen = triggersRef.current.some((t) => t.dataset.open === 'true')

        // always update the visual selection for keyboard/mouse interplay
        selectedItemRef.current = trigger

        if (anyOpen) {
          // only trigger a click if this hovered trigger isn't already open
          if (trigger.dataset.open !== 'true') {
            trigger.click()
          }
        }
      }

      trigger.addEventListener('click', onClick)
      trigger.addEventListener('focus', onFocus)
      trigger.addEventListener('mouseover', onMouseOver)

      triggerHandlersRef.current.set(trigger, { click: onClick, focus: onFocus, mouseover: onMouseOver })
    })

    // attach any existing contents at mount
    const initialContents = Array.from(document?.querySelectorAll('[duck-menubar-content]')) as HTMLDialogElement[]
    contentsRef.current = initialContents
    initialContents.forEach((content) => {
      if (!contentHandlersRef.current.has(content)) {
        const handler = handleContentKeydownFactory(content)
        content.addEventListener('keydown', handler)
        contentHandlersRef.current.set(content, handler)
      }
    })

    // cleanup
    return () => {
      wrapper.removeEventListener('keydown', handleKeydown)

      triggersRef.current.forEach((trigger) => {
        const h = triggerHandlersRef.current.get(trigger)
        if (!h) return
        trigger.removeEventListener('click', h.click)
        trigger.removeEventListener('focus', h.focus)
        trigger.removeEventListener('mouseover', h.mouseover)
        triggerHandlersRef.current.delete(trigger)
      })
    }
  }, [])

  return (
    <menubarContext.Provider
      value={{
        contentsRef,
        selectedItemRef,
        triggersRef,
        wrapperRef,
      }}>
      <div
        className={cn('flex items-center rounded-lg border p-1', className)}
        {...props}
        duck-menubar=""
        duck-slot="duck-menubar"
        ref={wrapperRef}>
        {children}
      </div>
    </menubarContext.Provider>
  )
}

function MenubarMenu({ children, ...props }: Omit<React.HTMLProps<HTMLDivElement>, 'contextMenu'>) {
  return (
    <DropdownMenu {...props} duck-menubar-menu="" duck-slot="duck-menubar-menu">
      <div {...props}>{children}</div>
    </DropdownMenu>
  )
}

function MenubarTrigger({ children, className, ...props }: React.ComponentPropsWithRef<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      className={cn(
        buttonVariants({ size: 'sm', variant: 'ghost' }),
        'data-[open="true"]:bg-secondary',
        'focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent',
        className,
      )}
      {...props}
      duck-menubar-trigger=""
      duck-slot="duck-menubar-trigger">
      {children}
    </DropdownMenuTrigger>
  )
}

function MenubarContent({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuContent>) {
  return <DropdownMenuContent {...props} duck-menubar-content="" duck-slot="duck-menubar-content" />
}

function MenubarItem({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuItem>) {
  return <DropdownMenuItem {...props} duck-menubar-item="" duck-slot="duck-menubar-item" />
}

function MenubarSeparator({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator {...props} duck-menubar-separator="" duck-slot="duck-menubar-separator" />
}

function MenubarLabel({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel {...props} duck-menubar-label="" duck-slot="duck-menubar-label" />
}

function MenubarCheckboxItem({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuCheckboxItem>) {
  return <DropdownMenuCheckboxItem {...props} duck-menubar-checkbox-item="" duck-slot="duck-menubar-checkbox-item" />
}

function MenubarRadioGroup({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup {...props} duck-menubar-radio-group="" duck-slot="duck-menubar-radio-group" />
}

function MenubarRadioItem({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuRadioItem>) {
  return <DropdownMenuRadioItem {...props} duck-menubar-radio-item="" duck-slot="duck-menubar-radio-item" />
}

function MenubarSubContent({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuSubContent>) {
  return <DropdownMenuSubContent {...props} duck-menubar-sub-content="" duck-slot="duck-menubar-sub-content" />
}

function MenubarSubTrigger({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuSubTrigger>) {
  return <DropdownMenuSubTrigger {...props} duck-menubar-sub-trigger="" duck-slot="duck-menubar-sub-trigger" />
}

function MenubarGroup({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup {...props} duck-menubar-group="" duck-slot="duck-menubar-group" />
}

function MenubarSub({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuSub>) {
  return <DropdownMenuSub {...props} duck-menubar-sub="" duck-slot="duck-menubar-sub" />
}

function MenubarShortcut({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut {...props} duck-menubar-shortcut="" duck-slot="duck-menubar-shortcut" />
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
