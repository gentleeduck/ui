'use client'

import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@gentelduck/libs/cn'
import { toggleVariants } from './toggle.constants'
import { Slot } from '../../button'

interface ToggleProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'size'>,
  Omit<VariantProps<typeof toggleVariants>, 'size'> { }

const Toggle = ({ className, variant, ref, children, ...props }: ToggleProps) => (
  <label className='relative flex items-center justify-center'>
    <input
      type='checkbox'
      ref={ref}
      className={cn(toggleVariants({ variant, className }))}
      {...props}
    />
    <Slot className='z-1 isolate'>
      {children}
    </Slot>
  </label>
)

export { Toggle }