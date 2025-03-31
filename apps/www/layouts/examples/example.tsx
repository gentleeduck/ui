'use client'

import { Button } from '@gentelduck/registry-ui-duckui/button'
import { Tooltip, TooltipContent } from '@gentelduck/registry-ui-duckui/tooltip'
import {
  BarChart,
  Bell,
  Folder,
  Globe,
  Grab,
  LayoutDashboard,
  LineChart,
  LogOut,
  Moon,
  PlusCircle,
  Pointer,
  RefreshCcw,
  Trash2,
  UserCog,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  Command as CCommand,
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gentelduck/registry-ui-duckui/command'
import { CssVariable } from 'next/dist/compiled/@next/font'

export function MainExample() {
  const items = [
    {
      title: 'Navigation',
      items: [
        { name: 'Dashboard', icon: <LayoutDashboard />, key: 'ctrl+D' },
        { name: 'Projects', icon: <Folder />, key: 'ctrl+P' },
        { name: 'Teams', icon: <Users />, key: 'ctrl+T' },
        { name: 'Reports', icon: <BarChart />, key: 'ctrl+R' },
      ],
    },
    {
      title: 'User Actions',
      items: [
        { name: 'Create New Task', icon: <PlusCircle />, key: 'ctrl+N' },
        { name: 'Assign User', icon: <UserPlus />, key: 'ctrl+A' },
        { name: 'Delete Item', icon: <Trash2 />, key: 'ctrl+Del' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { name: 'Profile Settings', icon: <UserCog />, key: 'ctrl+S' },
        { name: 'Notifications', icon: <Bell />, key: 'ctrl+O' },
        { name: 'Dark Mode', icon: <Moon />, key: 'ctrl+M' },
        { name: 'Language', icon: <Globe />, key: 'ctrl+L' },
      ],
    },
    {
      title: 'System',
      items: [
        { name: 'Restart App', icon: <RefreshCcw />, key: 'ctrl+Shift+R' },
        { name: 'Logout', icon: <LogOut />, key: 'ctrl+Q' },
        { name: 'Exit', icon: <X />, key: 'ctrl+Esc' },
      ],
    },
  ]

  return (
    <div className='flex flex-col gap-3 items-center'>
      <div className='relative'>
        <Pointer className='size-3 absolute top-3 right-0 z-10 fill-white' />
        <Tooltip>
          <TooltipContent>5 meetings remaining for today.</TooltipContent>
          <Button
            variant={'outline'}
            size={'default'}
            icon={<Calendar />}
            autoFocus={true}
            className='!ring-0 !outline-0 ring-offset-0 focus:ring-0 focus:outline-0 focus-visible:ring-0 bg-muted'
            style={{
              //@ts-ignore
              '--ring': '0',
            }}
          >
            Mettings
          </Button>
        </Tooltip>
      </div>
      <Button variant={'outline'} size={'default'} icon={<Calendar />}>
        Mettings
        <CommandShortcut
          keys='ctrl+k'
          className='bg-muted'
          onKeysPressed={() => {
            toast('Event has been created', {
              description: 'Sunday, December 03, 2023 at 9:00 AM',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
            })
          }}
        >
          <CCommand className='!size-3' />
          +K
        </CommandShortcut>
      </Button>
      <div className='relative'>
        <Grab className='size-3 absolute -top-1 right-8 z-10 fill-white' />

        <Button
          variant={'outline'}
          size={'default'}
          className='bg-secondary'
          icon={<LineChart />}
        >
          Analytics
        </Button>
      </div>
      <Command className='rounded-lg border shadow-md md:min-w-[450px] pb-2'>
        <CommandInput placeholder='Search...' />
        <CommandList className='max-h-[299px]'>
          {(search) => {
            const filteredGroups = items
              .map((group) => ({
                ...group,
                items: group.items.filter((item) =>
                  item.name.toLowerCase().includes(search.toLowerCase()),
                ),
              }))
              .filter((group) => group.items.length > 0)

            return filteredGroups.length > 0 ? (
              filteredGroups.map((group, idx) => (
                <>
                  <CommandGroup key={group.title} heading={group.title}>
                    {group.items.map((item) => (
                      <CommandItem key={item.key}>
                        {item.icon}
                        <span>{item.name}</span>
                        <CommandShortcut
                          keys={item.key}
                          onKeysPressed={() =>
                            toast.info(`${item.name} triggered`)
                          }
                          className='bg-muted'
                        >
                          ⌘{item.key.split('+')[1]}
                        </CommandShortcut>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {idx !== filteredGroups.length - 1 && <CommandSeparator />}
                </>
              ))
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )
          }}
        </CommandList>
      </Command>
    </div>
  )
}
