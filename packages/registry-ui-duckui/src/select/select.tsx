'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '../button'
import { styleItem, useHandleKeyDown } from '../command'

export interface SelectContextType {
  open: boolean
  onOpenChange: (open: boolean) => void

  wrapperRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<HTMLDivElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  groupsRef: React.RefObject<HTMLUListElement[] | null>
  itemsRef: React.RefObject<HTMLLIElement[] | null>
  selectedItemRef: React.RefObject<HTMLDivElement | null>
  originalItemsRef: React.RefObject<HTMLDivElement | null>
}

export const SelectContext = React.createContext<SelectContextType | null>(null)
export function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (context === null) {
    throw new Error('useSelectContext must be used within a SelectProvider')
  }
  return context
}

function Select({ children, ...props }: React.HTMLProps<HTMLDivElement>) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLDivElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const groupsRef = React.useRef<HTMLUListElement[]>([])
  const selectedItemRef = React.useRef<HTMLLIElement | null>(null)
  const itemsRef = React.useRef<HTMLLIElement[]>([])
  const originalItemsRef = React.useRef<HTMLLIElement[]>([])

  React.useEffect(() => {
    const items = wrapperRef.current?.querySelectorAll('[duck-select-item]') as never as HTMLLIElement[]
    const groups = wrapperRef.current?.querySelectorAll('[duck-select-group]') as never as HTMLUListElement[]

    itemsRef.current = Array.from(items)
    groupsRef.current = Array.from(groups)

    const item = itemsRef.current?.[0] as HTMLLIElement
    console.log(item)

    styleItem(item ?? null)
    item?.focus()
    // setSelectedItem(item ?? null)

    console.log(items, groups)
  }, [])

  useHandleKeyDown(
    itemsRef,
    (item) => {
      selectedItemRef.current = item
    },
    originalItemsRef,
    triggerRef as React.RefObject<HTMLButtonElement | null>,
    contentRef,
    () => {},
  )

  return (
    <SelectContext.Provider
      value={{
        wrapperRef,
        selectedItemRef,
        itemsRef,
        contentRef,
        groupsRef,
        open: false,
        onOpenChange: () => {},
        triggerRef,
        originalItemsRef,
      }}>
      <div ref={wrapperRef} {...props} duck-select="">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectGroup({ children, ...props }: React.HTMLProps<HTMLUListElement>) {
  return (
    <ul {...props} duck-select-group="">
      {children}
    </ul>
  )
}

function SelectValue({ children, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { selectedItemRef } = useSelectContext()
  return (
    <div ref={selectedItemRef} {...props} duck-select-value="">
      {children}
    </div>
  )
}

function SelectTrigger({ children, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div ref={ref} duck-dropdown-menu-trigger="" {...props}>
      {children}
    </div>
  )
}

function SelectContent({ children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} duck-select-content="">
      {children}
    </div>
  )
}

function SelectLabel({ children, ...props }: React.HTMLProps<HTMLLabelElement>) {
  return (
    <label {...props} duck-select-label="">
      {children}
    </label>
  )
}

function SelectItem({ children, className, ...props }: React.HTMLProps<HTMLLIElement>) {
  return (
    <li
      className={cn(
        "relative flex cursor-default select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 flex gap-2 hover:bg-muted cursor-pointer transition-color duration-300 will-change-300 hover:text-accent-foreground [&[aria-selected]]:bg-secondary ",
        className,
      )}
      {...props}
      duck-select-item="">
      {children}
    </li>
  )
}

function SelectSeparator({ children, className, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} duck-select-separator="" />
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  // SelectScrollUpButton,
  // SelectScrollDownButton,
  // SelectItemLeftCheck,
}
