'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import { Mount } from '@gentleduck/primitives/mount'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

const AccordionContext = React.createContext<{
  value?: string[]
  readonly onValueChange?: (value: string | string[]) => void
  readonly wrapperRef: React.RefObject<HTMLDivElement | null>
  readonly onItemChange: (
    value: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    e: React.MouseEvent<HTMLDetailsElement, MouseEvent>,
  ) => void
  readonly rerender: boolean
} | null>(null)

type AccordionProps = Omit<React.HTMLProps<HTMLDivElement>, 'value' | 'type'> & {
  rerender?: boolean
} & (
    | {
        type?: 'single'
        defaultValue?: string
        value?: string
        onValueChange?: (value: string) => void
        collapsible?: boolean
      }
    | {
        type?: 'multiple'
        defaultValue?: string[]
        onValueChange?: (value: string[]) => void
        value?: string[]
        collapsible?: never
      }
  )
function Accordion({
  className,
  children,
  defaultValue,
  ref,
  type = 'single',
  value,
  collapsible = true,
  rerender = false,
  onValueChange,
  ...props
}: AccordionProps) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const itemsRef = React.useRef<HTMLDetailsElement[]>([])

  React.useEffect(() => {
    itemsRef.current = Array.from(
      wrapperRef.current?.querySelectorAll('[duck-accordion-item]') as never as HTMLDetailsElement[],
    )
  }, [])

  React.useEffect(() => {
    if (defaultValue) {
      itemsRef.current.forEach((item) => {
        if (defaultValue.includes(item.id)) {
          item.open = true
        }
      })
    }
  }, [defaultValue, onValueChange])

  function handleAccordionItemChange(
    value: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    e: React.MouseEvent<HTMLDetailsElement, MouseEvent>,
  ) {
    if (type === 'single') {
      if (collapsible) {
        itemsRef.current.forEach((item) => {
          if (item.id !== value) {
            item.open = false
          }
        })
      } else {
        itemsRef.current.forEach((item) => {
          if (item.id === value) {
            item.open = true
            e.preventDefault()
          } else {
            item.open = false
          }
        })
      }
    } else if (type === 'multiple') {
      itemsRef.current.forEach((item) => {
        if (item.id === value) {
          item.open = !item.open
          e.preventDefault()
        }
      })
    }
    if (rerender) {
      setOpen((x) => !x)
    }
  }

  return (
    <AccordionContext.Provider
      value={{
        onItemChange: handleAccordionItemChange,
        onValueChange: onValueChange as never,
        rerender,
        value: (type === 'single' ? [value ?? defaultValue] : (value ?? defaultValue)) as string[],
        wrapperRef,
      }}>
      <div
        className={cn('min-w-[400px] [interpolate-size:allow-keywords]', className)}
        {...props}
        data-slot="accordion"
        ref={wrapperRef}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({
  className,
  ref,
  children,
  onClick,
  onKeyUp,

  renderOnce = false,
  value,
  ...props
}: Omit<React.HTMLProps<HTMLDetailsElement>, 'value'> & {
  renderOnce?: boolean
  value?: string
}) {
  const { onItemChange, value: _value, rerender } = React.useContext(AccordionContext) ?? {}
  const [open, setOpen] = React.useState<boolean>(_value?.includes(value as string) ?? false)
  const _children = Array.from(children as never as React.ReactNode[])

  return (
    <details
      aria-labelledby={value}
      className={cn(
        'group overflow-hidden border-border border-b',
        '[&::details-content]:h-0 [&::details-content]:transform-gpu [&::details-content]:transition-all [&::details-content]:transition-discrete [&::details-content]:duration-250 [&::details-content]:ease-(--duck-motion-ease) [&::details-content]:will-change-[height] open:[&::details-content]:h-auto',
        AnimVariants(),
        className,
      )}
      id={value}
      onClick={(e) => {
        onClick?.(e)
        onItemChange?.(value ?? '', setOpen, e)
      }}
      onKeyUp={onKeyUp}
      ref={ref}
      {...props}
      data-slot="accordion-item"
      duck-accordion-item="">
      {_children[0]}
      {rerender && (
        <Mount open={open} renderOnce={renderOnce}>
          {_children[1]}
        </Mount>
      )}
      {!rerender && _children[1]}
    </details>
  )
}

function AccordionTrigger({
  className,
  children,
  icon,
  value,
  ref,
  ...props
}: React.HTMLProps<HTMLElement> & {
  icon?: React.ReactNode
  value?: string
}) {
  return (
    <summary
      aria-controls={value}
      aria-describedby={value}
      className={cn(
        'flex flex-1 cursor-pointer select-none items-center justify-between whitespace-nowrap py-4 font-medium font-medium text-base ring-offset-background transition-all transition-colors hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      id={value}
      ref={ref}
      {...props}
      data-slot="accordion-trigger"
      duck-accordion-trigger="">
      {children}
      <span
        className={cn(
          '[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200 group-open:[&>svg]:rotate-180',
        )}
        data-slot="accordion-icon"
        duck-accordion-icon="">
        {icon ? icon : <ChevronDown id="arrow" />}
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
  return (
    <div
      className={cn('select-none overflow-hidden pt-0 pb-4 text-base', className)}
      data-slot="accordion-content"
      duck-accordion-content=""
      ref={ref}
      {...props}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
