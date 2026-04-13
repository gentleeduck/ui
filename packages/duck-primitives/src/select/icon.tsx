import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useSelectContext } from './select'

const ICON_NAME = 'SelectIcon'

type SelectIconElement = React.ComponentRef<typeof Primitive.span>

export interface ISelectIconProps extends React.ComponentPropsWithRef<typeof Primitive.span> {}

export const SelectIcon = React.forwardRef<SelectIconElement, ISelectIconProps>(
  (props: ScopedProps<ISelectIconProps>, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props
    const context = useSelectContext(ICON_NAME, __scopeSelect)
    return (
      <Primitive.span data-slot="select-icon" aria-hidden dir={context.dir} {...iconProps} ref={forwardedRef}>
        {children || '\u25BC'}
      </Primitive.span>
    )
  },
)

SelectIcon.displayName = ICON_NAME
