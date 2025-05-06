'use client'

import * as React from 'react'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../packages/_oldstuff_refactor/ui/ShadcnUI'
import { cn } from '@gentleduck/libs/cn'

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string
}

export function CodeBlockWrapper({ expandButtonTitle = 'View Code', className, children, ...props }: CodeBlockProps) {
  const [isOpened, setIsOpened] = React.useState(false)
  return (
    <Collapsible open={isOpened} onOpenChange={setIsOpened}>
      <div className={cn('relative overflow-hidden', className)} {...props}>
        <CollapsibleContent forceMount className={cn('overflow-hidden', !isOpened && 'max-h-32')}>
          <div
            className={cn(
              '[&_pre]:my-0 [&_pre]:max-h-[650px] [&_div:last-child_pre]:pb-[50px]',
              isOpened ? '[&_pre]:overflow-auto] [&_pre]:mt-2' : '[&_pre]:overflow-hidden',
            )}>
            {children}
          </div>
        </CollapsibleContent>
        <div
          className={cn(
            'absolute flex items-center justify-center bg-gradient-to-b p-2 rounded-lg',
            isOpened
              ? 'inset-x-[1px] bottom-0 h-12 from-accent/10 to-accent-foreground/5 border-b border-b-solid'
              : 'from-accent/10 to-accent-foreground/5 inset-0',
          )}>
          <CollapsibleTrigger asChild>
            <Button variant="secondary" className="h-8 text-xs">
              {isOpened ? 'Collapse' : expandButtonTitle}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
    </Collapsible>
  )
}
