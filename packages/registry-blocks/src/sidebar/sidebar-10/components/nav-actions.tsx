'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@gentleduck/registry-ui/sidebar'
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

const data = [
  [
    {
      icon: Settings2,
      label: 'Customize Page',
    },
    {
      icon: FileText,
      label: 'Turn into wiki',
    },
  ],
  [
    {
      icon: Link,
      label: 'Copy Link',
    },
    {
      icon: Copy,
      label: 'Duplicate',
    },
    {
      icon: CornerUpRight,
      label: 'Move to',
    },
    {
      icon: Trash2,
      label: 'Move to Trash',
    },
  ],
  [
    {
      icon: CornerUpLeft,
      label: 'Undo',
    },
    {
      icon: LineChart,
      label: 'View analytics',
    },
    {
      icon: GalleryVerticalEnd,
      label: 'Version History',
    },
    {
      icon: Trash,
      label: 'Show delete pages',
    },
    {
      icon: Bell,
      label: 'Notifications',
    },
  ],
  [
    {
      icon: ArrowUp,
      label: 'Import',
    },
    {
      icon: ArrowDown,
      label: 'Export',
    },
  ],
]

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden font-medium text-muted-foreground md:inline-block">Edit Oct 08</div>
      <Button aria-label="Star" className="h-7 w-7" size="icon" variant="ghost">
        <Star aria-hidden="true" />
      </Button>
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button aria-label="More actions" className="h-7 w-7 data-[state=open]:bg-accent" size="icon" variant="ghost">
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 overflow-hidden rounded-lg p-0">
          <Sidebar className="bg-transparent" collapsible="none">
            <SidebarContent>
              {data.map((group, groupIndex) => (
                <SidebarGroup
                  className="border-b last:border-none"
                  // biome-ignore lint/suspicious/noArrayIndexKey: static group list without unique identifiers
                  key={groupIndex}>
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton>
                            <item.icon aria-hidden="true" /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
