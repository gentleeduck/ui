'use client'

import * as React from 'react'

import { useKeyCommands } from '@gentleduck/vim/react'
import { DropdownMenuContextType, DropdownMenuShortcutProps } from './dropdown-menu.types'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '../button'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { ShouldRender, useDialogContext, useOverlayClose } from '@gentleduck/aria-feather/dialog'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import { dropdownMenuVariants } from './dropdown-menu.constants'
import { useComputedTimeoutTransition } from '@gentleduck/hooks'
import { handleKeyDown, styleItem } from '../command/command.libs'
import { useState } from 'react'
import { useHandleKeyDown } from './dropdown-menu.libs'
import { useDropdownMenuActions, useDropdownMenuContext } from './dropdown-menu.hooks'

export const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

function DropdownMenu({
  children,
}: {
  children: React.ReactNode
}) {
  const { wrapperRef, triggerRef, contentRef, overlayRef, groupsRef, itemsRef, selectedItemRef } =
    useDropdownMenuActions()
  useHandleKeyDown(itemsRef, selectedItemRef)

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
    <Button data-trigger ref={triggerRef} className={cn('', className)} asChild={asChild} {...props}>
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
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[open="false"]:animate-in data-[open="true"]:animate-out data-[open="true"]:fade-out-0 data-[open="false"]:fade-in-0 data-[open="true"]:zoom-out-95 data-[open="false"]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
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
        'w-full justify-start cursor-default [&>div]:justify-between [&>div]:w-full px-2 [&[aria-selected]]:bg-secondary',
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

function DropdownMenuSub({ className, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return <div className={cn(className)} {...props} duck-dropdown-menu-sub="" />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuCheckboxItem,
  // DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  // DropdownMenuPortal,
  DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  // DropdownMenuRadioGroup,
}
