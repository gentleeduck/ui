'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

export interface AvatarProps extends React.HTMLProps<HTMLImageElement> {
  fallback?: string
}

function Avatar({ className, fallback, alt, ref, ...props }: AvatarProps) {
  const [isValid, setIsValid] = React.useState(true)

  return (
    <picture className={cn('relative size-10 shrink-0 overflow-hidden rounded-full', className)} data-slot="avatar">
      <img
        ref={ref}
        {...props}
        alt={alt}
        className={'relative flex h-full w-full shrink-0 overflow-hidden object-cover text-transparent'}
        data-slot="avatar-img"
        height={'100%'}
        onError={() => setIsValid(false)}
        onLoad={() => setIsValid(true)}
        width={'100%'}
      />
      {!isValid && (
        <span
          aria-label={alt}
          className="absolute inset-0 flex h-full w-full items-center justify-center bg-muted"
          data-slot="avatar-fallback"
          role="img">
          {fallback?.slice(0, 2)}
        </span>
      )}
    </picture>
  )
}

export interface AvatarGroupProps extends React.HTMLProps<HTMLDivElement> {
  imgs: React.HTMLProps<HTMLImageElement>[]
  maxVisible?: number
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ imgs, maxVisible = 3, className, ...props }, ref) => {
    const visibleImgs = imgs.slice(0, maxVisible)
    const overflowCount = imgs.length > maxVisible ? imgs.length - maxVisible : 0

    return (
      <div className={cn('-space-x-5 flex items-center', className)} ref={ref} {...props}>
        {visibleImgs.map(({ className, alt, ...props }) => (
          <Avatar
            alt={alt?.slice(0, 2)}
            className={cn('border-2 border-border', className)}
            key={props.id}
            {...props}
          />
        ))}

        {/* Display overflow count if necessary */}
        {overflowCount > 0 && (
          <div className="relative z-10 inline-block">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm ring-2 ring-background">
              +{overflowCount}
            </div>
          </div>
        )}
      </div>
    )
  },
)

export { Avatar, AvatarGroup }
