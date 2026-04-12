'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomMax } from '@gentleduck/motion/motion-features'
import { tapScale } from '@gentleduck/motion/presets/content'
import { springSmooth } from '@gentleduck/motion/transitions/springs'
import * as ToggleGroupPrimitive from '@gentleduck/primitives/toggle-group'
import type { VariantProps } from '@gentleduck/variants'
import { LayoutGroup, LazyMotion, m } from 'motion/react'
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
      const contextValue = React.useMemo<ToggleGroupContextProps>(() => ({ size, variant }), [size, variant])
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

const MotionToggleGroupIdContext = React.createContext<string>('')

const MotionToggleGroup: React.ForwardRefExoticComponent<ToggleGroupProps & React.RefAttributes<ToggleGroupElement>> =
  React.forwardRef<ToggleGroupElement, ToggleGroupProps>(
    ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
      const groupId = React.useId()
      const contextValue = React.useMemo<ToggleGroupContextProps>(() => ({ size, variant }), [size, variant])
      return (
        <LazyMotion features={loadDomMax}>
          <MotionToggleGroupIdContext.Provider value={groupId}>
            <ToggleGroupContext.Provider value={contextValue}>
              <LayoutGroup id={`toggle-group-${groupId}`}>
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
              </LayoutGroup>
            </ToggleGroupContext.Provider>
          </MotionToggleGroupIdContext.Provider>
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
>(({ className, variant, size, children, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  const groupId = React.useContext(MotionToggleGroupIdContext)
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const [isOn, setIsOn] = React.useState(false)

  React.useEffect(() => {
    const el = btnRef.current
    if (!el) return
    const readState = () => setIsOn(el.getAttribute('data-state') === 'on')
    readState()
    const observer = new MutationObserver(readState)
    observer.observe(el, { attributes: true, attributeFilter: ['data-state'] })
    return () => observer.disconnect()
  }, [])

  return (
    <ToggleGroupPrimitive.Item asChild ref={ref} value={value} {...props}>
      <m.button
        ref={btnRef}
        whileTap={tapScale}
        className={cn(
          toggleVariants({ variant: variant || context.variant, size: size || context.size }),
          'relative rounded-none focus-visible:z-10 focus-visible:ring-offset-0 data-[state=on]:bg-transparent',
          className,
        )}
        data-slot="toggle-group-item">
        {isOn && (
          <m.span
            layoutId={`toggle-group-indicator-${groupId}`}
            className="absolute inset-0 rounded-[inherit] bg-accent"
            transition={springSmooth}
          />
        )}
        <span className="relative z-10 inline-flex items-center justify-center">{children}</span>
      </m.button>
    </ToggleGroupPrimitive.Item>
  )
})
MotionToggleGroupItem.displayName = 'MotionToggleGroupItem'

export { MotionToggleGroup, MotionToggleGroupItem, ToggleGroup, ToggleGroupItem }
