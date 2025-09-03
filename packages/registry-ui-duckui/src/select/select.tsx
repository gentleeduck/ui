'use client'

import { cn } from '@gentleduck/libs/cn'
import { usePopoverContext } from '@gentleduck/primitives/popover'
import { CheckIcon, ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'
import { Button, buttonVariants } from '../button'
import { useHandleKeyDown } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { useSelectScroll } from './select.hooks'
import { initRefs } from './select.libs'
import type { SelectContextType } from './select.types'

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
  value = '',
  onValueChange = () => {},
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'value'> & {
  scrollable?: boolean
  value?: string
  onValueChange?: (value: string) => void
}) {
  const { open, setOpen: onOpenChange } = usePopoverContext()

  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLDivElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const groupsRef = React.useRef<HTMLUListElement[]>([])
  const [selectedItem, setSelectedItem] = React.useState<HTMLLIElement | null>(null)
  const itemsRef = React.useRef<HTMLLIElement[]>([])
  const selectedItemRef = React.useRef<HTMLLIElement | null>(null)

  React.useEffect(() => {
    setTimeout(() => {
      initRefs(
        open,
        groupsRef,
        wrapperRef,
        contentRef,

        selectedItemRef,
        itemsRef,
        setSelectedItem,
        onOpenChange,
        value,
        onValueChange,
      )
    }, 0)
  }, [open])

  useSelectScroll(open, itemsRef, selectedItemRef, contentRef)
  useHandleKeyDown({
    open,
    itemsRef,
    originalItemsRef: itemsRef,
    selectedItem,
    setSelectedItem: (item) => {
      selectedItemRef.current = item
    },
  })

  return (
    <SelectContext.Provider
      value={{
        open,
        value,
        wrapperRef,
        selectedItem,
        itemsRef,
        contentRef,
        groupsRef,
        scrollable,
        triggerRef: triggerRef,
      }}>
      <div {...props} duck-select="" ref={wrapperRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function Select({
  children,
  onValueChange,
  contextMenu,
  value,
  ...props
}: React.ComponentPropsWithRef<typeof Popover> & {
  value?: string
  onValueChange?: (value: string) => void
  scrollable?: boolean
}) {
  return (
    <Popover {...props} matchWidth contextMenu={contextMenu}>
      <SelectWrapper {...props} onValueChange={onValueChange} value={value}>
        {children}
      </SelectWrapper>
    </Popover>
  )
}

function SelectTrigger({
  children,
  className,
  customIndicator,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof PopoverTrigger> & { customIndicator?: React.ReactNode }) {
  const { triggerRef } = useSelectContext()
  return (
    <PopoverTrigger
      {...props}
      duck-select-trigger=""
      className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-between text-sm', className)}
      ref={triggerRef}>
      {children}
      <span className="[&>svg]:opacity-50">
        {customIndicator ? customIndicator : <ChevronDown className="-mr-1" />}
      </span>
    </PopoverTrigger>
  )
}

function SelectContent({ children, className, ...props }: React.ComponentPropsWithRef<typeof PopoverContent>) {
  const { scrollable, contentRef } = useSelectContext()
  return (
    <PopoverContent className={cn('px-1.5', scrollable ? 'py-0' : 'py-1', className)} duck-select-content="" {...props}>
      {scrollable && <SelectScrollUpButton />}
      <div
        className={cn(scrollable && 'max-h-[450px] overflow-y-scroll')}
        duck-select-content-scrollable=""
        ref={contentRef as never}>
        {children}
      </div>
      {scrollable && <SelectScrollDownButton />}
    </PopoverContent>
  )
}

function SelectGroup({ children, ...props }: React.HTMLProps<HTMLUListElement>) {
  return <ul {...props}>{children}</ul>
}

function SelectValue({ className, children, placeholder, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { value } = useSelectContext()
  return (
    <div
      className={cn(
        'relative flex select-none items-center gap-2 truncate rounded-xs text-base outline-hidden',
        className,
      )}
      {...props}
      duck-select-value="">
      {value.length > 0 ? value : placeholder}
    </div>
  )
}

function SelectLabel({ htmlFor, children, className, ref, ...props }: React.HTMLProps<HTMLLabelElement>) {
  return (
    <label
      htmlFor={htmlFor}
      ref={ref}
      className={cn('px-2 text-muted-foreground text-sm', className)}
      {...props}
      duck-select-label="">
      {children}
    </label>
  )
}

function SelectItem({
  children,
  value,
  className,
  disabled,
  ref,
  ...props
}: Omit<React.HTMLProps<HTMLLIElement>, 'value'> & { value: string }) {
  const { value: _value, selectedItem } = useSelectContext()
  const id = React.useId()

  return (
    <li
      ref={ref}
      role="checkbox"
      popoverTarget={id}
      popoverTargetAction="hide"
      aria-haspopup="dialog"
      id={id}
      {...props}
      duck-select-item=""
      aria-disabled={disabled}
      data-value={value}
      value={value}
      className={cn(
        "relative flex flex cursor-default cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1 text-base outline-hidden transition-color duration-300 will-change-300 hover:bg-muted hover:text-accent-foreground data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground [&[aria-selected]]:bg-secondary",
        disabled && 'pointer-events-none opacity-50',
      )}>
      <div
        className={cn(
          'relative flex select-none items-center gap-2 truncate rounded-xs text-base outline-hidden',
          className,
        )}>
        {children}
      </div>
      {(_value.length > 0 ? _value : selectedItem?.getAttribute('data-value')) === String(value) && (
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
        scrollDown ? 'bottom-0' : '',
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
