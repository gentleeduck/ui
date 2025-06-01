'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'

function Radio({ className, ref, ...props }: React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      type="radio"
      ref={ref}
      className={cn(
        'appearance-none h-4 w-4 transition-all rounded-full border border-border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:border-primary  border-solid flex items-center justify-center after:absolute relative after:bg-black after:rounded-full after:scale-0 checked:after:scale-100  after:block after:w-2.5 after:h-2.5  after:opacity-0 checked:after:opacity-100 after:relative after:transition-all ',
        className,
      )}
      {...props}
    />
  )
}

export { Radio, RadioGroup, RadioGroupItem }
