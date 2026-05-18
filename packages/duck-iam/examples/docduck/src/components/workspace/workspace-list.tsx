'use client'

import { ExternalLinkIcon, FolderIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface WorkspaceMembership {
  workspace: {
    id: string
    name: string
    slug: string
    ownerId: string
    createdAt: string
  }
  role: string
}

const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'warning'> = {
  owner: 'default',
  admin: 'warning',
  editor: 'secondary',
  viewer: 'outline',
}

export function WorkspaceList({ memberships }: { memberships: WorkspaceMembership[] }) {
  const router = useRouter()

  if (memberships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <FolderIcon className="h-10 w-10 text-muted-foreground/40" />
        <h3 className="mt-4 font-medium text-sm">No workspaces yet</h3>
        <p className="mt-1 text-muted-foreground text-xs">Create a workspace to get started</p>
        <Button asChild className="mt-5" size="sm">
          <Link href="/workspaces/new">Create your first workspace</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {memberships.map(({ workspace, role }) => (
        <ContextMenu key={workspace.id}>
          <ContextMenuTrigger asChild>
            <Link
              href={`/workspaces/${workspace.slug}`}
              className="group flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors duration-200 hover:bg-accent/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <FolderIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm leading-tight">{workspace.name}</p>
                <p className="mt-0.5 truncate text-muted-foreground text-xs">/{workspace.slug}</p>
              </div>
              <Badge variant={roleBadgeVariant[role] ?? 'outline'} className="shrink-0 text-[10px] capitalize">
                {role}
              </Badge>
            </Link>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            <ContextMenuItem onSelect={() => router.push(`/workspaces/${workspace.slug}`)} className="gap-2">
              <ExternalLinkIcon className="h-4 w-4" />
              Open workspace
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => router.push(`/workspaces/${workspace.slug}/settings`)} className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  )
}
