'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'

export interface ScrollAreaProps extends React.HTMLProps<HTMLDivElement> { }

const ScrollArea = ({ className, children, ...props }: ScrollAreaProps) => (
  <div
    className={cn(
      'overflow-auto scrollbar-none hover:[scrollbar-width:thin] hover:[scrollbar-gutter:stable] hover:[&::-webkit-scrollbar]:w-[5px] hover:[&::-webkit-scrollbar]:h-[5px] hover:[&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:rounded-[5px] hover:[&::-webkit-scrollbar-thumb]:bg-[var(--border)]',
      className,
    )}
    {...props}
  >
    {children}
  </div>
)

export { ScrollArea }
