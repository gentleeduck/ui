import { cn } from '@gentleduck/libs/cn'
import { Slot } from '@gentleduck/primitives/slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import type * as React from 'react'

const Breadcrumb = ({
  ref,
  ...props
}: React.ComponentPropsWithRef<'nav'> & {
  separator?: React.ReactNode
}) => {
  return <nav ref={ref} {...props} aria-label="breadcrumb" duck-breadcrumb="" />
}

const BreadcrumbList = ({ className, ref, ...props }: React.ComponentPropsWithRef<'ol'>) => (
  <ol
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm sm:gap-2.5',
      className,
    )}
    ref={ref}
    {...props}
    data-slot="breadcrumb-list"
  />
)

const BreadcrumbItem = ({ className, ref, ...props }: React.ComponentPropsWithRef<'li'>) => {
  return (
    <li
      className={cn('inline-flex items-center gap-1.5', className)}
      ref={ref}
      {...props}
      data-slot="breadcrumb-item"
    />
  )
}

const BreadcrumbLink = ({
  asChild,
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<'a'> & {
  asChild?: boolean
}) => {
  const Comp = (asChild ? Slot : 'a') as React.ElementType
  return (
    <Comp
      className={cn('transition-colors hover:text-foreground', className)}
      ref={ref}
      {...props}
      data-slot="breadcrumb-link"
    />
  )
}

const BreadcrumbPage = ({ className, ref, ...props }: React.ComponentPropsWithRef<'a'>) => {
  return (
    <a
      className={cn('font-normal text-foreground', className)}
      ref={ref}
      {...props}
      aria-current="page"
      aria-disabled="true"
      data-slot="breadcrumb-page"
    />
  )
}

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    role="presentation">
    {children ?? <ChevronRight />}
  </div>
)

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    role="presentation"
    {...props}
    data-slot="breadcrumb-ellipsis">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
