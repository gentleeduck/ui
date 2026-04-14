import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './accordion'
import { useAccordionContext } from './accordion'
import { useAccordionItemContext } from './item'

const TRIGGER_NAME = 'AccordionTrigger'

type AccordionTriggerElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

interface IAccordionTriggerProps extends PrimitiveButtonProps {}

const AccordionTrigger = React.forwardRef<AccordionTriggerElement, IAccordionTriggerProps>(
  (props: ScopedProps<IAccordionTriggerProps>, forwardedRef) => {
    const { __scopeAccordion, disabled: disabledProp, ...triggerProps } = props
    const context = useAccordionContext(TRIGGER_NAME, __scopeAccordion)
    const itemContext = useAccordionItemContext(TRIGGER_NAME, __scopeAccordion)
    const disabled = itemContext.disabled || disabledProp || false

    return (
      <Primitive.button
        type="button"
        data-slot="accordion-trigger"
        aria-controls={itemContext.contentId}
        aria-disabled={disabled || undefined}
        aria-expanded={itemContext.open}
        data-state={itemContext.open ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        id={itemContext.triggerId}
        dir={context.dir}
        {...triggerProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => {
          if (!disabled) {
            context.onItemOpenChange(itemContext.value)
          }
        })}
      />
    )
  },
)

AccordionTrigger.displayName = TRIGGER_NAME

export type { IAccordionTriggerProps }
export { AccordionTrigger }
