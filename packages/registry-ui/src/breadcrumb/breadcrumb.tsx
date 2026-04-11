'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { slideFromLeft } from '@gentleduck/motion/presets/slide-from-left'
import { springSnappy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { Slot } from '@gentleduck/primitives/slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode
  }
>(({ dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return <nav ref={ref} {...props} aria-label="breadcrumb" data-slot="breadcrumb" dir={direction} />
})
Breadcrumb.displayName = 'Breadcrumb'

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  ({ className, ...props }, ref) => (
    <ol
      className={cn(
        'wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm sm:gap-2.5',
        className,
      )}
      ref={ref}
      {...props}
      data-slot="breadcrumb-list"
    />
  ),
)
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ className, ...props }, ref) => {
    return (
      <li
        className={cn('inline-flex items-center gap-1.5', className)}
        ref={ref}
        {...props}
        data-slot="breadcrumb-item"
      />
    )
  },
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = (asChild ? Slot : 'a') as React.ElementType
  return (
    <Comp
      className={cn('transition-colors hover:text-foreground', className)}
      ref={ref}
      {...props}
      data-slot="breadcrumb-link"
    />
  )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        className={cn('font-normal text-foreground', className)}
        ref={ref}
        {...props}
        aria-current="page"
        data-slot="breadcrumb-page"
      />
    )
  },
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ children, className, ...props }, ref) => (
    <li
      className={cn('[&>svg]:size-3.5', className)}
      ref={ref}
      {...props}
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      role="presentation">
      {children ?? <ChevronRight className="rtl:rotate-180" />}
    </li>
  ),
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'> & { text?: string }
>(({ className, text = 'More', ...props }, ref) => (
  <span
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    role="img"
    aria-label={text}
    ref={ref}
    {...props}
    data-slot="breadcrumb-ellipsis">
    <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
  </span>
))
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const MotionBreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  Omit<React.ComponentPropsWithoutRef<'li'>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & {
    index?: number
  }
>(({ className, index = 0, ...props }, ref) => {
  const options = React.useMemo(() => ({ transition: springSnappy, delay: index * 0.035 }), [index])
  const content = useMotionPreset(scaleIn, options)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.li
        ref={ref}
        className={cn('inline-flex items-center gap-1.5', className)}
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        {...props}
        data-slot="breadcrumb-item"
      />
    </LazyMotion>
  )
})
MotionBreadcrumbItem.displayName = 'MotionBreadcrumbItem'

const MotionBreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  Omit<React.ComponentPropsWithoutRef<'li'>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & {
    index?: number
  }
>(({ children, className, index = 0, ...props }, ref) => {
  const options = React.useMemo(() => ({ transition: springSnappy, delay: index * 0.035 }), [index])
  const content = useMotionPreset(slideFromLeft, options)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.li
        ref={ref}
        className={cn('[&>svg]:size-3.5', className)}
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        aria-hidden="true"
        role="presentation"
        {...props}
        data-slot="breadcrumb-separator">
        {children ?? <ChevronRight className="rtl:rotate-180" />}
      </m.li>
    </LazyMotion>
  )
})
MotionBreadcrumbSeparator.displayName = 'MotionBreadcrumbSeparator'

const MotionBreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  ({ className, children, ...props }, ref) => {
    let cursor = 0
    const injectIndex = (child: React.ReactNode): React.ReactNode => {
      if (
        React.isValidElement(child) &&
        (child.type === MotionBreadcrumbItem || child.type === MotionBreadcrumbSeparator)
      ) {
        const injected = React.cloneElement(child as React.ReactElement<{ index?: number }>, {
          index: cursor++,
        })
        return injected
      }
      return child
    }
    return (
      <ol
        className={cn(
          'wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm sm:gap-2.5',
          className,
        )}
        ref={ref}
        {...props}
        data-slot="breadcrumb-list">
        {React.Children.map(children, injectIndex)}
      </ol>
    )
  },
)
MotionBreadcrumbList.displayName = 'MotionBreadcrumbList'

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  MotionBreadcrumbItem,
  MotionBreadcrumbList,
  MotionBreadcrumbSeparator,
}
