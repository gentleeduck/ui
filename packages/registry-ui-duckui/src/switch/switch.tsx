'use client'

import { cn } from '@gentleduck/libs/cn'
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
        'appearance-none h-4 w-8 py-2 px-[0.5px] flex items-center justify-start transition-all rounded-full border bg-border border-border checked:bg-black checked:border-border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:border-primary',
        'after:absolute relative after:bg-white after:rounded-full after:block checked:after:translate-x-[80%] after:size-4  after:duration-200 after:will-change-[width,transform] after:ease-(--duck-motion-ease) after:transition-all after:shadow',
        ' ',
        className,
      )}
      {...props}
      duck-switch=""
    />
  )
}

export { Switch }
