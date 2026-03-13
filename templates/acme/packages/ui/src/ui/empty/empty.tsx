import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import type { VariantProps } from '@gentleduck/variants'
import React from 'react'
import { emptyMediaVariants } from './empty.constants'

const Empty = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12',
        className,
      )}
      dir={direction}
      data-slot="empty"
      {...props}
    />
  )
})
Empty.displayName = 'Empty'

const EmptyHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
      data-slot="empty-header"
      {...props}
    />
  )
})
EmptyHeader.displayName = 'EmptyHeader'

const EmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(emptyMediaVariants({ className, variant }))}
      data-slot="empty-icon"
      data-variant={variant}
      {...props}
    />
  )
})
EmptyMedia.displayName = 'EmptyMedia'

const EmptyTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('font-medium text-lg tracking-tight', className)} data-slot="empty-title" {...props} />
  )
})
EmptyTitle.displayName = 'EmptyTitle'

const EmptyDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<'p'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      data-slot="empty-description"
      {...props}
    />
  )
})
EmptyDescription.displayName = 'EmptyDescription'

const EmptyContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm', className)}
      data-slot="empty-content"
      {...props}
    />
  )
})
EmptyContent.displayName = 'EmptyContent'

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia }
