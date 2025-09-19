import { Frame, LifeBuoy, Map, PieChart, Send } from "lucide-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
} from "@/registry/default/ui/sidebar"

const projects = [
  {
    badge: "24",
    icon: Frame,
    name: "Design Engineering",
    url: "#",
  },
  {
    badge: "12",
    icon: PieChart,
    name: "Sales & Marketing",
    url: "#",
  },
  {
    badge: "3",
    icon: Map,
    name: "Travel",
    url: "#",
  },
  {
    badge: "21",
    icon: LifeBuoy,
    name: "Support",
    url: "#",
  },
  {
    badge: "8",
    icon: Send,
    name: "Feedback",
    url: "#",
  },
]

// Dummy fetch function
async function fetchProjects() {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return projects
}

export default function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <React.Suspense fallback={<NavProjectsSkeleton />}>
                <NavProjects />
              </React.Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

function NavProjectsSkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

async function NavProjects() {
  const projects = await fetchProjects()

  return (
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
  )
}
