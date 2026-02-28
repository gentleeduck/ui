'use client'

import { Icons } from '@duck-docs/components/icons'
import { cn } from '@gentleduck/libs/cn'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import * as React from 'react'
import { FigcaptionBlock } from './figcaption-block'

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  path?: string
}

function getChildLabel(child: React.ReactNode): string {
  return (
    String((child as any).props?.children?.[0]?.props?.__rawString__ ?? '')
      .split('\n')[0]
      ?.replace('//', '')
      .trim() || 'source'
  )
}

export function ComponentSource({ children, className, ...props }: ComponentSourceProps) {
  const items = React.Children.toArray(children)

  if (items.length === 0) {
    return (
      <div
        className="flex h-24 w-full items-center justify-center gap-2 rounded-md border border-border bg-muted/40 text-muted-foreground text-sm"
        role="status">
        <Icons.spinner aria-hidden="true" className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    )
  }

  // Single file -- render just the code block, no wrapper
  if (items.length === 1) {
    const value = getChildLabel(items[0])
    return (
      <div className="relative m-0 mt-2 shrink-0 list-none bg-muted/40 ring-offset-background focus-visible:shadow-none focus-visible:outline-none focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>div>div>button]:top-2 [&>div>div>button]:right-2 [&>div>div]:m-0 border [&>div]:my-0 rounded-lg [&>div]:bg-transparent [&>div]:border-none [&>div]:static">
        <FigcaptionBlock>{value}</FigcaptionBlock>
        {items[0]}
      </div>
    )
  }

  // Multiple files -- render with tabs
  const defaultValue = getChildLabel(items[0])

  return (
    <Tabs
      className={cn('rounded-md border border-border bg-muted/40', className)}
      {...props}
      defaultValue={defaultValue}>
      <TabsList className="w-[622px] justify-start overflow-x-auto bg-transparent px-2 py-2">
        {items.map((item, idx) => {
          const value = getChildLabel(item)
          return (
            <TabsTrigger className="aria-[selected='true']:bg-muted" key={idx} value={value}>
              {value}
            </TabsTrigger>
          )
        })}
      </TabsList>
      <Separator />
      {items.map((item, idx) => {
        const value = getChildLabel(item)
        return (
          <TabsContent
            className="relative m-0 bg-transparent focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 [&>div>div>button]:top-2 [&>div>div>button]:right-2 [&>div>div]:m-0"
            key={idx}
            value={value}>
            <FigcaptionBlock>{value}</FigcaptionBlock>
            {item}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
