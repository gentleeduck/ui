import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import type { IToggleGroupProps } from './toggle-group'
import { useRovingFocusGroupScope, useToggleGroupContext } from './toggle-group'

const ITEM_NAME = 'ToggleGroupItem'

type ToggleGroupItemElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

interface IToggleGroupItemProps extends PrimitiveButtonProps {
  /**
   * A unique value for this item.
   */
  value: string
}

const ToggleGroupItem = React.forwardRef<ToggleGroupItemElement, IToggleGroupItemProps>(
  (props: IToggleGroupProps.IScoped<IToggleGroupItemProps>, forwardedRef) => {
    const { __scopeToggleGroup, value, disabled: disabledProp, ...itemProps } = props
    const context = useToggleGroupContext(ITEM_NAME, __scopeToggleGroup)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToggleGroup)
    const pressed = context.value.includes(value)
    const disabled = context.disabled || disabledProp || false
    const isSingle = context.type === 'single'

    const commonProps = {
      'data-slot': 'toggle-group-item',
      role: isSingle ? ('radio' as const) : undefined,
      'aria-checked': isSingle ? pressed : undefined,
      'aria-pressed': isSingle ? undefined : pressed,
      'data-state': pressed ? ('on' as const) : ('off' as const),
      'data-disabled': disabled ? ('' as const) : undefined,
      disabled,
      dir: context.dir,
      ...itemProps,
      ref: forwardedRef,
      onClick: composeEventHandlers(props.onClick, () => {
        if (pressed) {
          context.onItemDeactivate(value)
        } else {
          context.onItemActivate(value)
        }
      }),
    }

    return context.rovingFocus ? (
      <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!disabled} active={pressed}>
        <Primitive.button type="button" {...commonProps} />
      </RovingFocusGroup.Item>
    ) : (
      <Primitive.button type="button" tabIndex={disabled ? -1 : 0} {...commonProps} />
    )
  },
)

ToggleGroupItem.displayName = ITEM_NAME

export type { IToggleGroupItemProps }
export { ToggleGroupItem }
