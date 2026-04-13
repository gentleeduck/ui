import * as React from 'react'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { DismissableLayerContext } from './dismissable-layer'

const BRANCH_NAME = 'DismissableLayerBranch'

type DismissableLayerBranchElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
export interface IDismissableLayerBranchProps extends PrimitiveDivProps {}

export const DismissableLayerBranch = React.forwardRef<DismissableLayerBranchElement, IDismissableLayerBranchProps>(
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

    return <Primitive.div data-slot="dismissable-layer-branch" {...props} ref={composedRefs} />
  },
)

DismissableLayerBranch.displayName = BRANCH_NAME
