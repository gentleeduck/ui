import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import * as PopperPrimitive from '../popper'
import { Primitive } from '../primitive-elements'
import { OPEN_KEYS, type ScopedProps, useCollection, usePopperScope, useSelectContext } from './select'
import { shouldShowPlaceholder, useTypeaheadListNavigation } from './select.libs'

const TRIGGER_NAME = 'SelectTrigger'

type SelectTriggerElement = React.ComponentRef<typeof Primitive.button>

export interface ISelectTriggerProps extends React.ComponentPropsWithRef<typeof Primitive.button> {}

export const SelectTrigger = React.forwardRef<SelectTriggerElement, ISelectTriggerProps>(
  (props: ScopedProps<ISelectTriggerProps>, forwardedRef) => {
    const { __scopeSelect, disabled = false, ...triggerProps } = props
    const popperScope = usePopperScope(__scopeSelect)
    const context = useSelectContext(TRIGGER_NAME, __scopeSelect)
    const isDisabled = context.disabled || disabled
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange)
    const getItems = useCollection(__scopeSelect)
    const pointerTypeRef = React.useRef<React.PointerEvent['pointerType']>('touch')

    const [searchRef, handleTypeaheadSearch, resetTypeaheadState] = useTypeaheadListNavigation({
      getItems: () => getItems().filter((item) => !item.disabled),
      getItemElement: (item) => item.ref.current as HTMLElement | null,
      getItemTextValue: (item) => item.textValue || (item.ref.current?.textContent ?? '').trim(),
      getCurrentItem: (items) => items.find((item) => item.value === context.value),
      onMatch: (item) => {
        context.onValueChange(item.value)
      },
    })

    const handleOpen = (pointerEvent?: React.MouseEvent | React.PointerEvent) => {
      if (!isDisabled) {
        context.onOpenChange(true)
        // reset typeahead when we open
        resetTypeaheadState()
      }

      if (pointerEvent) {
        context.triggerPointerDownPosRef.current = {
          x: Math.round(pointerEvent.pageX),
          y: Math.round(pointerEvent.pageY),
        }
      }
    }

    return (
      <PopperPrimitive.Anchor asChild {...popperScope}>
        <Primitive.button
          data-slot="select-trigger"
          type="button"
          role="combobox"
          aria-controls={context.contentId}
          aria-expanded={context.open}
          aria-required={context.required}
          aria-autocomplete="none"
          dir={context.dir}
          data-state={context.open ? 'open' : 'closed'}
          disabled={isDisabled}
          data-disabled={isDisabled ? '' : undefined}
          data-placeholder={shouldShowPlaceholder(context.value) ? '' : undefined}
          {...triggerProps}
          ref={composedRefs}
          onClick={composeEventHandlers(triggerProps.onClick, (event) => {
            event.currentTarget.focus()
            if (pointerTypeRef.current !== 'mouse') {
              handleOpen(event)
            }
          })}
          onPointerDown={composeEventHandlers(triggerProps.onPointerDown, (event) => {
            pointerTypeRef.current = event.pointerType
            const target = event.target as HTMLElement
            if (target.hasPointerCapture(event.pointerId)) {
              target.releasePointerCapture(event.pointerId)
            }
            if (event.button === 0 && event.ctrlKey === false && event.pointerType === 'mouse') {
              handleOpen(event)
              event.preventDefault()
            }
          })}
          onKeyDown={composeEventHandlers(triggerProps.onKeyDown, (event) => {
            const isTypingAhead = searchRef.current !== ''
            const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
            if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key)
            if (isTypingAhead && event.key === ' ') return
            if (OPEN_KEYS.includes(event.key)) {
              handleOpen()
              event.preventDefault()
            }
          })}
        />
      </PopperPrimitive.Anchor>
    )
  },
)

SelectTrigger.displayName = TRIGGER_NAME
