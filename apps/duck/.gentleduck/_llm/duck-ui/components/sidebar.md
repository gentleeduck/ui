```tsx title="components/sidebar-1.tsx"
// import from your project: import Demo from '@/components/sidebar-1'
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@gentleduck/registry-ui/sidebar'
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map as MapIcon,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

const data = {
  user: {
    name: 'Alex Morgan',
    email: 'alex@gentleduck.org',
    avatar: '/avatars/01.png',
  },
  teams: [
    {
      name: 'Duck Labs',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Pond Studio',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Feather Works',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Workspace',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: 'Overview', url: '#' },
        { title: 'Favorites', url: '#' },
        { title: 'Preferences', url: '#' },
      ],
    },
    {
      title: 'Components',
      url: '#',
      icon: Bot,
      items: [
        { title: 'Primitives', url: '#' },
        { title: 'Compositions', url: '#' },
        { title: 'Patterns', url: '#' },
      ],
    },
    {
      title: 'Resources',
      url: '#',
      icon: BookOpen,
      items: [
        { title: 'Getting Started', url: '#' },
        { title: 'Guides', url: '#' },
        { title: 'Examples', url: '#' },
        { title: 'Releases', url: '#' },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        { title: 'Profile', url: '#' },
        { title: 'Team', url: '#' },
        { title: 'Billing', url: '#' },
        { title: 'Usage', url: '#' },
      ],
    },
  ],
  projects: [
    { name: 'Component Library', url: '#', icon: Frame },
    { name: 'Landing Pages', url: '#', icon: PieChart },
    { name: 'Documentation', url: '#', icon: MapIcon },
  ],
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
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo aria-hidden="true" className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown aria-hidden="true" className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <team.logo className="size-3.5 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>Cmd+{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus aria-hidden="true" className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add team</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { open } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon aria-hidden="true" />}
                  {open && (
                    <>
                      <span>{item.title}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className="ml-auto transition-transform duration-200 group-data-[open=true]/collapsible:rotate-90"
                      />{' '}
                    </>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: React.ElementType
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon aria-hidden="true" />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal aria-hidden="true" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Folder aria-hidden="true" className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward aria-hidden="true" className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Trash2 aria-hidden="true" className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal aria-hidden="true" className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
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
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">AM</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown aria-hidden="true" className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">AM</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles aria-hidden="true" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck aria-hidden="true" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard aria-hidden="true" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell aria-hidden="true" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOut aria-hidden="true" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider>
        <Sidebar collapsible="icon">
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
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

## About

Sidebars are one of the most complex components to build. They are central
to any application and often contain a lot of moving parts.

We now have a solid foundation to build on top of. Composable. Themeable.
Customizable.

[Browse the Blocks Library](/blocks).

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add sidebar
```

## Usage

```tsx showLineNumbers title="app/layout.tsx"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
```

```tsx showLineNumbers title="components/app-sidebar.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
```

## Examples

### sidebar variant

Use the default `sidebar` variant for a standard sidebar layout.

```tsx title="components/sidebar-2.tsx"
// import from your project: import Demo from '@/components/sidebar-2'
'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@gentleduck/registry-ui/sidebar'
import { Check, ChevronsUpDown, GalleryVerticalEnd, Home, Inbox, LayoutDashboard, Settings, Users } from 'lucide-react'
import * as React from 'react'

const data = {
  versions: ['3.2.0', '3.1.0', '3.0.0-rc'],
  navMain: [
    {
      title: 'Overview',
      items: [
        { title: 'Analytics', url: '#', icon: LayoutDashboard, isActive: true },
        { title: 'Reports', url: '#', icon: Home },
        { title: 'Notifications', url: '#', icon: Inbox },
      ],
    },
    {
      title: 'Account',
      items: [
        { title: 'Profile', url: '#', icon: Users },
        { title: 'Preferences', url: '#', icon: Settings },
      ],
    },
  ],
}

export default function Demo() {
  const [selectedVersion, setSelectedVersion] = React.useState(data.versions[0])

  return (
    <div className="relative flex h-full w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <GalleryVerticalEnd aria-hidden="true" className="size-4" />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">Documentation</span>
                        <span className="">v{selectedVersion}</span>
                      </div>
                      <ChevronsUpDown aria-hidden="true" className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
                    {data.versions.map((version) => (
                      <DropdownMenuItem key={version} onSelect={() => setSelectedVersion(version)}>
                        v{version} {version === selectedVersion && <Check aria-hidden="true" className="ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {data.navMain.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

### floating variant

Use the `floating` variant for a sidebar with rounded borders and a drop shadow.

```tsx title="components/sidebar-3.tsx"
// import from your project: import Demo from '@/components/sidebar-3'
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@gentleduck/registry-ui/sidebar'
import { GalleryVerticalEnd, Home, Inbox, LayoutDashboard, Settings, Users } from 'lucide-react'

