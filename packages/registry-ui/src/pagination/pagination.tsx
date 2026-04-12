import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { tapScale } from '@gentleduck/motion/presets/content'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
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
import { LazyMotion, m } from 'motion/react'
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
  const { className: rightClassName, icon: rightIcon, ...rightProps } = props.right ?? {}
  const { className: maxRightClassName, icon: maxRightIcon, ...maxRightProps } = props.maxRight ?? {}
  const { className: leftClassName, icon: leftIcon, ...leftProps } = props.left ?? {}
  const { className: maxLeftClassName, icon: maxLeftIcon, ...maxLeftProps } = props.maxLeft ?? {}
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
            icon={maxLeftIcon === undefined ? <StartDoubleIcon aria-hidden="true" /> : maxLeftIcon}
            size="sm"
            variant="outline"
            {...maxLeftProps}
          />
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button
            aria-label="Go to previous page"
            className={cn('w-[32px] p-0', leftClassName)}
            icon={leftIcon === undefined ? <StartIcon aria-hidden="true" /> : leftIcon}
            size="sm"
            variant="outline"
            {...leftProps}
          />
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button
            aria-label="Go to next page"
            className={cn('w-[32px] p-0', rightClassName)}
            icon={rightIcon === undefined ? <EndIcon aria-hidden="true" /> : rightIcon}
            size="sm"
            variant="outline"
            {...rightProps}
          />
        </PaginationItem>
        <PaginationItem className={cn(itemClassName)} {...itemProps}>
          <Button
            aria-label="Go to last page"
            className={cn('w-[32px] p-0', maxRightClassName)}
            icon={maxRightIcon === undefined ? <EndDoubleIcon aria-hidden="true" /> : maxRightIcon}
            size="sm"
            variant="outline"
            {...maxRightProps}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const MotionPagination = React.forwardRef<
  React.ComponentRef<typeof PaginationPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof PaginationPrimitive.Root>
>(({ className, ...props }, ref) => {
  const content = useMotionPreset('scaleIn', { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <PaginationPrimitive.Root
          className={cn('mx-auto flex w-full justify-center', className)}
          data-slot="pagination"
          ref={ref}
          {...props}
        />
      </m.div>
    </LazyMotion>
  )
})
MotionPagination.displayName = 'MotionPagination'

const MotionPaginationLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<PaginationLinkProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & { index?: number }
>(({ className, isActive, size = 'icon', index = 0, ...props }, ref) => {
  const options = React.useMemo(() => ({ transition: springBouncy, delay: index * 0.05 }), [index])
  const content = useMotionPreset('scaleIn', options)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.a
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
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        whileTap={tapScale}
        {...(props as Omit<
          React.ComponentPropsWithoutRef<'a'>,
          'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
        >)}
      />
    </LazyMotion>
  )
})
MotionPaginationLink.displayName = 'MotionPaginationLink'

const MotionPaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof PaginationLink> & { text?: string; index?: number }
>(({ className, text = 'Previous', index = 0, ...props }, ref) => (
  <MotionPaginationLink
    aria-label="Go to previous page"
    className={cn('gap-1 ps-2.5', className)}
    data-slot="pagination-previous"
    ref={ref}
    size="default"
    index={index}
    {...props}>
    <ChevronLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
    <span className="hidden sm:block">{text}</span>
  </MotionPaginationLink>
))
MotionPaginationPrevious.displayName = 'MotionPaginationPrevious'

const MotionPaginationNext = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof PaginationLink> & { text?: string; index?: number }
>(({ className, text = 'Next', index = 0, ...props }, ref) => (
  <MotionPaginationLink
    aria-label="Go to next page"
    className={cn('gap-1 pe-2.5', className)}
    data-slot="pagination-next"
    ref={ref}
    size="default"
    index={index}
    {...props}>
    <span className="hidden sm:block">{text}</span>
    <ChevronRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
  </MotionPaginationLink>
))
MotionPaginationNext.displayName = 'MotionPaginationNext'

export {
  MotionPagination,
  MotionPaginationLink,
  MotionPaginationNext,
  MotionPaginationPrevious,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationWrapper,
}
