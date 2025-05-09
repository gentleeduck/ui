'use client'

import { type DialogProps } from '@gentleduck/registry-ui-duckui/dialog'
//FIX: please ditch this to lucide.
import { CircleIcon, FileIcon, LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Command } from 'lucide-react'
import { docsConfig } from '~/config/docs'
import { cn } from '@gentleduck/libs/cn'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gentleduck/registry-ui-duckui/command'

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  // command={{
  //       children: (
  //         <>
  //           <Command className="!size-3" />
  //           <span className="text-md">K</span>
  //         </>
  //       ),
  //       key: 'ctrl+k, ctrl+/, cmd+k, cmd+/',
  //       action: () => {
  //         //NOTE: i have to add this line to the `@ahmedayoub/shortcut`
  //         window.event?.preventDefault()
  //         setOpen(!open)
  //       },
  //     }}

  console.log(open)

  return (
    <>
      <Button
        variant="outline"
        size={'sm'}
        className={cn(
          'relative h-8 bg-muted/50 text-sm text-muted-foreground shadow-none [&>div]:w-full [&>div]:justify-between pr-2 md:w-40 lg:w-64',
        )}
        onClick={() => {
          setOpen(true)
          console.log('hi iam open')
        }}
        {...props}>
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <CommandShortcut
          keys={'ctrl+k'}
          onKeysPressed={() => {
            // console.log('hi')
            setOpen(!open)
            // window.event?.preventDefault()
          }}
          className="bg-secondary">
          <Command className="!size-3" />
          <span className="text-md">K</span>
        </CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList className="max-h-[299px]">
          {(search) => {
            const items = [
              {
                title: 'Links',
                items: docsConfig.mainNav
                  .filter((navItem) => !navItem.external)
                  .map((navItem) => ({
                    key: navItem.href,
                    name: navItem.title,
                    icon: <FileIcon className="mr-2 h-4 w-4" />,
                    action: () => router.push(navItem.href as string),
                    shortcut: '⌘L', // Customize as needed
                  })),
              },
              ...docsConfig.sidebarNav.map((group) => ({
                title: group.title,
                items: group.items.map((navItem) => ({
                  key: navItem.href,
                  name: navItem.title,
                  icon: <CircleIcon className="h-3 w-3 mr-2" />,
                  action: () => router.push(navItem.href as string),
                  shortcut: '⌘S', // Customize as needed
                })),
              })),
              {
                title: 'Theme',
                items: [
                  {
                    key: 'theme-light',
                    name: 'Light',
                    icon: <SunIcon className="mr-2 h-4 w-4" />,
                    action: () => setTheme('light'),
                    shortcut: '⌘1',
                  },
                  {
                    key: 'theme-dark',
                    name: 'Dark',
                    icon: <MoonIcon className="mr-2 h-4 w-4" />,
                    action: () => setTheme('dark'),
                    shortcut: '⌘2',
                  },
                  {
                    key: 'theme-system',
                    name: 'System',
                    icon: <LaptopIcon className="mr-2 h-4 w-4" />,
                    action: () => setTheme('system'),
                    shortcut: '⌘3',
                  },
                ],
              },
            ]

            const filteredGroups = items
              .map((group) => ({
                ...group,
                items: group.items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
              }))
              .filter((group) => group.items.length > 0)

            return filteredGroups.length > 0 ? (
              filteredGroups.map((group, idx) => (
                <React.Fragment key={group.title}>
                  <CommandGroup heading={group.title}>
                    {group.items.map((item) => (
                      <CommandItem key={item.key} onSelect={() => runCommand(item.action)}>
                        {item.icon}
                        <span>{item.name}</span>
                        <span className="ml-auto text-muted-foreground text-xs">{item.shortcut}</span>
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
      </CommandDialog>
    </>
  )
}
