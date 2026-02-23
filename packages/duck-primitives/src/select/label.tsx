import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useSelectGroupContext } from './select'

const LABEL_NAME = 'SelectLabel'

type SelectLabelElement = React.ComponentRef<typeof Primitive.div>

export interface SelectLabelProps extends React.ComponentPropsWithRef<typeof Primitive.div> {}

export const SelectLabel = React.forwardRef<SelectLabelElement, SelectLabelProps>(
  (props: ScopedProps<SelectLabelProps>, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect)
    return <Primitive.div id={groupContext.id} {...labelProps} ref={forwardedRef} />
  },
)

SelectLabel.displayName = LABEL_NAME
