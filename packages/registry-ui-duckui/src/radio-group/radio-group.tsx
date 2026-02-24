'use client'

import { cn } from '@gentleduck/libs/cn'
import { checkersStylePattern } from '@gentleduck/motion/anim'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import * as RadioGroupPrimitive from '@gentleduck/primitives/radio-group'
import * as React from 'react'

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('flex flex-col gap-2', className)}
      data-slot="radio-group"
      ref={ref}
      {...props}
    />
  )
})
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    indicator?: React.ReactElement
    checkedIndicator?: React.ReactElement
  }
>(({ className, indicator, checkedIndicator, children, ...props }, ref) => {
  const { indicatorReady, checkedIndicatorReady, inputStyle, SvgIndicator } = useSvgIndicator({
    checkedIndicator,
    indicator,
  })

  return (
    <div className="flex items-center gap-2">
      <RadioGroupPrimitive.Item
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
            type: 'radio',
          }),
          'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
          '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
          'rounded-full',
          className,
        )}
        data-slot="radio-group-item"
        ref={ref}
        style={inputStyle}
        {...props}
      />
      <SvgIndicator className="sr-only" />
      {children && (
        <label
          className="font-normal text-base"
          data-slot="radio-label"
          onClick={() => {
            // Forward click to the radio item
          }}>
          {children}
        </label>
      )}
    </div>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
