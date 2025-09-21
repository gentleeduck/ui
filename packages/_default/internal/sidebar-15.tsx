'use client'

import {
  ArrowUpRight,
  AudioWaveform,
  BadgeCheck,
  Bell,
  Blocks,
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Home,
  Inbox,
  Link,
  LogOut,
  type LucideIcon,
  MessageCircleQuestion,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  StarOff,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/registry/default/ui/breadcrumb'
import { Calendar } from '@/registry/default/ui/calendar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/default/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu'
import { Separator } from '@/registry/default/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/registry/default/ui/sidebar'

export const iframeHeight = '800px'

export const description = 'A left and right sidebar.'

// This is sample data.
const sidebarLeftData = {
  favorites: [
    {
      emoji: '📊',
      name: 'Project Management & Task Tracking',
      url: '#',
    },
    {
      emoji: '🍳',
      name: 'Family Recipe Collection & Meal Planning',
      url: '#',
    },
    {
      emoji: '💪',
      name: 'Fitness Tracker & Workout Routines',
      url: '#',
    },
    {
      emoji: '📚',
      name: 'Book Notes & Reading List',
      url: '#',
    },
    {
      emoji: '🌱',
      name: 'Sustainable Gardening Tips & Plant Care',
      url: '#',
    },
    {
      emoji: '🗣️',
      name: 'Language Learning Progress & Resources',
      url: '#',
    },
    {
      emoji: '🏠',
      name: 'Home Renovation Ideas & Budget Tracker',
      url: '#',
    },
    {
      emoji: '💰',
      name: 'Personal Finance & Investment Portfolio',
      url: '#',
    },
    {
      emoji: '🎬',
      name: 'Movie & TV Show Watchlist with Reviews',
      url: '#',
    },
    {
      emoji: '✅',
      name: 'Daily Habit Tracker & Goal Setting',
      url: '#',
    },
  ],
  navMain: [
    {
      icon: Search,
      title: 'Search',
      url: '#',
    },
    {
      icon: Sparkles,
      title: 'Ask AI',
      url: '#',
    },
    {
      icon: Home,
      isActive: true,
      title: 'Home',
      url: '#',
    },
    {
      badge: '10',
      icon: Inbox,
      title: 'Inbox',
      url: '#',
    },
  ],
  navSecondary: [
    {
      icon: CalendarIcon,
      title: 'Calendar',
      url: '#',
    },
    {
      icon: Settings2,
      title: 'Settings',
      url: '#',
    },
    {
      icon: Blocks,
      title: 'Templates',
      url: '#',
    },
    {
      icon: Trash2,
      title: 'Trash',
      url: '#',
    },
    {
      icon: MessageCircleQuestion,
      title: 'Help',
      url: '#',
    },
  ],
  teams: [
    {
      logo: Command,
      name: 'Acme Inc',
      plan: 'Enterprise',
    },
    {
      logo: AudioWaveform,
      name: 'Acme Corp.',
      plan: 'Startup',
    },
    {
      logo: Command,
      name: 'Evil Corp.',
      plan: 'Free',
    },
  ],
  workspaces: [
    {
      emoji: '🏠',
      name: 'Personal Life Management',
      pages: [
        {
          emoji: '📔',
          name: 'Daily Journal & Reflection',
          url: '#',
        },
        {
          emoji: '🍏',
          name: 'Health & Wellness Tracker',
          url: '#',
        },
        {
          emoji: '🌟',
          name: 'Personal Growth & Learning Goals',
          url: '#',
        },
      ],
    },
    {
      emoji: '💼',
      name: 'Professional Development',
      pages: [
        {
          emoji: '🎯',
          name: 'Career Objectives & Milestones',
          url: '#',
        },
        {
          emoji: '🧠',
          name: 'Skill Acquisition & Training Log',
          url: '#',
        },
        {
          emoji: '🤝',
          name: 'Networking Contacts & Events',
          url: '#',
        },
      ],
    },
    {
      emoji: '🎨',
      name: 'Creative Projects',
      pages: [
        {
          emoji: '✍️',
          name: 'Writing Ideas & Story Outlines',
          url: '#',
        },
        {
          emoji: '🖼️',
          name: 'Art & Design Portfolio',
          url: '#',
        },
        {
          emoji: '🎵',
          name: 'Music Composition & Practice Log',
          url: '#',
        },
      ],
    },
    {
      emoji: '🏡',
      name: 'Home Management',
      pages: [
        {
          emoji: '💰',
          name: 'Household Budget & Expense Tracking',
          url: '#',
        },
        {
          emoji: '🔧',
          name: 'Home Maintenance Schedule & Tasks',
          url: '#',
        },
        {
          emoji: '📅',
          name: 'Family Calendar & Event Planning',
          url: '#',
        },
      ],
    },
    {
      emoji: '🧳',
      name: 'Travel & Adventure',
      pages: [
        {
          emoji: '🗺️',
          name: 'Trip Planning & Itineraries',
          url: '#',
        },
        {
          emoji: '🌎',
          name: 'Travel Bucket List & Inspiration',
          url: '#',
        },
        {
          emoji: '📸',
          name: 'Travel Journal & Photo Gallery',
          url: '#',
        },
      ],
    },
  ],
}

// This is sample data.
const sidebarRightData = {
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

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">Project Management & Task Tracking</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
          <div className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  )
}

function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarLeftData.teams} />
        <NavMain items={sidebarLeftData.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={sidebarLeftData.favorites} />
        <NavWorkspaces workspaces={sidebarLeftData.workspaces} />
        <NavSecondary className="mt-auto" items={sidebarLeftData.navSecondary} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="sticky top-0 hidden h-svh border-l lg:flex" collapsible="none" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={sidebarRightData.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={sidebarRightData.calendars} />
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

function Calendars({
  calendars,
}: {
  calendars: {
    name: string
    items: string[]
  }[]
}) {
  return (
    <>
      {calendars.map((calendar, index) => (
        <React.Fragment key={calendar.name}>
          <SidebarGroup className="py-0" key={calendar.name}>
            <Collapsible className="group/collapsible" defaultOpen={index === 0}>
              <SidebarGroupLabel
                asChild
                className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <CollapsibleTrigger>
                  {calendar.name}{' '}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {calendar.items.map((item, index) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton>
                          <div
                            className="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                            data-active={index < 2}>
                            <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                          </div>
                          {item}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  )
}

function DatePicker() {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]" />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavFavorites({
  favorites,
}: {
  favorites: {
    name: string
    url: string
    emoji: string
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {favorites.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url} title={item.name}>
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isMobile ? 'end' : 'start'}
                className="w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}>
                <DropdownMenuItem>
                  <StarOff className="text-muted-foreground" />
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    badge?: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user.name} src={user.avatar} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function NavWorkspaces({
  workspaces,
}: {
  workspaces: {
    name: string
    emoji: React.ReactNode
    pages: {
      name: string
      emoji: React.ReactNode
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.map((workspace) => (
            <Collapsible key={workspace.name}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <span>{workspace.emoji}</span>
                    <span>{workspace.name}</span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction
                    className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                    showOnHover>
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <SidebarMenuAction showOnHover>
                  <Plus />
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {workspace.pages.map((page) => (
                      <SidebarMenuSubItem key={page.name}>
                        <SidebarMenuSubButton asChild>
                          <a href="#">
                            <span>{page.emoji}</span>
                            <span>{page.name}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-3" />
              </div>
              <span className="truncate font-semibold">{activeTeam.name}</span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 rounded-lg" side="bottom" sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem className="gap-2 p-2" key={team.name} onClick={() => setActiveTeam(team)}>
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
