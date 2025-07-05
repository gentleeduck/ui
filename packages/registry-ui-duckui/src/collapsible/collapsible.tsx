'use client'

import React from 'react'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '../button'

const CollapsibleContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
  wrapperRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  contentId: string
} | null>(null)

export function useCollapsible() {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error('useCollapsible must be used within a Collapsible')
  }
  return context
}

function Collapsible({
  children,
  className,
  open,
  onOpenChange,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const contentId = React.useId()

  React.useEffect(() => {
    if (open) {
      triggerRef.current?.setAttribute('data-open', String(open))
      contentRef.current?.setAttribute('data-open', String(open))
      contentRef.current?.setAttribute('aria-expanded', String(open))
      onOpenChange?.(open)
    }

    function handleClick() {
      const open = triggerRef.current?.getAttribute('data-open') === 'true'
      triggerRef.current?.setAttribute('data-open', String(!open))
      contentRef.current?.setAttribute('data-open', String(!open))
      contentRef.current?.setAttribute('aria-expanded', String(!open))
      onOpenChange?.(open)
    }

    triggerRef.current?.addEventListener('click', handleClick)
    return () => triggerRef.current?.removeEventListener('click', handleClick)
  }, [open])

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange, wrapperRef, triggerRef, contentRef, contentId }}>
      <div duck-collapsible="" className={cn('flex flex-col gap-2', className)} ref={wrapperRef} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

function CollapsibleTrigger({ children, ...props }: React.ComponentPropsWithRef<typeof Button>) {
  const { open, onOpenChange, triggerRef, contentId } = useCollapsible()

  return (
    <Button
      ref={triggerRef}
      duck-collapsible-trigger=""
      variant="outline"
      size="icon"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={() => onOpenChange(!open)}
      {...props}>
      {children}
    </Button>
  )
}

function CollapsibleContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, contentRef, contentId } = useCollapsible()

  return (
    <div
      ref={contentRef}
      duck-collapsible-content=""
      id={contentId}
      role="region"
      aria-hidden={!open}
      className={cn('h-0 overflow-hidden transition-all duration-300 ease-in-out data-[open=true]:h-auto ', className)}
      {...props}>
      {open && children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
