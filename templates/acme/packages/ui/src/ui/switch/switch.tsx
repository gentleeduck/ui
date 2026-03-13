'use client'

import { cn } from '@gentleduck/libs/cn'
import { checkersStylePattern } from '@gentleduck/motion/anim'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'

const Switch = React.forwardRef<
  HTMLInputElement,
  Omit<React.HTMLProps<HTMLInputElement>, 'ref'> & {
    indicator?: React.ReactElement
    checkedIndicator?: React.ReactElement
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, indicator, checkedIndicator, onChange, onCheckedChange, dir, style, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const { indicatorReady, checkedIndicatorReady, inputStyle, SvgIndicator } = useSvgIndicator({
    checkedIndicator,
    indicator,
  })

  return (
    <>
      <input
        className={cn(
          checkersStylePattern({
            indicatorState:
              indicatorReady && checkedIndicatorReady
                ? 'both'
                : indicatorReady
                  ? 'indicatorReady'
                  : checkedIndicatorReady
                    ? 'checkedIndicatorReady'
                    : 'default',
            type: 'switch',
          }),
          'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
          '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
          '[&[dir=ltr]:checked]:after:translate-x-full [&[dir=ltr]]:after:translate-x-0',
          '[&[dir=rtl]:checked]:after:-translate-x-full [&[dir=rtl]]:after:translate-x-0',

          className,
        )}
        onChange={(e) => {
          onChange?.(e)
          onCheckedChange?.(e.target.checked)
        }}
        aria-checked={props.checked}
        ref={ref}
        role="switch"
        dir={direction}
        style={{ ...style, ...inputStyle }}
        type="checkbox"
        {...props}
        data-slot="switch"
      />
      <SvgIndicator className="sr-only" />
    </>
  )
})
Switch.displayName = 'Switch'

export { Switch }
