import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './select'

const SEPARATOR_NAME = 'SelectSeparator'

type SelectSeparatorElement = React.ComponentRef<typeof Primitive.div>

export interface SelectSeparatorProps extends React.ComponentPropsWithRef<typeof Primitive.div> {}

export const SelectSeparator = React.forwardRef<SelectSeparatorElement, SelectSeparatorProps>(
  (props: ScopedProps<SelectSeparatorProps>, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props
    return <Primitive.div aria-hidden {...separatorProps} ref={forwardedRef} />
  },
)

SelectSeparator.displayName = SEPARATOR_NAME
