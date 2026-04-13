import * as React from 'react'
import { useId } from '../hooks/use-id'
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
} from './select'

const ITEM_NAME = 'SelectItem'

type SelectItemElement = React.ComponentRef<typeof Primitive.div>

export interface ISelectItemProps extends React.ComponentPropsWithRef<typeof Primitive.div> {
  value: string
  disabled?: boolean
  textValue?: string
}

export const SelectItem = React.forwardRef<SelectItemElement, ScopedProps<ISelectItemProps>>((props, forwardedRef) => {
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
          data-slot="select-item"
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
