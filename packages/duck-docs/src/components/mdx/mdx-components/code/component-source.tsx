'use client'

import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import type React from 'react'
import { FigcaptionBlock } from './figcaption-block'

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[]
  src: string
}

/** NOTE: the props are not used */
export function ComponentSource({ children, className, ...props }: ComponentSourceProps) {
  if (!children.length) {
    return children
  }

  const defaultValue = String((children[0] as any).props.children[0].props.__rawString__)
    .split('\n')[0]
    ?.replace('//', '') as string

  return (
    <Tabs className="rounded-md border border-border bg-muted/40" defaultValue={defaultValue}>
      <TabsList className="w-[622px] justify-start overflow-x-auto bg-transparent px-2 py-2">
        {children.map((item, idx) => {
          const value = String((item as any).props.children[0].props.__rawString__)
            .split('\n')[0]
            ?.replace('//', '') as string
          return (
            <TabsTrigger className="aria-[selected='true']:bg-muted" key={idx} value={value}>
              {value}
            </TabsTrigger>
          )
        })}
      </TabsList>
      <Separator />
      {children.map((item, idx) => {
        const value = String((item as any).props.children[0].props.__rawString__)
          .split('\n')[0]
          ?.replace('//', '') as string
        return (
          <TabsContent
            className="relative m-0 bg-transparent focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 [&>div>div>button]:top-1 [&>div>div>button]:right-1 [&>div>div]:m-0"
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
