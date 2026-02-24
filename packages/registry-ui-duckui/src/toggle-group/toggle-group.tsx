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

type ToggleGroupElement = React.ComponentRef<typeof ToggleGroupPrimitive.Root>
type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>

const ToggleGroup: React.ForwardRefExoticComponent<ToggleGroupProps & React.RefAttributes<ToggleGroupElement>> =
  React.forwardRef<ToggleGroupElement, ToggleGroupProps>(
    ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
      return (
        <ToggleGroupContext.Provider value={{ size, variant }}>
          <ToggleGroupPrimitive.Root
            className={cn(
              'isolate flex items-center justify-center rounded-md *:first:rounded-s-md *:last:rounded-e-md',
              variant === 'outline' &&
                '[&>*:first-child]:border-e-0 [&>*:not(:first-child):not(:last-child)]:border-e-0',
              className,
            )}
            ref={ref}
            data-slot="toggle-group"
            {...props}>
            {children}
          </ToggleGroupPrimitive.Root>
        </ToggleGroupContext.Provider>
      )
    },
  )
ToggleGroup.displayName = 'ToggleGroup'

type ToggleGroupItemElement = React.ComponentRef<typeof ToggleGroupPrimitive.Item>
type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>
const ToggleGroupItem: React.ForwardRefExoticComponent<
  ToggleGroupItemProps & React.RefAttributes<ToggleGroupItemElement>
> = React.forwardRef<ToggleGroupItemElement, ToggleGroupItemProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)

    return (
      <ToggleGroupPrimitive.Item
        className={cn(
          toggleVariants({ variant: variant || context.variant, size: size || context.size }),
          'relative rounded-none focus-visible:z-10 focus-visible:ring-offset-0',
          className,
        )}
        ref={ref}
        data-slot="toggle-group-item"
        {...props}>
        {children}
      </ToggleGroupPrimitive.Item>
    )
  },
)
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }
