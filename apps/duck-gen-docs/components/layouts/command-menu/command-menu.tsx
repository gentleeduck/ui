'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  useCommandRefsContext,
} from '@gentleduck/registry-ui-duckui/command'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { useKeyCommands } from '@gentleduck/vim/react'
import { Circle, Command, CornerDownLeft, FileIcon, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { docsConfig } from '~/config/docs'

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()

  const groupRef = React.useRef<HTMLUListElement>(null)
  const items = [
    ...docsConfig.sidebarNav.map((group) => ({
      items: group.items.map((navItem) => ({
        action: () => router.push(navItem.href as string),
        icon: <Circle className="h-3 w-3 mr-2" />,
        name: navItem.title,
      })),
      title: group.title,
    })),
    {
      items: [
        {
          action: () => setTheme('light'),
          icon: <Sun className="mr-2 h-4 w-4" />,
          name: 'Light',
        },
        {
          action: () => setTheme('dark'),
          icon: <Moon className="mr-2 h-4 w-4" />,
          name: 'Dark',
        },
        {
          action: () => setTheme('system'),
          icon: <FileIcon className="mr-2 h-4 w-4" />,
          name: 'System',
        },
      ],
      title: 'Theme',
    },
  ]

  return (
    <>
      <Button
        className={cn(
          'relative w-full h-8 bg-muted/50 text-sm text-muted-foreground shadow-none [&>div]:w-full [&>div]:justify-between ltr:pr-2 rtl:pl-2 md:w-40 lg:w-64',
        )}
        onClick={() => setOpen(true)}
        size={'sm'}
        variant="outline">
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <CommandShortcut
          className="bg-secondary"
          keys={'ctrl+k'}
          onKeysPressed={() => {
            setOpen(!open)
            window.event?.preventDefault()
          }}>
          <Command className="!size-3" />
          <span className="text-md">K</span>
        </CommandShortcut>
      </Button>
      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput autoFocus placeholder="Search..." />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList className="h-[550px] max-h-full">
          {items.map((group, idx) => (
            <React.Fragment key={group.title}>
              <CommandGroup heading={group.title}>
                {group.items.map((item) => (
                  <CommandItem
                    id={item.name}
                    key={item.name}
                    onClick={() => {
                      setOpen(false)
                      item.action()
                      groupRef.current?.scrollTo(0, 0)
                      groupRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'start',
                      })
                    }}>
                    {item.icon}
                    <span>{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {idx !== items.length - 1 && <CommandSeparator />}
            </React.Fragment>
          ))}
        </CommandList>
        <CommandFooter />
      </CommandDialog>
    </>
  )
}

function CommandFooter() {
  const { selectedItem } = useCommandRefsContext()
  useKeyCommands({
    'ctrl+shift+c': {
      description: 'Copy command',
      execute: () =>
        navigator.clipboard.writeText(
          ('pnpm dlx @gentleduck/cli add ' + selectedItem?.innerText.toLowerCase().replace(/ /g, '-')) as string,
        ),
      name: 'ctrl+shift+c',
    },
  })
  return (
    <div className="flex items-center gap-4 px-2 pt-2 border-t justify-between w-full">
      <div className="flex items-center justify-between gap-4 w-full">
        {selectedItem?.innerText && (
          <Button className={cn('px-2')} size={'sm'} variant={'outline'}>
            <CornerDownLeft />
            <Separator className="m-0 p-0 h-4" orientation="vertical" />
            {selectedItem?.innerText}
          </Button>
        )}
        {selectedItem?.innerText &&
        docsConfig.sidebarNav[2]!.items.find((item) => item.title === selectedItem?.innerText)?.title.toLowerCase() ? (
          <Button className={cn('px-2')} size={'sm'} variant={'outline'}>
            <div className="flex items-center gap-1">
              <Command className="!size-3" />
              <p className="text-md">C</p>
            </div>
            <Separator className="m-0 p-0 h-4" orientation="vertical" />
            <div className="flex items-center gap-1">
              <span>pnpm dlx @gentleduck/cli add</span>
              <span className="text-blue-400">
                {docsConfig.sidebarNav[2]!.items.find(
                  (item) => item.title === selectedItem?.innerText,
                )?.title.toLowerCase()}
              </span>
            </div>
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground my-auto h-fit text-right w-full whitespace-nowrap">
            <span className="font-medium text-sm whitespace-nowrap">Command palette</span> for the documentation
            content.
          </p>
        )}
      </div>
    </div>
  )
}
