'use client'

import { useSvgIndicator } from '@gentleduck/aria-feather/checkers'
import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import * as React from 'react'

function Switch({
  className,
  indicator,
  checkedIndicator,
  ref,
  style,
  ...props
}: React.HTMLProps<HTMLInputElement> & { indicator?: React.ReactElement; checkedIndicator?: React.ReactElement }) {
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
          AnimVariants({ overlay: 'nothing', pseudo: 'animate' }),

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
