import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { WorkspaceProvider } from '@/components/workspace/workspace-provider'
import { auth } from '@/lib/auth'
import { getScopedPermissions } from '@/lib/permissions'
import { getWorkspaceBySlug, getWorkspaceMembership } from '@/server/actions/workspace'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function WorkspaceLayout({ children, params }: Props) {
  const { slug } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/login')

  const workspace = await getWorkspaceBySlug(slug)
  if (!workspace) redirect('/workspaces')

  const membership = await getWorkspaceMembership(workspace.id, session.user.id)
  if (!membership) redirect('/workspaces')

  // Generate permissions scoped to this workspace
  // Keys are simple (e.g. "create:document") so <Can> components work without scope
  const permissions = await getScopedPermissions(session.user.id, workspace.id)

  return (
    <WorkspaceProvider workspace={workspace} membership={membership} permissions={permissions}>
      {children}
    </WorkspaceProvider>
  )
}
