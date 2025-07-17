'use client'
import { cn } from '@gentleduck/libs/cn'
import { Search } from 'lucide-react'
import React from 'react'
import { Dialog, DialogContent, type DialogProps } from '../dialog'
import { ScrollArea } from '../scroll-area'
import {
  useCommandContext,
  useCommandElements,
  useCommandRefsContext,
  useCommandSearch,
  useHandleKeyDown,
} from './command.hooks'
import type { CommandBadgeProps, CommandContextType, CommandGroupProps, CommandRefsContextType } from './command.types'

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
          'flex h-full w-full max-w-96 flex-col overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-sm',
          className,
        )}
        {...props}
      />
    </CommandContext.Provider>
  )
}

/**
 * The Command component is a wrapper for the CommandInput and CommandList components.
 * It provides the context for the CommandInput and CommandList components.
 *
 * @param {React.ReactNode} children - The children of the Command component.
 * @returns {React.JSX.Element} The rendered Command component.
 */
function Command({ children, ...props }: React.ComponentPropsWithRef<typeof CommandWrapper>): React.JSX.Element {
  return (
    <CommandRefs>
      <CommandWrapper {...props}>{children}</CommandWrapper>
    </CommandRefs>
  )
}

/**
 * @description Component to handle the refs of the command
 * @function CommandInput
 * @param {string} [props.className] - The props of the CommandInput component.
 * @param {React.Ref<HTMLInputElement>} [prop.ref] - The ref of the CommandInput component.
 * @param {React.HTMLAttributes<HTMLInputElement>} [...props] - The props of the CommandInput component.
 * @returns {React.JSX.Element} The rendered CommandInput component.
 */
function CommandInput({
  className,
  placeholder = 'Search...',
  onChange,
  ...props
}: React.HTMLProps<HTMLInputElement>): React.JSX.Element {
  const { setSearch } = useCommandContext()
  const context = useCommandRefsContext()

  return (
    <div className={cn('mb-2 flex items-center gap-2 border-b px-3', className)} cmdk-input-wrapper="">
      <Search className="size-[20px] shrink-0 opacity-50" />
      <input
        ref={context.inputRef}
        onChange={(e) => {
          setSearch(() => e.target.value)
          onChange?.(e)
        }}
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

/**
 * @description Component to handle the refs of the command
 * @function CommandEmpty
 * @param {string} [props.className] - The props of the CommandEmpty component.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} [...props] - The props of the CommandEmpty component.
 * @returns {React.JSX.Element} The rendered CommandEmpty component.
 *
 */
function CommandEmpty({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  const context = useCommandRefsContext()
  return <h6 ref={context.emptyRef} className="hidden py-6 text-center text-sm" {...props} duck-command-empty="" />
}

/**
 * @description Component to handle the refs of the command
 * @function CommandList
 * @param {string} [props.className] - The props of the CommandList component.
 * @param {React.HTMLAttributes<HTMLUListElement>} [...props] - The props of the CommandList component.
 * @returns {React.JSX.Element} The rendered CommandList component.
 */
function CommandList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>): React.JSX.Element {
  const context = useCommandRefsContext()
  return (
    <ScrollArea className="overflow-y-auto overflow-x-hidden">
      <ul ref={context.listRef} className={cn('max-h-[300px] focus:outline-none', className)} {...props} />
    </ScrollArea>
  )
}

/**
 * @description Component to handle the refs of the command
 * @function CommandGroup
 * @param {CommandGroupProps} props - The props of the CommandGroup component.
 * @returns {React.JSX.Element} The rendered CommandGroup component.
 */
function CommandGroup({ className, children, heading, ref, ...props }: CommandGroupProps): React.JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs',
        className,
      )}
      {...props}
      duck-command-group="">
      {heading && <h3 className="pb-1 pl-1 text-muted-foreground text-xs">{heading}</h3>}
      {children}
    </div>
  )
}

/**
 * @description Component to handle the refs of the command
 * @function CommandItem
 * @param {string} [props.className] - The props of the CommandItem component.
 * @param {React.ReactNode} [props.children] - The children of the CommandItem component.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - The ref of the CommandItem component.
 * @param {React.HTMLAttributes<HTMLDivElement>} [...props] - The props of the CommandItem component.
 * @returns {React.JSX.Element} The rendered CommandItem component.
 */
function CommandItem({
  className,
  ref,
  value,
  onClick,
  onSelect,
  ...props
}: React.HTMLProps<HTMLLIElement> & {
  value?: string
  onSelect?: (value: string) => void
}): React.JSX.Element {
  return (
    <li
      ref={ref}
      duck-command-item=""
      onClick={(e) => {
        onSelect?.(value as string)
        onClick?.(e)
      }}
      className={cn(
        "data-[selected= data-[disabled=true]:pointer-events-none'true']:bg-accent relative flex flex cursor-default cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-color duration-300 will-change-300 hover:bg-muted hover:text-accent-foreground data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&[aria-selected]]:bg-secondary [&_svg]:size-4 ",
        className,
      )}
      {...props}
    />
  )
}

/**
 * @description Component to handle the refs of the command
 * @function CommandShortcut
 * @param {CommandBadgeProps} props - The props of the CommandShortcut component.
 * @returns {React.JSX.Element} The rendered CommandShortcut component.
 */
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
        execute: () => onKeysPressed(),
      },
    })
  }

  return (
    <kbd
      className={cn(
        'focus:offset-2 [&_svg]:!size-3 !font-sans pointer-events-none inline-flex cursor-none select-none items-center gap-[2px] rounded-[4px] px-2 py-[.12rem] text-[.7rem] text-muted-foreground text-secondary-foreground text-xs tracking-widest transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring ltr:ml-auto rtl:mr-auto',
        variant === 'secondary' && 'bg-secondary',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

/**
 * @description Component to handle the refs of the command
 * @function CommandSeparator
 * @param {string} [props.className] - The props of the CommandSeparator component.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - The ref of the CommandSeparator component.
 * @param {React.HTMLAttributes<HTMLDivElement>} [...props] - The props of the CommandSeparator component.
 * @returns {React.JSX.Element} The rendered CommandSeparator component.
 */
function CommandSeparator({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div ref={ref} className={cn('-mx-1 my-2 h-px bg-secondary', className)} {...props} duck-command-separator="" />
  )
}

/**
 * @description Component to handle the refs of the command
 * @function CommandDialog
 * @param {string} [props.className] - The props of the CommandDialog component.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - The ref of the CommandDialog component.
 * @param {React.HTMLAttributes<HTMLDivElement>} [...props] - The props of the CommandDialog component.
 * @returns {React.JSX.Element} The rendered CommandDialog component.
 */
function CommandDialog({ children, ...props }: DialogProps): React.JSX.Element {
  return (
    <Dialog {...props}>
      <DialogContent className="rounded-md border-none p-0 open:backdrop:bg-black/80 [&>div>div]:max-w-full">
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
