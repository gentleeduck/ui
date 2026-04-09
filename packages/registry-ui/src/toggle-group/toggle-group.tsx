'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { tapScale } from '@gentleduck/motion/presets/content'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import * as ToggleGroupPrimitive from '@gentleduck/primitives/toggle-group'
import type { VariantProps } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
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

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const MotionToggleGroup: React.ForwardRefExoticComponent<
  ToggleGroupProps & React.RefAttributes<ToggleGroupElement>
> = React.forwardRef<ToggleGroupElement, ToggleGroupProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const content = useMotionPreset('scaleIn', { transition: springBouncy })
    return (
      <LazyMotion features={loadDomAnimation}>
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
            {React.Children.map(children, (child, i) => (
              <m.div
                key={i}
                initial={content.initial}
                animate={content.animate}
                transition={{ ...content.transition, delay: i * 0.05 }}
                className="inline-flex">
                {child}
              </m.div>
            ))}
          </ToggleGroupPrimitive.Root>
        </ToggleGroupContext.Provider>
      </LazyMotion>
    )
  },
)
MotionToggleGroup.displayName = 'MotionToggleGroup'

const MotionToggleGroupItem: React.ForwardRefExoticComponent<
  Omit<ToggleGroupItemProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> &
    React.RefAttributes<ToggleGroupItemElement>
> = React.forwardRef<
  ToggleGroupItemElement,
  Omit<ToggleGroupItemProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ className, variant, size, children, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item asChild ref={ref} {...props}>
      <m.button
        whileTap={tapScale}
        transition={{ scale: { duration: 0, type: 'tween' } }}
        className={cn(
          toggleVariants({ variant: variant || context.variant, size: size || context.size }),
          'relative rounded-none focus-visible:z-10 focus-visible:ring-offset-0',
          className,
        )}
        data-slot="toggle-group-item">
        {children}
      </m.button>
    </ToggleGroupPrimitive.Item>
  )
})
MotionToggleGroupItem.displayName = 'MotionToggleGroupItem'

export { MotionToggleGroup, MotionToggleGroupItem, ToggleGroup, ToggleGroupItem }
