import * as React from 'react'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { DismissableLayerContext } from './dismissable-layer'

/* -------------------------------------------------------------------------------------------------
 * DismissableLayerBranch
 *
 * Marks a DOM subtree as a "branch" of the dismissable layer.
 * Pointer and focus events inside a branch will not trigger layer dismissal.
 * Useful for related UI like a color picker popover inside a dialog.
 * -----------------------------------------------------------------------------------------------*/

const BRANCH_NAME = 'DismissableLayerBranch'

type DismissableLayerBranchElement = React.ElementRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
export interface DismissableLayerBranchProps extends PrimitiveDivProps {}

export const DismissableLayerBranch = React.forwardRef<DismissableLayerBranchElement, DismissableLayerBranchProps>(
  (props, forwardedRef) => {
    const context = React.useContext(DismissableLayerContext)
    const ref = React.useRef<DismissableLayerBranchElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    React.useEffect(() => {
      const node = ref.current
      if (node) {
        context.branches.add(node)
        return () => {
          context.branches.delete(node)
        }
      }
    }, [context.branches])

    return <Primitive.div {...props} ref={composedRefs} />
  },
)

DismissableLayerBranch.displayName = BRANCH_NAME
