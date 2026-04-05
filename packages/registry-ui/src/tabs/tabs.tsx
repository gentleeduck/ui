'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { tweenFast } from '@gentleduck/motion/transitions/tweens'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { MountMinimal } from '@gentleduck/primitives/mount'
import { AnimatePresence, LayoutGroup, LazyMotion, m } from 'motion/react'
import * as React from 'react'

export function useTabs() {
  const context = React.useContext(TabsContext)
  if (context === null) {
    throw new Error('useTabs must be used within a TabsList')
  }
  return context
}

export interface TabsContextProps {
  activeItem: string
  setActiveItem: React.Dispatch<React.SetStateAction<string>>
  tabsId: string
}

const TabsContext = React.createContext<TabsContextProps | null>(null)

export interface TabsProps extends Omit<React.HTMLProps<HTMLDivElement>, 'defaultValue' | 'ref'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, defaultValue, onValueChange, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    const [activeItem, setActiveItem] = React.useState<string>(defaultValue ?? value ?? '')
    const tabsId = React.useId()

    React.useEffect(() => {
      if (onValueChange) onValueChange(activeItem)
    }, [activeItem, onValueChange])

    return (
      <TabsContext.Provider value={{ activeItem, setActiveItem, tabsId }}>
        <div {...props} data-slot="tabs" dir={direction} ref={ref} />
      </TabsContext.Provider>
    )
  },
)
Tabs.displayName = 'Tabs'

export interface TabsListProps extends Omit<React.HTMLProps<HTMLDivElement>, 'ref' | 'role'> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
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
))
TabsList.displayName = 'TabsList'

