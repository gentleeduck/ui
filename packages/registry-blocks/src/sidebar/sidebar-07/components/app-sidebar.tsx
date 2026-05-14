'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@gentleduck/registry-ui/sidebar'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map as MapIcon,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'
import type * as React from 'react'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

const data = {
  navMain: [
    {
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
      title: 'Playground',
      url: '#',
    },
    {
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
      title: 'Models',
      url: '#',
    },
    {
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
      title: 'Documentation',
      url: '#',
    },
    {
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
      title: 'Settings',
      url: '#',
    },
  ],
  projects: [
    {
      icon: Frame,
      name: 'Design Engineering',
      url: '#',
    },
    {
      icon: PieChart,
      name: 'Sales & Marketing',
      url: '#',
    },
    {
      icon: MapIcon,
      name: 'Travel',
      url: '#',
    },
  ],
  teams: [
    {
      logo: GalleryVerticalEnd,
      name: 'Duck Labs',
      plan: 'Enterprise',
    },
    {
      logo: AudioWaveform,
      name: 'Pond Studio',
      plan: 'Startup',
    },
    {
      logo: Command,
      name: 'Feather Works',
      plan: 'Free',
    },
  ],
  user: {
    avatar: '/avatars/01.png',
    email: 'alex@gentleduck.org',
    name: 'Alex Morgan',
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
