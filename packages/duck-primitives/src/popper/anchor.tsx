import * as React from 'react'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { usePopperContext } from './popper'
import type { IPopper } from './popper.types'

const ANCHOR_NAME = 'PopperAnchor'

type PopperAnchorElement = React.ComponentRef<typeof Primitive.div>

export const PopperAnchor = React.forwardRef<PopperAnchorElement, IPopper.IAnchorProps>(
  (props: IPopper.IScoped<IPopper.IAnchorProps>, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props
    const context = usePopperContext(ANCHOR_NAME, __scopePopper)

    const ref = React.useRef(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    React.useEffect(() => {
      context.onAnchorChange(virtualRef?.current ?? ref.current)
    })

    return virtualRef ? null : <Primitive.div data-slot="popper-anchor" {...anchorProps} ref={composedRefs} />
  },
)

PopperAnchor.displayName = ANCHOR_NAME
