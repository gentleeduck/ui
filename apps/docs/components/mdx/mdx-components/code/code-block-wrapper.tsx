import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui-duckui/collapsible'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string
}

export function CodeBlockWrapper({ expandButtonTitle = 'View Code', className, children, ...props }: CodeBlockProps) {
  const [isOpened, setIsOpened] = React.useState(false)
  console.log(children)

  return (
    <div
      className={cn(
        'flex ',
        '[&_pre]:my-0 [&_pre]:max-h-[650px] [&_div:last-child_pre]:pb-[50px] transition-all',
        isOpened
          ? '[&_pre]:overflow-auto m-4 [&>div]:border'
          : '[&_pre]:overflow-hidden [&_[data-rehype-pretty-code-fragment]]:border-none',
      )}>
      {children}
    </div>
  )
}
