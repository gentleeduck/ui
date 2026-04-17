'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import type { IDirection } from '@gentleduck/primitives/direction'
import { useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const MOTION_TABLE_OPTIONS = { transition: springBouncy } as const
const MOTION_TABLE_ROW_STAGGER = 0.05

const MotionTable = React.forwardRef<
  HTMLTableElement,
  Omit<React.HTMLAttributes<HTMLTableElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ className, dir, ...props }, ref) => {
  const direction = useDirection(dir as IDirection.Kind)
  const content = useMotionPreset(scaleIn, MOTION_TABLE_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        className="relative w-full overflow-auto"
        dir={direction}
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}>
        <table className={cn('w-full caption-bottom text-sm', className)} data-slot="table" ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionTable.displayName = 'MotionTable'

const MotionTableRow = React.forwardRef<
  HTMLTableRowElement,
  Omit<React.HTMLAttributes<HTMLTableRowElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & {
    index?: number
  }
>(({ className, index = 0, ...props }, ref) => {
  const motionOptions = React.useMemo(
    () => ({ transition: springBouncy, delay: index * MOTION_TABLE_ROW_STAGGER }),
    [index],
  )
  const content = useMotionPreset(scaleIn, motionOptions)
  return (
    <m.tr
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      data-slot="table-row"
      ref={ref}
      initial={content.initial}
      animate={content.animate}
      transition={content.transition}
      {...props}
    />
  )
})
MotionTableRow.displayName = 'MotionTableRow'

export { MotionTable, MotionTableRow }
