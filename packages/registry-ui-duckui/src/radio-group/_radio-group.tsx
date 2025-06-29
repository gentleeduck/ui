'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import * as React from 'react'
import { Label } from '../label'
import { useHandleRadioClick } from './radio-group.hooks'
import { RadioGroupContextType } from './radio-group.types'

export const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null)

function Radio({ className, ref, ...props }: React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      type="radio"
      ref={ref}
      duck-radio=""
      role="radio"
      aria-checked={props.checked}
      className={cn(
        checkersStylePattern(),
        AnimVariants({ overlay: 'nothing', pseudo: 'animate' }),
        'justify-center p-2',
        'after:scale-0 checked:after:scale-100 after:size-2 ',
        className,
      )}
      {...props}
    />
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
      <Label duck-radio-label="" className="font-normal text-sm" htmlFor={value}>
        {children}
      </Label>
    </li>
  )
}

export { Radio, RadioGroup, RadioGroupItem }
