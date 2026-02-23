import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './select'

const ICON_NAME = 'SelectIcon'

type SelectIconElement = React.ComponentRef<typeof Primitive.span>

export interface SelectIconProps extends React.ComponentPropsWithRef<typeof Primitive.span> {}

export const SelectIcon = React.forwardRef<SelectIconElement, SelectIconProps>(
  (props: ScopedProps<SelectIconProps>, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props
    return (
      <Primitive.span aria-hidden {...iconProps} ref={forwardedRef}>
        {children || '\u25BC'}
      </Primitive.span>
    )
  },
)

SelectIcon.displayName = ICON_NAME
