'use client'

import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/default/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/registry/default/ui/sidebar'

const items = [
  {
    items: [
      {
        title: 'Installation',
        url: '#',
      },
      {
        title: 'Project Structure',
        url: '#',
      },
    ],
    title: 'Getting Started',
    url: '#',
  },
  {
    items: [
      {
        title: 'Routing',
        url: '#',
      },
      {
        isActive: true,
        title: 'Data Fetching',
        url: '#',
      },
      {
        title: 'Rendering',
        url: '#',
      },
      {
        title: 'Caching',
        url: '#',
      },
      {
        title: 'Styling',
        url: '#',
      },
      {
        title: 'Optimizing',
        url: '#',
      },
      {
        title: 'Configuring',
        url: '#',
      },
      {
        title: 'Testing',
        url: '#',
      },
      {
        title: 'Authentication',
        url: '#',
      },
      {
        title: 'Deploying',
        url: '#',
      },
      {
        title: 'Upgrading',
        url: '#',
      },
      {
        title: 'Examples',
        url: '#',
      },
    ],
    title: 'Building Your Application',
    url: '#',
  },
  {
    items: [
      {
        title: 'Components',
        url: '#',
      },
      {
        title: 'File Conventions',
        url: '#',
      },
      {
        title: 'Functions',
        url: '#',
      },
      {
        title: 'next.config.js Options',
        url: '#',
      },
      {
        title: 'CLI',
        url: '#',
      },
      {
        title: 'Edge Runtime',
        url: '#',
      },
    ],
    title: 'API Reference',
    url: '#',
  },
  {
    items: [
      {
        title: 'Accessibility',
        url: '#',
      },
      {
        title: 'Fast Refresh',
        url: '#',
      },
      {
        title: 'Next.js Compiler',
        url: '#',
      },
      {
        title: 'Supported Browsers',
        url: '#',
      },
      {
        title: 'Turbopack',
        url: '#',
      },
    ],
    title: 'Architecture',
    url: '#',
  },
]

export default function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => (
                  <Collapsible className="group/collapsible" defaultOpen={index === 0} key={index}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <span>{item.title}</span>
                          <ChevronRight className="transition-transform ml-auto group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem, subIndex) => (
                            <SidebarMenuSubItem key={subIndex}>
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
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
