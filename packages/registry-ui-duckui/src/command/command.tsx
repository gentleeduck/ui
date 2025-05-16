import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
import { cn } from '@gentleduck/libs/cn'
import { Search } from 'lucide-react'
import React from 'react'
import { Dialog, DialogContent, DialogProps } from '../dialog'
import { ScrollArea } from '../scroll-area'
import { useCommandContext, useCommandElements, useCommandRefsContext, useCommandSearch } from './command.hooks'
import { styleItem } from './command.libs'
import {
  CommandBadgeProps,
  CommandContextType,
  CommandGroupProps,
  CommandItemProps,
  CommandProps,
  CommandRefsContextType,
  CommandSeparatorProps,
} from './command.types'

export const CommandContext: React.Context<CommandContextType | null> = React.createContext<CommandContextType | null>(
  null,
)
export const CommandRefsContext: React.Context<CommandRefsContextType | null> =
  React.createContext<CommandRefsContextType | null>(null)

// TODO: remove the redundancy of the class mutaion.
// TODO: filter the items and set the first item to be selected and styled.

function CommandRefs({ children }: { children: React.ReactNode }) {
  // References
  const commandRef = React.useRef<HTMLDivElement | null>(null)
  const listRef = React.useRef<HTMLUListElement | null>(null)
  const emptyRef = React.useRef<HTMLHeadingElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const filteredItems = React.useRef<HTMLLIElement[]>([])

  // Getting the items
  const { items, groups } = useCommandElements(commandRef)

  const [selectedItem, setSelectedItem] = React.useState<HTMLLIElement | null>(null)

  return (
    <CommandRefsContext.Provider
      value={{ commandRef, listRef, emptyRef, inputRef, items, filteredItems, groups, selectedItem, setSelectedItem }}>
      {children}
    </CommandRefsContext.Provider>
  )
}

function CommandWrapper({ className, ref, ...props }: CommandProps): React.JSX.Element {
  // States
  const [search, setSearch] = React.useState<string>('')

  const { filteredItems, items, setSelectedItem, selectedItem, commandRef, groups, listRef, emptyRef, inputRef } =
    useCommandRefsContext()

  // Command handle search functionality
  useCommandSearch(items, search, setSelectedItem, emptyRef, commandRef, groups, filteredItems)

  React.useEffect(() => {
    if (!commandRef.current || items.current.length === 0) return
    let currentItem = 0

    // This will add the class to the first item.
    styleItem((filteredItems.current?.[currentItem] as HTMLLIElement) ?? null)
    setSelectedItem((filteredItems.current?.[currentItem] as HTMLLIElement) ?? null)

    function handleItemsSelection() {
      // Resetting the position when the search query is empty

      // This will remove the class from all filteredItems.and add it to the right one.
      for (let i = 0; i < filteredItems.current.length; i++) {
        const item = filteredItems.current[i] as HTMLLIElement
        item.classList.remove('bg-secondary')
        item.blur()
        item.removeAttribute('duck-item-selected')

        if (i === currentItem) {
          styleItem(item)
          setSelectedItem(item)
          item.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        currentItem = currentItem === filteredItems.current.length - 1 ? 0 : currentItem + 1
      } else if (e.key === 'ArrowUp') {
        currentItem = currentItem === 0 ? filteredItems.current.length - 1 : currentItem - 1
      } else if (e.key === 'Enter') {
        ;(filteredItems.current[currentItem] as HTMLLIElement)?.click()
      }
      handleItemsSelection()
    }

    // Here i am tracking keyboard keys strokes to navigate through the filteredItems.
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [items, search])

  React.useEffect(() => {
    // const select = document.querySelector('li[duck-item-selected]')
    console.log(filteredItems, 'select')
  }, [search])

  return (
    <CommandContext.Provider
      value={{
        search,
        setSearch,
      }}>
      <div
        ref={commandRef}
        data-command-wrapper=""
        className={cn(
          'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground p-2',
          className,
        )}
        {...props}
      />
    </CommandContext.Provider>
  )
}

function Command({ children, ...props }: CommandProps): React.JSX.Element {
  return (
    <CommandRefs>
      <CommandWrapper>{children}</CommandWrapper>
    </CommandRefs>
  )
}

function CommandInput({
  className,
  onChange,
  ...props
}: React.HtmlHTMLAttributes<HTMLInputElement>): React.JSX.Element {
  const { setSearch } = useCommandContext()
  const context = useCommandRefsContext()

  return (
    <div className="flex items-center border-b px-3 gap-2" cmdk-input-wrapper="">
      <Search className="size-[20px] shrink-0 opacity-50" />
      <input
        ref={context.inputRef}
        onChange={(e) => {
          setSearch(() => e.target.value)
          onChange?.(e)
        }}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        tabIndex={0}
        {...props}
      />
    </div>
  )
}

function CommandEmpty({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  const context = useCommandRefsContext()
  return <h6 ref={context.emptyRef} className="py-6 text-center text-sm hidden" {...props} data-command-empty="" />
}

function CommandList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>): React.JSX.Element {
  const context = useCommandRefsContext()
  return (
    <ScrollArea>
      <ul ref={context.listRef} className={cn('max-h-[300px] focus:outline-none', className)} {...props} />
    </ScrollArea>
  )
}

function CommandGroup({ className, children, heading, ref, ...props }: CommandGroupProps): React.JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden p-2 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...props}
      duck-command-group="">
      <h3 className="text-xs text-muted-foreground pb-1 pl-1">{heading}</h3>
      {children}
    </div>
  )
}

function CommandItem({ className, ref, ...props }: CommandItemProps): React.JSX.Element {
  return (
    <li
      ref={ref}
      duck-command-item=""
      className={cn(
        "relative flex cursor-default select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 flex gap-2 hover:bg-muted cursor-pointer transition-color duration-300 will-change-300 hover:text-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}
function CommandShortcut({ className, keys, onKeysPressed, ref, ...props }: CommandBadgeProps): React.JSX.Element {
  useDuckShortcut({
    keys,
    onKeysPressed: () => {
      window.event?.preventDefault()
      onKeysPressed()
    },
  })

  return (
    <kbd
      className={cn(
        'inline-flex items-center gap-[2px] transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:offset-2 text-[.7rem] py-[.12rem] px-2 rounded-[4px] text-secondary-foreground [&_svg]:!size-3 !font-sans cursor-none pointer-events-none select-none ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}
function CommandSeparator({ className, ref, ...props }: CommandSeparatorProps): React.JSX.Element {
  return <div ref={ref} className={cn('-mx-1 h-px bg-border mx-2', className)} {...props} duck-command-separator="" />
}

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="[&>.content-wrapper]:p-0 open:backdrop:bg-black/80">
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
