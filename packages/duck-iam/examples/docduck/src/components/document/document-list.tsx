'use client'

import { EditIcon, FileTextIcon, GlobeIcon, LockIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Can, Cannot } from '@/lib/access-client'
import { createDocument, deleteDocument, toggleDocumentPublic } from '@/server/actions/document'

interface Document {
  id: string
  title: string
  workspaceId: string
  ownerId: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  documents: Document[]
  workspaceId: string
  workspaceSlug: string
}

export function DocumentList({ documents, workspaceId, workspaceSlug }: Props) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')

  const filteredDocuments = useMemo(() => {
    const query = search.toLowerCase().trim()
    const filtered = query ? documents.filter((doc) => doc.title.toLowerCase().includes(query)) : documents

    return [...filtered].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [documents, search])

  async function handleCreate() {
    setCreating(true)
    try {
      const result = await createDocument(workspaceId, 'Untitled')
      router.push(`/workspaces/${workspaceSlug}/documents/${result.id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm('Delete this document?')) return
    try {
      await deleteDocument(docId)
      toast.success('Document deleted')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function handleTogglePublic(docId: string) {
    try {
      await toggleDocumentPublic(docId)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Sticky header with search and create */}
      <div className="sticky top-0 z-10 -mx-1 bg-background/95 px-1 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="pl-9"
            />
          </div>

          <Can action="create" resource="document">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" onClick={handleCreate} loading={creating}>
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{creating ? 'Creating...' : 'New Document'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create a new document in this workspace</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Can>
        </div>

        <Cannot action="create" resource="document">
          <p className="mt-2 text-muted-foreground text-sm">
            You don&apos;t have permission to create documents in this workspace.
          </p>
        </Cannot>
      </div>

      {/* Document list or empty state */}
      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <FileTextIcon className="h-10 w-10 text-muted-foreground/30" />
          <p className="mt-4 font-medium text-muted-foreground text-sm">
            {search ? 'No documents match your search' : 'No documents yet'}
          </p>
          <p className="mt-1 max-w-sm text-center text-muted-foreground/70 text-xs">
            {search ? 'Try adjusting your search terms.' : 'Create your first document to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <ContextMenu key={doc.id}>
              <ContextMenuTrigger asChild>
                <div
                  className="group flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-3.5 transition-colors duration-200 hover:bg-accent/50"
                  onClick={() => router.push(`/workspaces/${workspaceSlug}/documents/${doc.id}`)}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <FileTextIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm leading-tight">{doc.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={doc.isPublic ? 'secondary' : 'outline'} className="shrink-0 gap-1 text-[10px]">
                        {doc.isPublic ? (
                          <>
                            <GlobeIcon className="h-2.5 w-2.5" />
                            Public
                          </>
                        ) : (
                          <>
                            <LockIcon className="h-2.5 w-2.5" />
                            Private
                          </>
                        )}
                      </Badge>
                      <span className="truncate text-[11px] text-muted-foreground/60">{formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </ContextMenuTrigger>

              <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={() => router.push(`/workspaces/${workspaceSlug}/documents/${doc.id}`)}>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Open
                </ContextMenuItem>

                <ContextMenuItem disabled>
                  <EditIcon className="mr-2 h-4 w-4" />
                  Rename
                </ContextMenuItem>

                <Can action="share" resource="document">
                  <ContextMenuItem onClick={() => handleTogglePublic(doc.id)}>
                    {doc.isPublic ? (
                      <>
                        <LockIcon className="mr-2 h-4 w-4" />
                        Make Private
                      </>
                    ) : (
                      <>
                        <GlobeIcon className="mr-2 h-4 w-4" />
                        Make Public
                      </>
                    )}
                  </ContextMenuItem>
                </Can>

                <Can action="delete" resource="document">
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(doc.id)}>
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </ContextMenuItem>
                </Can>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      )}
    </div>
  )
}
