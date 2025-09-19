import { Plus } from "lucide-react"
import * as React from "react"

import { Calendars } from "@/registry/default/blocks/sidebar-15/components/calendars"
import { DatePicker } from "@/registry/default/blocks/sidebar-15/components/date-picker"
import { NavUser } from "@/registry/default/blocks/sidebar-15/components/nav-user"
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
} from "@/registry/default/ui/sidebar"

// This is sample data.
const data = {
  calendars: [
    {
      items: ["Personal", "Work", "Family"],
      name: "My Calendars",
    },
    {
      items: ["Holidays", "Birthdays"],
      name: "Favorites",
    },
    {
      items: ["Travel", "Reminders", "Deadlines"],
      name: "Other",
    },
  ],
  user: {
    avatar: "/avatars/shadcn.jpg",
    email: "m@example.com",
    name: "shadcn",
  },
}

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="sticky hidden lg:flex top-0 h-svh border-l"
      collapsible="none"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
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
    </Sidebar>
  )
}
