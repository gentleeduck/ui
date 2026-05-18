import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DocumentEditor } from '@/components/document/document-editor'
import { engine } from '@/lib/access'
import { auth } from '@/lib/auth'
import { getDocument } from '@/server/actions/document'
import { getWorkspaceBySlug } from '@/server/actions/workspace'

interface Props {
  params: Promise<{ slug: string; docId: string }>
}

export default async function DocumentPage({ params }: Props) {
  const { slug, docId } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/login')

  const workspace = await getWorkspaceBySlug(slug)
  if (!workspace) redirect('/workspaces')

  const doc = await getDocument(docId)
  if (!doc || doc.workspaceId !== workspace.id) redirect(`/workspaces/${slug}`)

  // Check if user can update this document (determines edit vs. read-only)
  const canEdit = await engine.can(
    session.user.id,
    'update',
    { type: 'document', id: docId, attributes: { ownerId: doc.ownerId, isPublic: doc.isPublic } },
    undefined,
    workspace.id,
  )

  // Strip binary content and serialize dates for client component
  const serializedDoc = {
    id: doc.id,
    title: doc.title,
    workspaceId: doc.workspaceId,
    ownerId: doc.ownerId,
    isPublic: doc.isPublic,
  }

  return <DocumentEditor document={serializedDoc} workspace={workspace} user={session.user} canEdit={canEdit} />
}
