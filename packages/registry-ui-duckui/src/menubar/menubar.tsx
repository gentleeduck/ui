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
} from '../dropdown-menu'

export interface MenubarContextType {}
const menubarContext = React.createContext<MenubarContextType | null>(null)

function Menubar({ children, className, ...props }: React.HTMLProps<HTMLDivElement>) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const triggersRef = React.useRef<HTMLButtonElement[]>([])
  const contentsRef = React.useRef<HTMLDialogElement[]>([])
  const selectedItemRef = React.useRef<HTMLButtonElement | null>(null)
  const clickedItemRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    const triggers = Array.from(
      wrapperRef.current?.querySelectorAll('[duck-menubar-trigger]') as never as HTMLButtonElement[],
    )
    const contents = Array.from(
      wrapperRef.current?.querySelectorAll('[duck-menubar-content]') as never as HTMLDialogElement[],
    )
    triggersRef.current = triggers
    contentsRef.current = contents

    wrapperRef.current?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const currentIndex = triggers.indexOf(selectedItemRef.current as HTMLButtonElement)

        if (e.key === 'ArrowRight') {
          const nextIndex = currentIndex + 1
          selectedItemRef.current = nextIndex < triggers.length ? triggers[nextIndex]! : triggers[0]!
          clickedItemRef.current && selectedItemRef.current?.click()
        } else if (e.key === 'ArrowLeft') {
          const nextIndex = currentIndex - 1
          selectedItemRef.current = nextIndex >= 0 ? triggers[nextIndex]! : triggers[triggers.length - 1]!
          clickedItemRef.current && selectedItemRef.current?.click()
        }

        console.log(selectedItemRef.current)
        for (let i = 0; i < triggers.length; i++) {
          const trigger = triggers[i] as HTMLButtonElement
          trigger.setAttribute('data-open', 'false')

          if (trigger === selectedItemRef.current) {
            trigger.setAttribute('data-open', 'true')
            setTimeout(() => trigger.focus(), 10)
          }
        }
      }

      // if (e.key === 'Enter') {
      //   selectedItemRef.current?.click()
      // }
    })

    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i] as HTMLButtonElement
      const content = contents[i] as HTMLDialogElement

      trigger.addEventListener('focus', () => {
        if (!clickedItemRef.current && !selectedItemRef.current) {
          trigger.setAttribute('data-open', 'true')
          selectedItemRef.current = trigger
        }
      })

      trigger.addEventListener('click', () => {
        const state = trigger.getAttribute('data-open')
        for (let i = 0; i < triggers.length; i++) {
          const trigger = triggers[i] as HTMLButtonElement
          trigger.setAttribute('data-open', 'false')
        }
        clickedItemRef.current = trigger
        selectedItemRef.current = trigger
        trigger.setAttribute('data-open', String(!state))
      })

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          console.log('hi')
          e.preventDefault()
          content.focus()
        }
      })

      //
      //   trigger.addEventListener('mouseenter', () => {
      //     if (
      //       clickedItemRef.current &&
      //       trigger.getAttribute('data-open') === 'false' &&
      //       trigger !== clickedItemRef.current
      //     ) {
      //       for (let i = 0; i < triggers.length; i++) {
      //         const trigger = triggers[i] as HTMLButtonElement
      //         trigger.setAttribute('data-open', 'false')
      //       }
      //       selectedItemRef.current = trigger
      //       selectedItemRef.current?.click()
      //       selectedItemRef.current.setAttribute('data-open', 'true')
      //     }
      //   })
      //
      //   // reset the open state when the mouse leaves
      //   wrapperRef.current?.addEventListener('mouseleave', () => {
      //     selectedItemRef.current = null
      //     clickedItemRef.current = null
      //   })
      //
      //   // clean the items that are not open
      //   let toggle: boolean = false
      //   content.addEventListener('toggle', () => {
      //     if (toggle) {
      //       for (let i = 0; i < triggers.length; i++) {
      //         triggers[i]?.setAttribute('data-open', 'false')
      //       }
      //     }
      //     toggle = !toggle
      //   })
    }
  }, [])

  return (
    <menubarContext.Provider value={{}}>
      <div
        className={cn('flex items-center border p-1 rounded-lg', className)}
        {...props}
        ref={wrapperRef}
        duck-menubar="">
        {children}
      </div>
    </menubarContext.Provider>
  )
}

function MenubarMenu({ children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <DropdownMenu {...props} duck-menubar-menu="">
      <div {...props}>{children}</div>
    </DropdownMenu>
  )
}

function MenubarTrigger({
  children,
  className,
  variant = 'ghost',
  ...props
}: React.ComponentPropsWithRef<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      variant={variant}
      className={cn(
        'data-[open="true"]:bg-secondary',
        // 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent',
        className,
      )}
      {...props}
      duck-menubar-trigger="">
      {children}
    </DropdownMenuTrigger>
  )
}

function MenubarContent({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuContent>) {
  return <DropdownMenuContent {...props} className="max-w-[250px]" duck-menubar-content="" />
}

function MenubarItem({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuItem>) {
  return <DropdownMenuItem {...props} duck-menubar-item="" />
}

function MenubarSeparator({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator {...props} duck-menubar-separator="" />
}

function MenubarLabel({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel {...props} duck-menubar-label="" />
}

function MenubarCheckboxItem({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuCheckboxItem>) {
  return <DropdownMenuCheckboxItem {...props} duck-menubar-checkbox-item="" />
}

function MenubarRadioGroup({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup {...props} duck-menubar-radio-group="" />
}

function MenubarRadioItem({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuRadioItem>) {
  return <DropdownMenuRadioItem {...props} duck-menubar-radio-item="" />
}

function MenubarSubContent({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuSubContent>) {
  return <DropdownMenuSubContent {...props} duck-menubar-sub-content="" />
}

function MenubarSubTrigger({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuSubTrigger>) {
  return <DropdownMenuSubTrigger {...props} duck-menubar-sub-trigger="" />
}

function MenubarGroup({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup {...props} duck-menubar-group="" />
}

function MenubarSub({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuSub>) {
  return <DropdownMenuSub {...props} duck-menubar-sub="" />
}

function MenubarShortcut({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut {...props} duck-menubar-shortcut="" />
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
