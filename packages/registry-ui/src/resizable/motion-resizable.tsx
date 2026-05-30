'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import type { IDirection } from '@gentleduck/primitives/direction'
import { useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import React from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'
import { toDirection } from '../direction/direction.libs'

const MOTION_RESIZABLE_PANEL_GROUP_OPTIONS = { transition: springBouncy } as const

const MotionResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Group> & { dir?: IDirection.Kind }
>(({ className, dir, ...props }, ref) => {
  const direction = useDirection(toDirection(dir))
  const content = useMotionPreset(scaleIn, MOTION_RESIZABLE_PANEL_GROUP_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        className={cn('h-full w-full', className)}>
        <ResizablePrimitive.Group
          className={cn('flex h-full w-full')}
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

export { MotionResizablePanelGroup }
