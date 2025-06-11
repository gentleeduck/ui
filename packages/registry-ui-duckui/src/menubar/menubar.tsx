'use client'

import * as React from 'react'

import { cn } from '@gentleduck/libs/cn'
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
  const contentsRef = React.useRef<HTMLDivElement[]>([])
  const selectedItemRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    const triggers = Array.from(
      wrapperRef.current?.querySelectorAll('[duck-menubar-trigger]') as never as HTMLButtonElement[],
    )
    const contents = Array.from(
      wrapperRef.current?.querySelectorAll('[duck-menubar-content]') as never as HTMLDivElement[],
    )
    triggersRef.current = triggers
    contentsRef.current = contents

    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i] as HTMLButtonElement
      trigger.onclick = () => {
        for (let i = 0; i < triggers.length; i++) {
          const trigger = triggers[i] as HTMLButtonElement
          trigger.setAttribute('data-open', 'false')
          contents[i]?.setAttribute('data-open', 'false')
        }
        selectedItemRef.current = trigger
        trigger.setAttribute('data-open', 'true')
        contents[i]?.setAttribute('data-open', 'true')
      }

      trigger.addEventListener('mouseenter', () => {
        if (trigger.getAttribute('data-open') === 'false') {
          for (let i = 0; i < triggers.length; i++) {
            const trigger = triggers[i] as HTMLButtonElement
            trigger.setAttribute('data-open', 'false')
            contents[i]?.setAttribute('data-open', 'false')
          }
          selectedItemRef.current = trigger
          trigger.setAttribute('data-open', 'true')
          contents[i]?.setAttribute('data-open', 'true')
        }
      })
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
  variant = 'ghost',
  ...props
}: React.ComponentPropsWithRef<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger variant={variant} {...props} duck-menubar-trigger="">
      {children}
    </DropdownMenuTrigger>
  )
}

function MenubarContent({ ...props }: React.ComponentPropsWithRef<typeof DropdownMenuContent>) {
  return <DropdownMenuContent {...props} duck-menubar-content="" />
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
