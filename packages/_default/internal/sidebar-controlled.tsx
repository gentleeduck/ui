"use client"

import {
  Frame,
  LifeBuoy,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Send,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/default/ui/sidebar"

const projects = [
  {
    icon: Frame,
    name: "Design Engineering",
    url: "#",
  },
  {
    icon: PieChart,
    name: "Sales & Marketing",
    url: "#",
  },
  {
    icon: Map,
    name: "Travel",
    url: "#",
  },
  {
    icon: LifeBuoy,
    name: "Support",
    url: "#",
  },
  {
    icon: Send,
    name: "Feedback",
    url: "#",
  },
]

export default function AppSidebar() {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarProvider onOpenChange={setOpen} open={open}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
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
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center h-12 px-4 justify-between">
          <Button
            onClick={() => setOpen((open) => !open)}
            size="sm"
            variant="ghost"
          >
            {open ? <PanelLeftClose /> : <PanelLeftOpen />}
            <span>{open ? "Close" : "Open"} Sidebar</span>
          </Button>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
