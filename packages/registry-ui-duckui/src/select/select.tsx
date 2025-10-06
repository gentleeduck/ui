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
  defaultValue,
}: {
  children: React.ReactNode
  scrollable?: boolean
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}) {
  const { open, setOpen: onOpenChange } = usePopoverContext()

  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
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
        contentRef,
        selectedItemRef,
        itemsRef,
        setSelectedItem,
        onOpenChange,
        value,
        onValueChange,
        defaultValue as string,
      )
    }, 0)
  }, [open])

  useSelectScroll(open, itemsRef, selectedItemRef, contentRef)
  useHandleKeyDown({
    itemsRef,
    open,
    originalItemsRef: itemsRef,
    selectedItem,
    setSelectedItem: (item) => {
      selectedItemRef.current = item
    },
  })

  return (
    <SelectContext.Provider
      value={{
        contentRef,
        groupsRef,
        itemsRef,
        open,
        scrollable,
        selectedItem,
        triggerRef: triggerRef,
        value,
      }}>
      {children}
    </SelectContext.Provider>
  )
}

function Select({
  children,
  onValueChange,
  contextMenu,
  defaultValue,
  value,
  ...props
}: React.ComponentPropsWithRef<typeof Popover> & {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  scrollable?: boolean
}) {
  return (
    <Popover {...props} contextMenu={contextMenu} matchWidth>
      <SelectWrapper {...props} defaultValue={defaultValue} onValueChange={onValueChange} value={value}>
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
      className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-between text-base', className)}
      data-slot="select-trigger"
      duck-select-trigger=""
      ref={triggerRef as never}>
      {children}
      <span className="[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground [&>svg]:duration-300">
        {customIndicator ? customIndicator : <ChevronDown className="-mr-1" />}
      </span>
    </PopoverTrigger>
  )
}

function SelectContent({ children, className, ...props }: React.ComponentPropsWithRef<typeof PopoverContent>) {
  const { scrollable, contentRef } = useSelectContext()
  return (
    <PopoverContent
      className={cn('w-auto px-1.5 [&>div]:w-full', scrollable ? 'py-0' : 'py-1', className)}
      data-slot="select-content"
      duck-select-content=""
      {...props}>
      {scrollable && <SelectScrollUpButton />}
      <div
        className={cn(scrollable && 'max-h-[450px] overflow-y-scroll')}
        data-slot="select-content-scrollable"
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
        'relative flex select-none items-center gap-2 truncate rounded-xs text-sm outline-hidden',
        className,
      )}
      {...props}
      data-slot="select-value"
      duck-select-value="">
      {value.length > 0 ? value : <span className="text-muted-foreground">{placeholder}</span>}
    </div>
  )
}

function SelectLabel({ htmlFor, children, className, ref, ...props }: React.HTMLProps<HTMLLabelElement>) {
  return (
    <label
      className={cn('px-2 text-muted-foreground text-sm', className)}
      htmlFor={htmlFor}
      ref={ref}
      {...props}
      data-slot="select-label"
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
      aria-haspopup="dialog"
      id={id}
      popoverTarget={id}
      popoverTargetAction="hide"
      ref={ref}
      role="checkbox"
      {...props}
      aria-disabled={disabled}
      className={cn(
        "relative flex flex w-full cursor-default cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1 text-sm outline-hidden transition-color duration-300 will-change-300 hover:bg-background hover:text-accent-foreground data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground [&[aria-selected]]:bg-muted",
        disabled && 'pointer-events-none opacity-50',
      )}
      data-slot="select-item"
      data-value={value}
      duck-select-item=""
      value={value}>
      <div
        className={cn(
          'relative flex select-none items-center gap-2 truncate rounded-xs text-sm outline-hidden',
          className,
        )}>
        {children}
      </div>
      {(_value.length > 0 ? _value : selectedItem?.getAttribute('data-value')) === String(value) && (
        <span
          className="absolute flex items-center justify-center transition-none duration-0 ltr:right-2 ltr:pl-2 rtl:left-2 rtl:pr-2"
          data-slot="select-indicator"
          duck-select-indicator=""
          id="select-indicator">
          <CheckIcon className="!size-3.5 shrink-0" />
        </span>
      )}
    </li>
  )
}

function SelectSeparator({ children, className, ref, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      ref={ref}
      {...props}
      data-slot="select-separator"
      duck-select-separator=""
    />
  )
}

function SelectScrollButton({
  children,
  className,
  scrollDown,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & { scrollDown?: boolean }) {
  return (
    <Button
      className={cn(
        'sticky z-50 w-full cursor-default cursor-pointer rounded-none bg-background p-0 [&>div]:justify-center',
        scrollDown ? 'bottom-0' : '',
        className,
      )}
      size="sm"
      variant="nothing"
      {...props}
      data-slot="select-scroll-up-button"
      duck-select-scroll-button="">
      {scrollDown ? <ChevronDown className="shrink-0" /> : <ChevronUp className="shrink-0" />}
    </Button>
  )
}

function SelectScrollUpButton(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <SelectScrollButton
      {...props}
      data-slot="select-scroll-up-button"
      duck-select-scroll-up-button=""
      scrollDown={false}
    />
  )
}

function SelectScrollDownButton(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <SelectScrollButton
      {...props}
      data-slot="select-scroll-down-button"
      duck-select-scroll-down-button=""
      scrollDown={true}
    />
  )
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
