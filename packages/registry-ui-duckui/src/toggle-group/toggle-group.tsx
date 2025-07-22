'use client'

import { cn } from '@gentleduck/libs/cn'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { Toggle, toggleVariants } from '../toggle'
import { ToggleGroupInit } from './toggle-group.hooks'

export interface ToggleGroupContextProps extends VariantProps<typeof toggleVariants> {
  type?: 'single' | 'multiple'
  selectedItemRef: React.RefObject<HTMLDivElement[]>
  itemsRef: React.RefObject<HTMLDivElement[]>
  wrapperRef: React.RefObject<HTMLUListElement | null>
}

const ToggleGroupContext = React.createContext<ToggleGroupContextProps | null>(null)

function ToggleGroup({
  className,
  variant = 'outline',
  size,
  type,
  children,
  onValueChange,
  ref,
  ...props
}: React.HTMLProps<HTMLUListElement> &
  VariantProps<typeof toggleVariants> & {
    type?: 'single' | 'multiple'
    onValueChange?: (value: string) => void
  }) {
  const { selectedItemRef, wrapperRef, itemsRef } = ToggleGroupInit(type, onValueChange)

  return (
    <ToggleGroupContext.Provider value={{ variant, size, type, selectedItemRef, itemsRef, wrapperRef }}>
      <ul
        ref={wrapperRef}
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-md [&>:first-child>input]:rounded-l-md [&>:last-child>input]:rounded-r-md',
          variant === 'outline' &&
            '[&>*:first-child>input]:border-r-0 [&>*:not(:first-child):not(:last-child)>input]:border-r-0',
          className,
        )}
        {...props}
        data-type={type}
        duck-toggle-group="">
        {children}
      </ul>
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
}: React.ComponentPropsWithRef<typeof Toggle>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <Toggle
      ref={ref}
      value={value}
      variant={context?.variant || variant}
      size={context?.size || size}
      className={cn('rounded-none', className)}
      {...props}
      duck-toggle-group-item="">
      {children}
    </Toggle>
  )
}

export { ToggleGroup, ToggleGroupItem }
