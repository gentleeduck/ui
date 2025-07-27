'use client'

import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { CodeBlockWrapper } from './code-block-wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[]
  src: string
}

export function ComponentSource({ children, className, ...props }: ComponentSourceProps) {
  // console.log(children)
  return (
    <Tabs defaultValue="hello">
      <TabsList className="">
        {children.map((item) => {
          // console.log(item.props.children[0].props)
          return (
            <TabsTrigger className="w-full" value={item}>
              index.tsx
            </TabsTrigger>
          )
        })}
      </TabsList>
      {children.map((item) => {
        console.log(item)
        return (
          <TabsContent className="bg-zinc-800" value={'hello'}>
            {item}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
