import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { useRovingFocusGroupScope, useToggleGroupContext } from './toggle-group'
import type { IToggleGroup } from './toggle-group.types'

const ITEM_NAME = 'ToggleGroupItem'

type ToggleGroupItemElement = React.ComponentRef<typeof Primitive.button>

const ToggleGroupItem = React.forwardRef<ToggleGroupItemElement, IToggleGroup.IItemProps>(
  (props: IToggleGroup.IScoped<IToggleGroup.IItemProps>, forwardedRef) => {
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

export { ToggleGroupItem }
