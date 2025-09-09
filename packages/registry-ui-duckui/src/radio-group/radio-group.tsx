'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import * as React from 'react'
import { Label } from '../label'
import { useHandleRadioClick } from './radio-group.hooks'

export interface RadioGroupContextType {
  value: string
  onValueChange: (value: string) => void
  wrapperRef: React.RefObject<HTMLUListElement | null>
  itemsRef: React.RefObject<HTMLLIElement[]>
  selectedItemRef: React.RefObject<HTMLLIElement | null>
}

export const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null)

function Radio({
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
        type="radio"
        ref={ref}
        duck-radio=""
        style={{ ...style, ...inputStyle }}
        className={cn(
          checkersStylePattern({
            type: 'radio',
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
          'rounded-full',
          className,
        )}
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
        value: '',
        onValueChange: () => {},
        wrapperRef,
        itemsRef,
        selectedItemRef,
      }}>
      <ul duck-radio-group="" className={cn('flex flex-col', className)} ref={wrapperRef} role="radiogroup" {...props}>
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
      id={value}
      duck-radio-item=""
      role="presentation"
      className={cn(
        'relative flex items-center gap-2 [&>#radio-indicator]:opacity-0 [&[aria-checked=true]>#radio-indicator]:opacity-100',
        className,
      )}
      {...props}>
      {customIndicator && <span id="radio-indicator">{customIndicator}</span>}
      <Radio id={value} className={cn(customIndicator?.toString() && 'hidden')} />
      <Label duck-radio-label="" className="font-normal text-base" htmlFor={value}>
        {children}
      </Label>
    </li>
  )
}

export { Radio, RadioGroup, RadioGroupItem }
