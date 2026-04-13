import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useSelectContext } from './select'

const SEPARATOR_NAME = 'SelectSeparator'

type SelectSeparatorElement = React.ComponentRef<typeof Primitive.div>

export interface ISelectSeparatorProps extends React.ComponentPropsWithRef<typeof Primitive.div> {}

export const SelectSeparator = React.forwardRef<SelectSeparatorElement, ISelectSeparatorProps>(
  (props: ScopedProps<ISelectSeparatorProps>, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props
    const context = useSelectContext(SEPARATOR_NAME, __scopeSelect)
    return (
      <Primitive.div
        data-slot="select-separator"
        aria-hidden
        dir={context.dir}
        {...separatorProps}
        ref={forwardedRef}
      />
    )
  },
)

SelectSeparator.displayName = SEPARATOR_NAME
