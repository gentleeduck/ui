'use client'

import { Mount } from '@gentleduck/aria-feather/mount'
import { cn } from '@gentleduck/libs/cn'
import React from 'react'
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
  open: openProp,
  onOpenChange,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(openProp)

  const contentId = React.useId()

  function handleOpenChange(state: boolean) {
    setOpen(state)
    onOpenChange?.(state)
  }

  React.useEffect(() => {
    if (open) {
      handleOpenChange(open)
    }

    function handleClick() {
      const open = triggerRef.current?.getAttribute('data-open') === 'true'
      onOpenChange?.(open)
    }

    triggerRef.current?.addEventListener('click', handleClick)
    return () => triggerRef.current?.removeEventListener('click', handleClick)
  }, [open])

  return (
    <CollapsibleContext.Provider
      value={{ open, onOpenChange: handleOpenChange, wrapperRef, triggerRef, contentRef, contentId }}>
      <div
        duck-collapsible=""
        className={cn('flex flex-col gap-2', className)}
        ref={wrapperRef}
        {...props}
        data-open={open}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

function CollapsibleTrigger({ children, onClick, ...props }: React.ComponentPropsWithRef<typeof Button>) {
  const { open, onOpenChange, triggerRef, contentId } = useCollapsible()

  return (
    <Button
      ref={triggerRef}
      duck-collapsible-trigger=""
      variant="ghost"
      aria-expanded={open}
      data-open={open}
      aria-controls={contentId}
      onClick={(e) => {
        onOpenChange?.(!open)
        onClick?.(e)
      }}
      {...props}>
      {children}
    </Button>
  )
}

function CollapsibleContent({
  children,
  forceMount = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { forceMount?: boolean }) {
  const { open, contentRef, contentId } = useCollapsible()

  return (
    <div
      ref={contentRef}
      duck-collapsible-content=""
      id={contentId}
      role="region"
      data-open={open}
      aria-hidden={!open}
      aria-expanded={open}
      className={cn('h-0 overflow-hidden transition-all duration-300 ease-in-out data-[open=true]:h-auto ', className)}
      {...props}>
      <Mount forceMount={forceMount} open={open} ref={contentRef as never}>
        {children}
      </Mount>
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
