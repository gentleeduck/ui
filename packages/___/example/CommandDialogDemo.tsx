'use client'

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
import * as React from 'react'

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
    element: {
      children: (
        <>
          <Archive className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <CommandShortcut>⌘T</CommandShortcut>
        </>
      ),
    },
    label: 'Archive',
  },
  {
    element: {
      children: (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Trash</span>
          <CommandShortcut>⌘T</CommandShortcut>
        </>
      ),
    },
    label: 'Trash',
  },
  {
    element: {
      children: (
        <>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </>
      ),
    },
    label: 'Settings',
  },
  {
    element: {
      children: (
        <>
          <MessageCircleMore className="mr-2 h-4 w-4" />
          <span>Messages</span>
          <CommandShortcut>⌘M</CommandShortcut>
        </>
      ),
    },
    label: 'Messages',
  },
  {
    element: {
      children: (
        <>
          <Handshake className="mr-2 h-4 w-4" />
          <span>Deals</span>
          <CommandShortcut>⌘D</CommandShortcut>
        </>
      ),
    },
    label: 'Deals',
  },
  {
    element: {
      children: (
        <>
          <CalendarMinus2 className="mr-2 h-4 w-4" />
          <span>Schaduling</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </>
      ),
    },
    label: 'Schaduling',
  },
  {
    element: {
      children: (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Credit Card</span>
          <CommandShortcut>⌘C</CommandShortcut>
        </>
      ),
    },
    label: 'Credit Card',
  },
  {
    element: {
      children: (
        <>
          <Smile className="mr-2 h-4 w-4" />
          <span>Smile</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </>
      ),
    },
    label: 'Smile',
  },
]

export default function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TooltipProvider>
        <Button
          command={{
            action: () => setOpen(true),
            key: 'j',
            label: '⌘+J',
            state: { open },
          }}
          onClick={() => setOpen(true)}
          title="Command"
          variant="outline"
        />
        <CommandDialog onOpenChange={setOpen} open={open}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandListGroup
            className="h-[300px]"
            data={data}
            group={[3, 3, 2]}
            groupheading={['Suggestions', 'Settings']}
            selected={['']}
          />
        </CommandDialog>
      </TooltipProvider>
    </>
  )
}
