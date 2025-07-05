'use client'

import { usePopoverContext } from '@gentleduck/aria-feather/popover'
import { cn } from '@gentleduck/libs/cn'
import { CheckIcon, ChevronDown, ChevronDownIcon, ChevronUp } from 'lucide-react'
import * as React from 'react'
import { Button } from '../button'
import { useHandleKeyDown } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { useSelectInit, useSelectScroll } from './select.hooks'
import { SelectContextType } from './select.types'

export const SelectContext = React.createContext<SelectContextType | null>(null)
export function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (context === null) {
    throw new Error('useSelectContext must be used within a SelectProvider')
  }
  return context
}

function SelectWrapper({
  children,
  scrollable = false,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  scrollable?: boolean
}) {
  const { open = false, onOpenChange = () => {} } = usePopoverContext()

  const { itemsRef, selectedItemRef, contentRef, triggerRef, groupsRef, wrapperRef, selectedItem } = useSelectInit(
    open,
    onOpenChange,
  )

  useSelectScroll(open, itemsRef, selectedItemRef, contentRef)
  useHandleKeyDown({
    open,
    itemsRef,
    originalItemsRef: itemsRef,
    selectedItem,
    setSelectedItem: (item) => {
      selectedItemRef.current = item
    },
    onOpenChange,
  })

  return (
    <SelectContext.Provider
      value={{
        wrapperRef,
        selectedItem,
        itemsRef,
        contentRef,
        groupsRef,
        open: open,
        onOpenChange: () => {
          onOpenChange?.(open)
        },
        scrollable,
        triggerRef,
      }}>
      <div ref={wrapperRef} {...props} duck-select="">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function Select({
  children,
  ...props
}: React.ComponentPropsWithRef<typeof Popover> & {
  scrollable?: boolean
}) {
  return (
    <Popover {...props}>
      <SelectWrapper {...props}>{children}</SelectWrapper>
    </Popover>
  )
}

function SelectTrigger({
  children,
  customIndicator,
  variant = 'outline',
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof PopoverTrigger> & { customIndicator?: React.ReactNode }) {
  const { triggerRef } = useSelectContext()
  return (
    <PopoverTrigger ref={triggerRef as never} variant={variant} {...props} duck-select-trigger="">
      {children}
      <span className="[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:opacity-50">
        {customIndicator ? customIndicator : <ChevronDownIcon />}
      </span>
    </PopoverTrigger>
  )
}

function SelectContent({ children, className, ref, ...props }: React.ComponentPropsWithRef<typeof PopoverContent>) {
  const { contentRef, scrollable } = useSelectContext()
  return (
    <PopoverContent
      side={'bottom'}
      role="select"
      aria-activedescendant=""
      className={cn('px-1.5', scrollable ? 'py-0' : 'py-1', className)}
      duck-select-content=""
      {...props}
      ref={contentRef as never}>
      {scrollable && <SelectScrollUpButton />}
      <div className={cn('max-h-[400px]', scrollable && 'overflow-y-scroll')} duck-select-content-scrollable="">
        {children}
      </div>
      {scrollable && <SelectScrollDownButton />}
    </PopoverContent>
  )
}

function SelectGroup({ children, ...props }: React.HTMLProps<HTMLUListElement>) {
  return (
    <ul role="listbox" {...props}>
      {children}
    </ul>
  )
}

function SelectValue({ className, children, placeholder, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative flex select-none items-center gap-2 truncate rounded-xs text-sm outline-hidden',
        className,
      )}
      {...props}
      duck-select-value="">
      {placeholder}
    </div>
  )
}

function SelectLabel({ children, className, ref, ...props }: React.HTMLProps<HTMLLabelElement>) {
  return (
    <label
      ref={ref}
      className={cn('px-2 py-1.5 text-muted-foreground text-xs', className)}
      {...props}
      duck-select-label="">
      {children}
    </label>
  )
}

function SelectItem({ children, ref, className, disabled, ...props }: React.HTMLProps<HTMLLIElement>) {
  const { selectedItem } = useSelectContext()
  const id = React.useId()

  return (
    <li
      ref={ref}
      role="checkbox"
      id={id}
      {...props}
      duck-select-item=""
      aria-disabled={disabled}
      className={cn(
        "relative flex flex cursor-default cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-color duration-300 will-change-300 hover:bg-muted hover:text-accent-foreground data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground [&[aria-selected]]:bg-secondary",
        disabled && 'pointer-events-none opacity-50',
      )}>
      <div
        className={cn(
          'relative flex select-none items-center gap-2 truncate rounded-xs text-sm outline-hidden',
          className,
        )}>
        {children}
      </div>
      {selectedItem?.id === id && (
        <span
          className="absolute flex items-center justify-center transition-none duration-0 ltr:right-2 ltr:pl-2 rtl:left-2 rtl:pr-2"
          id="select-indicator">
          <CheckIcon className="!size-3.5 shrink-0" />
        </span>
      )}
    </li>
  )
}

function SelectSeparator({ children, className, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} duck-select-separator="" />
}

function SelectScrollButton({
  children,
  className,
  scrollDown,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & { scrollDown?: boolean }) {
  return (
    <Button
      variant="nothing"
      size="xs"
      className={cn(
        'sticky z-50 w-full cursor-default cursor-pointer rounded-none bg-background p-0 [&>div]:justify-center',
        scrollDown ? 'bottom-0' : 'top-0',
        className,
      )}
      {...props}
      duck-select-scroll-up-button="">
      {scrollDown ? <ChevronDown className="shrink-0" /> : <ChevronUp className="shrink-0" />}
    </Button>
  )
}

function SelectScrollUpButton(props: React.ComponentPropsWithRef<typeof Button>) {
  return <SelectScrollButton {...props} duck-select-scroll-up-button="" scrollDown={false} />
}

function SelectScrollDownButton(props: React.ComponentPropsWithRef<typeof Button>) {
  return <SelectScrollButton {...props} duck-select-scroll-down-button="" scrollDown={true} />
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
  SelectScrollUpButton,
  SelectScrollDownButton,
}
