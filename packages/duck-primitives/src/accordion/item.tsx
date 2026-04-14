import * as React from 'react'
import { useId } from '../hooks/use-id'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './accordion'
import { createAccordionContext, useAccordionContext } from './accordion'

const ITEM_NAME = 'AccordionItem'

type AccordionItemContextValue = {
  value: string
  open: boolean
  disabled: boolean
  triggerId: string
  contentId: string
}

const [AccordionItemProvider, useAccordionItemContext] = createAccordionContext<AccordionItemContextValue>(ITEM_NAME)

type AccordionItemElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

interface IAccordionItemProps extends PrimitiveDivProps {
  value?: string
  disabled?: boolean
}

const AccordionItem = React.forwardRef<AccordionItemElement, IAccordionItemProps>(
  (props: ScopedProps<IAccordionItemProps>, forwardedRef) => {
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
