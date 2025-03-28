'use client'

import { Button } from '@gentelduck/registry-ui-duckui/button'
import { Tooltip, TooltipContent } from '@gentelduck/registry-ui-duckui/tooltip'
import { Grab, LineChart, Pointer } from 'lucide-react'
import { toast } from 'sonner'

import {
  Calculator,
  Calendar,
  Command as CCommand,
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

export function MainExample() {
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
            className='!ring-0 !outline-0 ring-offset-0'
          >
            Mettings
          </Button>
        </Tooltip>
      </div>

      <Button variant={'outline'} size={'default'} icon={<Calendar />}>
        Mettings
        <CommandShortcut
          keys='ctrl+k'
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
          <Command className='!size-3' />
          +K
        </CommandShortcut>
      </Button>

      <Button variant={'outline'} size={'default'} icon={<Calendar />}>
        Mettings
      </Button>
      <div className='relative'>
        <Grab className='size-4 absolute -top-2 right-8 z-10 fill-white' />

        <Button
          variant={'outline'}
          size={'default'}
          className='bg-secondary'
          icon={<LineChart />}
        >
          Analytics
        </Button>
      </div>

      <Command className='rounded-lg border shadow-md md:min-w-[450px]'>
        <CommandInput placeholder='Search...' />
        <CommandList>
          {(search) => {
            return [
              { name: 'Users', icon: <User />, key: 'ctrl+K' },
              { name: 'Events', icon: <Calendar />, key: 'ctrl+E' },
              { name: 'Settings', icon: <Settings />, key: 'ctrl+S' },
            ].map((item) => {
              return item.name.includes(search) ? (
                <CommandItem>
                  {item.icon}
                  <span>{item.name}</span>
                  <CommandShortcut
                    keys={item.key}
                    onKeysPressed={() => toast.info('Event has been created')}
                    className='bg-muted'
                  >
                    ⌘{item.key.split('+')[1]}
                  </CommandShortcut>
                </CommandItem>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )
            })
          }}
        </CommandList>
      </Command>

      {
        //   <CommandGroup heading='Suggestions'>
        //     <CommandItem>
        //       <Calendar />
        //       <span>Calendar</span>
        //     </CommandItem>
        //   </CommandGroup>
      }
    </div>
  )
}
