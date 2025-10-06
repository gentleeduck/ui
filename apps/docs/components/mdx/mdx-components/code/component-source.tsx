'use client'

import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import React from 'react'
import { FigcaptionBlock } from './figcaption-block'

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[]
  src: string
}

export function ComponentSource({ children, className, ...props }: ComponentSourceProps) {
  if (!children.length) {
    return children
  }

  const defaultValue = String((children[0] as any).props.children[0].props.__rawString__)
    .split('\n')[0]
    ?.replace('//', '') as string

  return (
    <Tabs className="bg-muted/40 rounded-md border border-border" defaultValue={defaultValue}>
      <TabsList className="justify-start w-[622px] bg-transparent py-2 px-2 overflow-x-auto ">
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
            className="bg-transparent [&>div>div]:m-0 m-0 focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0 relative"
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
