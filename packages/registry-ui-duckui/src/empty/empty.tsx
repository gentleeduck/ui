import { cn } from '@gentleduck/libs/cn'
import { cva, type VariantProps } from '@gentleduck/variants'
import { emptyMediaVariants } from './empty.constants'

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12',
        className,
      )}
      data-slot="empty"
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
      data-slot="empty-header"
      {...props}
    />
  )
}

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      className={cn(emptyMediaVariants({ className, variant }))}
      data-slot="empty-icon"
      data-variant={variant}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('font-medium text-lg tracking-tight', className)} data-slot="empty-title" {...props} />
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      className={cn(
        'text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      data-slot="empty-description"
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm', className)}
      data-slot="empty-content"
      {...props}
    />
  )
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia }
