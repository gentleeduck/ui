'use client'

import { cn } from '@gentleduck/libs/cn'
import * as ToggleGroupPrimitive from '@gentleduck/primitives/toggle-group'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { toggleVariants } from '../toggle/toggle.constants'

interface ToggleGroupContextProps extends VariantProps<typeof toggleVariants> {}

const ToggleGroupContext = React.createContext<ToggleGroupContextProps>({
  size: 'default',
  variant: 'default',
})

const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
  return (
    <ToggleGroupContext.Provider value={{ size, variant }}>
      <ToggleGroupPrimitive.Root
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-md [&>:first-child]:rounded-s-md [&>:last-child]:rounded-e-md',
          variant === 'outline' && '[&>*:first-child]:border-e-0 [&>*:not(:first-child):not(:last-child)]:border-e-0',
          className,
        )}
        ref={ref}
        data-slot="toggle-group"
        {...props}>
        {children}
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  )
})
ToggleGroup.displayName = 'ToggleGroup'

const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({ variant: variant || context.variant, size: size || context.size }),
        'rounded-none',
        className,
      )}
      ref={ref}
      data-slot="toggle-group-item"
      {...props}>
      {children}
    </ToggleGroupPrimitive.Item>
  )
})
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }
