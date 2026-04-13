import * as React from 'react'
import { useComposedRefs } from '../libs/compose-ref'
import type { IMeasurable } from '../libs/observe-element-rect'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, usePopperContext } from './popper'

const ANCHOR_NAME = 'PopperAnchor'

type PrimitiveDivProps = React.ComponentPropsWithRef<typeof Primitive.div>

export interface IPopperAnchorProps extends PrimitiveDivProps {
  virtualRef?: React.RefObject<IMeasurable>
}

export const PopperAnchor = ({ ref: forwardedRef, ...props }: ScopedProps<IPopperAnchorProps>) => {
  const { __scopePopper, virtualRef, ...anchorProps } = props
  const context = usePopperContext(ANCHOR_NAME, __scopePopper)

  const ref = React.useRef(null)
  const composedRefs = useComposedRefs(forwardedRef, ref)

  React.useEffect(() => {
    context.onAnchorChange(virtualRef?.current ?? ref.current)
  })

  return virtualRef ? null : <Primitive.div data-slot="popper-anchor" {...anchorProps} ref={composedRefs} />
}

PopperAnchor.displayName = ANCHOR_NAME
