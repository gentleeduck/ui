'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'
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
      className={cn(
        'appearance-none h-4 w-4 transition-all rounded-full border border-border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:border-foreground border-solid flex items-center justify-center after:absolute relative after:bg-foreground after:rounded-full after:scale-0 checked:after:scale-100  after:block after:w-2.5 after:h-2.5 after:opacity-0 checked:after:opacity-100 after:relative after:transition-all ',
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
      <ul duck-radio-group="" className={cn('flex flex-col', className)} {...props} ref={wrapperRef}>
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
      className={cn(
        'flex items-center justify-between w-full [&>#radio-indicator]:scale-0 [&[aria-checked=true]>#radio-indicator]:scale-100 ',
        className,
      )}
      {...props}>
      {customIndicator && <span id="radio-indicator">{customIndicator}</span>}
      <Radio id={value} className={cn(customIndicator?.toString() && 'hidden')} />
      <Label duck-radio-label="" className="font-normal text-sm" htmlFor={value}>
        {children}
      </Label>
      {customIndicator && <span id="radio-indicator" className="transition-all duration-300 ease-(--duck-motion-ease)">{customIndicator}</span>}
      <Radio id={value} className={cn(customIndicator?.toString() && 'hidden')} />
    </li>
  )
}

export { Radio, RadioGroup, RadioGroupItem }
