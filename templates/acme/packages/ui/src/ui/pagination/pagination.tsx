import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as PaginationPrimitive from '@gentleduck/primitives/pagination'
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
import { Button, buttonVariants } from '../button'
import type { DuckPaginationProps, PaginationLinkProps } from './pagination.types'

const Pagination = React.forwardRef<
  React.ComponentRef<typeof PaginationPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof PaginationPrimitive.Root>
>(({ className, ...props }, ref) => (
  <PaginationPrimitive.Root
    className={cn('mx-auto flex w-full justify-center', className)}
    data-slot="pagination"
    ref={ref}
    {...props}
  />
))
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  React.ComponentRef<typeof PaginationPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PaginationPrimitive.Content>
>(({ className, ...props }, ref) => (
  <PaginationPrimitive.Content
    className={cn('flex flex-row items-center gap-1', className)}
    data-slot="pagination-content"
    ref={ref}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  React.ComponentRef<typeof PaginationPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof PaginationPrimitive.Item>
>(({ className, ...props }, ref) => (
  <PaginationPrimitive.Item className={cn(className)} data-slot="pagination-item" ref={ref} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = 'icon', ...props }, ref) => (
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
      ref={ref}
      {...props}
    />
  ),
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof PaginationLink> & { text?: string }
>(({ className, text = 'Previous', ...props }, ref) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn('gap-1 ps-2.5', className)}
    data-slot="pagination-previous"
    ref={ref}
    size="default"
    {...props}>
    <ChevronLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
    <span className="hidden sm:block">{text}</span>
  </PaginationLink>
))
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof PaginationLink> & { text?: string }
>(({ className, text = 'Next', ...props }, ref) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn('gap-1 pe-2.5', className)}
    data-slot="pagination-next"
    ref={ref}
    size="default"
    {...props}>
    <span className="hidden sm:block">{text}</span>
    <ChevronRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
  </PaginationLink>
))
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'> & { text?: string }
>(({ className, text = 'More pages', ...props }, ref) => (
  <span
    role="img"
    aria-label={text}
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    data-slot="pagination-ellipsis"
    ref={ref}
    {...props}>
    <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
  </span>
))
PaginationEllipsis.displayName = 'PaginationEllipsis'

const PaginationWrapper = (props: DuckPaginationProps) => {
  const { className: wrapperClassName, dir, ...wrapperProps } = props.wrapper ?? {}
  const { className: contentClassName, ...contentProps } = props.content ?? {}
  const { className: itemClassName, ...itemProps } = props.item ?? {}
  const { className: rightClassName, ...rightProps } = props.right ?? {}
  const { className: maxRightClassName, ...maxRightProps } = props.maxRight ?? {}
  const { className: leftClassName, ...leftProps } = props.left ?? {}
  const { className: maxLeftClassName, ...maxLeftProps } = props.maxLeft ?? {}
  const direction = useDirection(dir as Direction)
  const StartIcon = direction === 'rtl' ? ChevronRightIcon : ChevronLeftIcon
  const EndIcon = direction === 'rtl' ? ChevronLeftIcon : ChevronRightIcon
  const StartDoubleIcon = direction === 'rtl' ? ChevronsRightIcon : ChevronsLeftIcon
  const EndDoubleIcon = direction === 'rtl' ? ChevronsLeftIcon : ChevronsRightIcon

  return (
    <Pagination className={cn('justify-end', wrapperClassName)} {...wrapperProps}>
      <PaginationContent className={cn('gap-2', contentClassName)} {...contentProps}>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button
            aria-label="Go to first page"
            className={cn('w-[32px] p-0', maxLeftClassName)}
            size="sm"
            variant="outline"
            {...maxLeftProps}>
            <StartDoubleIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button
            aria-label="Go to previous page"
            className={cn('w-[32px] p-0', leftClassName)}
            size="sm"
            variant="outline"
            {...leftProps}>
            <StartIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button
            aria-label="Go to next page"
            className={cn('w-[32px] p-0', rightClassName)}
            size="sm"
            variant="outline"
            {...rightProps}>
            <EndIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button
            aria-label="Go to last page"
            className={cn('w-[32px] p-0', maxRightClassName)}
            size="sm"
            variant="outline"
            {...maxRightProps}>
            <EndDoubleIcon aria-hidden="true" />
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
