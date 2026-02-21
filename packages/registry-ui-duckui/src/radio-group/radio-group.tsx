'use client'

import { cn } from '@gentleduck/libs/cn'
import { checkersStylePattern } from '@gentleduck/motion/anim'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import * as React from 'react'
import { Label } from '../label'
import { RadioGroupContext, useHandleRadioClick } from './radio-group.hooks'

const Radio = React.forwardRef<
  HTMLInputElement,
  Omit<React.HTMLProps<HTMLInputElement>, 'ref'> & {
    indicator?: React.ReactElement
    checkedIndicator?: React.ReactElement
  }
>(({ className, indicator, checkedIndicator, style, ...props }, ref) => {
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
            type: 'radio',
          }),
          'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
          '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
          'rounded-full',
          className,
        )}
        data-slot="radio"
        duck-radio=""
        ref={ref}
        style={{ ...style, ...inputStyle }}
        type="radio"
        {...props}
      />
      <SvgIndicator className="sr-only" />
    </>
  )
})
Radio.displayName = 'Radio'

const RadioGroup = React.forwardRef<
  HTMLUListElement,
  Omit<React.HTMLProps<HTMLUListElement>, 'ref'> & {
    value?: string
    onValueChange?: (value: string) => void
    defaultValue?: string
  }
>(({ className, children, value, onValueChange, defaultValue, ...props }, ref) => {
  const { selectedItemRef, itemsRef, wrapperRef } = useHandleRadioClick(defaultValue, value, onValueChange)

  return (
    <RadioGroupContext.Provider
      value={{
        itemsRef,
        onValueChange: () => {},
        selectedItemRef,
        value: '',
        wrapperRef,
      }}>
      <ul
        className={cn('flex flex-col', className)}
        data-slot="radio-group"
        duck-radio-group=""
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ;(ref as React.RefObject<HTMLUListElement | null>).current = node
          }
          ;(wrapperRef as React.RefObject<HTMLUListElement | null>).current = node
        }}
        role="radiogroup"
        {...props}>
        {children}
      </ul>
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef<
  HTMLLIElement,
  Omit<Omit<React.HTMLProps<HTMLLIElement>, 'value'>, 'ref'> & { customIndicator?: React.ReactNode; value: string }
>(({ className, children, customIndicator, value, ...props }, ref) => {
  return (
    <li
      className={cn(
        'relative flex items-center gap-2 [&>#radio-indicator]:opacity-0 [&[aria-checked=true]>#radio-indicator]:opacity-100',
        className,
      )}
      data-slot="radio-item"
      duck-radio-item=""
      id={value}
      ref={ref}
      role="presentation"
      {...props}>
      {customIndicator && <span id="radio-indicator">{customIndicator}</span>}
      <Radio className={cn(customIndicator?.toString() && 'hidden')} id={value} />
      <Label className="font-normal text-base" data-slot="radio-label" duck-radio-label="" htmlFor={value}>
        {children}
      </Label>
    </li>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

export { Radio, RadioGroup, RadioGroupItem }
