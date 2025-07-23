'use client'

import { ShouldRender } from '@gentleduck/aria-feather/dialog'
import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

const AccordionContext = React.createContext<{
  value?: string
  onValueChange?: (value: string | string[]) => void
  wrapperRef: React.RefObject<HTMLDivElement | null>
} | null>(null)

function Accordion({
  className,
  children,
  defaultValue,
  ref,
  type = 'single',
  value,
  collapsible = true,
  onValueChange,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'value'> & {
  collapsible?: boolean
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string
  onValueChange?: (value: string | string[]) => void
}) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const itemsRef = React.useRef<HTMLDetailsElement[]>([])

  React.useEffect(() => {
    itemsRef.current = Array.from(
      wrapperRef.current?.querySelectorAll('[duck-accordion-item]') as never as HTMLDetailsElement[],
    )
  }, [])

  React.useEffect(() => {
    if (defaultValue) {
      onValueChange?.(defaultValue)
    }
    function setOpen(value: boolean, trigger?: HTMLDivElement, content?: HTMLDivElement) {
      trigger?.setAttribute('data-open', String(value))
      content?.setAttribute('data-open', String(value))
    }

    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i] as HTMLDetailsElement
      const content = item.querySelector('[duck-accordion-content]') as HTMLDivElement
      const trigger = item.querySelector('[duck-accordion-trigger]') as HTMLDivElement

      if (item.id === defaultValue) {
        item.open = true
        setOpen(true, trigger, content)
      }

      trigger.addEventListener('click', () => {
        if (type === 'single') {
          for (let i = 0; i < itemsRef.current.length; i++) {
            const _item = itemsRef.current[i] as HTMLDetailsElement
            const content = _item.querySelector('[duck-accordion-content]') as HTMLDivElement
            const trigger = _item.querySelector('[duck-accordion-trigger]') as HTMLDivElement

            if (!collapsible) {
              _item.open = false
              setOpen(false, trigger, content)
            }

            if (_item.id === item.id) {
              _item.open = item.open
              setOpen(!item.open, trigger, content)
            }
          }
        } else {
        }
        if (!collapsible) item.open = false
        setOpen(!item.open, trigger, content)
        onValueChange?.(item.id)
      })
    }
  }, [defaultValue, onValueChange])

  return (
    <AccordionContext.Provider
      value={{
        onValueChange,
        value,
        wrapperRef,
      }}>
      <div className={cn('min-w-[400px] [interpolate-size:allow-keywords]', className)} {...props} ref={wrapperRef}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

const AccordionItemContext = React.createContext<{
  value?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
} | null>(null)

function AccordionItem({
  className,
  ref,
  value,
  ...props
}: React.HTMLProps<HTMLDetailsElement> & {
  value?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <AccordionItemContext.Provider value={{ onOpenChange: setOpen, open, value }}>
      <details
        aria-labelledby={value}
        className={cn(
          'group overflow-hidden border-border border-b',
          '[&::details-content]:h-0 [&::details-content]:transform-gpu [&::details-content]:transition-all [&::details-content]:transition-discrete [&::details-content]:duration-250 [&::details-content]:ease-(--duck-motion-ease) [&::details-content]:will-change-[height] open:[&::details-content]:h-auto',
          AnimVariants({ overlay: 'nothing' }),
          className,
        )}
        id={value}
        ref={ref}
        {...props}
        duck-accordion-item=""
      />
    </AccordionItemContext.Provider>
  )
}

function AccordionTrigger({
  className,
  children,
  icon,
  value,
  onClick,
  ref,
  ...props
}: React.HTMLProps<HTMLElement> & {
  icon?: React.ReactNode
  value?: string
}) {
  const { onOpenChange, open } = React.useContext(AccordionItemContext) ?? {}
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <summary>
    <summary
      aria-controls={value}
      aria-describedby={value}
      className={cn(
        'flex flex-1 items-center justify-between whitespace-nowrap py-4 font-medium font-medium text-sm ring-offset-background transition-all transition-colors hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      id={value}
      onClick={(e) => {
        onOpenChange?.(!open)
        onClick?.(e)
      }}
      ref={ref}
      {...props}
      duck-accordion-trigger="">
      {children}
      <span
        className={cn(
          '[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200 [&[data-open=true]>svg]:rotate-180',
        )}
        data-open={open}>
        {icon ? icon : <ChevronDown className="group-open:rotate-180" id="arrow" />}
      </span>
    </summary>
  )
}

const AccordionContent = ({
  className,
  children,
  rerender = false,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> & { rerender?: boolean }) => {
  const { open } = React.useContext(AccordionItemContext) ?? {}
  return (
    <div className={cn('overflow-hidden pt-0 pb-4 text-sm', className)} duck-accordion-content="" ref={ref} {...props}>
      <ShouldRender once={rerender} open={open ?? false} ref={ref as never}>
        {children}
      </ShouldRender>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
