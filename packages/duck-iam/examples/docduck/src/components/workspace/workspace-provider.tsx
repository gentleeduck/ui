'use client'

import type { PermissionMap } from '@gentleduck/iam'
import { createContext, useContext } from 'react'
import { AccessProvider } from '@/lib/access-client'

interface Workspace {
  id: string
  name: string
  slug: string
  ownerId: string
}

interface Membership {
  id: string
  role: string
  userId: string
  workspaceId: string
}

interface WorkspaceContextValue {
  workspace: Workspace
  membership: Membership
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return ctx
}

interface WorkspaceProviderProps {
  workspace: Workspace
  membership: Membership
  permissions: PermissionMap
  children: React.ReactNode
}

export function WorkspaceProvider({ workspace, membership, permissions, children }: WorkspaceProviderProps) {
  return (
    <WorkspaceContext value={{ workspace, membership }}>
      <AccessProvider permissions={permissions}>{children}</AccessProvider>
    </WorkspaceContext>
  )
}
