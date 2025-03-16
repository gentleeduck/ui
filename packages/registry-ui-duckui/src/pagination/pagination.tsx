import * as React from 'react'
import {
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontal,
} from 'lucide-react'

import { cn } from '@gentelduck/libs/cn'
import { Button, ButtonProps, buttonVariants } from '../button'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('', className)}
    {...props}
  />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to previous page'
    size='default'
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className='h-4 w-4' />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to next page'
    size='default'
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className='h-4 w-4' />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export interface DuckPaginationProps {
  wrapper?: React.ComponentPropsWithoutRef<typeof Pagination>
  content?: React.ComponentPropsWithoutRef<typeof PaginationContent>
  item?: React.ComponentPropsWithoutRef<typeof PaginationItem>
  right?: React.ComponentPropsWithoutRef<typeof Button>
  maxRight?: React.ComponentPropsWithoutRef<typeof Button>
  left?: React.ComponentPropsWithoutRef<typeof Button>
  maxLeft?: React.ComponentPropsWithoutRef<typeof Button>
}

export const DuckPagination = React.forwardRef<
  HTMLUListElement,
  DuckPaginationProps
>(({ wrapper, content, item, right, maxRight, left, maxLeft }, ref) => {
  const { className: wrapperClassName, ...wrapperProps } = wrapper ?? {}
  const { className: contentClassName, ...contentProps } = content ?? {}
  const { className: itemClassName, ...itemProps } = item ?? {}
  const { className: rightClassName, ...rightProps } = right ?? {}
  const { className: maxRightClassName, ...maxRightProps } = maxRight ?? {}
  const { className: leftClassName, ...leftProps } = left ?? {}
  const { className: maxLeftClassName, ...maxLeftProps } = maxLeft ?? {}

  return (
    <Pagination
      ref={ref}
      className={cn('justify-end', wrapperClassName)}
      {...wrapperProps}
    >
      <PaginationContent
        className={cn('gap-2', contentClassName)}
        {...contentProps}
      >
        <PaginationItem
          className={cn(itemClassName)}
          {...itemProps}
        >
          <Button
            variant='outline'
            size='sm'
            className={cn('w-[32px] p-0', maxLeftClassName)}
            {...maxLeftProps}
          >
            <ChevronsLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem
          className={cn(itemClassName)}
          {...itemProps}
        >
          <Button
            variant='outline'
            size='sm'
            className={cn('w-[32px] p-0', leftClassName)}
            {...leftProps}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem
          className={cn(itemClassName)}
          {...itemProps}
        >
          <Button
            variant='outline'
            size='sm'
            className={cn('w-[32px] p-0', rightClassName)}
            {...rightProps}
          >
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
        <PaginationItem
          className={cn(itemClassName)}
          {...itemProps}
        >
          <Button
            variant='outline'
            size='sm'
            className={cn('w-[32px] p-0', maxRightClassName)}
            {...maxRightProps}
          >
            <ChevronsRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
})

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  DuckPagination as PaginationCustomView,
}
