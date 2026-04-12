'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, htmlFor, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: label is composed with form controls externally via htmlFor
    <label
      className={cn(
        'text-balance font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      data-slot="label"
      dir={direction}
      htmlFor={htmlFor}
      ref={ref}
      {...props}
    />
  )
})
Label.displayName = 'Label'

const MotionLabel = React.forwardRef<HTMLLabelElement, LabelProps & { index?: number }>(
  ({ index = 0, ...props }, ref) => {
    const options = React.useMemo(() => ({ transition: springBouncy, delay: index * 0.05 }), [index])
    const content = useMotionPreset(scaleIn, options)
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
          <Label ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionLabel.displayName = 'MotionLabel'

export { Label, MotionLabel }
