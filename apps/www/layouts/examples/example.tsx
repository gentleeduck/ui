'use client'

import { Button } from '@gentelduck/registry-ui-duckui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@gentelduck/registry-ui-duckui/tooltip'
import {
  BarChart,
  Bell,
  CalendarIcon,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentelduck/registry-ui-duckui/dialog'
import {
  Command as CCommand,
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from 'lucide-react'

import { Avatar } from '@gentelduck/registry-ui-duckui/avatar'
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@gentelduck/registry-ui-duckui/hover-card'
import { Input } from '@gentelduck/registry-ui-duckui/input'
import { Label } from '@gentelduck/registry-ui-duckui/label'
import { CssVariable } from 'next/dist/compiled/@next/font'
import React from 'react'
import Image from 'next/image'

export function MainExample() {
  const items = [
    // {
    //   title: 'Navigation',
    //   items: [
    //     { name: 'Dashboard', icon: <LayoutDashboard />, key: 'ctrl+D' },
    //     { name: 'Projects', icon: <Folder />, key: 'ctrl+P' },
    //     { name: 'Reports', icon: <BarChart />, key: 'ctrl+R' },
    //     { name: 'Teams', icon: <Users />, key: 'ctrl+T' },
    //   ],
    // },
    // {
    //   title: 'User Actions',
    //   items: [
    //     { name: 'Create New Task', icon: <PlusCircle />, key: 'ctrl+N' },
    //     { name: 'Assign User', icon: <UserPlus />, key: 'ctrl+A' },
    //     { name: 'Delete Item', icon: <Trash2 />, key: 'ctrl+Del' },
    //   ],
    // },
    // {
    //   title: 'Settings',
    //   items: [
    //     { name: 'Profile Settings', icon: <UserCog />, key: 'ctrl+S' },
    //     { name: 'Notifications', icon: <Bell />, key: 'ctrl+O' },
    //     { name: 'Dark Mode', icon: <Moon />, key: 'ctrl+M' },
    //     { name: 'Language', icon: <Globe />, key: 'ctrl+L' },
    //   ],
    // },
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
        <Tooltip open={true} className=''>
          <TooltipTrigger
            variant={'outline'}
            size={'default'}
            icon={<Calendar />}
            className='group-data-[method="forced"]/tooltip:bg-muted'
          >
            Mettings
          </TooltipTrigger>

          <TooltipContent>5 meetings remaining for today.</TooltipContent>
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
                <React.Fragment key={group.title}>
                  <CommandGroup heading={group.title}>
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
                </React.Fragment>
              ))
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )
          }}
        </CommandList>
      </Command>

      <Avatar
        src={
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO7X9JwxJjzfJ6Aqa7NIR9Gf2LpTLrma2ffw&s'
        }
        alt='WD'
      />

      <div></div>

      <Dialog>
        <DialogTrigger variant={'outline'}>Edit Profile</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input id='name' value='wild duck' className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Username
              </Label>
              <Input id='username' value='@wildduck2' className='col-span-3' />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Save changes</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <HoverCard open={true}>
        <HoverCardTrigger asChild>
          <Button variant='link'>@wildduck</Button>
        </HoverCardTrigger>
        <HoverCardContent className='w-80'>
          <div className='flex justify-between space-x-4'>
            <Avatar
              src={
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO7X9JwxJjzfJ6Aqa7NIR9Gf2LpTLrma2ffw&s'
              }
              alt='WD'
            />
            <div className='space-y-1'>
              <h4 className='text-sm font-semibold'>@wildduck</h4>
              <p className='text-sm'>
                The CEO of
                <em className='font-semibold underline'> @gentelduck </em> , the
                most powerful duck in the world
              </p>
              <div className='flex items-center pt-2'>
                <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />{' '}
                <span className='text-xs text-muted-foreground'>
                  Joined December 2021
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
