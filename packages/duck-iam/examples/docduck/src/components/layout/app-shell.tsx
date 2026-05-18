'use client'

import { Provider as JotaiProvider } from 'jotai'
import type { Session } from '@/lib/auth'
import { AppSidebar } from './app-sidebar'
import { ThemeProvider } from './theme-provider'
import { Topbar } from './topbar'

interface AppShellProps {
  user: Session['user']
  children: React.ReactNode
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <JotaiProvider>
      <ThemeProvider>
        <div className="flex h-screen">
          <AppSidebar user={user} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Topbar user={user} />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </JotaiProvider>
  )
}
