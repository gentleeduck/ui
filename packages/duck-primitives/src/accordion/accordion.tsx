import * as React from 'react'
import type { Direction } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'

const ACCORDION_NAME = 'Accordion'

type ScopedProps<P> = P & { __scopeAccordion?: Scope }

const [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME)

type AccordionContextValue = {
  type: 'single' | 'multiple'
  openItems: string[]
  onItemOpenChange(value: string): void
  collapsible: boolean
  dir: Direction
}

const [AccordionProvider, useAccordionContext] = createAccordionContext<AccordionContextValue>(ACCORDION_NAME)

type AccordionElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

interface IAccordionImplProps extends PrimitiveDivProps {
  dir?: Direction
}

interface IAccordionSingleProps extends IAccordionImplProps {
  type?: 'single'
  value?: string
  defaultValue?: string
  onValueChange?(value: string): void
  collapsible?: boolean
}

interface IAccordionMultipleProps extends IAccordionImplProps {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?(value: string[]): void
  collapsible?: never
}

type IAccordionProps = IAccordionSingleProps | IAccordionMultipleProps

const Accordion = React.forwardRef<AccordionElement, IAccordionProps>(
  (props: ScopedProps<IAccordionProps>, forwardedRef) => {
    if (props.type === 'multiple') {
      return <AccordionMultiple {...props} ref={forwardedRef} />
    }

    return <AccordionSingle {...props} ref={forwardedRef} />
  },
)

Accordion.displayName = ACCORDION_NAME

const AccordionSingle = React.forwardRef<AccordionElement, IAccordionSingleProps>(
  (props: ScopedProps<IAccordionSingleProps>, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, collapsible = true, ...accordionProps } = props

    const [value = '', setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? '',
      onChange: onValueChange,
      caller: ACCORDION_NAME,
    })

    const handleItemOpenChange = React.useCallback(
      (itemValue: string) => {
        setValue((currentValue = '') => {
          if (currentValue === itemValue) {
            return collapsible ? '' : currentValue
          }

          return itemValue
        })
      },
      [collapsible, setValue],
    )

    return (
      <AccordionImpl
        {...accordionProps}
        ref={forwardedRef}
        type="single"
        openItems={value ? [value] : []}
        onItemOpenChange={handleItemOpenChange}
        collapsible={collapsible}
      />
    )
  },
)

AccordionSingle.displayName = `${ACCORDION_NAME}Single`

const AccordionMultiple = React.forwardRef<AccordionElement, IAccordionMultipleProps>(
  (props: ScopedProps<IAccordionMultipleProps>, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, ...accordionProps } = props

    const [value = [], setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? [],
      onChange: onValueChange,
      caller: ACCORDION_NAME,
    })

    const handleItemOpenChange = React.useCallback(
      (itemValue: string) => {
        setValue((currentValue = []) => {
          if (currentValue.includes(itemValue)) {
            return currentValue.filter((value) => value !== itemValue)
          }

          return [...currentValue, itemValue]
        })
      },
      [setValue],
    )

    return (
      <AccordionImpl
        {...accordionProps}
        ref={forwardedRef}
        type="multiple"
        openItems={value}
        onItemOpenChange={handleItemOpenChange}
        collapsible
      />
    )
  },
)

AccordionMultiple.displayName = `${ACCORDION_NAME}Multiple`

interface IAccordionImplPrivateProps extends IAccordionImplProps {
  type: 'single' | 'multiple'
  openItems: string[]
  onItemOpenChange(value: string): void
  collapsible: boolean
}

const AccordionImpl = React.forwardRef<AccordionElement, IAccordionImplPrivateProps>(
  (props: ScopedProps<IAccordionImplPrivateProps>, forwardedRef) => {
    const { __scopeAccordion, type, openItems, onItemOpenChange, collapsible, dir, ...accordionProps } = props
    const direction = useDirection(dir)

    return (
      <AccordionProvider
        scope={__scopeAccordion}
        type={type}
        openItems={openItems}
        onItemOpenChange={onItemOpenChange}
        collapsible={collapsible}
        dir={direction}>
        <Primitive.div data-slot="accordion" dir={direction} {...accordionProps} ref={forwardedRef} />
      </AccordionProvider>
    )
  },
)

AccordionImpl.displayName = `${ACCORDION_NAME}Impl`

export type { IAccordionImplProps, IAccordionMultipleProps, IAccordionProps, IAccordionSingleProps, ScopedProps }
export {
  ACCORDION_NAME,
  Accordion,
  AccordionProvider,
  createAccordionContext,
  createAccordionScope,
  useAccordionContext,
}
