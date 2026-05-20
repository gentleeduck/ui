'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import * as CommandPrimitive from '@gentleduck/primitives/command'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { DialogDescription, DialogTitle, MotionDialog, MotionDialogContent } from '../dialog'
import { COMMAND_ITEM_CLASSNAME, Command } from './command'

function MotionCommandDialog({
  children,
  shouldFilter,
  contentClassName,
  ...props
}: React.ComponentPropsWithoutRef<typeof MotionDialog> & { shouldFilter?: boolean; contentClassName?: string }) {
  return (
    <MotionDialog {...props}>
      <MotionDialogContent
        className={cn('h-125 max-w-full p-0 transition-all duration-200 lg:w-175', contentClassName)}
        hideClose>
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">Search for commands and navigation items</DialogDescription>
        <Command className="max-w-full" shouldFilter={shouldFilter}>
          {children}
        </Command>
      </MotionDialogContent>
    </MotionDialog>
  )
}
MotionCommandDialog.displayName = 'MotionCommandDialog'

const MotionCommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  > & { index?: number }
>(({ className, index = 0, children, ...props }, ref) => {
  const options = React.useMemo(() => ({ transition: springBouncy, delay: index * 0.03 }), [index])
  const content = useMotionPreset(scaleIn, options)
  return (
    <LazyMotion features={loadDomAnimation}>
      <CommandPrimitive.Item asChild ref={ref} {...props}>
        <m.li
          className={cn(COMMAND_ITEM_CLASSNAME, className)}
          data-slot="command-item"
          initial={content.initial}
          animate={content.animate}
          transition={content.transition}>
          {children}
        </m.li>
      </CommandPrimitive.Item>
    </LazyMotion>
  )
})
MotionCommandItem.displayName = 'MotionCommandItem'

export { MotionCommandItem }
