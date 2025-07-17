'use client'

import * as React from 'react'
import type { VariantProps } from '@gentleduck/variants'

import { cn } from '@gentleduck/libs/cn'
import { Toggle, toggleVariants } from '../toggle'
import { ToggleGroupInit } from './toggle-group.hooks'

export interface ToggleGroupContextProps extends VariantProps<typeof toggleVariants> {
  type?: 'single' | 'multiple'
  selectedItemRef: React.RefObject<HTMLDivElement[]>
  itemsRef: React.RefObject<HTMLDivElement[]>
  wrapperRef: React.RefObject<HTMLDivElement | null>
}

const ToggleGroupContext = React.createContext<ToggleGroupContextProps | null>(null)

function ToggleGroup({
  className,
  variant,
  size,
  type,
  children,
  onValueChange,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> &
  VariantProps<typeof toggleVariants> & {
    type?: 'single' | 'multiple'
    onValueChange?: (value: string) => void
  }) {
  const { selectedItemRef, wrapperRef, itemsRef } = ToggleGroupInit(type, onValueChange)

  return (
    <ToggleGroupContext.Provider value={{ variant, size, type, selectedItemRef, itemsRef, wrapperRef }}>
      <div
        ref={wrapperRef}
        className={cn(
          'flex items-center justify-center [&>:first-child>input]:rounded-l-md [&>:last-child>input]:rounded-r-md',
          className,
        )}
        {...props}
        data-type={type}
        duck-toggle-group="">
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof Toggle> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <Toggle
      ref={ref}
      value={value}
      className={cn(
        toggleVariants({
          variant: context?.variant || variant,
          size: context?.size || size,
        }),
        'rounded-none',
        className,
      )}
      {...props}
      duck-toggle-group-item="">
      {children}
    </Toggle>
  )
}

export { ToggleGroup, ToggleGroupItem }
