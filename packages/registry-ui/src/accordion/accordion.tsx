'use client'

import { cn } from '@gentleduck/libs/cn'
import * as AccordionPrimitive from '@gentleduck/primitives/accordion'
import { MountMinimal } from '@gentleduck/primitives/mount'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

const AccordionRenderOnceContext = React.createContext(false)

export type IAccordionProps = AccordionPrimitive.IAccordionProps & {
  renderOnce?: boolean
}

export type AccordionProps = IAccordionProps

const Accordion = React.forwardRef<HTMLDivElement, IAccordionProps>(
  ({ className, renderOnce = false, ...props }, ref) => (
    <AccordionRenderOnceContext.Provider value={renderOnce}>
      <AccordionPrimitive.Root
        ref={ref}
        className={cn('min-w-100 [interpolate-size:allow-keywords] font-sans not-italic', className)}
        {...props}
      />
    </AccordionRenderOnceContext.Provider>
  ),
)
Accordion.displayName = 'Accordion'

const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('group overflow-hidden border-border border-b', className)}
      {...props}
    />
  ),
)
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    icon?: React.ReactNode
  }
>(({ className, children, icon, ...props }, ref) => {
  return (
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group/accordion-trigger flex w-full cursor-pointer select-none items-center justify-between py-4 font-sans font-medium not-italic text-base ring-offset-background transition-all hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}>
      <span>{children}</span>
      <span
        className={cn(
          '[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200 group-data-[state=open]/accordion-trigger:[&>svg]:rotate-180',
        )}
        data-slot="accordion-icon">
        {icon ? icon : <ChevronDown aria-hidden="true" />}
      </span>
    </AccordionPrimitive.Trigger>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>, 'asChild' | 'forceMount'> & {
    rerender?: boolean
  }
>(({ className, children, rerender: _rerender = false, ...props }, ref) => {
  const renderOnce = React.useContext(AccordionRenderOnceContext)
  const { open } = AccordionPrimitive.useAccordionItemContext('AccordionContent', undefined)
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <MountMinimal open={open} ref={contentRef.current as never} renderOnce={renderOnce}>
      <AccordionPrimitive.Content
        ref={(node) => {
          contentRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        forceMount
        inert={!open || undefined}
        className={cn(
          'group/accordion-content grid overflow-hidden will-change-[grid-template-rows,opacity]',
          'data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]',
          'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
          'data-[state=closed]:pointer-events-none',
          'transition-[grid-template-rows,opacity] transition-discrete duration-[240ms,200ms] ease-(--gentleduck-motion-ease)',
          'motion-reduce:transition-none',
          className,
        )}
        {...props}>
        <div
          className={cn(
            'min-h-0 overflow-hidden pt-0 pb-4 font-sans not-italic text-base will-change-transform',
            'transition-[transform,opacity] duration-[240ms] ease-(--gentleduck-motion-ease) motion-reduce:transition-none',
            'group-data-[state=closed]/accordion-content:-translate-y-1 group-data-[state=closed]/accordion-content:opacity-0',
            'group-data-[state=open]/accordion-content:translate-y-0 group-data-[state=open]/accordion-content:opacity-100',
          )}>
          {children}
        </div>
      </AccordionPrimitive.Content>
    </MountMinimal>
  )
})
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionContent, AccordionItem, AccordionRenderOnceContext, AccordionTrigger }
