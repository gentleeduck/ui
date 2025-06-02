'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, CheckIcon, ChevronDown, ChevronDownIcon, ChevronUp } from 'lucide-react'
import * as React from 'react'

import { cn } from '@gentleduck/libs/cn'
import { Button, buttonVariants } from '../button'
import { dstyleItem, handleItemsSelection, styleItem, useHandleKeyDown } from '../command'

export interface SelectContextType {
  open: boolean
  onOpenChange: (open: boolean) => void

  wrapperRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<HTMLDivElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  groupsRef: React.RefObject<HTMLUListElement[] | null>
  itemsRef: React.RefObject<HTMLLIElement[] | null>
  selectedItem: HTMLLIElement | null
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
  const [selectedItem, setSelectedItem] = React.useState<HTMLLIElement | null>(null)
  const itemsRef = React.useRef<HTMLLIElement[]>([])
  const selectedItemRef = React.useRef<HTMLLIElement | null>(null)

  React.useEffect(() => {
    const items = wrapperRef.current?.querySelectorAll('[duck-select-item]') as never as HTMLLIElement[]
    const groups = wrapperRef.current?.querySelectorAll('[duck-select-group]') as never as HTMLUListElement[]

    itemsRef.current = Array.from(items)
    groupsRef.current = Array.from(groups)

    const item = itemsRef.current?.[0] as HTMLLIElement

    styleItem(item ?? null)
    item?.focus()
    selectedItemRef.current = item

    for (let i = 0; i < itemsRef.current?.length; i++) {
      const item = itemsRef.current[i] as HTMLLIElement

      item.addEventListener('mouseover', () => {
        if (item.hasAttribute('aria-checked')) return
        dstyleItem(item)
        item?.blur()
      })

      item.addEventListener('click', () => {
        const currentItem = itemsRef.current?.findIndex((_item) => _item.id === item.id)
        handleItemsSelection(currentItem, itemsRef, setSelectedItem)
        item.setAttribute('aria-checked', 'true')
        triggerRef.current?.setAttribute('data-open', 'false')
        contentRef.current?.setAttribute('data-open', 'false')
      })
    }
  }, [])

  useHandleKeyDown(
    itemsRef,
    (item) => {
      selectedItemRef.current = item
    },
    itemsRef,
    triggerRef as React.RefObject<HTMLButtonElement | null>,
    contentRef,
    () => {},
  )

  return (
    <SelectContext.Provider
      value={{
        wrapperRef,
        selectedItem,
        itemsRef,
        contentRef,
        groupsRef,
        open: false,
        onOpenChange: () => {},
        triggerRef,
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

function SelectValue({ placeholder, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { selectedItem } = useSelectContext()
  return (
    <div className="truncate" {...props} duck-select-value="">
      {selectedItem?.textContent ?? placeholder}
    </div>
  )
}

function SelectTrigger({ children, className, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      ref={ref}
      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'font-normal gap-1 justify-between', className)}
      {...props}
      duck-dropdown-menu-trigger="">
      {children}
      <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
    </div>
  )
}

function SelectContent({
  children,
  className,
  position = 'popper',
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  position?: 'popper'
}) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md p-1 mt-1',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      {...props}
      data-position={position}
      duck-select-content="">
      {children}
    </div>
  )
}

function SelectLabel({ children, className, ref, ...props }: React.HTMLProps<HTMLLabelElement>) {
  return (
    <label
      ref={ref}
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
      duck-select-label="">
      {children}
    </label>
  )
}

function SelectItem({ children, ref, className, ...props }: React.HTMLProps<HTMLLIElement>) {
  const { selectedItem } = useSelectContext()
  const id = React.useId()
  return (
    <li
      ref={ref}
      id={id}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 flex gap-2 hover:bg-muted cursor-pointer transition-color duration-300 will-change-300 hover:text-accent-foreground [&[aria-selected]]:bg-secondary ",
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",

        className,
      )}
      {...props}
      duck-select-item="">
      {children}
      {selectedItem?.id === id && (
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          <CheckIcon className="size-4" />
        </span>
      )}
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