const data = {
  navMain: [
    {
      title: 'Content',
      items: [
        { title: 'Articles', url: '#', icon: LayoutDashboard, isActive: true },
        { title: 'Media', url: '#', icon: Home },
        { title: 'Pages', url: '#', icon: Inbox },
      ],
    },
    {
      title: 'Tools',
      items: [
        { title: 'Editor', url: '#', icon: Users },
        { title: 'Templates', url: '#', icon: Settings },
      ],
    },
  ],
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider>
        <Sidebar variant="floating">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">My App</span>
                    <span className="text-xs">Floating variant</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {data.navMain.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

### inset variant

Use the `inset` variant for a sidebar that sits inside the page layout.

}>
  If you use the `inset` variant, remember to wrap your main content
  in a `SidebarInset` component.

```tsx showLineNumbers
<SidebarProvider>
  <Sidebar variant="inset" />
  <SidebarInset>
    <main>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

```tsx title="components/sidebar-4.tsx"
// import from your project: import Demo from '@/components/sidebar-4'
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@gentleduck/registry-ui/sidebar'
import { GalleryVerticalEnd, Home, Inbox, LayoutDashboard, Settings, Users } from 'lucide-react'

const data = {
  navMain: [
    {
      title: 'Workspace',
      items: [
        { title: 'Projects', url: '#', icon: LayoutDashboard, isActive: true },
        { title: 'Tasks', url: '#', icon: Home },
        { title: 'Calendar', url: '#', icon: Inbox },
      ],
    },
    {
      title: 'Admin',
      items: [
        { title: 'Members', url: '#', icon: Users },
        { title: 'Billing', url: '#', icon: Settings },
      ],
    },
  ],
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider>
        <Sidebar variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">My App</span>
                    <span className="text-xs">Inset variant</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {data.navMain.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

### Controlled Sidebar

Use the `open` and `onOpenChange` props to control the sidebar.

```tsx title="components/sidebar-5.tsx"
// import from your project: import Demo from '@/components/sidebar-5'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@gentleduck/registry-ui/sidebar'
import { GalleryVerticalEnd, Home, Inbox, LayoutDashboard, Settings, Users } from 'lucide-react'
import * as React from 'react'

const data = {
  navMain: [
    {
      title: 'Main',
      items: [
        { title: 'Feed', url: '#', icon: LayoutDashboard, isActive: true },
        { title: 'Explore', url: '#', icon: Home },
        { title: 'Bookmarks', url: '#', icon: Inbox },
      ],
    },
    {
      title: 'System',
      items: [
        { title: 'Logs', url: '#', icon: Users },
        { title: 'Config', url: '#', icon: Settings },
      ],
    },
  ],
}

export default function Demo() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="relative flex h-full w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">My App</span>
                    <span className="text-xs">Controlled</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {data.navMain.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Sidebar is {open ? 'open' : 'closed'}</span>
              <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
                Toggle
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

```tsx showLineNumbers
export function AppSidebar() {
  const [open, setOpen] = React.useState(false)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar />
    </SidebarProvider>
  )
}
```

## Component Composition

A `Sidebar` component is composed of the following parts:

* `SidebarProvider` - Handles collapsible state.
* `Sidebar` - The sidebar container.
* `SidebarHeader` and `SidebarFooter` - Sticky at the top and bottom of the sidebar.
* `SidebarContent` - Scrollable content.
* `SidebarGroup` - Section within the `SidebarContent`.
* `SidebarTrigger` - Trigger for the `Sidebar`.

## SidebarProvider

The `SidebarProvider` component is used to provide the sidebar context to the `Sidebar` component. You should always wrap your application in a `SidebarProvider` component.

| Name           | Type                      | Description                                  |
| -------------- | ------------------------- | -------------------------------------------- |
| `defaultOpen`  | `boolean`                 | Default open state of the sidebar.           |
| `open`         | `boolean`                 | Open state of the sidebar (controlled).      |
| `onOpenChange` | `(open: boolean) => void` | Sets open state of the sidebar (controlled). |

### Width

If you have a single sidebar in your application, you can use the `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` variables in `sidebar.tsx` to set the width of the sidebar.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
```

For multiple sidebars in your application, you can use the `--sidebar-width` and `--sidebar-width-mobile` CSS variables in the `style` prop.

```tsx showLineNumbers
<SidebarProvider
  style={
    {
      "--sidebar-width": "20rem",
      "--sidebar-width-mobile": "20rem",
    } as React.CSSProperties
  }
>
  <Sidebar />
</SidebarProvider>
```

### Keyboard Shortcut

To trigger the sidebar, you use the `cmd+b` keyboard shortcut on Mac and `ctrl+b` on Windows.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
```

## Sidebar

The main `Sidebar` component used to render a collapsible sidebar.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'left' \| 'right'` | `'left'` | The side of the sidebar. |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | The variant of the sidebar. |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` | Collapsible state of the sidebar. |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection`. |
| `mobileTitle` | `string` | `'Sidebar'` | Title for the mobile sheet dialog. |
| `mobileDescription` | `string` | `'Displays the mobile sidebar.'` | Description for the mobile sheet dialog. |

| Prop        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `offcanvas` | A collapsible sidebar that slides in from the left or right. |
| `icon`      | A sidebar that collapses to icons.                           |
| `none`      | A non-collapsible sidebar.                                   |

## useSidebar

The `useSidebar` hook is used to control the sidebar.

```tsx showLineNumbers
import { useSidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar()
}
```

| Property        | Type                      | Description                                   |
| --------------- | ------------------------- | --------------------------------------------- |
| `state`         | `expanded` or `collapsed` | The current state of the sidebar.             |
| `open`          | `boolean`                 | Whether the sidebar is open.                  |
| `setOpen`       | `(open: boolean) => void` | Sets the open state of the sidebar.           |
| `openMobile`    | `boolean`                 | Whether the sidebar is open on mobile.        |
| `setOpenMobile` | `(open: boolean) => void` | Sets the open state of the sidebar on mobile. |
| `isMobile`      | `boolean`                 | Whether the sidebar is on mobile.             |
| `toggleSidebar` | `() => void`              | Toggles the sidebar. Desktop and mobile.      |
| `dir`           | `'ltr' \| 'rtl'`          | The resolved text direction.                  |

## SidebarHeader

Use the `SidebarHeader` component to add a sticky header to the sidebar.

```tsx showLineNumbers title="components/app-sidebar.tsx"
<Sidebar>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              Select Workspace
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--gentleduck-dropdown-menu-trigger-width)">
            <DropdownMenuItem>
              <span>Duck Labs</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
</Sidebar>
```

## SidebarFooter

Use the `SidebarFooter` component to add a sticky footer to the sidebar.

```tsx showLineNumbers
<Sidebar>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <User2 /> Username
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</Sidebar>
```

## SidebarContent

The `SidebarContent` component is used to wrap the content of the sidebar. This is where you add your `SidebarGroup` components. It is scrollable.

| Name       | Type      | Default | Description                                       |
| ---------- | --------- | ------- | ------------------------------------------------- |
| `noScroll` | `boolean` | `true`  | Hides the scrollbar while keeping scroll behavior. |

```tsx showLineNumbers
<Sidebar>
  <SidebarContent>
    <SidebarGroup />
    <SidebarGroup />
  </SidebarContent>
</Sidebar>
```

To show the scrollbar, set `noScroll` to `false`:

```tsx showLineNumbers
<SidebarContent noScroll={false}>
  <SidebarGroup />
</SidebarContent>
```

## SidebarGroup

Use the `SidebarGroup` component to create a section within the sidebar.

A `SidebarGroup` has a `SidebarGroupLabel`, a `SidebarGroupContent` and an optional `SidebarGroupAction`.

```tsx showLineNumbers
<SidebarGroup>
  <SidebarGroupLabel>Application</SidebarGroupLabel>
  <SidebarGroupAction>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarGroupAction>
  <SidebarGroupContent></SidebarGroupContent>
</SidebarGroup>
```

To make a `SidebarGroup` collapsible, wrap it in a `Collapsible`.

```tsx showLineNumbers
<Collapsible defaultOpen className="group/collapsible">
  <SidebarGroup>
    <SidebarGroupLabel asChild>
      <CollapsibleTrigger>
        Help
        <ChevronDown className="ml-auto transition-transform group-data-[open=true]/collapsible:rotate-180" />
      </CollapsibleTrigger>
    </SidebarGroupLabel>
    <CollapsibleContent>
      <SidebarGroupContent />
    </CollapsibleContent>
  </SidebarGroup>
</Collapsible>
```

## SidebarMenu

The `SidebarMenu` component is used for building a menu within a `SidebarGroup`.

```tsx showLineNumbers
<SidebarMenu>
  {projects.map((project) => (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton asChild>
        <a href={project.url}>
          <project.icon />
          <span>{project.name}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarMenuButton

The `SidebarMenuButton` component is used to render a menu button within a `SidebarMenuItem`.

By default, the `SidebarMenuButton` renders a button but you can use the `asChild` prop to render a different component such as a `Link` or an `a` tag.

| Name       | Type                                          | Default     | Description                                    |
| ---------- | --------------------------------------------- | ----------- | ---------------------------------------------- |
| `asChild`  | `boolean`                                     | `false`     | Render as child element.                       |
| `isActive` | `boolean`                                     | `false`     | Marks the menu item as active.                 |
| `variant`  | `default` or `outline`                        | `default`   | The visual variant of the button.              |
| `size`     | `default`, `sm`, or `lg`                      | `default`   | The size of the button.                        |
| `tooltip`  | `string` or `TooltipContent` props            | `undefined` | Tooltip shown when sidebar is collapsed.       |

```tsx showLineNumbers
<SidebarMenuButton asChild isActive>
  <a href="#">Home</a>
</SidebarMenuButton>
```

### Tooltip

Use the `tooltip` prop to show a tooltip when the sidebar is collapsed to icons.

```tsx showLineNumbers
<SidebarMenuButton tooltip="Home">
  <Home />
  <span>Home</span>
</SidebarMenuButton>
```

You can also pass `TooltipContent` props for more control:

```tsx showLineNumbers
<SidebarMenuButton
  tooltip={{
    children: "Home",
    side: "right",
    align: "center",
  }}
>
  <Home />
  <span>Home</span>
</SidebarMenuButton>
```

## SidebarMenuAction

The `SidebarMenuAction` component is used to render a menu action within a `SidebarMenuItem`.

| Name          | Type      | Default | Description                                      |
| ------------- | --------- | ------- | ------------------------------------------------ |
| `asChild`     | `boolean` | `false` | Render as child element.                         |
| `showOnHover` | `boolean` | `false` | Only show the action on hover (hidden by default). |

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton asChild>
    <a href="#">
      <Home />
      <span>Home</span>
    </a>
  </SidebarMenuButton>
  <SidebarMenuAction showOnHover>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarMenuAction>
</SidebarMenuItem>
```

## SidebarMenuSub

The `SidebarMenuSub` component is used to render a submenu within a `SidebarMenu`.

Use `SidebarMenuSubButton` inside `SidebarMenuSubItem` for sub-menu items.

#### SidebarMenuSubButton

| Name       | Type              | Default | Description                    |
| ---------- | ----------------- | ------- | ------------------------------ |
| `asChild`  | `boolean`         | `false` | Render as child element.       |
| `size`     | `sm` or `md`      | `md`    | The size of the sub-button.    |
| `isActive` | `boolean`         | `false` | Marks the sub-item as active.  |

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuSub>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton isActive>
        <span>Active Sub Item</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <a href="#">Sub Item Link</a>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  </SidebarMenuSub>
</SidebarMenuItem>
```

## SidebarMenuBadge

The `SidebarMenuBadge` component is used to render a badge within a `SidebarMenuItem`.

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuBadge>24</SidebarMenuBadge>
</SidebarMenuItem>
```

## SidebarMenuSkeleton

The `SidebarMenuSkeleton` component is used to render a skeleton for a `SidebarMenu`.

| Name       | Type      | Default | Description                          |
| ---------- | --------- | ------- | ------------------------------------ |
| `showIcon` | `boolean` | `false` | Show a skeleton icon before the text. |

```tsx showLineNumbers
<SidebarMenu>
  {Array.from({ length: 5 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuSkeleton showIcon />
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarTrigger

Use the `SidebarTrigger` component to render a button that toggles the sidebar. It extends the `Button` component and accepts all its props.

```tsx showLineNumbers
<SidebarTrigger />
```

You can also build a custom trigger using the `useSidebar` hook:

```tsx showLineNumbers
import { useSidebar } from "@/components/ui/sidebar"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()

  return <button onClick={toggleSidebar}>Toggle Sidebar</button>
}
```

## SidebarRail

The `SidebarRail` component is used to render a rail within a `Sidebar`. This rail can be used to toggle the sidebar.

```tsx showLineNumbers
<Sidebar>
  <SidebarHeader />
  <SidebarContent>
    <SidebarGroup />
  </SidebarContent>
  <SidebarFooter />
  <SidebarRail />
</Sidebar>
```

## Notes

### Data Attributes

All sidebar components expose `data-slot` attributes for precise CSS targeting.

| Component              | `data-slot`              |
| ---------------------- | ------------------------ |
| `SidebarProvider`      | `sidebar-wrapper`        |
| `Sidebar`              | `sidebar`                |
| `SidebarTrigger`       | `sidebar-trigger`        |
| `SidebarRail`          | `sidebar-rail`           |
| `SidebarInset`         | `sidebar-inset`          |
| `SidebarInput`         | `sidebar-input`          |
| `SidebarHeader`        | `sidebar-header`         |
| `SidebarFooter`        | `sidebar-footer`         |
| `SidebarSeparator`     | `sidebar-separator`      |
| `SidebarContent`       | `sidebar-content`        |
| `SidebarGroup`         | `sidebar-group`          |
| `SidebarGroupLabel`    | `sidebar-group-label`    |
| `SidebarGroupAction`   | `sidebar-group-action`   |
| `SidebarGroupContent`  | `sidebar-group-content`  |
| `SidebarMenu`          | `sidebar-menu`           |
| `SidebarMenuItem`      | `sidebar-menu-item`      |
| `SidebarMenuButton`    | `sidebar-menu-button`    |
| `SidebarMenuAction`    | `sidebar-menu-action`    |
| `SidebarMenuBadge`     | `sidebar-menu-badge`     |
| `SidebarMenuSkeleton`  | `sidebar-menu-skeleton`  |
| `SidebarMenuSub`       | `sidebar-menu-sub`       |
| `SidebarMenuSubItem`   | `sidebar-menu-sub-item`  |
| `SidebarMenuSubButton` | `sidebar-menu-sub-button`|

### Theming

We use the following CSS variables to theme the sidebar.

```css
@layer base {
  :root {
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 0 0% 98%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}
```

### Styling

Here are some tips for styling the sidebar based on different states.

Hide a group when the sidebar collapses to icons:

```tsx
<Sidebar collapsible="icon">
  <SidebarContent>
    <SidebarGroup className="group-data-[collapsible=icon]:hidden" />
  </SidebarContent>
</Sidebar>
```

Show an action when the menu button is active:

```tsx
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuAction className="peer-data-active/menu-button:opacity-100" />
</SidebarMenuItem>
```

## RTL Support

Set `dir="rtl"` on `Sidebar` for a local override, or set `DirectionProvider` once at app/root level for global direction. Trigger icon and rail positioning adjust automatically.

```tsx title="components/sidebar-6.tsx"
// import from your project: import Demo from '@/components/sidebar-6'
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui/collapsible'
import { DirectionContext } from '@gentleduck/registry-ui/direction'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@gentleduck/registry-ui/sidebar'
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map as MapIcon,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

const data = {
  user: {
    name: 'احمد محمد',
    email: 'ahmad@gentleduck.org',
    avatar: '/avatars/01.png',
  },
  teams: [
    {
      name: 'مختبرات داك',
      logo: GalleryVerticalEnd,
      plan: 'مؤسسات',
    },
    {
      name: 'استوديو البركة',
      logo: AudioWaveform,
      plan: 'ناشئة',
    },
    {
      name: 'اعمال الريش',
      logo: Command,
      plan: 'مجاني',
    },
  ],
  navMain: [
    {
      title: 'مساحة العمل',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: 'نظرة عامة', url: '#' },
        { title: 'المفضلة', url: '#' },
        { title: 'التفضيلات', url: '#' },
      ],
    },
    {
      title: 'المكونات',
      url: '#',
      icon: Bot,
      items: [
        { title: 'الاساسيات', url: '#' },
        { title: 'التركيبات', url: '#' },
        { title: 'الانماط', url: '#' },
      ],
    },
    {
      title: 'الموارد',
      url: '#',
      icon: BookOpen,
      items: [
        { title: 'البدء', url: '#' },
        { title: 'الادلة', url: '#' },
        { title: 'الامثلة', url: '#' },
        { title: 'الاصدارات', url: '#' },
      ],
    },
    {
      title: 'الاعدادات',
      url: '#',
      icon: Settings2,
      items: [
        { title: 'الملف الشخصي', url: '#' },
        { title: 'الفريق', url: '#' },
        { title: 'الفوترة', url: '#' },
        { title: 'الاستخدام', url: '#' },
      ],
    },
  ],
  projects: [
    { name: 'مكتبة المكونات', url: '#', icon: Frame },
    { name: 'صفحات الهبوط', url: '#', icon: PieChart },
    { name: 'التوثيق', url: '#', icon: MapIcon },
  ],
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
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo aria-hidden="true" className="size-4" />
              </div>
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown aria-hidden="true" className="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'left'}
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">الفرق</DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <team.logo className="size-3.5 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>Cmd+{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus aria-hidden="true" className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">اضافة فريق</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { open } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>المنصة</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon aria-hidden="true" />}
                  {open && (
                    <>
                      <span>{item.title}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className="ms-auto transition-transform duration-200 group-data-[open=true]/collapsible:rotate-90 rtl:rotate-180"
                      />
                    </>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: React.ElementType
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>المشاريع</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon aria-hidden="true" />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal aria-hidden="true" />
                  <span className="sr-only">المزيد</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'left'}
                align={isMobile ? 'end' : 'start'}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Folder aria-hidden="true" className="text-muted-foreground" />
                    <span>عرض المشروع</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward aria-hidden="true" className="text-muted-foreground" />
                    <span>مشاركة المشروع</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Trash2 aria-hidden="true" className="text-muted-foreground" />
                    <span>حذف المشروع</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal aria-hidden="true" className="text-sidebar-foreground/70" />
            <span>المزيد</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
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
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">ام</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown aria-hidden="true" className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'left'}
            align="end"
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-right text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">ام</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-right text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles aria-hidden="true" />
                الترقية الى برو
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck aria-hidden="true" />
                الحساب
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard aria-hidden="true" />
                الفوترة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell aria-hidden="true" />
                الاشعارات
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOut aria-hidden="true" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default function Demo() {
  return (
    <DirectionContext.Provider value="rtl">
      <div className="transform-[translateZ(0)] relative flex h-full w-full overflow-hidden" dir="rtl">
        <SidebarProvider dir="rtl">
          <Sidebar collapsible="icon" side="right">
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
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ms-1" />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </DirectionContext.Provider>
  )
}
```

```tsx
<Sidebar dir="rtl" side="right">
  {/* ... */}
</Sidebar>
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionSidebar` for smooth width animations powered by [motion](https://motion.dev). The sidebar width animates with expo-out easing when collapsing and expanding.

```tsx title="components/sidebar-7.tsx"
// import from your project: import Demo from '@/components/sidebar-7'
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import {
  MotionSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@gentleduck/registry-ui/sidebar'
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map as MapIcon,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

const data = {
  user: {
    name: 'Alex Morgan',
    email: 'alex@gentleduck.org',
    avatar: '/avatars/01.png',
  },
  teams: [
    {
      name: 'Duck Labs',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Pond Studio',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Feather Works',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Workspace',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: 'Overview', url: '#' },
        { title: 'Favorites', url: '#' },
        { title: 'Preferences', url: '#' },
      ],
    },
    {
      title: 'Components',
      url: '#',
      icon: Bot,
      items: [
        { title: 'Primitives', url: '#' },
        { title: 'Compositions', url: '#' },
        { title: 'Patterns', url: '#' },
      ],
    },
    {
      title: 'Resources',
      url: '#',
      icon: BookOpen,
      items: [
        { title: 'Getting Started', url: '#' },
        { title: 'Guides', url: '#' },
        { title: 'Examples', url: '#' },
        { title: 'Releases', url: '#' },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        { title: 'Profile', url: '#' },
        { title: 'Team', url: '#' },
        { title: 'Billing', url: '#' },
        { title: 'Usage', url: '#' },
      ],
    },
  ],
  projects: [
    { name: 'Component Library', url: '#', icon: Frame },
    { name: 'Landing Pages', url: '#', icon: PieChart },
    { name: 'Documentation', url: '#', icon: MapIcon },
  ],
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
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo aria-hidden="true" className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown aria-hidden="true" className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <team.logo className="size-3.5 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>Cmd+{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus aria-hidden="true" className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add team</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { open } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon aria-hidden="true" />}
                  {open && (
                    <>
                      <span>{item.title}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className="ml-auto transition-transform duration-200 group-data-[open=true]/collapsible:rotate-90"
                      />{' '}
                    </>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: React.ElementType
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon aria-hidden="true" />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal aria-hidden="true" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Folder aria-hidden="true" className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward aria-hidden="true" className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Trash2 aria-hidden="true" className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal aria-hidden="true" className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
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
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">AM</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown aria-hidden="true" className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">AM</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles aria-hidden="true" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck aria-hidden="true" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard aria-hidden="true" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell aria-hidden="true" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOut aria-hidden="true" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider>
        <MotionSidebar collapsible="icon">
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
        </MotionSidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

}>
  Requires the `motion` package. Use `MotionSidebar` instead of `Sidebar`. All other sub-components (`SidebarProvider`, `SidebarContent`, `SidebarTrigger`, etc.) stay the same.

### MotionSidebar

Same props as `Sidebar`. Replaces CSS width transition with motion `m.div animate` using contentTransition (250ms expo-out). Handles icon collapse, offcanvas slide, and floating/inset variants. Requires the `motion` package.