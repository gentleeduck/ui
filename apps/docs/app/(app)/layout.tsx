'use client'
import { SiteHeader } from '~/components/layouts/site-header'
import { SiteFooter } from '~/components/layouts/site-footer'
import { CommandMenu } from '~/components/layouts'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const html = document.documentElement
  // html.setAttribute('dir', 'rtl')
  return (
    <div data-wrapper="" className="flex items-center place-content-center min-h-screen flex-col gap-8">
      <SelectScrollable />
    </div>
    // <SiteHeader />
    // <main className="flex flex-1 flex-col">{children}</main>
    //   <SiteFooter />
  )
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui-duckui/select'
import { Calendar, Clock, MicOff, Users, Video, X } from 'lucide-react'

export function SelectDemo() {
  return (
    <>
      <Select open={true}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Choose a meeting" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Upcoming Meetings</SelectLabel>

            <SelectItem value="daily-standup">
              <div className="flex items-start gap-2">
                <Video className="mt-1 size-4.5 text-blue-500" />
                <div className="space-y-0.5">
                  <div className="font-medium">Daily Standup</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    9:00 AM - 9:15 AM
                  </div>
                </div>
              </div>
            </SelectItem>

            <SelectItem value="team-sync">
              <div className="flex items-start gap-2">
                <Users className="mt-1 h-4 w-4 text-green-600" />
                <div className="space-y-0.5">
                  <div className="font-medium">Team Sync</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Tomorrow at 11:00 AM
                  </div>
                </div>
              </div>
            </SelectItem>

            <SelectItem value="1on1">
              <div className="flex items-start gap-2">
                <MicOff className="mt-1 h-4 w-4 text-gray-500" />
                <div className="space-y-0.5">
                  <div className="font-medium">1-on-1 with Ahmed</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    2:00 PM - 2:30 PM
                  </div>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>{' '}
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
import { Calculator, CreditCard, Settings, Smile, User } from 'lucide-react'

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
import React from 'react'

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

export function SelectScrollable() {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>

        <SelectContent className="w-[280px]">
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
            <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
            <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe & Africa</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
            <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
            <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
            <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
            <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
            <SelectItem value="ist_indonesia">Indonesia Central Standard Time (WITA)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Australia & Pacific</SelectLabel>
            <SelectItem value="awst">Australian Western Standard Time (AWST)</SelectItem>
            <SelectItem value="acst">Australian Central Standard Time (ACST)</SelectItem>
            <SelectItem value="aest">Australian Eastern Standard Time (AEST)</SelectItem>
            <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
            <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>South America</SelectLabel>
            <SelectItem value="art">Argentina Time (ART)</SelectItem>
            <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
            <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
            <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}
