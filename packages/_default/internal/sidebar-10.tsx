"use client"

import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  AudioWaveform,
  Bell,
  Blocks,
  Calendar,
  ChevronDown,
  ChevronRight,
  Command,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  Home,
  Inbox,
  LineChart,
  Link,
  type LucideIcon,
  MessageCircleQuestion,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  StarOff,
  Trash,
  Trash2,
} from "lucide-react"
import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/registry/default/ui/breadcrumb"
import { Button } from "@/registry/default/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/default/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import { Separator } from "@/registry/default/ui/separator"
import {
  Sidebar,
  SidebarContent,
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
  SidebarTrigger,
  useSidebar,
} from "@/registry/default/ui/sidebar"

export const iframeHeight = "800px"

export const description = "A sidebar in a popover."

// This is sample data.
const data = {
  actions: [
    [
      {
        icon: Settings2,
        label: "Customize Page",
      },
      {
        icon: FileText,
        label: "Turn into wiki",
      },
    ],
    [
      {
        icon: Link,
        label: "Copy Link",
      },
      {
        icon: Copy,
        label: "Duplicate",
      },
      {
        icon: CornerUpRight,
        label: "Move to",
      },
      {
        icon: Trash2,
        label: "Move to Trash",
      },
    ],
    [
      {
        icon: CornerUpLeft,
        label: "Undo",
      },
      {
        icon: LineChart,
        label: "View analytics",
      },
      {
        icon: GalleryVerticalEnd,
        label: "Version History",
      },
      {
        icon: Trash,
        label: "Show delete pages",
      },
      {
        icon: Bell,
        label: "Notifications",
      },
    ],
    [
      {
        icon: ArrowUp,
        label: "Import",
      },
      {
        icon: ArrowDown,
        label: "Export",
      },
    ],
  ],
  favorites: [
    {
      emoji: "📊",
      name: "Project Management & Task Tracking",
      url: "#",
    },
    {
      emoji: "🍳",
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
    },
    {
      emoji: "💪",
      name: "Fitness Tracker & Workout Routines",
      url: "#",
    },
    {
      emoji: "📚",
      name: "Book Notes & Reading List",
      url: "#",
    },
    {
      emoji: "🌱",
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
    },
    {
      emoji: "🗣️",
      name: "Language Learning Progress & Resources",
      url: "#",
    },
    {
      emoji: "🏠",
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
    },
    {
      emoji: "💰",
      name: "Personal Finance & Investment Portfolio",
      url: "#",
    },
    {
      emoji: "🎬",
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
    },
    {
      emoji: "✅",
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
    },
  ],
  navMain: [
    {
      icon: Search,
      title: "Search",
      url: "#",
    },
    {
      icon: Sparkles,
      title: "Ask AI",
      url: "#",
    },
    {
      icon: Home,
      isActive: true,
      title: "Home",
      url: "#",
    },
    {
      badge: "10",
      icon: Inbox,
      title: "Inbox",
      url: "#",
    },
  ],
  navSecondary: [
    {
      icon: Calendar,
      title: "Calendar",
      url: "#",
    },
    {
      icon: Settings2,
      title: "Settings",
      url: "#",
    },
    {
      icon: Blocks,
      title: "Templates",
      url: "#",
    },
    {
      icon: Trash2,
      title: "Trash",
      url: "#",
    },
    {
      icon: MessageCircleQuestion,
      title: "Help",
      url: "#",
    },
  ],
  teams: [
    {
      logo: Command,
      name: "Acme Inc",
      plan: "Enterprise",
    },
    {
      logo: AudioWaveform,
      name: "Acme Corp.",
      plan: "Startup",
    },
    {
      logo: Command,
      name: "Evil Corp.",
      plan: "Free",
    },
  ],
  workspaces: [
    {
      emoji: "🏠",
      name: "Personal Life Management",
      pages: [
        {
          emoji: "📔",
          name: "Daily Journal & Reflection",
          url: "#",
        },
        {
          emoji: "🍏",
          name: "Health & Wellness Tracker",
          url: "#",
        },
        {
          emoji: "🌟",
          name: "Personal Growth & Learning Goals",
          url: "#",
        },
      ],
    },
    {
      emoji: "💼",
      name: "Professional Development",
      pages: [
        {
          emoji: "🎯",
          name: "Career Objectives & Milestones",
          url: "#",
        },
        {
          emoji: "🧠",
          name: "Skill Acquisition & Training Log",
          url: "#",
        },
        {
          emoji: "🤝",
          name: "Networking Contacts & Events",
          url: "#",
        },
      ],
    },
    {
      emoji: "🎨",
      name: "Creative Projects",
      pages: [
        {
          emoji: "✍️",
          name: "Writing Ideas & Story Outlines",
          url: "#",
        },
        {
          emoji: "🖼️",
          name: "Art & Design Portfolio",
          url: "#",
        },
        {
          emoji: "🎵",
          name: "Music Composition & Practice Log",
          url: "#",
        },
      ],
    },
    {
      emoji: "🏡",
      name: "Home Management",
      pages: [
        {
          emoji: "💰",
          name: "Household Budget & Expense Tracking",
          url: "#",
        },
        {
          emoji: "🔧",
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
        },
        {
          emoji: "📅",
          name: "Family Calendar & Event Planning",
          url: "#",
        },
      ],
    },
    {
      emoji: "🧳",
      name: "Travel & Adventure",
      pages: [
        {
          emoji: "🗺️",
          name: "Trip Planning & Itineraries",
          url: "#",
        },
        {
          emoji: "🌎",
          name: "Travel Bucket List & Inspiration",
          url: "#",
        },
        {
          emoji: "📸",
          name: "Travel Journal & Photo Gallery",
          url: "#",
        },
      ],
    },
  ],
}

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions actions={data.actions} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 py-10">
          <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
          <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary className="mt-auto" items={data.navSecondary} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function NavActions({
  actions,
}: {
  actions: {
    label: string
    icon: LucideIcon
  }[][]
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden font-medium text-muted-foreground md:inline-block">
        Edit Oct 08
      </div>
      <Button className="h-7 w-7" size="icon" variant="ghost">
        <Star />
      </Button>
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button
            className="h-7 w-7 data-[state=open]:bg-accent"
            size="icon"
            variant="ghost"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-56 overflow-hidden rounded-lg p-0"
        >
          <Sidebar className="bg-transparent" collapsible="none">
            <SidebarContent>
              {actions.map((group, index) => (
                <SidebarGroup className="border-b last:border-none" key={index}>
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{item.label}</span>
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
                align={isMobile ? "end" : "start"}
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
              >
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
                    showOnHover
                  >
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
          <DropdownMenuContent
            align="start"
            className="w-64 rounded-lg"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                className="gap-2 p-2"
                key={team.name}
                onClick={() => setActiveTeam(team)}
              >
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
