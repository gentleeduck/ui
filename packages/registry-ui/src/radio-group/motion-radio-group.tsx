'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { checkerBounce, contentTransition } from '@gentleduck/motion/presets/content'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import * as RadioGroupPrimitive from '@gentleduck/primitives/radio-group'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { RadioGroup } from './radio-group'

const MotionRadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    indicator?: React.ReactElement
    checkedIndicator?: React.ReactElement
    textValue?: string
    index?: number
  }
>(({ className, indicator, checkedIndicator, children, textValue, index = 0, onClick, ...props }, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: index * 0.05 })
  const [bounce, setBounce] = React.useState(false)
  const { indicatorReady, checkedIndicatorReady, inputStyle, SvgIndicator } = useSvgIndicator({
    checkedIndicator,
    indicator,
  })
  const itemId = React.useId()
  const resolvedTextValue =
    textValue ?? (typeof children === 'string' || typeof children === 'number' ? String(children) : undefined)

  const indicatorStateClass =
    indicatorReady && checkedIndicatorReady
      ? 'after:mask-[var(--svg-off)] data-[state=checked]:after:mask-[var(--svg-on)]'
      : indicatorReady
        ? 'after:mask-[var(--svg-off)]'
        : checkedIndicatorReady
          ? 'data-[state=checked]:after:mask-[var(--svg-on)]'
          : ''

  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        className="flex items-center gap-2">
        <m.div
          animate={bounce ? checkerBounce : {}}
          transition={contentTransition}
          onAnimationComplete={() => setBounce(false)}
          className="inline-flex">
          <RadioGroupPrimitive.Item
            id={itemId}
            className={cn(
              'relative m-0 flex size-[1em] appearance-none items-center rounded-full p-2',
              'border border-border bg-border text-primary-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary',
              'ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'data-disabled:cursor-not-allowed data-disabled:opacity-50',
              'after:mask-type-alpha after:mask-contain after:absolute after:block after:size-[1em] after:rounded-[inherit] after:bg-current after:drop-shadow',
              'after:opacity-0 data-[state=checked]:after:opacity-100',
              'justify-center after:text-[10px]',
              'after:scale-0 data-[state=checked]:after:scale-100',
              indicatorStateClass,
              'transition-all transition-discrete duration-[200ms,150ms] ease-(--gentleduck-motion-ease)',
              '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
              'rounded-full',
              className,
            )}
            data-slot="radio-group-item"
            ref={ref}
            style={inputStyle}
            data-text-value={resolvedTextValue}
            onClick={(e) => {
              setBounce(true)
              onClick?.(e)
            }}
            {...props}
          />
        </m.div>
        <SvgIndicator className="sr-only" />
        {children && (
          <label className="cursor-pointer font-normal text-base" data-slot="radio-label" htmlFor={itemId}>
            {children}
          </label>
        )}
      </m.div>
    </LazyMotion>
  )
})
MotionRadioGroupItem.displayName = 'MotionRadioGroupItem'

const MotionRadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ children, ...props }, ref) => (
  <RadioGroup ref={ref} {...props}>
    {React.Children.map(children, (child, i) => {
      if (React.isValidElement(child) && child.type === MotionRadioGroupItem) {
        return React.cloneElement(child as React.ReactElement<{ index?: number }>, { index: i })
      }
      return child
    })}
  </RadioGroup>
))
MotionRadioGroup.displayName = 'MotionRadioGroup'

export { MotionRadioGroup, MotionRadioGroupItem }
