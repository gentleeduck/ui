// @ts-noCheck
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

export interface TabsContextProps {
    activeItem: string
    setActiveItem: React.Dispatch<React.SetStateAction<string>>
}

const TabsContext = React.createContext<TabsContextProps | null>(null)

export interface TabsProps extends React.HTMLProps<HTMLDivElement> {
    listValues: string[]
}

function Tabs({ listValues, ...props }: TabsProps) {
    if (!listValues) throw Error('listValues is required')
    const [activeItem, setActiveItem] = React.useState<string>(
        listValues![0] ?? '',
    )
    return (
        <TabsContext.Provider value={{ activeItem, setActiveItem }}>
            <div {...props} />
        </TabsContext.Provider>
    )
}

export interface TabsListProps extends React.HTMLProps<HTMLUListElement> { }
const TabsList = ({ className, ref, ...props }: TabsListProps) => {
    return (
        <ul
            ref={ref}
            className={cn(
                'inline-flex gap-2 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
                className,
            )}
            {...props}
        />
    )
}

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
    ref,
    ...props
}: TabsTriggerProps) => {
    const { setActiveItem } = useTabs()
    return (
        <li
            ref={ref}
            data-value={value}
            className={cn(
                'relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 has-checked:bg-background has-checked:text-foreground has-checked:shadow',
                className,
            )}
            {...props}
        >
            <input
                id={value}
                type='radio'
                name='tab'
                value={value}
                className='appearance-none absolute inset-0'
                onChange={() => setActiveItem(value)}
                defaultChecked={defaultChecked}
            />
            <label htmlFor={value} children={children} />
        </li>
    )
}

export interface TabsContentProps extends React.HTMLProps<HTMLDivElement> {
    value: string
}
const TabsContent = ({ className, value, ref, ...props }: TabsContentProps) => {
    const { activeItem } = useTabs()
    const [shouldrender, setShouldRender] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (activeItem === value) {
            setShouldRender(true)
        }
    }, [activeItem])

    return shouldrender ? (
        <div
            ref={ref}
            data-value={value}
            className={cn(
                'list-none mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                activeItem === value ? 'block' : 'hidden',
                className,
            )}
            {...props}
        />
    ) : null
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
