import * as React from 'react'
import { useId } from '../hooks/use-id'
import { Primitive } from '../primitive-elements'
import { createAccordionContext, useAccordionContext } from './accordion'
import type { IAccordion } from './accordion.types'

const ITEM_NAME = 'AccordionItem'

const [AccordionItemProvider, useAccordionItemContext] = createAccordionContext<IAccordion.IItemContext>(ITEM_NAME)

const AccordionItem = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IAccordion.IItemProps>(
  (props: IAccordion.IScoped<IAccordion.IItemProps>, forwardedRef) => {
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

export { AccordionItem, AccordionItemProvider, useAccordionItemContext }
