'use client'

import { Check, CheckIcon, ChevronDown, ChevronDownIcon, ChevronUp } from 'lucide-react'
import * as React from 'react'

import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '../button'
import { dstyleItem, handleItemsSelection, styleItem, useHandleKeyDown } from '../command'
import { initRefs } from './select.libs'

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

function Select({
  children,
  open,
  onOpenChange,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLDivElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const groupsRef = React.useRef<HTMLUListElement[]>([])
  const [selectedItem, setSelectedItem] = React.useState<HTMLLIElement | null>(null)
  const itemsRef = React.useRef<HTMLLIElement[]>([])
  const selectedItemRef = React.useRef<HTMLLIElement | null>(null)

  React.useEffect(() => {
    triggerRef.current?.setAttribute('data-open', String(open))
    contentRef.current?.setAttribute('data-open', String(open))
  }, [open])

  React.useEffect(() => {
    initRefs(groupsRef, wrapperRef, triggerRef, contentRef, selectedItemRef, itemsRef, setSelectedItem)
    triggerRef.current?.addEventListener('click', () => {
      const open = contentRef.current?.getAttribute('data-open') === 'true'

      if (!groupsRef.current.length || !itemsRef.current.length) {
        initRefs(groupsRef, wrapperRef, triggerRef, contentRef, selectedItemRef, itemsRef, setSelectedItem)
      }

      if (onOpenChange) onOpenChange(!open)
      contentRef.current?.setAttribute('data-open', String(!open))
      triggerRef.current?.setAttribute('data-open', String(!open))
    })
  }, [])

  useHandleKeyDown(
    itemsRef,
    (item) => {
      selectedItemRef.current = item
    },
    itemsRef,
    triggerRef as React.RefObject<HTMLButtonElement | null>,
    contentRef,
    onOpenChange,
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

function SelectValue({ className, children, placeholder, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'truncate relative select-none flex items-center rounded-xs gap-2 text-sm outline-hidden',
        className,
      )}
      {...props}
      duck-select-value="">
      {placeholder}
    </div>
  )
}

function SelectTrigger({
  children,
  className,
  customIndicator,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> & { customIndicator?: React.ReactNode }) {
  const { triggerRef } = useSelectContext()
  return (
    <div
      ref={triggerRef}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'font-normal gap-1 justify-between ltr:pr-2 rtl:pl-2 h-auto data-[open=true]:bg-secondary data-[open=true]:text-accent-foreground',
        className,
      )}
      {...props}
      duck-dropdown-menu-trigger="">
      {children}
      <span className="[&>svg]:size-4 [&>svg]:opacity-50 [&>svg]:shrink-0">
        {customIndicator ? customIndicator : <ChevronDownIcon />}
      </span>
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
  const { contentRef } = useSelectContext()
  return (
    <div
      ref={contentRef}
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
      {...props}
      duck-select-item=""
      className="relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 flex gap-2 hover:bg-muted cursor-pointer transition-color duration-300 will-change-300 hover:text-accent-foreground [&[aria-selected]]:bg-secondary rounded-sm">
      <div className={cn('relative flex items-center rounded-xs text-sm flex gap-2 hover:bg-muted', className)}>
        {children}
      </div>
      {selectedItem?.id === id && (
        <span className="absolute ltr:right-2 rtl:left-2 flex items-center justify-center">
          <CheckIcon className="!size-3.5" />
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
