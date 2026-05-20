'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomMax } from '@gentleduck/motion/motion-features'
import { blurLight } from '@gentleduck/motion/transitions/blur'
import { springSmooth } from '@gentleduck/motion/transitions/springs'
import { shakeKeyframes, tweenExpand, tweenShake } from '@gentleduck/motion/transitions/tweens'
import type { IDirection } from '@gentleduck/primitives/direction'
import { useDirection } from '@gentleduck/primitives/direction'
import { AnimatePresence, LayoutGroup, LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { type ITabsListProps, type ITabsProps, type ITabsTriggerProps, TabsContext, useTabs } from './tabs'

const BLUR = `blur(${blurLight}px)`
const MOTION_TABS_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, x: `${dir * 8}%`, scale: 0.98, filter: BLUR }),
  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, x: `${dir * -8}%`, scale: 0.98, filter: BLUR }),
} as const

const MotionTabsContext = React.createContext<{
  direction: number
  registerTrigger: (value: string) => void
}>({
  direction: 1,
  registerTrigger: () => {},
})

const MotionTabs = React.forwardRef<HTMLDivElement, ITabsProps>(
  ({ value, defaultValue, onValueChange, dir, children, ...props }, ref) => {
    const resolvedDir = useDirection(dir as IDirection.Kind)
    const [activeItem, setActiveItem] = React.useState<string>(defaultValue ?? value ?? '')
    const tabsId = React.useId()
    const [motionDir, setMotionDir] = React.useState(1)
    const triggerOrderRef = React.useRef<string[]>([])

    const registeredRef = React.useRef(new Set<string>())
    const registerTrigger = React.useCallback((triggerValue: string) => {
      if (!registeredRef.current.has(triggerValue)) {
        registeredRef.current.add(triggerValue)
        triggerOrderRef.current.push(triggerValue)
      }
    }, [])

    const wrappedSetActiveItem: React.Dispatch<React.SetStateAction<string>> = React.useCallback((val) => {
      setActiveItem((prev) => {
        const next = typeof val === 'function' ? val(prev) : val
        const prevIdx = triggerOrderRef.current.indexOf(prev)
        const nextIdx = triggerOrderRef.current.indexOf(next)
        if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
          setMotionDir(nextIdx > prevIdx ? 1 : -1)
        }
        return next
      })
    }, [])

    React.useEffect(() => {
      if (onValueChange) onValueChange(activeItem)
    }, [activeItem, onValueChange])

    const tabsValue = React.useMemo(
      () => ({ activeItem, setActiveItem: wrappedSetActiveItem, tabsId }),
      [activeItem, wrappedSetActiveItem, tabsId],
    )
    const motionCtx = React.useMemo(() => ({ direction: motionDir, registerTrigger }), [motionDir, registerTrigger])

    return (
      <TabsContext.Provider value={tabsValue}>
        <MotionTabsContext.Provider value={motionCtx}>
          <LazyMotion features={loadDomMax}>
            <div {...props} data-slot="tabs" dir={resolvedDir} ref={ref}>
              {children}
            </div>
          </LazyMotion>
        </MotionTabsContext.Provider>
      </TabsContext.Provider>
    )
  },
)
MotionTabs.displayName = 'MotionTabs'

const MotionTabsList = React.forwardRef<HTMLDivElement, ITabsListProps>(({ className, ...props }, ref) => {
  const { tabsId } = useTabs()
  return (
    <LayoutGroup id={`tabs-${tabsId}`}>
      <div
        className={cn(
          'inline-flex w-fit items-center justify-center gap-2 rounded-md bg-muted p-1 text-muted-foreground',
          className,
        )}
        ref={ref}
        role="tablist"
        {...props}
        data-slot="tabs-list"
      />
    </LayoutGroup>
  )
})
MotionTabsList.displayName = 'MotionTabsList'

const MotionTabsTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<ITabsTriggerProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ className, children, defaultChecked, onClick, value, disabled, ...props }, ref) => {
  const { setActiveItem, activeItem, tabsId } = useTabs()
  const { registerTrigger } = React.useContext(MotionTabsContext)
  const isActive = value === activeItem
  const [shake, setShake] = React.useState(false)

  registerTrigger(value)

  React.useEffect(() => {
    if (defaultChecked) setActiveItem(value)
  }, [defaultChecked, setActiveItem, value])

  return (
    <m.button
      aria-controls={`${tabsId}-content-${value}`}
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      animate={shake ? { x: shakeKeyframes } : { x: 0 }}
      transition={shake ? tweenShake : undefined}
      onAnimationComplete={() => shake && setShake(false)}
      className={cn(
        'relative inline-flex h-[29.04px] items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 font-medium text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      data-value={value}
      id={`${tabsId}-trigger-${value}`}
      onClick={(e) => {
        if (disabled) {
          setShake(true)
          return
        }
        setActiveItem(value)
        onClick?.(e as React.MouseEvent<HTMLButtonElement>)
      }}
      ref={ref}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      {...props}
      type="button"
      data-slot="tabs-trigger">
      {isActive && (
        <m.span
          layoutId={`tab-indicator-${tabsId}`}
          className="absolute inset-0 rounded-[inherit] bg-background shadow-sm"
          transition={springSmooth}
        />
      )}
      <span className={cn('relative z-10', isActive ? 'text-foreground' : 'text-muted-foreground')}>{children}</span>
    </m.button>
  )
})
MotionTabsTrigger.displayName = 'MotionTabsTrigger'

const MotionTabsContents = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'ref' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ children, className, ...props }, ref) => {
  const { activeItem } = useTabs()
  const { direction } = React.useContext(MotionTabsContext)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number | undefined>(undefined)

  let activeChild: React.ReactNode = null
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<{ value: string }>(child) && child.props.value === activeItem) {
      activeChild = child
    }
  })

  return (
    <m.div
      ref={(node) => {
        ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      animate={{ height: height ?? 'auto' }}
      transition={tweenExpand}
      className={cn('relative mt-2 overflow-hidden', className)}
      {...props}
      data-slot="tabs-contents">
      <AnimatePresence
        mode="popLayout"
        initial={false}
        custom={direction}
        onExitComplete={React.useCallback(() => {
          if (containerRef.current) {
            setHeight(containerRef.current.scrollHeight)
          }
        }, [])}>
        {activeChild && React.isValidElement(activeChild) ? (
          <m.div
            key={activeItem}
            custom={direction}
            variants={MOTION_TABS_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springSmooth}
            onAnimationComplete={() => {
              if (containerRef.current) {
                setHeight(containerRef.current.scrollHeight)
              }
            }}>
            {activeChild}
          </m.div>
        ) : null}
      </AnimatePresence>
    </m.div>
  )
})
MotionTabsContents.displayName = 'MotionTabsContents'

const MotionTabsContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'ref'> & { value: string }
>(({ children, className, value, ...props }, ref) => {
  const { tabsId } = useTabs()

  return (
    <div
      ref={ref}
      aria-labelledby={`${tabsId}-trigger-${value}`}
      className={cn(
        'shrink-0 list-none ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      data-value={value}
      id={`${tabsId}-content-${value}`}
      role="tabpanel"
      tabIndex={-1}
      {...props}>
      {children}
    </div>
  )
})
MotionTabsContent.displayName = 'MotionTabsContent'

export { MotionTabs, MotionTabsContent, MotionTabsContents, MotionTabsList, MotionTabsTrigger }
