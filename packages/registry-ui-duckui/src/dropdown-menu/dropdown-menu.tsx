'use client'

import * as React from 'react'

import { useKeyCommands } from '@gentleduck/vim/react'
import { DropdownMenuContextType, DropdownMenuShortcutProps } from './dropdown-menu.types'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '../button'
import { Check, ChevronRight } from 'lucide-react'
import { useDropdownMenuActions, useDropdownMenuContext } from './dropdown-menu.hooks'
import { RadioGroup, RadioGroupItem } from '../radio-group'
import { useHandleKeyDown } from '../command'

export const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

function DropdownMenu({
  open = false,
  onOpenChange,
  children,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { wrapperRef, triggerRef, contentRef, overlayRef, groupsRef, itemsRef, selectedItemRef, originalItemsRef } =
    useDropdownMenuActions(open, onOpenChange)
  useHandleKeyDown(
    itemsRef,
    (item) => {
      selectedItemRef.current = item
    },
    originalItemsRef,
    triggerRef,
    contentRef,
    onOpenChange,
  )

  return (
    <DropdownMenuContext.Provider
      value={{
        wrapperRef,
        triggerRef,
        contentRef,
        overlayRef,
        groupsRef,
        itemsRef,
        selectedItemRef,
        originalItemsRef,
      }}>
      <div className="relative" duck-dropdown-menu="" ref={wrapperRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({
  className,
  children,
  asChild = false,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { triggerRef } = useDropdownMenuContext()
  return (
    <Button duck-dropdown-menu-trigger="" ref={triggerRef} className={cn('', className)} asChild={asChild} {...props}>
      {children}
    </Button>
  )
}

function DropdownMenuContent({
  children,
  className,
  renderOnce = true,
  side = 'top',
  sideOffset = 8,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  renderOnce?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}): React.JSX.Element {
  const { contentRef, overlayRef } = useDropdownMenuContext()

  return (
    <div
      ref={contentRef}
      duck-dropdown-menu-content=""
      data-open={false}
      className={cn(
        'z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[open="false"]:animate-in data-[open="true"]:animate-out data-[open="true"]:fade-out-0 data-[open="false"]:fade-in-0 data-[open="true"]:zoom-out-95 data-[open="false"]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        // 'data-[open="true"]:bg-red-500',
        className,
      )}
      style={{
        margin:
          side === 'left'
            ? `0 0 0 ${sideOffset}px`
            : side === 'right'
              ? `0 ${sideOffset}px 0 0`
              : side === 'top'
                ? `${sideOffset}px 0 0 0`
                : `0 0 ${sideOffset}px 0`,
      }}
      //
      {...props}
    >
      {
        // TODO: add overlay
        // <div className="fixed inset-0 z-[49] " ref={overlayRef} />
      }
      {children}
    </div>
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
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & { inset?: boolean }): React.JSX.Element {
  return (
    <Button
      ref={ref}
      variant={'ghost'}
      size={'sm'}
      duck-dropdown-menu-item=""
      className={cn(
        'h-auto w-full justify-start cursor-default [&>div]:justify-between [&>div]:w-full px-2 [&[aria-selected]]:bg-secondary',
        inset && 'pl-8',
        className,
      )}
      aria-disabled
      // disabled={true}
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
        'inline-flex items-center gap-1 transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:offset-2 py-[.12rem] rounded-xs text-secondary-foreground [&_svg]:!size-3 !font-sans cursor-none pointer-events-none select-none text-xs tracking-widest text-muted-foreground',
        colored && 'bg-muted px-2',
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
    <div
      className={cn(
        'relative',

        '[&[aria-selected]>button]:bg-secondary',
        className,
      )}
      {...props}
      duck-dropdown-menu-sub=""
    />
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
    <Button
      data-trigger
      size={'sm'}
      variant={'ghost'}
      duck-dropdown-menu-item=""
      className={cn(
        '[&>div]:justify-between [&>div]:w-full  w-full',
        '[&:focus-within+div,&:hover+div]:opacity-100',
        '[&[aria-selected]]:bg-secondary',
        '[&[data-open="true"]+div]:opacity-100',
        className,
      )}
      asChild={asChild}
      secondIcon={<ChevronRight
        className="rtl:rotate-180"
      />}
      {...props}>
      {children}
    </Button>
  )
}

function DropdownMenuSubContent({
  className,
  children,
  sideOffset = 8,
  align = 'start',
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  sideOffset?: number
  align?: 'start' | 'end'
}) {
  return (
    <DropdownMenuContent
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md delay-250 transition-opacity',
        'ml-1',
        '-mt-1',
        'opacity-0',
        className,
      )}
      style={
        {
          left: '100%',
          top: 0,
        } as React.CSSProperties
      }
      {...props}
      duck-dropdown-menu-sub-content="">
      {children}
    </DropdownMenuContent>
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
      className={cn('flex items-center space-x-2', className)}
      {...props}>
      <span>{children}</span>
      <span className="text-start flex size-4 items-center justify-center">
        <Check className={cn('size-4 opacity-0 transition-all translate-y-0.75  ease-(--duck-motion-ease)', checked && 'opacity-100 translate-y-0')} />
      </span>
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
        customIndicator={
          <span className="size-2 m-1.5 flex bg-foreground rounded-full" />
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
