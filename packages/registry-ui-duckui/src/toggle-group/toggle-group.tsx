'use client'

import { cn } from '@gentleduck/libs/cn'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import * as Toggle from '../toggle'
import { ToggleGroupInit } from './toggle-group.hooks'

export interface ToggleGroupContextProps extends VariantProps<typeof Toggle.toggleVariants> {
  type?: 'single' | 'multiple'
  selectedItemRef: React.RefObject<HTMLDivElement[]>
  itemsRef: React.RefObject<HTMLDivElement[]>
  wrapperRef: React.RefObject<HTMLUListElement | null>
}

const ToggleGroupContext = React.createContext<ToggleGroupContextProps | null>(null)

function ToggleGroup({
  className,
  variant = 'default',
  size,
  type,
  children,
  onValueChange,
  ref,
  ...props
}: Omit<React.HTMLProps<HTMLUListElement>, 'size'> &
  VariantProps<typeof Toggle.toggleVariants> & {
    type?: 'single' | 'multiple'
    onValueChange?: (value: string) => void
  }) {
  const { selectedItemRef, wrapperRef, itemsRef } = ToggleGroupInit(type, onValueChange)

  return (
    <ToggleGroupContext.Provider value={{ itemsRef, selectedItemRef, size, type, variant, wrapperRef }}>
      <ul
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-md [&>:first-child>input]:rounded-l-md [&>:last-child>input]:rounded-r-md',
          variant === 'outline' &&
            '[&>*:first-child>input]:border-r-0 [&>*:not(:first-child):not(:last-child)>input]:border-r-0',
          className,
        )}
        ref={wrapperRef}
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
}: React.ComponentPropsWithRef<typeof Toggle.Toggle>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <Toggle.Toggle
      className={cn('rounded-none', className)}
      ref={ref}
      size={context?.size || size}
      value={value}
      variant={context?.variant || variant}
      {...props}
      duck-toggle-group-item="">
      {children}
    </Toggle.Toggle>
  )
}

export { ToggleGroup, ToggleGroupItem }
