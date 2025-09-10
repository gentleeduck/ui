'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import type * as React from 'react'

function Switch({
  className,
  indicator,
  checkedIndicator,
  onChange,
  onCheckedChange,
  ref,
  style,
  ...props
}: React.HTMLProps<HTMLInputElement> & {
  indicator?: React.ReactElement
  checkedIndicator?: React.ReactElement
  onCheckedChange?: (checked: boolean) => void
}) {
  const { indicatorReady, checkedIndicatorReady, inputStyle, SvgIndicator } = useSvgIndicator({
    indicator,
    checkedIndicator,
  })

  return (
    <>
      <input
        type="checkbox"
        role="switch"
        style={{ ...style, ...inputStyle }}
        ref={ref}
        onChange={(e) => {
          onChange?.(e)
          onCheckedChange?.(e.target.checked)
        }}
        className={cn(
          checkersStylePattern({
            type: 'switch',
            indicatorState:
              indicatorReady && checkedIndicatorReady
                ? 'both'
                : indicatorReady
                  ? 'indicatorReady'
                  : checkedIndicatorReady
                    ? 'checkedIndicatorReady'
                    : 'default',
          }),
          AnimVariants({ pseudo: 'animate' }),

          className,
        )}
        {...props}
        duck-switch=""
      />
      <SvgIndicator className="sr-only" />
    </>
  )
}

export { Switch }
