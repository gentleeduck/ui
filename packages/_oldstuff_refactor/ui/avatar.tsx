'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@duck/libs/cn'
import { HoverCardCustomView } from './hover-card'
import { CalendarDays } from 'lucide-react'
import { TaggedUserType } from './swapy'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@duck/registry-ui-duckui/tooltip'

// ForwardedRef Components
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className,
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// AvatarCustom Component
export interface AvatarCustomProps
  extends React.ComponentPropsWithoutRef<typeof Avatar> {
  avatar_image: React.ComponentPropsWithoutRef<typeof AvatarImage>
  fallback?: React.ComponentPropsWithoutRef<typeof AvatarFallback>
  hover_card?: TaggedUserType
  profile_button?: boolean
}

const AvatarCustom = React.forwardRef<HTMLSpanElement, AvatarCustomProps>(
  ({ avatar_image, fallback, hover_card, profile_button, ...props }, ref) => {
    const Trigger = ({ className }: { className?: string }) => (
      <Avatar {...props} className={cn(props.className, className)}>
        <AvatarImage
          {...avatar_image}
          className={cn(avatar_image.className, 'object-cover')}
        />
        {fallback && <AvatarFallback {...fallback} />}
      </Avatar>
    )

    return hover_card ? (
      <HoverCardCustomView
        wrapper={{ openDelay: 300, closeDelay: 200 }}
        trigger={{ children: <Trigger /> }}
        content={{
          className: 'p-4',
          children: (
            <>
              {profile_button ? (
                'Profile'
              ) : (
                <div className="flex items-start gap-4">
                  <Trigger className="w-12 h-12 m-0 border-none" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      @{hover_card.name}
                    </h4>
                    <p className="text-sm">
                      I'am a UI/UX Designer from Canada.
                    </p>
                    <div className="flex items-center pt-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        Joined December 2021
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ),
        }}
      />
    ) : (
      <Trigger />
    )
  },
)

AvatarCustom.displayName = 'AvatarCustom'

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
          <AvatarCustom
            key={user.id}
            className={cn(
              'border-muted-foreground/80 border-[2px]',
              'mr-[-1.2rem]',
            )}
            avatar_image={{
              src: user.avatarUrl,
              alt: user.name,
              className: cn('rounded-md object-cover w-18 h-18'),
            }}
            fallback={{
              children: user.name?.[0],
              className: 'bg-zinc-900/80',
            }}
          />
        ))}
        {users.length > max && (
          <Tooltip>
            <TooltipTrigger>
              <div className="relative w-[37px] h-[37px] rounded-full bg-primary flex items-center justify-center font-medium cursor-pointer text-background text-sm z-[3]">
                +{users.length - max}
              </div>
            </TooltipTrigger>
            <TooltipContent
              className={cn('w-42 flex flex-col justify-between px-2')}
            >
              {users.slice(max, users.length).map((user, idx) => (
                <p key={idx} className="text-sm">
                  {user.name}
                </p>
              ))}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    )
  },
)

AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarCustom }
