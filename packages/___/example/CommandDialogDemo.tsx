'use client'

import * as React from 'react'
import {
  Archive,
  CalendarMinus2,
  CreditCard,
  Handshake,
  MessageCircleMore,
  Settings,
  Smile,
  Trash2,
} from 'lucide-react'

import {
  CommandDialog,
  CommandInput,
  CommandListGroup,
  CommandListGroupDataType,
  CommandShortcut,
  TooltipProvider,
} from '@/registry/default/ui/'
import { Button } from '@/registry/registry-ui-components'

const data: CommandListGroupDataType[] = [
  {
    label: 'Archive',
    element: {
      children: (
        <>
          <Archive className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <CommandShortcut>⌘T</CommandShortcut>
        </>
      ),
    },
  },
  {
    label: 'Trash',
    element: {
      children: (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Trash</span>
          <CommandShortcut>⌘T</CommandShortcut>
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
          <CommandShortcut>⌘S</CommandShortcut>
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
    label: 'Deals',
    element: {
      children: (
        <>
          <Handshake className="mr-2 h-4 w-4" />
          <span>Deals</span>
          <CommandShortcut>⌘D</CommandShortcut>
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
          <CommandShortcut>⌘S</CommandShortcut>
        </>
      ),
    },
  },
  {
    label: 'Credit Card',
    element: {
      children: (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Credit Card</span>
          <CommandShortcut>⌘C</CommandShortcut>
        </>
      ),
    },
  },
  {
    label: 'Smile',
    element: {
      children: (
        <>
          <Smile className="mr-2 h-4 w-4" />
          <span>Smile</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </>
      ),
    },
  },
]

export default function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TooltipProvider>
        <Button
          variant="outline"
          title="Command"
          onClick={() => setOpen(true)}
          command={{
            label: '⌘+J',
            key: 'j',
            action: () => setOpen(true),
            state: { open },
          }}
        />
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandListGroup
            data={data}
            group={[3, 3, 2]}
            className="h-[300px]"
            groupheading={['Suggestions', 'Settings']}
            selected={['']}
          />
        </CommandDialog>
      </TooltipProvider>
    </>
  )
}
