import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { useAccordionContext } from './accordion'
import type { IAccordion } from './accordion.types'
import { useAccordionItemContext } from './item'

const CONTENT_NAME = 'AccordionContent'

const AccordionContent = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IAccordion.IContentProps>(
  (props: IAccordion.IScoped<IAccordion.IContentProps>, forwardedRef) => {
    const { __scopeAccordion, forceMount = false, ...contentProps } = props
    const context = useAccordionContext(CONTENT_NAME, __scopeAccordion)
    const itemContext = useAccordionItemContext(CONTENT_NAME, __scopeAccordion)

    if (!forceMount && !itemContext.open) {
      return null
    }

    return (
      <Primitive.div
        data-slot="accordion-content"
        data-state={itemContext.open ? 'open' : 'closed'}
        data-disabled={itemContext.disabled ? '' : undefined}
        id={itemContext.contentId}
        role="region"
        aria-labelledby={itemContext.triggerId}
        aria-hidden={forceMount && !itemContext.open ? true : undefined}
        dir={context.dir}
        {...contentProps}
        ref={forwardedRef}
      />
    )
  },
)

AccordionContent.displayName = CONTENT_NAME

export { AccordionContent }
