import type * as React from 'react'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@gentleduck/libs/cn'
import { Slot } from '@gentleduck/primitives/slot'

const Breadcrumb = ({
  ref,
  ...props
}: React.ComponentPropsWithRef<'nav'> & {
  separator?: React.ReactNode
}) => {
  return <nav ref={ref} {...props} duck-breadcrumb="" aria-label="breadcrumb" />
}

const BreadcrumbList = ({ className, ref, ...props }: React.ComponentPropsWithRef<'ol'>) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm sm:gap-2.5',
      className,
    )}
    {...props}
    duck-breadcrumb-list=""
  />
)

const BreadcrumbItem = ({ className, ref, ...props }: React.ComponentPropsWithRef<'li'>) => {
  return (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} duck-breadcrumb-item="" />
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
      ref={ref}
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
      duck-breadcrumb-link=""
    />
  )
}

const BreadcrumbPage = ({ className, ref, ...props }: React.ComponentPropsWithRef<'span'>) => {
  return (
    <span
      ref={ref}
      className={cn('font-normal text-foreground', className)}
      {...props}
      role="link"
      aria-disabled="true"
      aria-current="page"
      duck-breadcrumb-page=""
    />
  )
}

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
  <li
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
    role="presentation"
    aria-hidden="true"
    duck-breadcrumb-separator="">
    {children ?? <ChevronRight />}
  </li>
)

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
    duck-breadcrumb-ellipsis="">
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
