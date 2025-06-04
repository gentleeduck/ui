'use client'

import * as React from 'react'

import { toggleVariants } from './toggle.constants'
import { VariantProps } from '@gentleduck/variants'
import { cn } from '@gentleduck/libs/cn'
import { Slot } from '@gentleduck/aria-feather/slot'

interface ToggleProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof toggleVariants>, 'size'> {}

const Toggle = ({ className, variant, ref, children, ...props }: ToggleProps) => (
  <label className="relative flex items-center justify-center" duck-toggle="">
    <input type="checkbox" ref={ref} className={cn(toggleVariants({ variant, className }))} {...props} />
    <Slot className="z-1 isolate">{children}</Slot>
  </label>
)

export { Toggle }
