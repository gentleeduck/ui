import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useId } from '../hooks/use-id'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import type { SelectItemContextValue } from './select'
import {
  Collection,
  type ScopedProps,
  SELECTION_KEYS,
  SelectItemContextProvider,
  useSelectContentContext,
  useSelectContext,
  useSelectItemContext,
  useSelectNativeOptionsContext,
} from './select'

const ITEM_NAME = 'SelectItem'

type SelectItemElement = React.ComponentRef<typeof Primitive.div>

export interface SelectItemProps extends React.ComponentPropsWithRef<typeof Primitive.div> {
  value: string
  disabled?: boolean
  textValue?: string
}

export const SelectItem = React.forwardRef<SelectItemElement, ScopedProps<SelectItemProps>>((props, forwardedRef) => {
  const { __scopeSelect, value, disabled = false, textValue: textValueProp, ...itemProps } = props
  const context = useSelectContext(ITEM_NAME, __scopeSelect)
  const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect)
  const isSelected = context.value === value
  const [textValue, setTextValue] = React.useState(textValueProp ?? '')
  const [isFocused, setIsFocused] = React.useState(false)
  const composedRefs = useComposedRefs(forwardedRef, (node: HTMLDivElement | null) =>
    contentContext.itemRefCallback?.(node, value, disabled),
  )
  const textId = useId()
  const pointerTypeRef = React.useRef<React.PointerEvent['pointerType']>('touch')

  const handleSelect = () => {
    if (!disabled) {
      context.onValueChange(value)
      context.onOpenChange(false)
    }
  }

  if (value === '') {
    throw new Error(
      'A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.',
    )
  }

  const itemContextValue = React.useMemo<SelectItemContextValue>(
    () => ({
      value,
      disabled,
      textId,
      isSelected,
      onItemTextChange: (node) => {
        setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? '').trim())
      },
    }),
    [value, disabled, textId, isSelected],
  )

  return (
    <SelectItemContextProvider scope={__scopeSelect} {...itemContextValue}>
      <Collection.ItemSlot scope={__scopeSelect} value={value} disabled={disabled} textValue={textValue}>
        <Primitive.div
          role="option"
          aria-labelledby={textId}
          dir={context.dir}
          data-highlighted={isFocused ? '' : undefined}
          // `isFocused` caveat fixes stuttering in VoiceOver
          aria-selected={isSelected && isFocused}
          data-state={isSelected ? 'checked' : 'unchecked'}
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? '' : undefined}
          tabIndex={disabled ? undefined : -1}
          {...itemProps}
          ref={composedRefs}
          onFocus={composeEventHandlers(itemProps.onFocus, () => setIsFocused(true))}
          onBlur={composeEventHandlers(itemProps.onBlur, () => setIsFocused(false))}
          onClick={composeEventHandlers(itemProps.onClick, () => {
            // Open on click when using a touch or pen device
            if (pointerTypeRef.current !== 'mouse') handleSelect()
          })}
          onPointerUp={composeEventHandlers(itemProps.onPointerUp, () => {
            // Using a mouse you should be able to do pointer down, move through
            // the list, and release the pointer over the item to select it.
            if (pointerTypeRef.current === 'mouse') handleSelect()
          })}
          onPointerDown={composeEventHandlers(itemProps.onPointerDown, (event) => {
            pointerTypeRef.current = event.pointerType
          })}
          onPointerMove={composeEventHandlers(itemProps.onPointerMove, (event) => {
            // Remember pointer type when sliding over to this item from another one
            pointerTypeRef.current = event.pointerType
            if (disabled) {
              contentContext.onItemLeave?.()
            } else if (pointerTypeRef.current === 'mouse') {
              event.currentTarget.focus({ preventScroll: true })
            }
          })}
          onPointerLeave={composeEventHandlers(itemProps.onPointerLeave, (event) => {
            if (event.currentTarget === document.activeElement) {
              contentContext.onItemLeave?.()
            }
          })}
          onKeyDown={composeEventHandlers(itemProps.onKeyDown, (event) => {
            const isTypingAhead = contentContext.searchRef?.current !== ''
            if (isTypingAhead && event.key === ' ') return
            if (SELECTION_KEYS.includes(event.key)) handleSelect()
            // prevent page scroll if using the space key to select an item
            if (event.key === ' ') event.preventDefault()
          })}
        />
      </Collection.ItemSlot>
    </SelectItemContextProvider>
  )
})

SelectItem.displayName = ITEM_NAME
const ITEM_TEXT_NAME = 'SelectItemText'

type SelectItemTextElement = React.ComponentRef<typeof Primitive.span>

export interface SelectItemTextProps extends React.ComponentPropsWithRef<typeof Primitive.span> {}

export const SelectItemText = React.forwardRef<SelectItemTextElement, ScopedProps<SelectItemTextProps>>(
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
        <Primitive.span id={itemContext.textId} dir={context.dir} {...itemTextProps} ref={composedRefs} />

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
const ITEM_INDICATOR_NAME = 'SelectItemIndicator'

type SelectItemIndicatorElement = React.ComponentRef<typeof Primitive.span>

export interface SelectItemIndicatorProps extends React.ComponentPropsWithRef<typeof Primitive.span> {}

export const SelectItemIndicator = React.forwardRef<SelectItemIndicatorElement, ScopedProps<SelectItemIndicatorProps>>(
  (props, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props
    const context = useSelectContext(ITEM_INDICATOR_NAME, __scopeSelect)
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect)
    return itemContext.isSelected ? (
      <Primitive.span aria-hidden dir={context.dir} {...itemIndicatorProps} ref={forwardedRef} />
    ) : null
  },
)

SelectItemIndicator.displayName = ITEM_INDICATOR_NAME
