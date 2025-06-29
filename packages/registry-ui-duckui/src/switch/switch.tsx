'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import * as React from 'react'

function Switch({ className, checked, ref, 'aria-label': ariaLabel, ...props }: React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? 'Toggle'}
      ref={ref}
      className={cn(
        checkersStylePattern(),
        AnimVariants({ overlay: 'nothing', pseudo: 'animate' }),
        'px-4.5 py-[9px] justify-end ',
        'checked:after:translate-x-full after:size-4',
        className,
      )}
      {...props}
      duck-switch=""
    />
  )
}

export { Switch }
