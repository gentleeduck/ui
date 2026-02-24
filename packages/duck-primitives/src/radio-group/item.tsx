import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import type { ScopedProps } from './radio-group'
import { RADIO_GROUP_NAME, useRadioGroupContext, useRovingFocusGroupScope } from './radio-group'

const ITEM_NAME = 'RadioGroupItem'

const [createRadioGroupItemContext] = createContextScope(ITEM_NAME)

type RadioGroupItemContextValue = {
  checked: boolean
  disabled: boolean
}

const [RadioGroupItemProvider, useRadioGroupItemContext] =
  createRadioGroupItemContext<RadioGroupItemContextValue>(ITEM_NAME)

type RadioGroupItemElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

interface RadioGroupItemProps extends PrimitiveButtonProps {
  /**
   * The unique value for this radio item.
   */
  value: string
}

const RadioGroupItem = React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
  (props: ScopedProps<RadioGroupItemProps>, forwardedRef) => {
    const { __scopeRadioGroup, value, disabled: disabledProp, ...itemProps } = props
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup)
    const checked = context.value === value
    const disabled = context.disabled || disabledProp || false
    const ref = React.useRef<RadioGroupItemElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const isArrowKeyPressedRef = React.useRef(false)

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          isArrowKeyPressedRef.current = true
        }
      }
      const handleKeyUp = () => {
        isArrowKeyPressedRef.current = false
      }
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
      }
    }, [])

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
            ref={composedRefs}
            onClick={composeEventHandlers(props.onClick, () => {
              if (!checked) {
                context.onValueChange(value)
              }
            })}
            onFocus={composeEventHandlers(props.onFocus, () => {
              // When focus moves via arrow keys, auto-select this item
              if (isArrowKeyPressedRef.current) {
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

/* -------------------------------------------------------------------------------------------------
 * BubbleInput -- hidden native radio input for form submission
 * -----------------------------------------------------------------------------------------------*/

interface BubbleInputProps {
  name: string
  value: string
  checked: boolean
  disabled: boolean
}

function BubbleInput(props: BubbleInputProps) {
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
export type { RadioGroupItemProps }
