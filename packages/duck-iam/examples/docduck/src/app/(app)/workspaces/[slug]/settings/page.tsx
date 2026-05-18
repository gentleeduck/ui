import { redirect } from 'next/navigation'
import { WorkspaceSettings } from '@/components/workspace/workspace-settings'
import { getWorkspaceBySlug, getWorkspaceMembers } from '@/server/actions/workspace'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WorkspaceSettingsPage({ params }: Props) {
  const { slug } = await params
  const workspace = await getWorkspaceBySlug(slug)
  if (!workspace) redirect('/workspaces')

  const members = await getWorkspaceMembers(workspace.id)

  // Serialize dates for client component
  const serializedMembers = members.map((m) => ({
    ...m,
    joinedAt: m.joinedAt.toISOString(),
    user: m.user ? { id: m.user.id, name: m.user.name, email: m.user.email } : undefined,
  }))

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-bold text-2xl">Workspace Settings</h1>
      <WorkspaceSettings workspace={workspace} members={serializedMembers} />
    </div>
  )
}
