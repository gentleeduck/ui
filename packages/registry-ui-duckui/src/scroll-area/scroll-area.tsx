'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'

const ScrollArea = ({ className, children, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div
    className={cn(
      'overflow-auto scrollbar-none hover:[scrollbar-gutter:stable] hover:[&::-webkit-scrollbar]:w-[5px] hover:[&::-webkit-scrollbar]:h-[5px] hover:[&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:rounded-[5px] hover:[&::-webkit-scrollbar-thumb]:bg-(--border)',
      className,
    )}
    {...props}>
    {children}
  </div>
)

export { ScrollArea }
