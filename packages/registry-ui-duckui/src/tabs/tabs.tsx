'use client'

import { cn } from '@gentleduck/libs/cn'
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

export interface TabsProps extends Omit<React.HTMLProps<HTMLDivElement>, 'defaultValue'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

function Tabs({ value, defaultValue, onValueChange, ...props }: TabsProps) {
  const [activeItem, setActiveItem] = React.useState<string>(defaultValue ?? value ?? '')

  React.useEffect(() => {
    if (onValueChange) onValueChange(activeItem)
  }, [activeItem])

  return (
    <TabsContext.Provider value={{ activeItem, setActiveItem }}>
      <div {...props} aria-orientation="vertical" data-slot="tabs" duck-tabs="" role="tablist" />
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLProps<HTMLUListElement> {}
const TabsList = ({ className, ref, ...props }: TabsListProps) => (
  <ul
    className={cn(
      'inline-flex w-fit items-center justify-center gap-2 rounded-md bg-muted p-1 text-muted-foreground',
      className,
    )}
    ref={ref}
    {...props}
    data-slot="tabs-list"
    duck-tabs-list=""
  />
)

export interface TabsTriggerProps extends React.HTMLProps<HTMLLIElement> {
  value: string
  defaultChecked?: boolean
}

const TabsTrigger = ({
  className,
  children,
  defaultChecked,
  onClick,
  value,
  disabled,
  ref,
  ...props
}: TabsTriggerProps) => {
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
      data-slot="tabs-trigger"
      duck-tabs-trigger="">
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
}

const TabsContent = ({
  children,
  forceMount = false,
  className,
  value,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  value: string
  forceMount?: boolean
}) => {
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
      duck-tabs-content=""
      hidden={activeItem !== value}
      ref={localRef}
      role="tabpanel"
      tabIndex={-1}
      {...props}
      data-slot="tabs-content">
      <MountMinimal forceMount={forceMount} open={activeItem === value} ref={null}>
        {children}
      </MountMinimal>
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
