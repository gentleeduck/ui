import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useSelectContext, useSelectGroupContext } from './select'

const LABEL_NAME = 'SelectLabel'

type SelectLabelElement = React.ComponentRef<typeof Primitive.div>

export interface ISelectLabelProps extends React.ComponentPropsWithRef<typeof Primitive.div> {}

export const SelectLabel = React.forwardRef<SelectLabelElement, ISelectLabelProps>(
  (props: ScopedProps<ISelectLabelProps>, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props
    const context = useSelectContext(LABEL_NAME, __scopeSelect)
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect)
    return (
      <Primitive.div
        data-slot="select-label"
        id={groupContext.id}
        dir={context.dir}
        {...labelProps}
        ref={forwardedRef}
      />
    )
  },
)

SelectLabel.displayName = LABEL_NAME
