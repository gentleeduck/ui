'use client'

import { cn } from '@gentleduck/libs/cn'
import * as ToggleGroupPrimitive from '@gentleduck/primitives/toggle-group'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { toggleVariants } from '../toggle/toggle.constants'

interface IToggleGroupContextProps extends VariantProps<typeof toggleVariants> {}

const ToggleGroupContext = React.createContext<IToggleGroupContextProps>({
  size: 'default',
  variant: 'default',
})

type ToggleGroupElement = React.ComponentRef<typeof ToggleGroupPrimitive.Root>
type IToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>
type ToggleGroupProps = IToggleGroupProps

const ToggleGroup: React.ForwardRefExoticComponent<IToggleGroupProps & React.RefAttributes<ToggleGroupElement>> =
  React.forwardRef<ToggleGroupElement, IToggleGroupProps>(
    ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
      const contextValue = React.useMemo<IToggleGroupContextProps>(() => ({ size, variant }), [size, variant])
      return (
        <ToggleGroupContext.Provider value={contextValue}>
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
type IToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>
type ToggleGroupItemProps = IToggleGroupItemProps
const ToggleGroupItem: React.ForwardRefExoticComponent<
  IToggleGroupItemProps & React.RefAttributes<ToggleGroupItemElement>
> = React.forwardRef<ToggleGroupItemElement, IToggleGroupItemProps>(
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

export type {
  IToggleGroupContextProps,
  IToggleGroupItemProps,
  IToggleGroupProps,
  ToggleGroupElement,
  ToggleGroupItemElement,
  ToggleGroupItemProps,
  ToggleGroupProps,
}
export { ToggleGroup, ToggleGroupContext, ToggleGroupItem }
