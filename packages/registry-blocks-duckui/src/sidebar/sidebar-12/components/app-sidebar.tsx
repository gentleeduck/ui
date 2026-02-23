import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@gentleduck/registry-ui-duckui/sidebar'
import { Plus } from 'lucide-react'
import type * as React from 'react'
import { Calendars } from './calendars'
import { DatePicker } from './date-picker'
import { NavUser } from './nav-user'

// This is sample data.
const data = {
  calendars: [
    {
      items: ['Personal', 'Work', 'Family'],
      name: 'My Calendars',
    },
    {
      items: ['Holidays', 'Birthdays'],
      name: 'Favorites',
    },
    {
      items: ['Travel', 'Reminders', 'Deadlines'],
      name: 'Other',
    },
  ],
  user: {
    avatar: '/avatars/shadcn.jpg',
    email: 'm@example.com',
    name: 'shadcn',
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-sidebar-border border-b">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
