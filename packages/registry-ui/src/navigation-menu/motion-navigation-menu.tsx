'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import * as NavigationMenuPrimitive from '@gentleduck/primitives/navigation-menu'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { NavigationMenuViewport } from './navigation-menu'

const MotionNavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean
  }
>(({ className, children, viewport = true, ...props }, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <NavigationMenuPrimitive.Root
          ref={ref}
          className={cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', className)}
          data-slot="navigation-menu"
          data-viewport={viewport}
          {...props}>
          {children}
          {viewport && <NavigationMenuViewport />}
        </NavigationMenuPrimitive.Root>
      </m.div>
    </LazyMotion>
  )
})
MotionNavigationMenu.displayName = 'MotionNavigationMenu'

export { MotionNavigationMenu }
