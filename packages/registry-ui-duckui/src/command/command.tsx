/**
 * @module CommandComponents
 * @description A complete library of command components that enable building a rich, interactive command palette.
 *
 * @example
 * ```tsx
 * import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandShortcut, CommandSeparator } from './CommandComponents'
 *
 * function App() {
 *   return (
 *     <Command className="custom-command">
 *       <CommandInput placeholder="Search..." />
 *       <CommandList>
 *         {(search) => {
 *           // ... your filtering logic here
 *           return (
 *             <>
 *               <CommandGroup heading="Navigation">
 *                 <CommandItem>Dashboard</CommandItem>
 *                 <CommandItem>Projects</CommandItem>
 *               </CommandGroup>
 *               <CommandEmpty>No results found.</CommandEmpty>
 *             </>
 *           )
 *         }}
 *       </CommandList>
 *     </Command>
 *   )
 * }
 * ```
 * @author wildduck
 */
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
import { useDebounceCallback } from '@gentleduck/hooks'
import { useCommandContext } from './command.hooks'

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
function Command({ className, ref, ...props }: CommandProps): JSX.Element {
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
function CommandInput({ className, ref, ...props }: CommandInputProps): JSX.Element {
  const { setSearch } = useCommandContext()
  const debouncedSetSearch = useDebounceCallback(setSearch, 400)

  return (
    <div className="flex items-center border-b px-3 gap-1" cmdk-input-wrapper="">
      <Search className="h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        onChange={(e) => debouncedSetSearch(e.target.value)}
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
function CommandEmpty({ className, ref, ...props }: CommandEmptyProps): JSX.Element {
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
function CommandList({ className, children, ref, ...props }: CommandListProps): JSX.Element {
  const { search } = useCommandContext()
  return (
    <ul
      ref={ref}
      className={cn(
        'max-h-[300px] overflow-y-auto overflow-x-hidden [scrollbar-width:thin] [scrollbar-gutter:stable]',
        className,
      )}
      children={children(search)}
      {...props}
    />
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
function CommandGroup({ className, children, heading, ref, ...props }: CommandGroupProps): JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden p-2 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...props}>
      <h3 className="text-sm text-muted-foreground pb-1 pl-1">{heading}</h3>
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
function CommandItem({ className, ref, ...props }: CommandItemProps): JSX.Element {
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
function CommandShortcut({ className, keys, onKeysPressed, ref, ...props }: CommandBadgeProps): JSX.Element {
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

export {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandShortcut,
  CommandSeparator,
  // CommandDialog,
}

// interface CommandDialogProps extends DialogP rop s {}
//
// const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
//   return (
//     <Dialog {...props}>
//       <DialogContent className='overflow-hidden p-0 shadow-lg'>
//         <Command className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'>
//           {children}
//         </Command>
//       </DialogContent>
//     </Dialog>
//   )
// }
