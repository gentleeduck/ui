'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { Mount } from '@gentleduck/primitives/mount'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

const AccordionContext = React.createContext<{
  value: string[]
  readonly onValueChange?: (value: string | string[]) => void
  readonly wrapperRef: React.RefObject<HTMLDivElement | null>
  readonly onItemChange: (value: string, e: React.MouseEvent<HTMLDetailsElement, MouseEvent>) => void
  readonly renderOnce: boolean
} | null>(null)

type AccordionProps = Omit<React.HTMLProps<HTMLDivElement>, 'value' | 'type' | 'ref'> & {
  renderOnce?: boolean
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

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      children,
      defaultValue,
      type = 'single',
      value,
      collapsible = true,
      renderOnce = false,
      onValueChange,
      dir,
      ...props
    },
    ref,
  ) => {
    const direction = useDirection(dir as Direction)
    const wrapperRef = React.useRef<HTMLDivElement | null>(null)
    const itemsRef = React.useRef<HTMLDetailsElement[]>([])

    const [activeValues, setActiveValues] = React.useState<string[]>(() => {
      if (defaultValue) {
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
      }
      return []
    })

    const currentValues = value !== undefined ? (Array.isArray(value) ? value : [value]) : activeValues

    React.useEffect(() => {
      itemsRef.current = Array.from(
        wrapperRef.current?.querySelectorAll('[data-slot="accordion-item"]') as never as HTMLDetailsElement[],
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
    }, [defaultValue])

    function handleAccordionItemChange(itemValue: string, e: React.MouseEvent<HTMLDetailsElement, MouseEvent>) {
      let newValues: string[]

      if (type === 'single') {
        if (collapsible) {
          newValues = currentValues.includes(itemValue) ? [] : [itemValue]
          itemsRef.current.forEach((item) => {
            if (item.id !== itemValue) {
              item.open = false
            }
          })
        } else {
          newValues = [itemValue]
          itemsRef.current.forEach((item) => {
            if (item.id === itemValue) {
              item.open = true
              e.preventDefault()
            } else {
              item.open = false
            }
          })
        }
      } else {
        if (currentValues.includes(itemValue)) {
          newValues = currentValues.filter((v) => v !== itemValue)
        } else {
          newValues = [...currentValues, itemValue]
        }
        itemsRef.current.forEach((item) => {
          if (item.id === itemValue) {
            item.open = !item.open
            e.preventDefault()
          }
        })
      }

      setActiveValues(newValues)

      if (type === 'single') {
        ;(onValueChange as ((value: string) => void) | undefined)?.(newValues[0] ?? '')
      } else {
        ;(onValueChange as ((value: string[]) => void) | undefined)?.(newValues)
      }
    }

    return (
      <AccordionContext.Provider
        value={{
          onItemChange: handleAccordionItemChange,
          onValueChange: onValueChange as never,
          renderOnce,
          value: currentValues,
          wrapperRef,
        }}>
        <div
          className={cn('min-w-100 [interpolate-size:allow-keywords]', className)}
          dir={direction}
          {...props}
          data-slot="accordion"
          ref={(node) => {
            wrapperRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  },
)
Accordion.displayName = 'Accordion'

const AccordionItem = React.forwardRef<
  HTMLDetailsElement,
  Omit<React.HTMLProps<HTMLDetailsElement>, 'value' | 'ref'> & {
    value?: string
  }
>(({ className, children, onClick, onKeyUp, value, dir, ...props }, ref) => {
  const { onItemChange, value: _value = [], renderOnce } = React.useContext(AccordionContext) ?? {}
  const isActive = _value.includes(value as string)
  const _children = Array.from(children as never as React.ReactNode[])
  const direction = useDirection(dir as Direction)

  return (
    <details
      className={cn(
        'group details-content:h-0 details-content:transform-gpu overflow-hidden border-border border-b details-content:transition-all details-content:transition-discrete details-content:duration-[200ms,150ms] details-content:ease-(--duck-motion-ease) details-content:will-change-[height] open:details-content:h-auto',
        className,
      )}
      id={value}
      onClick={(e) => {
        const summary = (e.currentTarget as HTMLDetailsElement).querySelector('summary')
        if (!summary?.contains(e.target as Node)) {
          e.preventDefault()
          return
        }
        onClick?.(e)
        onItemChange?.(value ?? '', e)
      }}
      onKeyUp={onKeyUp}
      dir={direction}
      ref={ref}
      {...props}
      data-slot="accordion-item">
      {_children[0]}
      <Mount open={renderOnce ? isActive : true} renderOnce={renderOnce ?? false}>
        {_children[1]}
      </Mount>
    </details>
  )
})
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & {
    icon?: React.ReactNode
    value?: string
  }
>(({ className, children, icon, value, ...props }, ref) => {
  return (
    <summary
      className={cn(
        'flex flex-1 cursor-pointer items-center justify-between py-4 font-medium text-base ring-offset-background transition-all hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      ref={ref as React.Ref<HTMLElement>}
      {...props}
      data-slot="accordion-trigger">
      {children}
      <span
        className={cn(
          '[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200 group-open:[&>svg]:rotate-180',
        )}
        data-slot="accordion-icon">
        {icon ? icon : <ChevronDown aria-hidden="true" />}
      </span>
    </summary>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement> & { rerender?: boolean }>(
  ({ className, children, rerender = false, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <div
        className={cn(
          'overflow-hidden pt-0 pb-4 text-base',
          'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
          className,
        )}
        data-slot="accordion-content"
        dir={direction}
        ref={ref}
        {...props}>
        {children}
      </div>
    )
  },
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
