import { redirect } from 'next/navigation'
import { DocumentList } from '@/components/document/document-list'
import { Badge } from '@/components/ui/badge'
import { getDocuments } from '@/server/actions/document'
import { getWorkspaceBySlug } from '@/server/actions/workspace'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WorkspaceDocumentsPage({ params }: Props) {
  const { slug } = await params
  const workspace = await getWorkspaceBySlug(slug)
  if (!workspace) redirect('/workspaces')

  const docs = await getDocuments(workspace.id)

  const serializedDocs = docs.map((d) => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }))

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="truncate font-bold text-2xl">{workspace.name}</h1>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {docs.length} {docs.length === 1 ? 'doc' : 'docs'}
          </Badge>
        </div>
        <p className="mt-1 text-muted-foreground text-sm">Manage documents in this workspace</p>
      </div>
      <DocumentList documents={serializedDocs} workspaceId={workspace.id} workspaceSlug={slug} />
    </div>
  )
}
