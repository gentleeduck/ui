'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/registry/registry-ui-components'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/default/ui/'

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string
}

export function CodeBlockWrapper({ expandButtonTitle = 'View Code', className, children, ...props }: CodeBlockProps) {
  const [isOpened, setIsOpened] = React.useState(false)
  return (
    <Collapsible
      open={isOpened}
      onOpenChange={setIsOpened}
    >
      <div
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        <CollapsibleContent
          forceMount
          className={cn('overflow-hidden', !isOpened && 'max-h-32')}
        >
          <div
            className={cn(
              '[&_pre]:my-0 [&_pre]:max-h-[650px] [&_div:last-child_pre]:pb-[50px]',
              !isOpened ? '[&_pre]:overflow-hidden' : '[&_pre]:overflow-auto] [&_pre]:mt-2'
            )}
          >
            {children}
          </div>
        </CollapsibleContent>
        <div
          className={cn(
            'absolute flex items-center justify-center bg-gradient-to-b p-2 rounded-lg',
            isOpened
              ? 'inset-x-[1px] bottom-0 h-12 from-[#18181b] to-[#09090b] border-b border-b-solid'
              : 'from-zinc-100/10 to-zinc-950/90 inset-0'
          )}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="secondary"
              className="h-8 text-xs"
            >
              {isOpened ? 'Collapse' : expandButtonTitle}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
    </Collapsible>
  )
}
