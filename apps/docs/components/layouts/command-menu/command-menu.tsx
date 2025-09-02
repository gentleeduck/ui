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
      title: group.title,
      items: group.items.map((navItem) => ({
        name: navItem.title,
        icon: <Circle className="h-3 w-3 mr-2" />,
        action: () => router.push(navItem.href as string),
      })),
    })),
    {
      title: 'Theme',
      items: [
        {
          name: 'Light',
          icon: <Sun className="mr-2 h-4 w-4" />,
          action: () => setTheme('light'),
        },
        {
          name: 'Dark',
          icon: <Moon className="mr-2 h-4 w-4" />,
          action: () => setTheme('dark'),
        },
        {
          name: 'System',
          icon: <FileIcon className="mr-2 h-4 w-4" />,
          action: () => setTheme('system'),
        },
      ],
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        size={'sm'}
        className={cn(
          'relative w-full h-8 bg-muted/50 text-sm text-muted-foreground shadow-none [&>div]:w-full [&>div]:justify-between ltr:pr-2 rtl:pl-2 md:w-40 lg:w-64',
        )}
        onClick={() => setOpen(true)}>
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <CommandShortcut
          keys={'ctrl+k'}
          onKeysPressed={() => {
            setOpen(!open)
            window.event?.preventDefault()
          }}
          className="bg-secondary">
          <Command className="!size-3" />
          <span className="text-md">K</span>
        </CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." autoFocus />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList className="max-h-[350px]">
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
    'ctrl+c': {
      name: 'ctrl+c',
      description: 'Copy command',
      execute: () =>
        navigator.clipboard.writeText(
          ('pnpm dlx @duck-ui add ' + selectedItem?.innerText.toLowerCase().replace(/ /g, '-')) as string,
        ),
    },
  })
  return (
    <div className="flex items-center gap-4 px-2 pt-2 border-t justify-between w-full">
      <div className="flex items-center gap-4 w-full">
        {selectedItem?.innerText && (
          <Button className={cn('px-2')} variant={'outline'} size={'xs'}>
            <CornerDownLeft />
            <Separator orientation="vertical" className="m-0 p-0 h-4" />
            {selectedItem?.innerText}
          </Button>
        )}
        {selectedItem?.innerText &&
        docsConfig.sidebarNav[1]!.items.find((item) => item.title === selectedItem?.innerText)?.title.toLowerCase() ? (
          <Button className={cn('px-2')} variant={'outline'} size={'xs'}>
            <div className="flex items-center gap-1">
              <Command className="!size-3" />
              <p className="text-md">C</p>
            </div>
            <Separator orientation="vertical" className="m-0 p-0 h-4" />
            <div className="flex items-center gap-1">
              <span>pnpm dlx @duck-ui add</span>
              <span className="text-blue-400">
                {docsConfig.sidebarNav[1]!.items.find(
                  (item) => item.title === selectedItem?.innerText,
                )?.title.toLowerCase()}
              </span>
            </div>
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground my-auto h-fit text-right w-full">
            <span className="font-medium text-sm">Command palette</span> for the documentation content.
          </p>
        )}
      </div>
    </div>
  )
}
