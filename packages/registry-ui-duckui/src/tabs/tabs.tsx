'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { MountMinimal } from '@gentleduck/primitives/mount'
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

    React.useEffect(() => {
      if (onValueChange) onValueChange(activeItem)
    }, [activeItem])

    return (
      <TabsContext.Provider value={{ activeItem, setActiveItem }}>
        <div {...props} aria-orientation="vertical" data-slot="tabs" dir={direction} ref={ref} role="tablist" />
      </TabsContext.Provider>
    )
  },
)
Tabs.displayName = 'Tabs'

export interface TabsListProps extends Omit<React.HTMLProps<HTMLUListElement>, 'ref'> {}

const TabsList = React.forwardRef<HTMLUListElement, TabsListProps>(({ className, ...props }, ref) => (
  <ul
    className={cn(
      'inline-flex w-fit items-center justify-center gap-2 rounded-md bg-muted p-1 text-muted-foreground',
      className,
    )}
    ref={ref}
    {...props}
    data-slot="tabs-list"
  />
))
TabsList.displayName = 'TabsList'

export interface TabsTriggerProps extends Omit<React.HTMLProps<HTMLLIElement>, 'ref'> {
  value: string
  defaultChecked?: boolean
}

const TabsTrigger = React.forwardRef<HTMLLIElement, TabsTriggerProps>(
  ({ className, children, defaultChecked, onClick, value, disabled, ...props }, ref) => {
    const { setActiveItem, activeItem } = useTabs()
    const isActive = value === activeItem

    React.useEffect(() => {
      if (defaultChecked) setActiveItem(value)
    }, [defaultChecked])

    return (
      <li
        aria-selected={isActive}
        className={cn(
          'relative inline-flex h-[29.04px] items-center justify-center whitespace-nowrap rounded-sm px-3 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isActive && 'bg-background text-foreground shadow-sm',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        data-value={value}
        id={`tab-${value}`}
        ref={ref}
        {...props}
        data-slot="tabs-trigger">
        <input
          checked={isActive}
          className="absolute inset-0 appearance-none rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          defaultChecked={defaultChecked}
          disabled={disabled}
          id={value}
          name="tab"
          onChange={() => setActiveItem(value)}
          type="radio"
          value={value}
        />
        <label className="flex items-center gap-2 font-medium" htmlFor={value}>
          {children}
        </label>
      </li>
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
  const { activeItem } = useTabs()
  const localRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      aria-hidden={activeItem !== value}
      className={cn(
        'mt-2 shrink-0 list-none ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        activeItem === value ? 'h-auto opacity-100' : 'h-0 opacity-0',
        className,
      )}
      data-value={value}
      hidden={activeItem !== value}
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

export { Tabs, TabsList, TabsTrigger, TabsContent }
