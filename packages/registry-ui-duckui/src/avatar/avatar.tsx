'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'

export interface AvatarProps extends React.HTMLProps<HTMLImageElement> {}

function Avatar({ className, alt, ref, ...props }: AvatarProps) {
  const [isValid, setIsValid] = React.useState(false)

  return (
    <picture className={cn('relative shrink-0 overflow-hidden rounded-full size-10', className)}>
      <img
        ref={ref}
        {...props}
        onLoad={() => setIsValid(true)}
        onError={() => setIsValid(false)}
        className={'relative flex shrink-0 overflow-hidden rounded-full object-cover w-full h-full text-transparent'}
        alt={alt}
      />
      {!isValid && (
        <span
          aria-label={alt}
          role="img"
          className="absolute flex bg-muted items-center justify-center inset-0 w-full h-full rounded-full">
          {alt?.slice(0, 2)}
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
      <div className={cn('flex items-center -space-x-5', className)} ref={ref} {...props}>
        {visibleImgs.map(({ className, alt, ...props }) => (
          <Avatar
            key={props.id}
            className={cn('border-2 border-border', className)}
            alt={alt?.slice(0, 2)}
            {...props}
          />
        ))}

        {/* Display overflow count if necessary */}
        {overflowCount > 0 && (
          <div className="relative inline-block z-10">
            <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full size-10 text-sm font-medium ring-2 ring-background">
              +{overflowCount}
            </div>
          </div>
        )}
      </div>
    )
  },
)

export { Avatar, AvatarGroup }
