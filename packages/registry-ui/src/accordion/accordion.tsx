'use client'

import { cn } from '@gentleduck/libs/cn'
import * as AccordionPrimitive from '@gentleduck/primitives/accordion'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

const AccordionRenderOnceContext = React.createContext(false)

export type IAccordionProps = AccordionPrimitive.IAccordion.IProps & {
  renderOnce?: boolean
}

export type AccordionProps = IAccordionProps

const Accordion = React.forwardRef<HTMLDivElement, IAccordionProps>(
  ({ className, renderOnce = false, ...props }, ref) => (
    <AccordionRenderOnceContext.Provider value={renderOnce}>
      <AccordionPrimitive.Root
        ref={ref}
        className={cn('min-w-100 font-sans not-italic [interpolate-size:allow-keywords]', className)}
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
        'group/accordion-trigger flex w-full cursor-pointer select-none items-center justify-between py-4 text-start font-medium font-sans text-base not-italic ring-offset-background transition-all hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}>
      <span>{children}</span>
      <span
        className={cn(
          '[&>svg:not([class*=size-])]:size-4 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200 group-data-[state=open]/accordion-trigger:[&>svg]:rotate-180',
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
  const [hasOpened, setHasOpened] = React.useState(open)

  React.useEffect(() => {
    if (open) setHasOpened(true)
  }, [open])

  if (renderOnce && !hasOpened) return null

  return (
    <AccordionPrimitive.Content
      ref={ref}
      forceMount
      inert={!open || undefined}
      className={cn(
        'block overflow-hidden font-sans text-base not-italic will-change-[height,opacity]',
        'data-[state=closed]:h-0 data-[state=open]:h-auto',
        'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
        'data-[state=closed]:pointer-events-none',
        'transition-[height,opacity] duration-[200ms,150ms] ease-(--gentleduck-motion-ease)',
        'motion-reduce:transition-none',
        className,
      )}
      {...props}>
      <div className="pt-0 pb-4">{children}</div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionContent, AccordionItem, AccordionRenderOnceContext, AccordionTrigger }
