import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  TooltipProvider,
} from '@/registry/default/ui'

import { Archive, CalendarMinus2, Handshake, MessageCircleMore, Settings, Trash2 } from 'lucide-react'

export default function CommandMaiDemo() {
  return (
    <TooltipProvider>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Archive className="mr-2 h-4 w-4" />
              <span>Archive</span>
            </CommandItem>
            <CommandItem>
              <CalendarMinus2 className="mr-2 h-4 w-4" />
              <span>Schaduling</span>
            </CommandItem>
            <CommandItem disabled>
              <Handshake className="mr-2 h-4 w-4" />
              <span>Deals</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <MessageCircleMore className="mr-2 h-4 w-4" />
              <span>Messages</span>
              <CommandShortcut>⌘M</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Trash</span>
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </TooltipProvider>
  )
}
