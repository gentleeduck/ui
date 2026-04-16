'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import type { Variants } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
import React from 'react'
import { Field, FieldError, FieldGroup } from './field'
import type { fieldVariants } from './field.constants'

const MotionField = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & Variants.VariantProps<typeof fieldVariants> & { index?: number }
>(({ index = 0, ...props }, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: index * 0.05 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <Field ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionField.displayName = 'MotionField'

const MotionFieldGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <FieldGroup ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionFieldGroup.displayName = 'MotionFieldGroup'

const MotionFieldError = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & { errors?: Array<{ message?: string } | undefined> }
>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: 0.05 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <FieldError ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionFieldError.displayName = 'MotionFieldError'

export { MotionField, MotionFieldError, MotionFieldGroup }
