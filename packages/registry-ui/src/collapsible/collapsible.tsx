'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { MountMinimal } from '@gentleduck/primitives/mount'
import * as React from 'react'
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

const Collapsible = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    defaultOpen?: boolean
  }
>(({ children, className, open: openProp, onOpenChange, defaultOpen, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(openProp ?? defaultOpen ?? false)

  const contentId = React.useId()

  function handleOpenChange(state: boolean) {
    setOpen(state)
    onOpenChange?.(state)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleOpenChange and triggerRef are stable refs
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
  }, [open, onOpenChange])

  return (
    <CollapsibleContext.Provider
      value={{ contentId, contentRef, onOpenChange: handleOpenChange, open, triggerRef, wrapperRef }}>
      <div
        className={cn('flex flex-col gap-2', className)}
        dir={direction}
        data-slot="collapsible"
        ref={(node) => {
          ;(wrapperRef as React.RefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        {...props}
        data-open={open}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
})
Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  ({ children, onClick, ...props }, ref) => {
    const { open, onOpenChange, triggerRef, contentId } = useCollapsible()

    return (
      <Button
        aria-controls={contentId}
        aria-expanded={open}
        data-open={open}
        data-slot="collapsible-trigger"
        onClick={(e) => {
          onOpenChange?.(!open)
          onClick?.(e)
        }}
        ref={(node) => {
          ;(triggerRef as React.RefObject<HTMLButtonElement | null>).current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        variant="ghost"
        {...props}>
        {children}
      </Button>
    )
  },
)
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLDivElement> & { forceMount?: boolean }
>(({ children, forceMount = false, className, ...props }, ref) => {
  const { open, contentRef, contentId } = useCollapsible()

  return (
    <section
      aria-hidden={!open}
      className={cn(
        'h-0 overflow-hidden transition-all data-[open=true]:h-auto',
        'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
        className,
      )}
      data-open={open}
      inert={!open || undefined}
      data-slot="collapsible-content"
      id={contentId}
      ref={(node) => {
        ;(contentRef as React.RefObject<HTMLDivElement | null>).current = node as HTMLDivElement
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      {...props}>
      <MountMinimal forceMount={forceMount} open={open} ref={contentRef as never}>
        {children}
      </MountMinimal>
    </section>
  )
})
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
