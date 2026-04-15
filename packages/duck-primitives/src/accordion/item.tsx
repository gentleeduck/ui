import * as React from 'react'
import { useId } from '../hooks/use-id'
import { Primitive } from '../primitive-elements'
import type { IAccordionProps } from './accordion'
import { createAccordionContext, useAccordionContext } from './accordion'

const ITEM_NAME = 'AccordionItem'

interface IAccordionItemProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  value?: string
  disabled?: boolean
}

export namespace IAccordionItemProps {
  export interface IContext {
    value: string
    open: boolean
    disabled: boolean
    triggerId: string
    contentId: string
  }
}

const [AccordionItemProvider, useAccordionItemContext] = createAccordionContext<IAccordionItemProps.IContext>(ITEM_NAME)

const AccordionItem = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IAccordionItemProps>(
  (props: IAccordionProps.IScoped<IAccordionItemProps>, forwardedRef) => {
    const { __scopeAccordion, value: valueProp, disabled = false, ...itemProps } = props
    const context = useAccordionContext(ITEM_NAME, __scopeAccordion)
    const generatedValue = useId()
    const triggerId = useId()
    const contentId = useId()
    const value = valueProp ?? generatedValue
    const open = context.openItems.includes(value)

    return (
      <AccordionItemProvider
        scope={__scopeAccordion}
        value={value}
        open={open}
        disabled={disabled}
        triggerId={triggerId}
        contentId={contentId}>
        <Primitive.div
          data-slot="accordion-item"
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          data-value={value}
          dir={context.dir}
          {...itemProps}
          ref={forwardedRef}
        />
      </AccordionItemProvider>
    )
  },
)

AccordionItem.displayName = ITEM_NAME

export type { IAccordionItemProps }
export { AccordionItem, AccordionItemProvider, useAccordionItemContext }
