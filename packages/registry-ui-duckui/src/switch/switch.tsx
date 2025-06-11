'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'

function Switch({ className, checked, ref, 'aria-label': ariaLabel, ...props }: React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? 'Toggle'}
      ref={ref}
      className={cn(
        'appearance-none h-6 w-10 transition-all rounded-full border bg-border border-border checked:bg-black checked:border-border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:border-primary border-solid flex items-center p-1 after:absolute relative after:bg-white after:rounded-full after:block checked:after:translate-x-3.5 checked:hover:active:after:translate-x-2.5 after:w-4 after:h-4 hover:active:after:w-5 after:duration-300 after:will-change-[width,transform] after:ease-[cubic-bezier(1,0.235,0,1.65)] after:transition-all after:shadow after:relative',
        className,
      )}
      {...props}
      duck-switch=""
    />
  )
}

export { Switch }
