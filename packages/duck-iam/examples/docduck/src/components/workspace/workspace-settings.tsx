'use client'

import { useAtom } from 'jotai'
import { CheckIcon, TrashIcon, UserPlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Can } from '@/lib/access-client'
import { type Theme, themeAtom } from '@/lib/theme'
import { deleteWorkspace, inviteMember, removeMember, updateMemberRole } from '@/server/actions/workspace'
import { InviteDialog } from './invite-dialog'
import { MemberList } from './member-list'
import { PermissionsDashboard } from './permissions-dashboard'

interface Member {
  id: string
  userId: string
  workspaceId: string
  role: string
  user?: { id: string; name: string; email: string } | undefined
}

interface Workspace {
  id: string
  name: string
  slug: string
  ownerId: string
}

interface Props {
  workspace: Workspace
  members: Member[]
}

export function WorkspaceSettings({ workspace, members }: Props) {
  const router = useRouter()
  const [showInvite, setShowInvite] = useState(false)
  const [theme, setTheme] = useAtom(themeAtom)

  async function handleDeleteWorkspace() {
    try {
      await deleteWorkspace(workspace.id)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function handleRoleChange(memberId: string, newRole: string) {
    try {
      await updateMemberRole(workspace.id, memberId, newRole)
      toast.success('Role updated')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function handleRemoveMember(memberId: string) {
    try {
      await removeMember(workspace.id, memberId)
      toast.success('Member removed')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function handleInvite(email: string, role: string) {
    try {
      await inviteMember(workspace.id, email, role)
      toast.success('Member invited')
      setShowInvite(false)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">Team Members</h2>
              <p className="text-muted-foreground text-sm">
                {members.length} member{members.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Can action="manage" resource="member">
              <Button type="button" size="sm" onClick={() => setShowInvite(true)}>
                <UserPlusIcon className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </Can>
          </div>
          <Separator />
          <MemberList members={members} onRoleChange={handleRoleChange} onRemove={handleRemoveMember} />
        </TabsContent>

        <TabsContent value="permissions" className="mt-4 space-y-4">
          <div>
            <h2 className="font-semibold text-lg">Your Permissions</h2>
            <p className="text-muted-foreground text-sm">Overview of what you can do in this workspace</p>
          </div>
          <Separator />
          <PermissionsDashboard />
        </TabsContent>

        <TabsContent value="appearance" className="mt-4 space-y-4">
          <div>
            <h2 className="font-semibold text-lg">Theme</h2>
            <p className="text-muted-foreground text-sm">Choose your preferred appearance</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 sm:max-w-md">
            {(
              [
                { value: 'bun' as Theme, label: 'Bun Dark', color: 'bg-zinc-900' },
                { value: 'light' as Theme, label: 'Light', color: 'bg-zinc-100' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                  theme === option.value
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-muted-foreground/30'
                }`}>
                {theme === option.value && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <CheckIcon className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className={`h-16 w-full rounded-md ${option.color} border`} />
                <span className="font-medium text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <Can action="delete" resource="workspace">
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Deleting a workspace removes all documents and member access permanently.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete Workspace
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete workspace &ldquo;{workspace.name}&rdquo;?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All documents and member access will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteWorkspace}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </Can>

      {showInvite && <InviteDialog onInvite={handleInvite} onClose={() => setShowInvite(false)} />}
    </div>
  )
}
