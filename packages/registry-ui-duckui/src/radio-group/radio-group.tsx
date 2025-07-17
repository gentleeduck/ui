'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'
import { Label } from '../label'
import { useHandleRadioClick } from './radio-group.hooks'
import type { RadioGroupContextType } from './radio-group.types'

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
        'relative flex h-4 w-4 appearance-none items-center justify-center rounded-full border border-border border-solid ring-offset-background transition-all after:absolute after:relative after:block after:h-2.5 after:w-2.5 after:scale-0 after:rounded-full after:bg-foreground after:opacity-0 after:transition-all checked:border-foreground checked:after:scale-100 checked:after:opacity-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ',
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
