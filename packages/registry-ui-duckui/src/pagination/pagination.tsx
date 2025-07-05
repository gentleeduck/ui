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
import * as React from 'react'
import { Button, ButtonProps, buttonVariants } from '../button'
import { DuckPaginationProps, PaginationLinkProps } from './pagination.types'

const Pagination = ({ className, ...props }: React.HTMLProps<HTMLHeadElement>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)

const PaginationContent = ({ className, ref, ...props }: React.HTMLProps<HTMLUListElement>) => (
  <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
)

const PaginationItem = ({ className, ref, ...props }: React.HTMLProps<HTMLLIElement>) => (
  <li ref={ref} className={cn('', className)} {...props} />
)

const PaginationLink = ({ className, isActive, size = 'icon', ref, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
)

const PaginationPrevious = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    ref={ref}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)

const PaginationNext = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    ref={ref}
    {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

const PaginationEllipsis = ({ className, ref, ...props }: React.HTMLProps<HTMLSpanElement>) => (
  <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} ref={ref} {...props}>
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
          <Button variant="outline" size="sm" className={cn('w-[32px] p-0', maxLeftClassName)} {...maxLeftProps}>
            <ChevronsLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button variant="outline" size="sm" className={cn('w-[32px] p-0', leftClassName)} {...leftProps}>
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button variant="outline" size="sm" className={cn('w-[32px] p-0', rightClassName)} {...rightProps}>
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button variant="outline" size="sm" className={cn('w-[32px] p-0', maxRightClassName)} {...maxRightProps}>
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

export interface DuckPaginationProps {
  wrapper?: React.ComponentPropsWithoutRef<typeof Pagination>
  content?: React.ComponentPropsWithoutRef<typeof PaginationContent>
  item?: React.ComponentPropsWithoutRef<typeof PaginationItem>
  right?: React.ComponentPropsWithoutRef<typeof Button>
  maxRight?: React.ComponentPropsWithoutRef<typeof Button>
  left?: React.ComponentPropsWithoutRef<typeof Button>
  maxLeft?: React.ComponentPropsWithoutRef<typeof Button>
}

export const DuckPagination = React.forwardRef<HTMLUListElement, DuckPaginationProps>(
  ({ wrapper, content, item, right, maxRight, left, maxLeft }, ref) => {
    const { className: wrapperClassName, ...wrapperProps } = wrapper ?? {}
    const { className: contentClassName, ...contentProps } = content ?? {}
    const { className: itemClassName, ...itemProps } = item ?? {}
    const { className: rightClassName, ...rightProps } = right ?? {}
    const { className: maxRightClassName, ...maxRightProps } = maxRight ?? {}
    const { className: leftClassName, ...leftProps } = left ?? {}
    const { className: maxLeftClassName, ...maxLeftProps } = maxLeft ?? {}

    return (
      <Pagination ref={ref} className={cn('justify-end', wrapperClassName)} {...wrapperProps}>
        <PaginationContent className={cn('gap-2', contentClassName)} {...contentProps}>
          <PaginationItem className={cn(itemClassName)} {...itemProps}>
            <Button
              variant="outline"
              size="icon"
              className={cn('h-[32px] w-[32px] p-0', maxLeftClassName)}
              {...maxLeftProps}>
              <ChevronsLeftIcon className="size-4" />
            </Button>
          </PaginationItem>
          <PaginationItem className={cn(itemClassName)} {...itemProps}>
            <Button variant="outline" size="icon" className={cn('h-[32px] w-[32px] p-0', leftClassName)} {...leftProps}>
              <ChevronLeftIcon className="size-4" />
            </Button>
          </PaginationItem>
          <PaginationItem className={cn(itemClassName)} {...itemProps}>
            <Button
              variant="outline"
              size="icon"
              className={cn('h-[32px] w-[32px] p-0', rightClassName)}
              {...rightProps}>
              <ChevronRightIcon className="size-4" />
            </Button>
          </PaginationItem>
          <PaginationItem className={cn(itemClassName)} {...itemProps}>
            <Button
              variant="outline"
              size="icon"
              className={cn('h-[32px] w-[32px] p-0', maxRightClassName)}
              {...maxRightProps}>
              <ChevronsRightIcon className="size-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
)
