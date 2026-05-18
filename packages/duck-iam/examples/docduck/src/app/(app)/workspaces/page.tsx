import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WorkspaceList } from '@/components/workspace/workspace-list'
import { getWorkspaces } from '@/server/actions/workspace'

export default async function WorkspacesPage() {
  const memberships = await getWorkspaces()

  // Serialize dates for client component
  const serialized = memberships.map((m) => ({
    ...m,
    workspace: {
      ...m.workspace,
      createdAt: m.workspace.createdAt.toISOString(),
    },
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Workspaces</h1>
          <p className="mt-1 text-muted-foreground text-sm">Select a workspace or create a new one</p>
        </div>
        <Button asChild>
          <Link href="/workspaces/new">New Workspace</Link>
        </Button>
      </div>
      <WorkspaceList memberships={serialized} />
    </div>
  )
}
