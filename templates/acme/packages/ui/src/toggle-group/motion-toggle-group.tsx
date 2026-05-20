'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomMax } from '@gentleduck/motion/motion-features'
import { tapScale } from '@gentleduck/motion/presets/content'
import { springSmooth } from '@gentleduck/motion/transitions/springs'
import * as ToggleGroupPrimitive from '@gentleduck/primitives/toggle-group'
import { LayoutGroup, LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { toggleVariants } from '../toggle/toggle.constants'
import type {
  IToggleGroupItemProps,
  IToggleGroupProps,
  ToggleGroupElement,
  ToggleGroupItemElement,
} from './toggle-group'
import { ToggleGroup, ToggleGroupContext } from './toggle-group'

const MotionToggleGroupIdContext = React.createContext<string>('')

const MotionToggleGroup: React.ForwardRefExoticComponent<IToggleGroupProps & React.RefAttributes<ToggleGroupElement>> =
  React.forwardRef<ToggleGroupElement, IToggleGroupProps>(({ children, ...props }, ref) => {
    const groupId = React.useId()
    return (
      <LazyMotion features={loadDomMax}>
        <MotionToggleGroupIdContext.Provider value={groupId}>
          <LayoutGroup id={`toggle-group-${groupId}`}>
            <ToggleGroup ref={ref} {...props}>
              {children}
            </ToggleGroup>
          </LayoutGroup>
        </MotionToggleGroupIdContext.Provider>
      </LazyMotion>
    )
  })
MotionToggleGroup.displayName = 'MotionToggleGroup'

const MotionToggleGroupItem: React.ForwardRefExoticComponent<
  Omit<IToggleGroupItemProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> &
    React.RefAttributes<ToggleGroupItemElement>
> = React.forwardRef<
  ToggleGroupItemElement,
  Omit<IToggleGroupItemProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
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

export { MotionToggleGroup, MotionToggleGroupItem }
