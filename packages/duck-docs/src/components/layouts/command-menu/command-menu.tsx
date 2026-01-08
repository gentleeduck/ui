'use client'

import { useDocsConfig } from '@duck-docs/context'
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

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()
  const docsConfig = useDocsConfig()

  const groupRef = React.useRef<HTMLUListElement>(null)
  const items = [
    ...docsConfig.sidebarNav.map((group) => ({
      items: group.items?.map((navItem) => ({
        action: () => router.push(navItem.href as string),
        icon: <Circle className="mr-2 h-3 w-3" />,
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
          'relative h-8 w-full bg-muted/50 text-muted-foreground text-sm shadow-none md:w-40 lg:w-64 ltr:pr-2 rtl:pl-2 [&>div]:w-full [&>div]:justify-between',
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
        <CommandList className="h-[550px] max-h-full w-90 md:w-full">
          {items.map((group, idx) => (
            <React.Fragment key={group.title}>
              <CommandGroup heading={group.title}>
                {group.items?.map((item) => (
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
  const docsConfig = useDocsConfig()
  const sidebarItems = docsConfig.sidebarNav.flatMap((group) => group.items ?? [])
  const selectedNavItem = sidebarItems.find((item) => item.title === selectedItem?.innerText)
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
    <div className="hidden w-full items-center justify-between gap-4 border-t px-2 pt-2 lg:flex">
      <div className="flex w-full items-center justify-between gap-4">
        {selectedItem?.innerText && (
          <Button className={cn('px-2')} size={'sm'} variant={'outline'}>
            <CornerDownLeft />
            <Separator className="m-0 h-4 p-0" orientation="vertical" />
            {selectedItem?.innerText}
          </Button>
        )}
        {selectedItem?.innerText && selectedNavItem?.title ? (
          <Button className={cn('px-2')} size={'sm'} variant={'outline'}>
            <div className="flex items-center gap-1">
              <Command className="!size-3" />
              <p className="text-md">C</p>
            </div>
            <Separator className="m-0 h-4 p-0" orientation="vertical" />
            <div className="flex items-center gap-1">
              <span>pnpm dlx @gentleduck/cli add</span>
              <span className="text-blue-400">{selectedNavItem.title.toLowerCase()}</span>
            </div>
          </Button>
        ) : (
          <p className="my-auto h-fit w-full whitespace-nowrap text-right text-muted-foreground text-sm">
            <span className="whitespace-nowrap font-medium text-sm">Command palette</span> for the documentation
            content.
          </p>
        )}
      </div>
    </div>
  )
}
