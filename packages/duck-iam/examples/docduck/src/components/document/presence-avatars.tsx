'use client'

import type { HocuspocusProvider } from '@hocuspocus/provider'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AwarenessUser {
  name: string
  color: string
}

interface AwarenessState {
  user?: AwarenessUser
}

interface Props {
  provider: HocuspocusProvider
  maxVisible?: number
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function PresenceAvatars({ provider, maxVisible = 5 }: Props) {
  const [users, setUsers] = useState<Array<{ clientId: number; name: string; color: string }>>([])

  useEffect(() => {
    const awareness = provider.awareness

    function updateUsers() {
      if (!awareness) return

      const localClientId = awareness.clientID
      const states = awareness.getStates() as Map<number, AwarenessState>
      const connectedUsers: Array<{ clientId: number; name: string; color: string }> = []

      states.forEach((state, clientId) => {
        if (clientId === localClientId) return
        if (state.user?.name) {
          connectedUsers.push({
            clientId,
            name: state.user.name,
            color: state.user.color,
          })
        }
      })

      setUsers(connectedUsers)
    }

    updateUsers()

    const handleUpdate = () => {
      updateUsers()
    }

    provider.on('awarenessUpdate', handleUpdate)

    return () => {
      provider.off('awarenessUpdate', handleUpdate)
    }
  }, [provider])

  if (users.length === 0) return null

  const visibleUsers = users.slice(0, maxVisible)
  const overflowCount = users.length - maxVisible

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {visibleUsers.map((u) => (
          <Tooltip key={u.clientId}>
            <TooltipTrigger asChild>
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="font-medium text-[10px] text-white" style={{ backgroundColor: u.color }}>
                  {getInitials(u.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{u.name}</TooltipContent>
          </Tooltip>
        ))}

        {overflowCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="bg-muted font-medium text-[10px] text-muted-foreground">
                  +{overflowCount}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              {users
                .slice(maxVisible)
                .map((u) => u.name)
                .join(', ')}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
