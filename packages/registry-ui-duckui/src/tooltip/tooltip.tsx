'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimTooltipVariants } from '@gentleduck/motion/anim'
import type * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

function Tooltip({
  skipDelayDuration = 300,
  delayDuration = 300,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Popover>, 'mouseEnter' | 'mouseExist'>) {
  return (
    <Popover
      skipDelayDuration={skipDelayDuration}
      delayDuration={delayDuration}
      mouseEnter={true}
      mouseExist={true}
      {...props}
    />
  )
}

const TooltipTrigger = PopoverTrigger

function TooltipContent({
  className,
  children,
  side = 'top',
  ...props
}: React.ComponentPropsWithRef<typeof PopoverContent>): React.JSX.Element {
  return (
    <PopoverContent side={side as never} role="tooltip" className={cn(AnimTooltipVariants(), className)} {...props}>
      {children}
    </PopoverContent>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }

// 'use client'
//
// import TooltipPrimitive from '@gentleduck/aria-feather/tooltip'
// import { cn } from '@gentleduck/libs/cn'
// import { cva } from '@gentleduck/variants'
// import React from 'react'
//
// function Tooltip({
//   // skipDelayDuration = 300,
//   // delayDuration = 300,
//   ...props
// }: React.ComponentPropsWithRef<typeof TooltipPrimitive.Root>) {
//   return (
//     <TooltipPrimitive.Root
//       // skipDelayDuration={skipDelayDuration}
//       // delayDuration={delayDuration}
//       // mouseEnter={true}
//       // mouseExist={true}
//       {...props}
//     />
//   )
// }
//
// const TooltipTrigger = TooltipPrimitive.Trigger
//
// function TooltipContent({
//   className,
//   side = 'top',
//   ...props
// }: React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>): React.JSX.Element {
//   return (
//     <TooltipPrimitive.Content
//       side={side as never}
//       role="tooltip"
//       className={cn(AnimTooltipVariants({ side }), className, '')}
//       {...props}
//     />
//   )
// }
//
// export const AnimTooltipVariants = cva(
//   `select-none text-balance rounded-lg rounded-sm border border-border border-border bg-background bg-background px-3 py-1.5 text-accent-foreground shadow-none shadow-sm outline-hidden transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease) w-fit`,
//   {
//     variants: {
//       animation: {
//         default:
//           'data-[open=true]:pointer-events-all scale-90 opacity-0 data-[open=false]:pointer-events-none data-[open=true]:scale-100 starting:data-[open=true]:scale-90 data-[open=true]:opacity-100 starting:data-[open=true]:opacity-0',
//       },
//       side: {
//         top: 'translate-y-1',
//         bottom: '-translate-y-1',
//         left: 'translate-x-1',
//         right: '-translate-x-1',
//       },
//     },
//     defaultVariants: {
//       animation: 'default',
//       side: 'top',
//     },
//   },
// )
//
// export const AnimationVariants = cva(``, {
//   variants: {
//     animation: {},
//   },
//   defaultVariants: {},
// })
//
// // export const AnimDialogVariants = cva(`, {
// //   variants: {
// //     animation: {
// //       default:
// //         '',
// export { Tooltip, TooltipTrigger, TooltipContent }
