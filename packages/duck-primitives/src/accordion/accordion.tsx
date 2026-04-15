import * as React from 'react'
import type { Direction } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'

const ACCORDION_NAME = 'Accordion'

const [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME)

type IAccordionProps = IAccordion.ISingle | IAccordion.IMultiple

export namespace IAccordion {
  export type IScoped<TProps> = TProps & { __scopeAccordion?: Scope }

  export interface IContext {
    type: 'single' | 'multiple'
    openItems: string[]
    onItemOpenChange(value: string): void
    collapsible: boolean
    dir: Direction
  }

  export interface IImpl extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
    dir?: Direction
  }

  export interface ISingle extends IImpl {
    type?: 'single'
    value?: string
    defaultValue?: string
    onValueChange?(value: string): void
    collapsible?: boolean
  }

  export interface IMultiple extends IImpl {
    type: 'multiple'
    value?: string[]
    defaultValue?: string[]
    onValueChange?(value: string[]): void
    collapsible?: never
  }

  export interface IImplPrivate extends IImpl {
    type: 'single' | 'multiple'
    openItems: string[]
    onItemOpenChange(value: string): void
    collapsible: boolean
  }
}

const [AccordionProvider, useAccordionContext] = createAccordionContext<IAccordion.IContext>(ACCORDION_NAME)

const Accordion = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IAccordionProps>(
  (props: IAccordion.IScoped<IAccordionProps>, forwardedRef) => {
    if (props.type === 'multiple') {
      return <AccordionMultiple {...props} ref={forwardedRef} />
    }

    return <AccordionSingle {...props} ref={forwardedRef} />
  },
)

Accordion.displayName = ACCORDION_NAME

const AccordionSingle = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IAccordion.ISingle>(
  (props: IAccordion.IScoped<IAccordion.ISingle>, forwardedRef) => {
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

const AccordionMultiple = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IAccordion.IMultiple>(
  (props: IAccordion.IScoped<IAccordion.IMultiple>, forwardedRef) => {
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

const AccordionImpl = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IAccordion.IImplPrivate>(
  (props: IAccordion.IScoped<IAccordion.IImplPrivate>, forwardedRef) => {
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

export type { IAccordionProps }
export {
  ACCORDION_NAME,
  Accordion,
  AccordionProvider,
  createAccordionContext,
  createAccordionScope,
  useAccordionContext,
}
