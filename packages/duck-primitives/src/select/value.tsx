import * as React from 'react'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useSelectContext } from './select'
import { shouldShowPlaceholder } from './select.libs'

const VALUE_NAME = 'SelectValue'

type SelectValueElement = React.ComponentRef<typeof Primitive.span>

export interface ISelectValueProps extends Omit<React.ComponentPropsWithRef<typeof Primitive.span>, 'placeholder'> {
  placeholder?: React.ReactNode
}

export const SelectValue = React.forwardRef<SelectValueElement, ISelectValueProps>(
  (props: ScopedProps<ISelectValueProps>, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const { __scopeSelect, className, style, children, placeholder = '', ...valueProps } = props
    const context = useSelectContext(VALUE_NAME, __scopeSelect)
    const { onValueNodeHasChildrenChange } = context
    const hasChildren = children !== undefined
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange)

    useLayoutEffect(() => {
      onValueNodeHasChildrenChange(hasChildren)
    }, [onValueNodeHasChildrenChange, hasChildren])

    return (
      <Primitive.span
        data-slot="select-value"
        {...valueProps}
        ref={composedRefs}
        dir={context.dir}
        // we don't want events from the portalled `SelectValue` children to bubble
        // through the item they came from
        style={{ pointerEvents: 'none' }}>
        {shouldShowPlaceholder(context.value) ? placeholder : children}
      </Primitive.span>
    )
  },
)

SelectValue.displayName = VALUE_NAME
