'use client'

import { usePopoverContext } from '@gentleduck/aria-feather/popover'
import { cn } from '@gentleduck/libs/cn'
import { useKeyCommands } from '@gentleduck/vim/react'
import { Check, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { Button } from '../button'
import { useHandleKeyDown } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { RadioGroup, RadioGroupItem } from '../radio-group'
import { useDropdownMenuContext, useDropdownMenuInit } from './dropdown-menu.hooks'
import { DropdownMenuContextType, DropdownMenuShortcutProps, DropdownMenuSubContextType } from './dropdown-menu.types'

export const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

function DropdownMenuImpritive({ children, className, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { open = false, onOpenChange = () => {} } = usePopoverContext()
  const { wrapperRef, groupsRef, itemsRef, selectedItemRef, originalItemsRef } = useDropdownMenuInit(
    open,
    onOpenChange,
    false,
  )
  const { triggerRef, contentRef } = usePopoverContext()

  useHandleKeyDown({
    open,
    itemsRef,
    selectedItem: selectedItemRef.current,
    setSelectedItem: (item) => {
      selectedItemRef.current = item
    },
    originalItemsRef,
    allowAxisArrowKeys: true,
  })

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        onOpenChange,
        wrapperRef,
        triggerRef: triggerRef as never,
        contentRef: contentRef as never,
        groupsRef,
        itemsRef,
        selectedItemRef,
        originalItemsRef,
      }}>
      <div className={cn('relative', className)} duck-dropdown-menu="" {...props} ref={wrapperRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenu({ children, ...props }: React.ComponentPropsWithRef<typeof Popover>) {
  return (
    <Popover {...props}>
      <DropdownMenuImpritive {...props}>{children}</DropdownMenuImpritive>
    </Popover>
  )
}

function DropdownMenuTrigger({
  className,
  children,
  variant = 'outline',
  asChild = false,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverTrigger>) {
  const { triggerRef } = useDropdownMenuContext()
  return (
    <PopoverTrigger
      ref={triggerRef as never}
      variant={variant}
      className={cn('', className)}
      asChild={asChild}
      {...props}
      duck-select-trigger="">
      {children}
    </PopoverTrigger>
  )
}

function DropdownMenuContent({
  children,
  className,
  renderOnce = true,
  side = 'top',
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverContent> & {
  renderOnce?: boolean
}): React.JSX.Element {
  const { contentRef } = useDropdownMenuContext()
  return (
    <PopoverContent
      duck-dropdown-menu-content=""
      className={cn('min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground', className)}
      {...props}
      side={side}
      sideOffset={sideOffset}
      renderOnce={renderOnce}
      ref={contentRef as never}>
      {children}
    </PopoverContent>
  )
}

function DropdownMenuLabel({
  className,
  ref,
  inset,
  ...props
}: React.HTMLProps<HTMLDivElement> & { inset?: boolean }): React.JSX.Element {
  return (
    <div
      ref={ref}
      className={cn('px-2 py-1.5 font-semibold text-sm', inset && 'pl-8', className)}
      {...props}
      duck-dropdown-menu-label=""
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  disabled,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & { inset?: boolean }): React.JSX.Element {
  return (
    <Button
      ref={ref}
      variant={'ghost'}
      size={'sm'}
      duck-dropdown-menu-item=""
      aria-disabled={disabled}
      disabled={disabled}
      className={cn(
        // 'h-auto w-full justify-start cursor-default [&>div]:justify-between [&>div]:w-full px-2 [&[aria-selected]]:bg-secondary focus:bg-secondary',
        // '[&[aria-selected]:focus-visible]:ring-2 [&[aria-selected]:focus-visible]:ring-ring [&[aria-selected]:focus-visible]:ring-offset-2 [&[aria-selected]:focus-visible]:ring-offset-background',
        'h-auto w-full cursor-default justify-start px-2 focus:bg-secondary [&>div]:w-full [&>div]:justify-between', //' [&[aria-selected]:focus-visible]:bg-red-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  keys,
  onKeysPressed,
  ref,
  colored = false,
  ...props
}: DropdownMenuShortcutProps): React.JSX.Element {
  useKeyCommands({
    [keys]: {
      name: keys,
      description: keys,
      execute: () => onKeysPressed(),
    },
  })

  return (
    <kbd
      className={cn(
        'focus:offset-2 [&_svg]:!size-3 !font-sans pointer-events-none ml-auto inline-flex cursor-none select-none items-center gap-[2px] rounded-[4px] px-2 py-[.12rem] text-[.7rem] text-muted-foreground text-secondary-foreground text-xs tracking-widest transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring',
        colored ? 'bg-muted' : 'ltr:-mr-2 rtl:-ml-2',
        className,
      )}
      duck-data-dropdown-menu-shortcut=""
      ref={ref}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} duck-dropdown-menu-separator="" />
  )
}

function DropdownMenuGroup({ className, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return <div className={cn(className)} {...props} duck-dropdown-menu-group="" />
}

export const DropdownMenuSubContext = React.createContext<DropdownMenuSubContextType | null>(null)
export function useDropdownMenuSubContext() {
  const context = React.useContext(DropdownMenuSubContext)
  if (!context) {
    throw new Error('useDropdownMenuSubContext must be used within a DropdownMenuSub')
  }
  return context
}

function DropdownMenuSubImpritive({ children, className, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { open = false, onOpenChange = () => {} } = usePopoverContext()
  const { wrapperRef, groupsRef, itemsRef, selectedItemRef, originalItemsRef } = useDropdownMenuInit(
    open,
    onOpenChange,
    true,
  )
  const { triggerRef, contentRef } = usePopoverContext()

  useHandleKeyDown({
    open,
    itemsRef,
    selectedItem: selectedItemRef.current,
    setSelectedItem: (item) => {
      selectedItemRef.current = item
    },
    originalItemsRef,
    allowAxisArrowKeys: true,
  })

  return (
    <DropdownMenuSubContext.Provider
      value={{
        open,
        onOpenChange,
        wrapperRef,
        triggerRef: triggerRef as never,
        contentRef: contentRef as never,
        groupsRef,
        itemsRef,
        selectedItemRef,
        originalItemsRef,
      }}>
      <div
        className={cn(
          'relative focus:bg-secondary [&>button]:focus:bg-secondary [&[aria-selected]:focus-visible>button]:bg-secondary [&[aria-selected]>button]:bg-secondary',
        )}
        {...props}
        duck-dropdown-menu-sub=""
        ref={wrapperRef}>
        {children}
      </div>
    </DropdownMenuSubContext.Provider>
  )
}

function DropdownMenuSub({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Popover>): React.JSX.Element {
  return (
    <Popover {...props} mouseEnter={true} mouseExist={true} delayDuration={200}>
      <DropdownMenuSubImpritive {...props}>{children}</DropdownMenuSubImpritive>
    </Popover>
  )
}

function DropdownMenuSubTrigger({
  className,
  children,
  secondIcon,
  inset = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button> & { inset?: boolean }) {
  return (
    <PopoverTrigger
      size={'sm'}
      variant={'ghost'}
      duck-dropdown-menu-sub-trigger=""
      className={cn(
        'w-full [&>div]:w-full [&>div]:justify-between',
        '[&:hover+div]:opacity-100',
        '[&[aria-selected]]:bg-secondary',
        '[&[data-open="true"]+div]:opacity-100',
        'data-[open=true]:bg-secondary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent',
        inset && 'pl-8',
        className,
      )}
      secondIcon={secondIcon || <ChevronRight className="rtl:-ml-2 ltr:-mr-2 ltr:rotate-0 rtl:rotate-180" />}
      {...props}>
      {children}
    </PopoverTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  children,
  sideOffset = 4,
  side = 'right',
  align = 'start',
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverContent>) {
  return (
    <PopoverContent
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'ml-1',
        '-mt-1',
        'opacity-0',
        className,
      )}
      side={side}
      sideOffset={sideOffset}
      {...props}
      duck-dropdown-menu-sub-content="">
      {children}
    </PopoverContent>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & { checked?: boolean }) {
  return (
    <DropdownMenuItem
      duck-dropdown-menu-checkbox-item=""
      data-checked={checked}
      ref={ref}
      className={cn(className)}
      {...props}>
      <span className="absolute left-2.5 flex items-center">
        <Check className={cn('!size-4 opacity-0', checked && 'opacity-100')} />
      </span>
      <span className="ltr:pl-7 rtl:pr-7">{children}</span>
    </DropdownMenuItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: React.ComponentPropsWithRef<typeof RadioGroup>) {
  return <RadioGroup duck-dropdown-menu-radio-group="" duck-dropdown-menu-group="" {...props} />
}

function DropdownMenuRadioItem({ ...props }: React.ComponentPropsWithRef<typeof RadioGroupItem>) {
  const groupItemRef = React.useRef<HTMLLIElement>(null)

  return (
    <DropdownMenuItem
      duck-dropdown-menu-item=""
      duck-dropdown-menu-radio-item=""
      onClick={() => {
        groupItemRef.current?.querySelector('label')?.click()
      }}>
      <RadioGroupItem
        ref={groupItemRef}
        {...props}
        className="ltr:pl-[1.25rem] rtl:pr-[1.25rem]"
        customIndicator={
          <span className="-translate-y-1/2 absolute top-1/2 flex size-2 rounded-full bg-foreground transition-all duration-150 ease-in-out ltr:left-1 rtl:right-1" />
        }
      />
    </DropdownMenuItem>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
}
