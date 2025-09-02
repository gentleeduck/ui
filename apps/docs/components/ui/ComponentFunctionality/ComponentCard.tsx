import { cn } from '@gentleduck/libs/cn'
import { AspectRatio } from '@gentleduck/registry-ui-duckui/aspect-ratio'
import React from 'react'

export function ComponentCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <AspectRatio
      ratio={'1/1'}
      className={cn('flex items-center justify-center rounded-md border p-8', className)}
      {...props}
    />
  )
}
