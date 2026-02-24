'use client'

import { cn } from '@gentleduck/libs/cn'
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
  const itemRef = React.useRef<HTMLButtonElement>(null)

  const indicatorStateClass =
    indicatorReady && checkedIndicatorReady
      ? 'after:mask-[var(--svg-off)] data-[state=checked]:after:mask-[var(--svg-on)]'
      : indicatorReady
        ? 'after:mask-[var(--svg-off)]'
        : checkedIndicatorReady
          ? 'data-[state=checked]:after:mask-[var(--svg-on)]'
          : ''

  return (
    <div className="flex items-center gap-2">
      <RadioGroupPrimitive.Item
        className={cn(
          // Base radio styles (uses data-[state=checked]: instead of checked: for button elements)
          'appearance-none relative p-2 size-[1em] flex items-center rounded-full m-0',
          'border bg-border border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary text-primary-foreground',
          'ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
          'after:absolute after:drop-shadow after:bg-current after:size-[1em] after:rounded-[inherit] after:block after:mask-type-alpha after:mask-contain',
          'after:opacity-0 data-[state=checked]:after:opacity-100',
          // Radio-specific indicator
          'justify-center after:text-[10px]',
          'after:scale-0 data-[state=checked]:after:scale-100',
          indicatorStateClass,
          // Animation
          'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
          '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
          'rounded-full',
          className,
        )}
        data-slot="radio-group-item"
        ref={(node) => {
          itemRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }}
        style={inputStyle}
        {...props}
      />
      <SvgIndicator className="sr-only" />
      {children && (
        <label
          className="font-normal text-base cursor-pointer"
          data-slot="radio-label"
          onClick={() => itemRef.current?.click()}>
          {children}
        </label>
      )}
    </div>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
