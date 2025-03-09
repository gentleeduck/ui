'use client'

import * as React from 'react'

import { Button } from '@duck/registry-ui-duckui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../../packages/_oldstuff_refactor/ui/ShadcnUI'
import { cn } from '@duck/libs/cn'

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string
}

export function CodeBlockWrapper({
  expandButtonTitle = 'View Code',
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <Collapsible
      open={isOpened}
      onOpenChange={setIsOpened}
      className="overflow-hidden"
    >
      <div
        className={cn('relative overflow-hidden rounded-md border', className)}
        {...props}
      >
        <CollapsibleContent
          forceMount
          className={cn(
            'overflow-hidden will-change-auto',
            !isOpened && 'max-h-32',
          )}
        >
          <div
            className={cn(
              '[&_pre]:my-0 [&_pre]:max-h-[650px] [&_div:last-child_pre]:pb-[50px] transition-all',
              !isOpened
                ? '[&_pre]:overflow-hidden [&_[data-rehype-pretty-code-fragment]]:border-none'
                : '[&_pre]:overflow-auto m-4 [&>div]:border',
            )}
          >
            {children}
          </div>
        </CollapsibleContent>
        <div
          className={cn(
            'absolute flex items-center justify-center bg-gradient-to-b p-2 rounded-md',
            isOpened
              ? 'inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-700/50 to-transparent'
              : 'inset-0 bg-gradient-to-t from-zinc-700/50 to-transparent',
          )}
        >
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
