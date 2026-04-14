'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../sheet'
import { SIDEBAR_WIDTH_MOBILE } from './sidebar.constants'
import { useSidebar } from './sidebar.hooks'
import type { ISidebarProps } from './sidebar.types'

const MotionSidebar = React.forwardRef<HTMLDivElement, ISidebarProps>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      dir,
      mobileTitle = 'Sidebar',
      mobileDescription = 'Displays the mobile sidebar.',
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile, open } = useSidebar()
    const direction = useDirection(dir as Direction)

    if (collapsible === 'none') {
      return (
        <div
          ref={ref}
          dir={direction}
          data-slot="sidebar"
          className={cn('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground', className)}
          {...props}>
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet dir={direction} open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            dir={direction}
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
            side={side}>
            <SheetHeader className="sr-only">
              <SheetTitle>{mobileTitle}</SheetTitle>
              <SheetDescription>{mobileDescription}</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    const isIcon = collapsible === 'icon' && !open
    const isOffcanvas = collapsible === 'offcanvas' && !open

    const gapWidth = isOffcanvas
      ? 0
      : isIcon
        ? variant === 'floating' || variant === 'inset'
          ? 'calc(3rem + 1rem)'
          : '3rem'
        : '16rem'

    const containerWidth = isIcon
      ? variant === 'floating' || variant === 'inset'
        ? 'calc(3rem + 1rem + 2px)'
        : '3rem'
      : '16rem'

    return (
      <LazyMotion features={loadDomAnimation}>
        <div
          ref={ref}
          dir={direction}
          className="group peer hidden text-sidebar-foreground md:block"
          data-state={state}
          data-collapsible={state === 'collapsed' ? collapsible : ''}
          data-variant={variant}
          data-side={side}
          data-slot="sidebar">
          <m.div
            data-slot="sidebar-gap"
            animate={{ width: gapWidth }}
            transition={springBouncy}
            className="relative bg-transparent"
          />
          <m.div
            data-slot="sidebar-container"
            data-side={side}
            animate={{
              width: containerWidth,
              ...(isOffcanvas
                ? side === 'left'
                  ? { left: 'calc(-16rem)' }
                  : { right: 'calc(-16rem)' }
                : side === 'left'
                  ? { left: 0 }
                  : { right: 0 }),
            }}
            transition={springBouncy}
            className={cn(
              'fixed inset-y-0 z-10 hidden h-svh md:flex',
              side === 'right' ? 'right-0' : 'left-0',
              variant === 'floating' || variant === 'inset'
                ? 'p-2'
                : cn(side === 'left' && 'border-r', side === 'right' && 'border-l'),
              className,
            )}>
            <div
              data-sidebar="sidebar"
              data-slot="sidebar-inner"
              className="flex size-full flex-col overflow-hidden bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border">
              {children}
            </div>
          </m.div>
        </div>
      </LazyMotion>
    )
  },
)
MotionSidebar.displayName = 'MotionSidebar'

export { MotionSidebar }
