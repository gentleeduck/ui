import { cn } from '@gentelduck/libs/cn'
import { groupDataByNumbers } from '@gentelduck/libs/group-data-by-numbers'
import { Dialog, DialogContent } from '@gentelduck/registry-ui-duckui/dialog'
import { DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { Check, Search } from 'lucide-react'
import React, { useMemo } from 'react'
import { Checkbox } from '../checkbox'
import { ScrollArea } from '../scroll-area'
import { Separator } from '../separator'
import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
import { Button } from '../button'
import {
  CommandBadgeProps,
  CommandEmptyProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandProps,
} from './command.types'
import { Input } from '../input'
import {
  debounceCallback,
  useDebounceCallback,
} from '@gentelduck/hooks/use-debounce'

interface CommandDialogProps extends DialogProps { }

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className='overflow-hidden p-0 shadow-lg'>
        <Command className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className,
    )}
    {...props}
  />
))

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
))

/* --------------------------------------------------------------------------------------------- */

export type CommandContextType = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}
const CommandContext = React.createContext<CommandContextType | null>(null)
function useCommandContext() {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error('useCommandContext must be used within a CommandProvider')
  }
  return context
}

function Command({ className, ref, ...props }: CommandProps) {
  const [search, setSearch] = React.useState<string>('')

  return (
    <CommandContext.Provider
      value={{
        search,
        setSearch,
      }}
    >
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

function CommandInput({ className, ref, ...props }: CommandInputProps) {
  const { setSearch } = useCommandContext()
  const debouncedSetSearch = useDebounceCallback(setSearch, 300)

  return (
    <div
      className='flex items-center border-b px-3 gap-1'
      cmdk-input-wrapper=''
    >
      <Search className='h-4 w-4 shrink-0 opacity-50' />
      <input
        ref={ref}
        onChange={(e) => debouncedSetSearch(e.target.value)}
        className={cn(
          'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export function CommandEmpty({ className, ref, ...props }: CommandEmptyProps) {
  return <h6 ref={ref} className='py-6 text-center text-sm' {...props} />
}

function CommandList({ className, children, ref, ...props }: CommandListProps) {
  const { search } = useCommandContext()
  return (
    <ul
      ref={ref}
      className={cn(
        'max-h-[300px] overflow-y-auto overflow-x-hidden p-1',
        className,
      )}
      children={children(search)}
      {...props}
    />
  )
}

const CommandItem = ({ className, ref, ...props }: CommandItemProps) => (
  <li
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 flex gap-2",
      className,
    )}
    {...props}
  />
)

function CommandShortcut({
  className,
  keys,
  onKeysPressed,
  ref,
  ...props
}: CommandBadgeProps) {
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

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
