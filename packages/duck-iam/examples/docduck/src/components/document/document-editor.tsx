'use client'

import type { HocuspocusProvider } from '@hocuspocus/provider'
import { useSetAtom } from 'jotai'
import { ArrowLeftIcon, CopyIcon, Loader2Icon, LockIcon, MoreHorizontalIcon, TypeIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { documentTitleAtom } from '@/lib/atoms'
import { updateDocumentTitle } from '@/server/actions/document'
import type { ConnectionStatus } from './collaborative-editor'
import { PresenceAvatars } from './presence-avatars'

const CollaborativeEditor = dynamic(
  () => import('./collaborative-editor').then((m) => ({ default: m.CollaborativeEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center gap-2 text-muted-foreground text-sm">
        <Loader2Icon className="h-4 w-4 animate-spin" />
        Loading editor...
      </div>
    ),
  },
)

interface Document {
  id: string
  title: string
  workspaceId: string
  ownerId: string
  isPublic: boolean
}

interface Workspace {
  id: string
  name: string
  slug: string
}

interface User {
  id: string
  name: string
  email: string
}

interface Props {
  document: Document
  workspace: Workspace
  user: User
  canEdit: boolean
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

const CONNECTION_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  connected: {
    label: 'Connected',
    dotClass: 'bg-green-500',
  },
  syncing: {
    label: 'Syncing...',
    dotClass: 'bg-yellow-500 animate-pulse',
  },
  disconnected: {
    label: 'Disconnected',
    dotClass: 'bg-red-500',
  },
  connecting: {
    label: 'Connecting...',
    dotClass: 'bg-yellow-500 animate-pulse',
  },
}

export function DocumentEditor({ document: doc, workspace, user, canEdit }: Props) {
  const [title, setTitle] = useState(doc.title)
  const [titleSaving, setTitleSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [lastSavedDisplay, setLastSavedDisplay] = useState<string>('')
  const [wordCount, setWordCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const setDocumentTitle = useSetAtom(documentTitleAtom)

  useEffect(() => {
    setDocumentTitle(title || doc.title)
    return () => setDocumentTitle(null)
  }, [title, doc.title, setDocumentTitle])

  useEffect(() => {
    if (!lastSaved) return
    setLastSavedDisplay(formatRelativeTime(lastSaved))

    intervalRef.current = setInterval(() => {
      setLastSavedDisplay(formatRelativeTime(lastSaved))
    }, 10_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [lastSaved])

  const saveTitleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const saveTitle = useCallback(
    async (newTitle: string) => {
      if (newTitle === doc.title || !canEdit) return
      setTitleSaving(true)
      try {
        await updateDocumentTitle(doc.id, newTitle)
        setLastSaved(new Date())
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setTitleSaving(false)
      }
    },
    [doc.id, doc.title, canEdit],
  )

  useEffect(() => {
    if (title === doc.title) return

    saveTitleTimeoutRef.current = setTimeout(() => {
      saveTitle(title)
    }, 500)

    return () => {
      if (saveTitleTimeoutRef.current) clearTimeout(saveTitleTimeoutRef.current)
    }
  }, [title, doc.title, saveTitle])

  const handleWordCountChange = useCallback((count: number) => {
    setWordCount(count)
  }, [])

  const handleSynced = useCallback(() => {
    setLastSaved(new Date())
  }, [])

  const handleConnectionChange = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status)
  }, [])

  const handleProviderReady = useCallback((p: HocuspocusProvider) => {
    setProvider(p)
  }, [])

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }, [])

  const currentConnection = CONNECTION_CONFIG[connectionStatus]

  return (
    <div className="flex h-full flex-col">
      <TooltipProvider>
        {/* Compact header bar */}
        <div className="flex h-11 shrink-0 items-center gap-2 border-b px-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" asChild>
                <Link href={`/workspaces/${workspace.slug}`}>
                  <ArrowLeftIcon className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to workspace</TooltipContent>
          </Tooltip>

          {/* Connection dot */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex cursor-default items-center">
                <span className={`h-2 w-2 rounded-full ${currentConnection.dotClass}`} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {currentConnection.label}
              {lastSaved ? ` · Saved ${lastSavedDisplay}` : ''}
            </TooltipContent>
          </Tooltip>

          {/* Word count & save status */}
          <span className="text-[11px] text-muted-foreground">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span className="text-[11px] text-muted-foreground">{lastSaved ? `Saved ${lastSavedDisplay}` : ''}</span>

          <div className="flex-1" />

          {/* Presence avatars */}
          {provider && <PresenceAvatars provider={provider} />}

          {/* Read-only badge */}
          {!canEdit && (
            <Badge variant="outline" className="shrink-0 text-[11px]">
              <LockIcon className="mr-1 h-3 w-3" /> Read-only
            </Badge>
          )}

          {/* More menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled className="text-muted-foreground text-xs">
                <TypeIcon className="mr-2 h-3.5 w-3.5" />
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopyLink}>
                <CopyIcon className="mr-2 h-3.5 w-3.5" />
                Copy link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Borderless editor — fills remaining height */}
        <div className="min-h-0 flex-1">
          <CollaborativeEditor
            docId={doc.id}
            workspaceId={workspace.id}
            user={user}
            editable={canEdit}
            onWordCountChange={handleWordCountChange}
            onSynced={handleSynced}
            onConnectionChange={handleConnectionChange}
            onProviderReady={handleProviderReady}
          />
        </div>
      </TooltipProvider>
    </div>
  )
}
