'use client'

import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { CodeBlockWrapper } from './code-block-wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[]
  src: string
}

export function ComponentSource({ children, className, ...props }: ComponentSourceProps) {
  const defaultValue = String((children[0] as any).props.children?.[0]?.props?.__rawString__)
    .split('\n')?.[0]
    ?.replace('//', '') as string

  return (
    <Tabs className="bg-muted/40 rounded-md" defaultValue={defaultValue}>
      <TabsList className="justify-start w-fit bg-transparent py-2 px-2 overflow-x-auto ">
        {children.map((item) => {
          const value = String((item as any).props.children[0].props.__rawString__)
            .split('\n')[0]
            ?.replace('//', '') as string
          return (
            <TabsTrigger value={value} className="aria-[selected='true']:bg-muted">
              {value}
            </TabsTrigger>
          )
        })}
      </TabsList>
      <Separator />
      {children.map((item) => {
        const value = String((item as any).props.children[0].props.__rawString__)
          .split('\n')[0]
          ?.replace('//', '') as string
        return (
          <TabsContent
            className="bg-transparent [&>div>div>div]:m-0 m-0 [&_pre]:dark:bg-transparent [&_pre]:border-none focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0"
            value={value}>
            {item}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
