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

const ToggleGroup = React.forwardRef<
  HTMLUListElement,
  Omit<Omit<React.HTMLProps<HTMLUListElement>, 'size'>, 'ref'> &
    VariantProps<typeof Toggle.toggleVariants> & {
      type?: 'single' | 'multiple'
      onValueChange?: (value: string) => void
      value?: string | string[]
      defaultValue?: string | string[]
    }
>(({ className, variant = 'default', size, type, children, onValueChange, value, defaultValue, ...props }, ref) => {
  const { selectedItemRef, wrapperRef, itemsRef } = ToggleGroupInit(type, onValueChange, value, defaultValue)

  return (
    <ToggleGroupContext.Provider value={{ itemsRef, selectedItemRef, size, type, variant, wrapperRef }}>
      <ul
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-md [&>:first-child]:rounded-s-md [&>:last-child]:rounded-e-md',
          variant === 'outline' && '[&>*:first-child]:border-e-0 [&>*:not(:first-child):not(:last-child)]:border-e-0',
          className,
        )}
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ;(ref as React.RefObject<HTMLUListElement | null>).current = node
          }
          ;(wrapperRef as React.RefObject<HTMLUListElement | null>).current = node
        }}
        {...props}
        data-slot="toggle-group"
        data-type={type}
        duck-toggle-group="">
        {children}
      </ul>
    </ToggleGroupContext.Provider>
  )
})
ToggleGroup.displayName = 'ToggleGroup'

const ToggleGroupItem = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<typeof Toggle.Toggle>, 'ref'>
>(({ className, children, variant, size, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <Toggle.Toggle
      className={cn('rounded-none', className)}
      ref={ref}
      size={context?.size || size}
      value={value}
      variant={context?.variant || variant}
      {...props}
      data-slot="toggle-group-item"
      duck-toggle-group-item="">
      {children}
    </Toggle.Toggle>
  )
})
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }
