'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { slideFromLeft } from '@gentleduck/motion/presets/slide-from-left'
import { springSnappy } from '@gentleduck/motion/transitions/springs'
import { ChevronRight } from 'lucide-react'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

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

export { MotionBreadcrumbItem, MotionBreadcrumbList, MotionBreadcrumbSeparator }