export interface TabsTriggerProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'ref' | 'value'> {
  value: string
  defaultChecked?: boolean
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, defaultChecked, onClick, value, disabled, ...props }, ref) => {
    const { setActiveItem, activeItem, tabsId } = useTabs()
    const isActive = value === activeItem

    React.useEffect(() => {
      if (defaultChecked) setActiveItem(value)
    }, [defaultChecked, setActiveItem, value])

    return (
      <button
        aria-controls={`${tabsId}-content-${value}`}
        aria-selected={isActive}
        className={cn(
          'relative inline-flex h-[29.04px] items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isActive && 'bg-background text-foreground shadow-sm',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        data-value={value}
        disabled={disabled}
        id={`${tabsId}-trigger-${value}`}
        onClick={(e) => {
          setActiveItem(value)
          onClick?.(e as React.MouseEvent<HTMLButtonElement>)
        }}
        ref={ref}
        role="tab"
        tabIndex={isActive ? 0 : -1}
        {...props}
        type="button"
        data-slot="tabs-trigger">
        {children}
      </button>
    )
  },
)
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'ref'> & {
    value: string
    forceMount?: boolean
  }
>(({ children, forceMount = false, className, value, ...props }, ref) => {
  const { activeItem, tabsId } = useTabs()
  const localRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      aria-hidden={activeItem !== value}
      aria-labelledby={`${tabsId}-trigger-${value}`}
      className={cn(
        'mt-2 shrink-0 list-none ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        activeItem === value ? 'h-auto opacity-100' : 'h-0 opacity-0',
        className,
      )}
      data-value={value}
      hidden={activeItem !== value}
      id={`${tabsId}-content-${value}`}
      ref={(node) => {
        ;(localRef as React.RefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      role="tabpanel"
      tabIndex={-1}
      {...props}
      data-slot="tabs-content">
      <MountMinimal forceMount={forceMount} open={activeItem === value} ref={null}>
        {children}
      </MountMinimal>
    </div>
  )
})
TabsContent.displayName = 'TabsContent'

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const MotionTabsContext = React.createContext<{ direction: number }>({ direction: 1 })

const MotionTabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, defaultValue, onValueChange, dir, children, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    const [activeItem, setActiveItem] = React.useState<string>(defaultValue ?? value ?? '')
    const tabsId = React.useId()
    const prevIndexRef = React.useRef(0)
    const [motionDir, setMotionDir] = React.useState(1)
    const triggerOrderRef = React.useRef<string[]>([])

    const wrappedSetActiveItem: React.Dispatch<React.SetStateAction<string>> = React.useCallback((val) => {
      setActiveItem((prev) => {
        const next = typeof val === 'function' ? val(prev) : val
        const prevIdx = triggerOrderRef.current.indexOf(prev)
        const nextIdx = triggerOrderRef.current.indexOf(next)
        if (prevIdx !== -1 && nextIdx !== -1) {
          setMotionDir(nextIdx > prevIdx ? 1 : -1)
        }
        prevIndexRef.current = nextIdx
        return next
      })
    }, [])

    React.useEffect(() => {
      if (onValueChange) onValueChange(activeItem)
    }, [activeItem, onValueChange])

    return (
      <TabsContext.Provider value={{ activeItem, setActiveItem: wrappedSetActiveItem, tabsId }}>
        <MotionTabsContext.Provider value={{ direction: motionDir }}>
          <LazyMotion features={loadDomAnimation}>
            <div {...props} data-slot="tabs" dir={direction} ref={ref}>
              <MotionTabsOrderCollector orderRef={triggerOrderRef}>{children}</MotionTabsOrderCollector>
            </div>
          </LazyMotion>
        </MotionTabsContext.Provider>
      </TabsContext.Provider>
    )
  },
)
MotionTabs.displayName = 'MotionTabs'

function MotionTabsOrderCollector({
  children,
  orderRef,
}: {
  children: React.ReactNode
  orderRef: React.RefObject<string[]>
}) {
  const collected = React.useRef(false)
  React.useEffect(() => {
    if (!collected.current) {
      collected.current = true
    }
  }, [])

  // Collect trigger values from children on first render
  if (!collected.current) {
    const order: string[] = []
    const collectValues = (nodes: React.ReactNode) => {
      React.Children.forEach(nodes, (child) => {
        if (!React.isValidElement(child)) return
        if (child.props && 'value' in child.props && child.props.role === undefined) {
          // This is likely a TabsTrigger or MotionTabsTrigger
          order.push(child.props.value as string)
        }
        if (child.props?.children) {
          collectValues(child.props.children)
        }
      })
    }
    collectValues(children)
    if (order.length > 0) {
      orderRef.current = order
    }
  }

  return <>{children}</>
}

const MotionTabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => {
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

const MotionTabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, defaultChecked, onClick, value, disabled, ...props }, ref) => {
    const { setActiveItem, activeItem, tabsId } = useTabs()
    const isActive = value === activeItem

    React.useEffect(() => {
      if (defaultChecked) setActiveItem(value)
    }, [defaultChecked, setActiveItem, value])

    return (
      <button
        aria-controls={`${tabsId}-content-${value}`}
        aria-selected={isActive}
        className={cn(
          'relative inline-flex h-[29.04px] items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isActive && 'text-foreground',
          !isActive && 'text-muted-foreground',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        data-value={value}
        disabled={disabled}
        id={`${tabsId}-trigger-${value}`}
        onClick={(e) => {
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
            className="absolute inset-0 rounded-sm bg-background shadow-sm"
            style={{ borderRadius: 6 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        <m.span
          className="relative z-10"
          animate={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}
          transition={tweenFast}>
          {children}
        </m.span>
      </button>
    )
  },
)
MotionTabsTrigger.displayName = 'MotionTabsTrigger'

const MotionTabsContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'ref'> & { value: string }
>(({ children, className, value, ...props }, ref) => {
  const { activeItem, tabsId } = useTabs()
  const { direction } = React.useContext(MotionTabsContext)
  const isActive = activeItem === value

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      {isActive && (
        <m.div
          key={value}
          initial={{ opacity: 0, x: direction * 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: direction * -20, filter: 'blur(4px)' }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          aria-labelledby={`${tabsId}-trigger-${value}`}
          className={cn(
            'mt-2 shrink-0 list-none ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className,
          )}
          data-value={value}
          id={`${tabsId}-content-${value}`}
          ref={ref}
          role="tabpanel"
          tabIndex={-1}
          {...props}
          data-slot="tabs-content">
          {children}
        </m.div>
      )}
    </AnimatePresence>
  )
})
MotionTabsContent.displayName = 'MotionTabsContent'

export { MotionTabs, MotionTabsContent, MotionTabsList, MotionTabsTrigger, Tabs, TabsContent, TabsList, TabsTrigger }
