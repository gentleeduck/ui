'use client'

import { cn } from '@gentleduck/libs/cn'
import { Search } from 'lucide-react'
import React from 'react'
import { Dialog, DialogContent } from '../dialog'
import { ScrollArea } from '../scroll-area'
import {
  useCommandContext,
  useCommandElements,
  useCommandRefsContext,
  useCommandSearch,
  useHandleKeyDown,
} from './command.hooks'
import type { CommandBadgeProps, CommandContextType, CommandRefsContextType } from './command.types'

export const CommandContext: React.Context<CommandContextType | null> = React.createContext<CommandContextType | null>(
  null,
)

export const CommandRefsContext: React.Context<CommandRefsContextType | null> =
  React.createContext<CommandRefsContextType | null>(null)

function CommandRefs({ children }: { children: React.ReactNode }): React.JSX.Element {
  const commandRef = React.useRef<HTMLDivElement | null>(null)
  const listRef = React.useRef<HTMLUListElement | null>(null)
  const emptyRef = React.useRef<HTMLHeadingElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const [selectedItem, setSelectedItem] = React.useState<HTMLLIElement | null>(null)
  const { itemsRef, groupsRef, filteredItemsRef } = useCommandElements(commandRef)

  return (
    <CommandRefsContext.Provider
      value={{
        commandRef,
        listRef,
        emptyRef,
        inputRef,
        items: itemsRef,
        filteredItems: filteredItemsRef,
        groups: groupsRef,
        selectedItem,
        setSelectedItem,
      }}>
      {children}
    </CommandRefsContext.Provider>
  )
}

function CommandWrapper({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  const [search, setSearch] = React.useState<string>('')
  const { filteredItems, items, setSelectedItem, commandRef, groups, emptyRef, selectedItem } = useCommandRefsContext()

  useCommandSearch(items, search, setSelectedItem, emptyRef, commandRef, groups, filteredItems)
  useHandleKeyDown({
    setSelectedItem: (item) => {
      setSelectedItem(item)
    },
    itemsRef: filteredItems,
    originalItemsRef: items,
    allowAxisArrowKeys: false,
    selectedItem: selectedItem,
    open: true,
  })

  return (
    <CommandContext.Provider
      value={{
        search,
        setSearch,
      }}>
      <div
        ref={commandRef}
        duck-command-wrapper=""
        className={cn(
          'flex h-full w-full max-w-96 flex-col overflow-hidden rounded-md bg-popover p-2 text-popover-foreground shadow-sm',
          className,
        )}
        {...props}
      />
    </CommandContext.Provider>
  )
}

function Command({ children, ...props }: React.ComponentPropsWithRef<typeof CommandWrapper>): React.JSX.Element {
  return (
    <CommandRefs>
      <CommandWrapper {...props}>{children}</CommandWrapper>
    </CommandRefs>
  )
}

function CommandInput({
  className,
  placeholder = 'Search...',
  onChange,
  autoFocus = true,
  ...props
}: React.HTMLProps<HTMLInputElement>): React.JSX.Element {
  const { setSearch } = useCommandContext()
  const context = useCommandRefsContext()

  return (
    <div className={cn('mb-2 flex items-center gap-2 border-b px-1', className)} cmdk-input-wrapper="">
      <Search className="size-[20px] shrink-0 opacity-50" />
      <input
        ref={context.inputRef}
        onChange={(e) => {
          setSearch(() => e.target.value)
          onChange?.(e)
        }}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        )}
        tabIndex={0}
        {...props}
      />
    </div>
  )
}

function CommandEmpty({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  const context = useCommandRefsContext()
  return <h6 ref={context.emptyRef} className="hidden py-6 text-center text-sm" {...props} duck-command-empty="" />
}

function CommandList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>): React.JSX.Element {
  const context = useCommandRefsContext()
  return (
    <ScrollArea className="overflow-y-auto overflow-x-hidden">
      <ul ref={context.listRef} className={cn('max-h-[300px] focus:outline-none', className)} {...props} />
    </ScrollArea>
  )
}

function CommandGroup({
  className,
  children,
  heading,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  /** The title for the command group. */
  heading?: string
}): React.JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-sm',
        className,
      )}
      {...props}
      duck-command-group="">
      {heading && <h3 className="pb-1 pl-1 text-muted-foreground text-sm">{heading}</h3>}
      {children}
    </div>
  )
}

function CommandItem({
  className,
  ref,
  value,
  onClick,
  onSelect,
  onKeyDown,
  ...props
}: Omit<React.HTMLProps<HTMLLIElement>, 'onSelect'> & {
  value?: string
  onSelect?: (value: string) => void
}): React.JSX.Element {
  return (
    <li
      ref={ref}
      duck-command-item=""
      onKeyDown={onKeyDown}
      onClick={(e) => {
        onSelect?.(value as string)
        onClick?.(e)
      }}
      className={cn(
        "data-[selected= data-[disabled=true]:pointer-events-none'true']:bg-accent relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-color duration-300 will-change-300 hover:bg-muted hover:text-accent-foreground data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&[aria-selected]]:bg-secondary [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  )
}

import { useKeyCommands } from '@gentleduck/vim/react'

function CommandShortcut({
  className,
  keys,
  onKeysPressed,
  variant = 'default',
  ref,
  ...props
}: CommandBadgeProps): React.JSX.Element {
  if (keys && onKeysPressed) {
    useKeyCommands({
      [keys]: {
        name: keys,
        description: keys,
        execute: () => {
          onKeysPressed()
        },
      },
    })
  }

  return (
    <kbd
      className={cn(
        'focus:offset-2 [&_svg]:!size-3 !font-sans pointer-events-none inline-flex cursor-none select-none items-center gap-[2px] rounded-[4px] px-2 py-[.12rem] text-secondary-foreground text-sm tracking-widest transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring ltr:ml-auto rtl:mr-auto',
        variant === 'secondary' && 'bg-secondary',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

function CommandSeparator({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div ref={ref} className={cn('-mx-1 my-2 h-px bg-secondary', className)} {...props} duck-command-separator="" />
  )
}

function CommandDialog({ children, ...props }: React.ComponentPropsWithRef<typeof Dialog>): React.JSX.Element {
  return (
    <Dialog {...props}>
      <DialogContent className="p-0 lg:w-[500px] [&>div]:max-w-full">
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandShortcut,
  CommandSeparator,
  CommandDialog,
}
