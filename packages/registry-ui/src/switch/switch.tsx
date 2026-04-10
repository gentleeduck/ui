'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { checkerBounce, contentTransition } from '@gentleduck/motion/presets/content'
import { checkersStylePattern } from '@gentleduck/motion/variants'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
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
          '[&:not(:checked)]:after:origin-right [&:checked]:after:origin-left',
          'active:after:scale-x-125 active:after:scale-y-110',
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

const MotionSwitch = React.forwardRef<
  HTMLInputElement,
  Omit<React.HTMLProps<HTMLInputElement>, 'ref'> & {
    indicator?: React.ReactElement
    checkedIndicator?: React.ReactElement
    onCheckedChange?: (checked: boolean) => void
  }
>(({ onCheckedChange, onChange, ...props }, ref) => {
  const [bounce, setBounce] = React.useState(false)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        animate={bounce ? checkerBounce : {}}
        transition={contentTransition}
        onAnimationComplete={() => setBounce(false)}
        className="inline-flex">
        <Switch
          ref={ref}
          onChange={(e) => {
            setBounce(true)
            onChange?.(e)
          }}
          onCheckedChange={onCheckedChange}
          {...props}
        />
      </m.div>
    </LazyMotion>
  )
})
MotionSwitch.displayName = 'MotionSwitch'

export { MotionSwitch, Switch }
