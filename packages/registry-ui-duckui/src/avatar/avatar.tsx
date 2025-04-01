'use client'

import * as React from 'react'
import { cn } from '@gentelduck/libs/cn'

export interface AvatarProps extends React.HTMLProps<HTMLImageElement> { }

const Avatar = ({ className, ref, ...props }: AvatarProps) => {
  return (
    <img
      ref={ref}
      {...props}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full object-cover bg-muted flex items-center justify-center',
        className,
      )}
    />
  )
}

// AvatarGroup Component
interface UserType {
  id: string
  name?: string
  avatarUrl?: string
}

export interface AvatarGroupProps extends React.HTMLProps<HTMLDivElement> {
  users: UserType[]
  max_users?: number
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max_users, users, className, ...props }, ref) => {
    const max = max_users ?? users.length
    return (
      <div className={cn('flex items-center', className)} {...props} ref={ref}>
        {users.slice(0, max).map((user) => (
          <Avatar
            src={user.avatarUrl}
            alt={user?.name?.toString().slice(0, 2)}
            key={user.id}
          />
        ))}
      </div>
    )
  },
)

export { Avatar }
