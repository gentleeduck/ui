'use client'

import * as React from 'react'

import { cn } from '@gentelduck/libs/cn'

export function useTabs() {
  const context = React.useContext(TabsContext)

  if (context === null) {
    throw new Error('useTabs must be used within a TabsList')
  }
  return context
}

export interface TabsContentProps {
  activeItem: string
  setActiveItem: React.Dispatch<React.SetStateAction<string>>
}

const TabsContext = React.createContext<TabsContentProps | null>(null)

export interface TabsProps extends React.HTMLProps<HTMLDivElement> {}

function Tabs(props: TabsProps) {
  return <div {...props} />
}

export interface TabsListProps extends React.HTMLProps<HTMLDivElement> {
  listValues: string[]
}
const TabsList = ({ className, listValues, ref, ...props }: TabsListProps) => {
  const [activeItem, setActiveItem] = React.useState<string>(
    listValues?.[0] ?? '',
  )

  const _css = React.useMemo(() => {
    return listValues?.map((item) => ({
      id: item,
      css: `[&>button[data-value="${item}"]]:bg-background [&>button[data-value="${item}"]]:text-foreground`,
    }))
  }, [listValues])

  return (
    <TabsContext.Provider value={{ activeItem, setActiveItem }}>
      <div
        ref={ref}
        data-active={setActiveItem}
        className={cn(
          'inline-flex gap-2 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
          _css.filter((item) => item.id === activeItem)?.[0]?.css,
          className,
        )}
        {...props}
      />
    </TabsContext.Provider>
  )
}

export interface TabsTriggerProps extends React.HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset'
  value: string
}
const TabsTrigger = ({
  className,
  onClick,
  value,
  ref,
  ...props
}: TabsTriggerProps) => {
  const { setActiveItem } = useTabs()
  return (
    <button
      ref={ref}
      data-value={value}
      onClick={(e) => {
        setActiveItem(value)
        console.log(value)
        onClick?.(e)
      }}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active="true"]:bg-background data-[active="true"]:text-foreground data-[active="true"]:shadow cursor-pointer',
        className,
      )}
      {...props}
    />
  )
}

export interface TabsContentProps extends React.HTMLProps<HTMLDivElement> {}
const TabsContent = ({ className, ref, ...props }: TabsContentProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        'list-none mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
