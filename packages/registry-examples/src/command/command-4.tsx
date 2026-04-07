'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  MotionCommandItem,
} from '@gentleduck/registry-ui/command'
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

export default function Demo() {
  return (
    <Command className="h-fit w-80 border pt-0">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <MotionCommandItem index={0}>
            <Calendar />
            <span>Calendar</span>
          </MotionCommandItem>
          <MotionCommandItem index={1}>
            <Smile />
            <span>Search Emoji</span>
          </MotionCommandItem>
          <MotionCommandItem index={2} disabled>
            <Calculator />
            <span>Calculator</span>
          </MotionCommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <MotionCommandItem index={3}>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </MotionCommandItem>
          <MotionCommandItem index={4}>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </MotionCommandItem>
          <MotionCommandItem index={5}>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </MotionCommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
