import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { IVisuallyHidden } from './visibility-hidden.types'

const NAME = 'VisuallyHidden'

type VisuallyHiddenElement = React.ComponentRef<typeof Primitive.span>

const VisuallyHidden = React.forwardRef<VisuallyHiddenElement, IVisuallyHidden.IProps>((props, forwardedRef) => {
  return (
    <Primitive.span
      data-slot="visually-hidden"
      {...props}
      ref={forwardedRef}
      style={{
        position: 'absolute',
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        ...props.style,
      }}
    />
  )
})

VisuallyHidden.displayName = NAME

const Root = VisuallyHidden

export { Root, VisuallyHidden }
