'use client'

import { type DialogProps } from '@gentleduck/registry-ui-duckui/dialog'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Circle, Command, FileIcon, Moon, Sun } from 'lucide-react'
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

  const groupRef = React.useRef<HTMLUListElement>(null)

  return (
    <>
      <Button
        variant="outline"
        size={'sm'}
        className={cn(
          'relative h-8 bg-muted/50 text-sm text-muted-foreground shadow-none [&>div]:w-full [&>div]:justify-between pr-2 md:w-40 lg:w-64',
        )}
        onClick={() => setOpen(true)}
        {...props}>
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
        <CommandList className="max-h-[299px]" ref={groupRef}>
          {(search) => {
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
                      <CommandItem
                        key={item.name}
                        onClick={() => {
                          item.action()
                          setOpen(false)
                          console.log(groupRef.current)
                          // groupRef.current?.scrollTo(0, 0)
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
