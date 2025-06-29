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
import { DropdownMenuContextType, DropdownMenuShortcutProps } from './dropdown-menu.types'

export const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

function DropdownMenuImpritive({ children, className, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { open = false, onOpenChange = () => {} } = usePopoverContext()
  const { wrapperRef, triggerRef, contentRef, groupsRef, itemsRef, selectedItemRef, originalItemsRef } =
    useDropdownMenuInit(open, onOpenChange)

  // useHandleKeyDown({
  //   open,
  //   itemsRef,
  //   selectedItem: selectedItemRef.current,
  //   setSelectedItem: (item) => {
  //     selectedItemRef.current = item
  //   },
  //   originalItemsRef,
  //   onOpenChange,
  //   allowAxisArrowKeys: true,
  // })

  return (
    <DropdownMenuContext.Provider
      value={{
        wrapperRef,
        triggerRef,
        contentRef,
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
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof PopoverContent> & {
  renderOnce?: boolean
}): React.JSX.Element {
  return (
    <PopoverContent
      ref={ref}
      duck-dropdown-menu-content=""
      className={cn('min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground', className)}
      {...props}>
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
      className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
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
        'h-auto w-full justify-start cursor-default [&>div]:justify-between [&>div]:w-full px-2 [&[aria-selected]:focus-visible]:ring-2 [&[aria-selected]:focus-visible]:ring-ring [&[aria-selected]:focus-visible]:ring-offset-2 [&[aria-selected]:focus-visible]:ring-offset-background focus:bg-secondary',
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
        'inline-flex items-center gap-[2px] transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:offset-2 text-[.7rem] py-[.12rem] px-2 rounded-[4px] text-secondary-foreground [&_svg]:!size-3 !font-sans cursor-none pointer-events-none select-none ml-auto text-xs tracking-widest text-muted-foreground',
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

export interface DropdownMenuSubContextType {
  wrapperRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  selectedItemRef: React.RefObject<HTMLLIElement | null>
}

export const DropdownMenuSubContext = React.createContext<DropdownMenuSubContextType | null>(null)
export function useDropdownMenuSubContext() {
  const context = React.useContext(DropdownMenuSubContext)
  if (!context) {
    throw new Error('useDropdownMenuSubContext must be used within a DropdownMenuSub')
  }
  return context
}

function DropdownMenuSub({ className, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <Popover hoverable>
      <div
        className={cn(
          'relative focus:bg-secondary [&[aria-selected]>button]:bg-secondary [&[aria-selected]:focus-visible>button]:bg-secondary [&>button]:focus:bg-secondary',
        )}
        {...props}
        duck-dropdown-menu-sub=""
      />
    </Popover>
  )
}

function DropdownMenuSubTrigger({
  className,
  children,
  asChild = false,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  return (
    <PopoverTrigger
      size={'sm'}
      variant={'ghost'}
      duck-dropdown-menu-item=""
      className={cn(
        '[&>div]:justify-between [&>div]:w-full w-full',
        '[&:hover+div]:opacity-100',
        '[&[aria-selected]]:bg-secondary',
        '[&[data-open="true"]+div]:opacity-100',
        className,
      )}
      asChild={asChild}
      secondIcon={<ChevronRight className="rtl:rotate-180 ltr:rotate-0 rtl:-ml-2 ltr:-mr-2" />}
      {...props}>
      {children}
    </PopoverTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  children,
  sideOffset = 8,
  align = 'start',
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof PopoverContent>) {
  return (
    <PopoverContent
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'ml-1',
        '-mt-1',
        'opacity-0',
        className,
      )}
      ref={ref}
      style={
        {
          left: '100%',
          top: 0,
        } as React.CSSProperties
      }
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
          <span className="absolute ltr:left-1 rtl:right-1 top-1/2 -translate-y-1/2 size-2 flex bg-foreground rounded-full transition-all duration-150 ease-in-out" />
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
