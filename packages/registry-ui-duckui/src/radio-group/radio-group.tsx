'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import type * as React from 'react'
import { Label } from '../label'
import { RadioGroupContext, useHandleRadioClick } from './radio-group.hooks'

function Radio({
  className,
  indicator,
  checkedIndicator,
  ref,
  style,
  ...props
}: React.HTMLProps<HTMLInputElement> & { indicator?: React.ReactElement; checkedIndicator?: React.ReactElement }) {
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
          AnimVariants({ pseudo: 'animate' }),
          'rounded-full',
          className,
        )}
        duck-radio=""
        ref={ref}
        style={{ ...style, ...inputStyle }}
        type="radio"
        {...props}
      />
      <SvgIndicator className="sr-only" />
    </>
  )
}

function RadioGroup({
  className,
  children,
  value,
  onValueChange,
  defaultValue,
  ...props
}: React.HTMLProps<HTMLUListElement> & {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}) {
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
      <ul className={cn('flex flex-col', className)} duck-radio-group="" ref={wrapperRef} {...props}>
        {children}
      </ul>
    </RadioGroupContext.Provider>
  )
}

function RadioGroupItem({
  className,
  children,
  customIndicator,
  value,
  ...props
}: Omit<React.HTMLProps<HTMLLIElement>, 'value'> & { customIndicator?: React.ReactNode; value: string }) {
  return (
    <li
      className={cn(
        'relative flex items-center gap-2 [&>#radio-indicator]:opacity-0 [&[aria-checked=true]>#radio-indicator]:opacity-100',
        className,
      )}
      duck-radio-item=""
      id={value}
      role="presentation"
      {...props}>
      {customIndicator && <span id="radio-indicator">{customIndicator}</span>}
      <Radio className={cn(customIndicator?.toString() && 'hidden')} id={value} />
      <Label className="font-normal text-base" duck-radio-label="" htmlFor={value}>
        {children}
      </Label>
    </li>
  )
}

export { Radio, RadioGroup, RadioGroupItem }
