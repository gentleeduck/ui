import { cn } from '@gentelduck/libs/cn'
import React from 'react'

export interface TabsListProps<TListData>
  extends Omit<React.HTMLProps<HTMLUListElement>, 'children'> {
  children: (data: TListData) => React.ReactNode
  listData: TListData
  orientation: 'vertical' | 'horizontal'
}
function TabsList<T>({
  children,
  className,
  listData,
  orientation = 'horizontal',
  ref,
  ...props
}: TabsListProps<T>) {
  return (
    <ul
      role='tablist'
      className={cn(
        'h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground grid w-full grid-cols-2',
        className,
      )}
      aria-orientation={orientation}
      data-orientation={orientation}
      {...props}
    >
      {children(listData)}
    </ul>
  )
}

export { TabsList }
