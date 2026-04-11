'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import * as InputOTPPrimitive from '@gentleduck/primitives/input-otp'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { Dot } from 'lucide-react'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const InputOTP = React.forwardRef<
  React.ComponentRef<typeof InputOTPPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Root>
>(({ className, ...props }, ref) => (
  <InputOTPPrimitive.Root
    ref={ref}
    className={cn('flex items-center gap-2 disabled:cursor-not-allowed has-disabled:opacity-50', className)}
    data-slot="input-otp"
    {...props}
  />
))
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = React.forwardRef<
  React.ComponentRef<typeof InputOTPPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Group>
>(({ className, ...props }, ref) => (
  <InputOTPPrimitive.Group
    ref={ref}
    className={cn('flex items-center', className)}
    data-slot="input-otp-group"
    {...props}
  />
))
InputOTPGroup.displayName = 'InputOTPGroup'

const InputOTPSlot = React.forwardRef<
  React.ComponentRef<typeof InputOTPPrimitive.Slot>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Slot>
>(({ className, ...props }, ref) => (
  <InputOTPPrimitive.Slot
    ref={ref}
    className={cn(
      'relative -ms-px h-10 w-10 rounded-none border border-input border-y border-e text-center text-sm transition-all first:ms-0 first:rounded-s-md last:rounded-e-md focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring',
      className,
    )}
    data-slot="input-otp-slot"
    {...props}
  />
))
InputOTPSlot.displayName = 'InputOTPSlot'

const InputOTPSeparator = React.forwardRef<
  React.ComponentRef<typeof InputOTPPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Separator>
>(({ customIndicator, ...props }, ref) => (
  <InputOTPPrimitive.Separator
    ref={ref}
    customIndicator={customIndicator ?? <Dot />}
    data-slot="input-otp-separator"
    {...props}
  />
))
InputOTPSeparator.displayName = 'InputOTPSeparator'

const REGEXP_ONLY_DIGITS_AND_CHARS = InputOTPPrimitive.REGEXP_ONLY_DIGITS_AND_CHARS
const REGEXP_ONLY_DIGITS = InputOTPPrimitive.REGEXP_ONLY_DIGITS

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const MotionInputOTP = React.forwardRef<
  React.ComponentRef<typeof InputOTPPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Root>
>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <InputOTP ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionInputOTP.displayName = 'MotionInputOTP'

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  MotionInputOTP,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
}
