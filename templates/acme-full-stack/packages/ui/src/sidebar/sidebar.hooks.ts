import React from 'react'
import type { ISidebarContextProps } from './sidebar.types'

export const SidebarContext = React.createContext<ISidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}
