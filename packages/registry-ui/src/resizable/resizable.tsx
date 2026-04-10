'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { GripVertical } from 'lucide-react'
import { LazyMotion, m } from 'motion/react'
import React from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'

const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Group> & { dir?: Direction }
>(({ className, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <ResizablePrimitive.Group
      className={cn('group/panel-group flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
      data-slot="panel-group"
      dir={direction}
      elementRef={ref}
      {...props}
    />
  )
})
ResizablePanelGroup.displayName = 'ResizablePanelGroup'

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Separator> & {
    withHandle?: boolean
  }
>(({ withHandle, className, ...props }, ref) => (
  <ResizablePrimitive.Separator
    elementRef={ref}
    aria-label="Resize panels"
    className={cn(
      'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
      'group-data-[panel-group-direction=vertical]/panel-group:h-px group-data-[panel-group-direction=vertical]/panel-group:w-full',
      'group-data-[panel-group-direction=vertical]/panel-group:after:left-0 group-data-[panel-group-direction=vertical]/panel-group:after:h-1 group-data-[panel-group-direction=vertical]/panel-group:after:w-full group-data-[panel-group-direction=vertical]/panel-group:after:translate-x-0 group-data-[panel-group-direction=vertical]/panel-group:after:-translate-y-1/2',
      'group-data-[panel-group-direction=vertical]/panel-group:[&>div]:rotate-90',
      className,
    )}
    data-slot="panel-resize-handle"
    {...props}>
    {withHandle && (
      <div
        className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border"
        data-slot="panel-handle">
        <GripVertical aria-hidden="true" className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.Separator>
))
ResizableHandle.displayName = 'ResizableHandle'

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const MotionResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Group> & { dir?: Direction }
>(({ className, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const content = useMotionPreset('scaleIn', { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        className={cn('h-full w-full', className)}>
        <ResizablePrimitive.Group
          className={cn('group/panel-group flex h-full w-full data-[panel-group-direction=vertical]:flex-col')}
          data-slot="panel-group"
          dir={direction}
          elementRef={ref}
          {...props}
        />
      </m.div>
    </LazyMotion>
  )
})
MotionResizablePanelGroup.displayName = 'MotionResizablePanelGroup'

export { MotionResizablePanelGroup, ResizableHandle, ResizablePanel, ResizablePanelGroup }
