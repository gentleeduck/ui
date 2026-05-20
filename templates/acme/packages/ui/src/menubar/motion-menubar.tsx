'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { AnimVariants } from '@gentleduck/motion/variants'
import * as MenubarPrimitive from '@gentleduck/primitives/menubar'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const MotionMenubarContent = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = 'start', alignOffset = -4, sideOffset = 8, children, ...props }, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-48 origin-(--gentleduck-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in',
          AnimVariants(),
          className,
        )}
        {...props}>
        <LazyMotion features={loadDomAnimation}>
          <m.div className="p-1" initial={content.initial} animate={content.animate} transition={content.transition}>
            {children}
          </m.div>
        </LazyMotion>
      </MenubarPrimitive.Content>
    </MenubarPrimitive.Portal>
  )
})
MotionMenubarContent.displayName = 'MotionMenubarContent'

export { MotionMenubarContent }
