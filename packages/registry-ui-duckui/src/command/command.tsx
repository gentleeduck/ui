import React from 'react'
import { cn } from '@gentleduck/libs/cn'
import { Search } from 'lucide-react'
import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
import {
  CommandBadgeProps,
  CommandContextType,
  CommandEmptyProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandProps,
  CommandSeparatorProps,
} from './command.types'
import { debounce, useDebounce } from '@gentleduck/hooks'
import { useCommandContext } from './command.hooks'
import { Dialog, DialogContent, DialogProps } from '../experimental/dialog'
import { ScrollArea } from '../experimental/scroll-area'

/**
 * @type {React.Context<CommandContextType|null>}
 * @description The context for the Command components. It holds the current search query and a function to update it.
 */
export const CommandContext: React.Context<CommandContextType | null> = React.createContext<CommandContextType | null>(
  null,
)

/**
 * Command Component
 *
 * @component
 * @param {React.HTMLProps<HTMLDivElement>} props - The component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - Reference to the underlying div element.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - The component props.
 * @returns {JSX.Element} The rendered Command component.
 */
function Command({ className, ref, ...props }: CommandProps): React.JSX.Element {
  const [search, setSearch] = React.useState<string>('')

  return (
    <CommandContext.Provider
      value={{
        search,
        setSearch,
      }}>
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
          className,
        )}
        {...props}
      />
    </CommandContext.Provider>
  )
}

/**
 * CommandInput Component
 *
 * @component
 * @param {React.HTMLProps<HTMLInputElement>} props - The component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref<HTMLInputElement>} [props.ref] - Reference to the input element.
 * @param {React.HTMLProps<HTMLInputElement>} [...props] - The component props.
 * @returns {JSX.Element} The rendered CommandInput component.
 */
function CommandInput({ className, ref, ...props }: CommandInputProps): React.JSX.Element {
  const { setSearch } = useCommandContext()

  return (
    <div className="flex items-center border-b px-3 gap-2" cmdk-input-wrapper="">
      <Search className="size-[20px] shrink-0 opacity-50" />
      <input
        ref={ref}
        onChange={(e) => setSearch(e.target.value)}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  )
}

/**
 * CommandEmpty Component
 *
 * @component
 * @param {React.HTMLProps<HTMLLIElement>} props - The component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref<HTMLHeadingElement>} [props.ref] - Reference to the heading element.
 * @param {React.HTMLProps<HTMLLIElement>} [...props] - Additional props.
 * @returns {JSX.Element} The rendered CommandEmpty component.
 */
function CommandEmpty({ className, ref, ...props }: CommandEmptyProps): React.JSX.Element {
  return <h6 ref={ref} className="py-6 text-center text-sm" {...props} />
}

/**
 * CommandList Component
 *
 * @component
 * @param {React.HTMLProps<HTMLLIElement>} props - The component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {(search: string) => React.ReactNode} props.children - A render prop that receives the current search query.
 * @param {React.Ref<HTMLUListElement>} [props.ref] - Reference to the ul element.
 * @param {React.HTMLProps<HTMLLIElement>} [...props] - Additional props.
 * @returns {JSX.Element} The rendered CommandList component.
 */

function CommandList({ className, children, ref, ...props }: CommandListProps): React.JSX.Element {
  const { search } = useCommandContext()
  return (
    <ScrollArea>
      <ul ref={ref} className={cn('max-h-[300px]', className)} children={children(search)} {...props} />
    </ScrollArea>
  )
}
/**
 * CommandGroup Component
 *
 * @component
 * @param {React.HTMLProps<HTMLLIElement>} props - The component props.
 * @param {string} props.heading - The title for the group.
 * @param {React.ReactNode} props.children - The items within this group.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - Reference to the div element.
 * @param {React.HTMLProps<HTMLLIElement>} [...props] - Additional props.
 * @returns {JSX.Element} The rendered CommandGroup component.
 */
function CommandGroup({ className, children, heading, ref, ...props }: CommandGroupProps): React.JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden p-2 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...props}>
      <h3 className="text-xs text-muted-foreground pb-1 pl-1">{heading}</h3>
      {children}
    </div>
  )
}

/**
 * CommandItem Component
 *
 * @component
 * @param {React.HTMLProps<HTMLLIElement>} props - The component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref<HTMLLIElement>} [props.ref] - Reference to the list item element.
 * @param {React.HTMLProps<HTMLLIElement>} [...props] - Additional props.
 * @returns {JSX.Element} The rendered CommandItem component.
 */
function CommandItem({ className, ref, ...props }: CommandItemProps): React.JSX.Element {
  return (
    <li
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 flex gap-2 hover:bg-muted cursor-pointer transition-color duration-300 will-change-300 hover:text-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}

/**
 * CommandShortcut Component
 *
 * @component
 * @param {React.HTMLProps<HTMLElement>} props - The component props.
 * @param {string} props.keys - The keyboard shortcut keys (e.g., "ctrl+K").
 * @param {() => void} props.onKeysPressed - Callback when the shortcut is activated.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref<HTMLElement>} [props.ref] - Reference to the kbd element.
 * @param {React.HTMLProps<HTMLElement>} [...props] - Additional props.
 * @returns {JSX.Element} The rendered CommandShortcut component.
 */
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
/**
 * CommandSeparator Component
 *
 * @component
 * @param {React.HTMLProps<HTMLDivElement>} props - The component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - Reference to the separator div.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - The component props.
 * @returns {React.JSX.Element} The rendered CommandSeparator component.
 */
function CommandSeparator({ className, ref, ...props }: CommandSeparatorProps): React.JSX.Element {
  return <div ref={ref} className={cn('-mx-1 h-px bg-border mx-2', className)} {...props} />
}

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent renderOnce={false} className="[&>.content-wrapper]:p-0">
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
