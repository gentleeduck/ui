import { cn } from '@gentleduck/libs/cn'
import {
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontal,
} from 'lucide-react'
import type * as React from 'react'
import { Button, buttonVariants } from '../button'
import type { DuckPaginationProps, PaginationLinkProps } from './pagination.types'

const Pagination = ({ className, ...props }: React.HTMLProps<HTMLHeadElement>) => (
  <nav
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
    data-slot="pagination"
  />
)

const PaginationContent = ({ className, ref, ...props }: React.HTMLProps<HTMLUListElement>) => (
  <ul
    className={cn('flex flex-row items-center gap-1', className)}
    ref={ref}
    {...props}
    data-slot="pagination-content"
  />
)

const PaginationItem = ({ className, ref, ...props }: React.HTMLProps<HTMLLIElement>) => (
  <li className={cn('', className)} ref={ref} {...props} data-slot="pagination-item" />
)

const PaginationLink = ({ className, isActive, size = 'icon', ref, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        size,
        variant: isActive ? 'outline' : 'ghost',
      }),
      className,
    )}
    data-slot="pagination-link"
    {...props}
  />
)

const PaginationPrevious = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn('gap-1 pl-2.5', className)}
    data-slot="pagination-previous"
    ref={ref}
    size="default"
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)

const PaginationNext = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn('gap-1 pr-2.5', className)}
    data-slot="pagination-next"
    ref={ref}
    size="default"
    {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

const PaginationEllipsis = ({ className, ref, ...props }: React.HTMLProps<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    data-slot="pagination-ellipsis"
    ref={ref}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

const PaginationWrapper = (props: DuckPaginationProps) => {
  const { className: wrapperClassName, ...wrapperProps } = props.wrapper ?? {}
  const { className: contentClassName, ...contentProps } = props.content ?? {}
  const { className: itemClassName, ...itemProps } = props.item ?? {}
  const { className: rightClassName, ...rightProps } = props.right ?? {}
  const { className: maxRightClassName, ...maxRightProps } = props.maxRight ?? {}
  const { className: leftClassName, ...leftProps } = props.left ?? {}
  const { className: maxLeftClassName, ...maxLeftProps } = props.maxLeft ?? {}

  return (
    <Pagination className={cn('justify-end', wrapperClassName)} {...wrapperProps}>
      <PaginationContent className={cn('gap-2', contentClassName)} {...contentProps}>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button className={cn('w-[32px] p-0', maxLeftClassName)} size="sm" variant="outline" {...maxLeftProps}>
            <ChevronsLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button className={cn('w-[32px] p-0', leftClassName)} size="sm" variant="outline" {...leftProps}>
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button className={cn('w-[32px] p-0', rightClassName)} size="sm" variant="outline" {...rightProps}>
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button className={cn('w-[32px] p-0', maxRightClassName)} size="sm" variant="outline" {...maxRightProps}>
            <ChevronsRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationWrapper,
}
