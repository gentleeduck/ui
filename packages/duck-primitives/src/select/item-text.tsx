import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import {
  useSelectContentContext,
  useSelectContext,
  useSelectItemContext,
  useSelectNativeOptionsContext,
} from './select'
import type { ISelect } from './select.types'

const ITEM_TEXT_NAME = 'SelectItemText'

type SelectItemTextElement = React.ComponentRef<typeof Primitive.span>

export const SelectItemText = React.forwardRef<SelectItemTextElement, ISelect.IScoped<ISelect.IItemTextProps>>(
  (props, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const { __scopeSelect, className, style, ...itemTextProps } = props
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect)
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect)
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect)
    const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect)
    const [itemTextNode, setItemTextNode] = React.useState<SelectItemTextElement | null>(null)
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node: HTMLSpanElement | null) => setItemTextNode(node),
      itemContext.onItemTextChange,
      (node: HTMLSpanElement | null) =>
        contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled),
    )

    const textContent = itemTextNode?.textContent
    const nativeOption = React.useMemo(
      () => (
        <option key={itemContext.value} value={itemContext.value} disabled={itemContext.disabled}>
          {textContent}
        </option>
      ),
      [itemContext.disabled, itemContext.value, textContent],
    )

    const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext
    useLayoutEffect(() => {
      onNativeOptionAdd(nativeOption)
      return () => onNativeOptionRemove(nativeOption)
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption])

    return (
      <>
        <Primitive.span
          data-slot="select-item-text"
          id={itemContext.textId}
          dir={context.dir}
          {...itemTextProps}
          ref={composedRefs}
        />

        {/* Portal the select item text into the trigger value node.
           Skip when allowTextPortal is false (content is animating out) to avoid
           duplicating the portal that the fragment copy already provides. */}
        {itemContext.isSelected &&
        context.valueNode &&
        !context.valueNodeHasChildren &&
        contentContext.allowTextPortal !== false
          ? ReactDOM.createPortal(itemTextProps.children, context.valueNode)
          : null}
      </>
    )
  },
)

SelectItemText.displayName = ITEM_TEXT_NAME
