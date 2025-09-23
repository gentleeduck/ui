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
    checkedIndicator,
    indicator,
  })

  return (
    <>
      <input
        aria-checked={props.checked}
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
          AnimVariants({ pseudo: 'animate' }),

          className,
        )}
        onChange={(e) => {
          onChange?.(e)
          onCheckedChange?.(e.target.checked)
        }}
        ref={ref}
        role="switch"
        style={{ ...style, ...inputStyle }}
        type="checkbox"
        {...props}
        data-slot="switch"
      />
      <SvgIndicator className="sr-only" />
    </>
  )
}

export { Switch }
