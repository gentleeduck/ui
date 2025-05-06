import {
  Command,
  CommandInput,
  CommandListGroup,
  CommandListGroupDataType,
  CommandShortcut,
  TooltipProvider,
} from '@/registry/default/ui'

import { Archive, CalendarMinus2, Handshake, MessageCircleMore, Settings } from 'lucide-react'

const data: CommandListGroupDataType[] = [
  {
    label: 'Archive',
    element: {
      children: (
        <>
          <Archive className="mr-2 h-4 w-4" />
          <span>Archive</span>
        </>
      ),
    },
  },
  {
    label: 'Schaduling',
    element: {
      children: (
        <>
          <CalendarMinus2 className="mr-2 h-4 w-4" />
          <span>Schaduling</span>
        </>
      ),
    },
  },
  {
    label: 'Deals',
    element: {
      children: (
        <>
          <Handshake className="mr-2 h-4 w-4" />
          <span>Deals</span>
        </>
      ),
    },
  },
  {
    label: 'Messages',
    element: {
      children: (
        <>
          <MessageCircleMore className="mr-2 h-4 w-4" />
          <span>Messages</span>
          <CommandShortcut>⌘M</CommandShortcut>
        </>
      ),
    },
  },
  {
    label: 'Settings',
    element: {
      children: (
        <>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <CommandShortcut>⌘T</CommandShortcut>
        </>
      ),
    },
  },
  {
    label: 'Profile',
    element: {
      children: (
        <>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </>
      ),
    },
  },
]

export default function CommandGroupDemo() {
  return (
    <TooltipProvider>
      <Command className="rounded-lg border shadow-md w-96">
        <CommandInput placeholder="Type a command or search..." />
        <CommandListGroup data={data} group={[2, 4]} groupheading={['Suggestions', 'Settings']} selected={['']} />
      </Command>
    </TooltipProvider>
  )
}
