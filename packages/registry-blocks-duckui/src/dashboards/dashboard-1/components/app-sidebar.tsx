'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@gentleduck/registry-ui-duckui/sidebar'
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react'
import type * as React from 'react'
import { NavDocuments } from './nav-documents'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'

const data = {
  documents: [
    {
      icon: DatabaseIcon,
      name: 'Data Library',
      url: '#',
    },
    {
      icon: ClipboardListIcon,
      name: 'Reports',
      url: '#',
    },
    {
      icon: FileIcon,
      name: 'Word Assistant',
      url: '#',
    },
  ],
  navClouds: [
    {
      icon: CameraIcon,
      isActive: true,
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
      title: 'Capture',
      url: '#',
    },
    {
      icon: FileTextIcon,
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
      title: 'Proposal',
      url: '#',
    },
    {
      icon: FileCodeIcon,
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
      title: 'Prompts',
      url: '#',
    },
  ],
  navMain: [
    {
      icon: LayoutDashboardIcon,
      title: 'Dashboard',
      url: '#',
    },
    {
      icon: ListIcon,
      title: 'Lifecycle',
      url: '#',
    },
    {
      icon: BarChartIcon,
      title: 'Analytics',
      url: '#',
    },
    {
      icon: FolderIcon,
      title: 'Projects',
      url: '#',
    },
    {
      icon: UsersIcon,
      title: 'Team',
      url: '#',
    },
  ],
  navSecondary: [
    {
      icon: SettingsIcon,
      title: 'Settings',
      url: '#',
    },
    {
      icon: HelpCircleIcon,
      title: 'Get Help',
      url: '#',
    },
    {
      icon: SearchIcon,
      title: 'Search',
      url: '#',
    },
  ],
  user: {
    avatar: '/avatars/wildduck.jpg',
    email: 'duck-ui@duck.com',
    name: 'wildduck',
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#placeholder">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="font-semibold text-base">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary className="mt-auto" items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
