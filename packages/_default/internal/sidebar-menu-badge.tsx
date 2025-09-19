"use client"

import { Frame, LifeBuoy, Map, PieChart, Send } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
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

export default function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton
                      asChild
                      className="group-has-[[data-state=open]]/menu-item:bg-sidebar-accent"
                    >
                      <a href={project.url}>
                        <project.icon />
                        <span>{project.name}</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{project.badge}</SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
