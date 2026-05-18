'use client'

import { useAtom } from 'jotai'
import { FileTextIcon, FolderIcon, SettingsIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { sidebarOpenAtom } from '@/lib/atoms'
import type { Session } from '@/lib/auth'
import { DocDuckLogo } from './docduck-logo'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
}

function NavItem({ href, icon, label, active, collapsed }: NavItemProps) {
  const link = (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors duration-200 ${
        active
          ? 'bg-accent font-medium text-foreground'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
      } ${collapsed ? 'justify-center px-2' : ''}`}>
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return link
}

interface AppSidebarProps {
  user: Session['user']
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [open, setOpen] = useAtom(sidebarOpenAtom)
  const pathname = usePathname()

  const workspaceMatch = pathname.match(/\/workspaces\/([^/]+)/)
  const currentSlug = workspaceMatch?.[1]

  const collapsed = !open

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    if (mq.matches) setOpen(false)
  }, [pathname, setOpen])

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed z-50 flex h-full flex-col border-r bg-sidebar transition-all duration-200 md:relative md:z-auto ${
          open ? 'w-60' : 'w-0 -translate-x-full md:w-12 md:translate-x-0'
        }`}>
        {/* Logo row — same height as topbar so borders connect */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b px-3">
          <div className="flex items-center gap-2">
            <DocDuckLogo size={24} className="shrink-0" />
            {!collapsed && <span className="font-semibold text-sm tracking-tight">DocDuck</span>}
          </div>
          {!collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 md:hidden"
              onClick={() => setOpen(false)}>
              <XIcon className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {!collapsed && (
            <p className="mb-1 px-3 pt-2 pb-1 text-[11px] text-muted-foreground/60 uppercase tracking-wider">General</p>
          )}
          <NavItem
            href="/workspaces"
            icon={<FolderIcon className="h-4 w-4" />}
            label="Workspaces"
            active={pathname === '/workspaces'}
            collapsed={collapsed}
          />

          {currentSlug && (
            <>
              {!collapsed && (
                <p className="mt-4 mb-1 px-3 pb-1 text-[11px] text-muted-foreground/60 uppercase tracking-wider">
                  Workspace
                </p>
              )}
              {collapsed && <div className="my-2 border-t" />}
              <NavItem
                href={`/workspaces/${currentSlug}`}
                icon={<FileTextIcon className="h-4 w-4" />}
                label="Documents"
                active={pathname.startsWith(`/workspaces/${currentSlug}`) && !pathname.includes('/settings')}
                collapsed={collapsed}
              />
              <NavItem
                href={`/workspaces/${currentSlug}/settings`}
                icon={<SettingsIcon className="h-4 w-4" />}
                label="Settings"
                active={pathname.startsWith(`/workspaces/${currentSlug}/settings`)}
                collapsed={collapsed}
              />
            </>
          )}
        </nav>

        {/* User section */}
        <div className="border-t p-2">
          <div className={`flex items-center gap-2.5 rounded-md px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-primary font-medium text-[11px] text-primary-foreground">
                {user.name?.charAt(0)?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] leading-tight">{user.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
