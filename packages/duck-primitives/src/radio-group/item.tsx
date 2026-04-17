import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { useRadioGroupContext, useRovingFocusGroupScope } from './radio-group'
import type { IRadioGroup } from './radio-group.types'

const ITEM_NAME = 'RadioGroupItem'

const [createRadioGroupItemContext] = createContextScope(ITEM_NAME)

const [RadioGroupItemProvider, useRadioGroupItemContext] =
  createRadioGroupItemContext<IRadioGroup.IItemContext>(ITEM_NAME)

type RadioGroupItemElement = React.ComponentRef<typeof Primitive.button>

const RadioGroupItem = React.forwardRef<RadioGroupItemElement, IRadioGroup.IItemProps>(
  (props: IRadioGroup.IScoped<IRadioGroup.IItemProps>, forwardedRef) => {
    const { __scopeRadioGroup, value, textValue, disabled: disabledProp, ...itemProps } = props
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup)
    const checked = context.value === value
    const disabled = context.disabled || disabledProp || false
    const ref = React.useRef<RadioGroupItemElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    return (
      <RadioGroupItemProvider scope={__scopeRadioGroup as Scope} checked={checked} disabled={disabled}>
        <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!disabled} active={checked}>
          <Primitive.button
            type="button"
            role="radio"
            data-slot="radio-group-item"
            aria-checked={checked}
            data-state={checked ? 'checked' : 'unchecked'}
            data-disabled={disabled ? '' : undefined}
            disabled={disabled}
            dir={context.dir}
            {...itemProps}
            data-value={value}
            data-text-value={textValue}
            ref={composedRefs}
            onClick={composeEventHandlers(props.onClick, () => {
              if (!checked) {
                context.onValueChange(value)
              }
            })}
            onFocus={composeEventHandlers(props.onFocus, () => {
              // When focus moves via keyboard navigation keys, auto-select this item.
              if (context.isNavigationKeyPressedRef.current) {
                context.onValueChange(value)
              }
            })}
          />
        </RovingFocusGroup.Item>
        {context.name && <BubbleInput name={context.name} value={value} checked={checked} disabled={disabled} />}
      </RadioGroupItemProvider>
    )
  },
)

RadioGroupItem.displayName = ITEM_NAME

function BubbleInput(props: IRadioGroup.IBubbleInputProps) {
  const { name, value, checked, disabled } = props
  return (
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      disabled={disabled}
      // Avoid React warning for checked without onChange
      onChange={() => {}}
      tabIndex={-1}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
        margin: 0,
        // Minimum size so it can still be clicked by assistive tech
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
      aria-hidden
    />
  )
}

export { RadioGroupItem, RadioGroupItemProvider, useRadioGroupItemContext }
