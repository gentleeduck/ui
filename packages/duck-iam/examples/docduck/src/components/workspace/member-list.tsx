'use client'

import { TrashIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Can } from '@/lib/access-client'

interface Member {
  id: string
  userId: string
  role: string
  user?: { id: string; name: string; email: string } | undefined
}

interface Props {
  members: Member[]
  onRoleChange: (memberId: string, newRole: string) => void
  onRemove: (memberId: string) => void
}

const ROLES = ['viewer', 'editor', 'admin', 'owner']

const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'warning'> = {
  owner: 'default',
  admin: 'warning',
  editor: 'secondary',
  viewer: 'outline',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function MemberList({ members, onRoleChange, onRemove }: Props) {
  return (
    <Card>
      <div className="divide-y">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="font-medium text-xs">
                  {getInitials(member.user?.name ?? '??')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium text-sm">{member.user?.name ?? 'Unknown'}</p>
                <p className="truncate text-muted-foreground text-xs">{member.user?.email ?? ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Can
                action="manage"
                resource="member"
                fallback={
                  <Badge variant={roleBadgeVariant[member.role] ?? 'outline'} className="capitalize">
                    {member.role}
                  </Badge>
                }>
                <select
                  value={member.role}
                  onChange={(e) => onRoleChange(member.id, e.target.value)}
                  className="rounded-md border bg-background px-2 py-1 text-sm">
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Can>

              <Can action="manage" resource="member">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onRemove(member.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove member</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Can>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
