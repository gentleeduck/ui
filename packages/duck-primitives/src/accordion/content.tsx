import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './accordion'
import { useAccordionContext } from './accordion'
import { useAccordionItemContext } from './item'

const CONTENT_NAME = 'AccordionContent'

type AccordionContentElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

interface IAccordionContentProps extends PrimitiveDivProps {
  forceMount?: boolean
}

const AccordionContent = React.forwardRef<AccordionContentElement, IAccordionContentProps>(
  (props: ScopedProps<IAccordionContentProps>, forwardedRef) => {
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

export type { IAccordionContentProps }
export { AccordionContent }
