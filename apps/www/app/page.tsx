'use client'
import { MainExample } from '~/layouts'
import * as React from 'react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

export default function Home() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <DropdownMenuCheckboxes />
        </main>
      </div>
    </>
  )
}

import { DropdownMenu } from '@gentleduck/registry-ui-duckui/dropdown-menu'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Command } from 'lucide-react'

type Checked = boolean
export function DropdownMenuCheckboxes() {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)
  const [position, setPosition] = React.useState('top')

  return (
    <DropdownMenu.DropdownMenu
      open={true}
      onOpenChange={(value) => {
        console.log(value)
      }}>
      <DropdownMenu.DropdownMenuTrigger>Open</DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent className="w-56">
        <DropdownMenu.DropdownMenuLabel>Appearance</DropdownMenu.DropdownMenuLabel>
        <DropdownMenu.DropdownMenuSeparator />
        <DropdownMenu.DropdownMenuGroup>
          <DropdownMenu.DropdownMenuCheckboxItem
            checked={showStatusBar}
            onClick={() => setShowStatusBar(!showStatusBar)}>
            Status Bar
          </DropdownMenu.DropdownMenuCheckboxItem>
          <DropdownMenu.DropdownMenuCheckboxItem checked={showActivityBar} disabled>
            Activity Bar
          </DropdownMenu.DropdownMenuCheckboxItem>
          <DropdownMenu.DropdownMenuCheckboxItem checked={showPanel}>Panel</DropdownMenu.DropdownMenuCheckboxItem>
        </DropdownMenu.DropdownMenuGroup>

        <DropdownMenu.DropdownMenuSeparator />
        <DropdownMenu.DropdownMenuRadioGroup value={position} onValueChange={setPosition} defaultValue={position}>
          <DropdownMenu.DropdownMenuRadioItem value="top">Top</DropdownMenu.DropdownMenuRadioItem>
          <DropdownMenu.DropdownMenuRadioItem value="bottom">Bottom</DropdownMenu.DropdownMenuRadioItem>
          <DropdownMenu.DropdownMenuRadioItem value="right">Right</DropdownMenu.DropdownMenuRadioItem>
        </DropdownMenu.DropdownMenuRadioGroup>
        <DropdownMenu.DropdownMenuGroup>
          <DropdownMenu.DropdownMenuItem disabled={true}>Status Bar</DropdownMenu.DropdownMenuItem>
          <DropdownMenu.DropdownMenuItem>Activity Bar</DropdownMenu.DropdownMenuItem>
          <DropdownMenu.DropdownMenuItem>Panel</DropdownMenu.DropdownMenuItem>
        </DropdownMenu.DropdownMenuGroup>
        <DropdownMenu.DropdownMenuSeparator />
        <DropdownMenu.DropdownMenuGroup>
          <DropdownMenu.DropdownMenuSub>
            <DropdownMenu.DropdownMenuSubTrigger>Submenu</DropdownMenu.DropdownMenuSubTrigger>
            <DropdownMenu.DropdownMenuSubContent>
              <DropdownMenu.DropdownMenuItem disabled={true}>Item 1</DropdownMenu.DropdownMenuItem>
              <DropdownMenu.DropdownMenuItem>Item 2</DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuSubContent>
          </DropdownMenu.DropdownMenuSub>
        </DropdownMenu.DropdownMenuGroup>
        <DropdownMenu.DropdownMenuSeparator />
        <DropdownMenu.DropdownMenuGroup>
          <DropdownMenu.DropdownMenuItem disabled={true}>
            Preferences
            <DropdownMenu.DropdownMenuShortcut onKeysPressed={() => {}} keys="⌘">
              <Command />P
            </DropdownMenu.DropdownMenuShortcut>
          </DropdownMenu.DropdownMenuItem>
          <DropdownMenu.DropdownMenuItem>
            Settings
            <DropdownMenu.DropdownMenuShortcut onKeysPressed={() => {}} keys="⌘">
              <Command />P
            </DropdownMenu.DropdownMenuShortcut>
          </DropdownMenu.DropdownMenuItem>
        </DropdownMenu.DropdownMenuGroup>
      </DropdownMenu.DropdownMenuContent>
    </DropdownMenu.DropdownMenu>
  )
}
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

import {
  Command as CCommand,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gentleduck/registry-ui-duckui/command'

export function CommandDemo() {
  return (
    <CCommand>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut onKeysPressed={() => {}} keys="⌘P">
              ⌘P
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut onKeysPressed={() => {}} keys="⌘B">
              ⌘B
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut onKeysPressed={() => {}} keys="⌘S">
              ⌘S
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CCommand>
  )
}

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'light' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
