'use client'

import { useAtom } from 'jotai'
import { ChevronRightIcon, LogOutIcon, PanelLeftIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { documentTitleAtom, sidebarOpenAtom } from '@/lib/atoms'
import type { Session } from '@/lib/auth'
import { signOut } from '@/lib/auth-client'
import { ThemeSwitcher } from './theme-switcher'

interface TopbarProps {
  user: Session['user']
}

export function Topbar({ user }: TopbarProps) {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)
  const [documentTitle] = useAtom(documentTitleAtom)
  const pathname = usePathname()
  const router = useRouter()

  const workspaceMatch = pathname.match(/\/workspaces\/([^/]+)/)
  const currentSlug = workspaceMatch?.[1]

  const documentMatch = pathname.match(/\/workspaces\/[^/]+\/documents\/([^/]+)/)
  const currentDocId = documentMatch?.[1]

  async function handleLogout() {
    await signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        className="h-8 w-8">
        <PanelLeftIcon className="h-4 w-4" />
      </Button>

      {/* Breadcrumb */}
      <nav className="hidden min-w-0 items-center gap-1 text-muted-foreground text-sm sm:flex">
        <span className="shrink-0">Workspaces</span>
        {currentSlug && (
          <>
            <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
            <span className={`max-w-[200px] truncate ${currentDocId ? '' : 'text-foreground'}`}>{currentSlug}</span>
          </>
        )}
        {currentDocId && (
          <>
            <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="max-w-[200px] truncate text-foreground">{documentTitle ?? currentDocId}</span>
          </>
        )}
      </nav>

      <div className="flex-1" />

      <ThemeSwitcher />

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary font-medium text-[11px] text-primary-foreground">
                {user.name?.charAt(0)?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="truncate font-medium text-sm leading-none">{user.name}</p>
              <p className="truncate text-muted-foreground text-xs leading-none">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
