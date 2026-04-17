import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { IToggle } from './toggle.types'

const TOGGLE_NAME = 'Toggle'

const [createToggleContext, createToggleScope] = createContextScope(TOGGLE_NAME)

const [ToggleProvider, useToggleContext] = createToggleContext<IToggle.IContext>(TOGGLE_NAME)

type ToggleElement = React.ComponentRef<typeof Primitive.button>

const Toggle = React.forwardRef<ToggleElement, IToggle.IProps>(
  (props: IToggle.IScoped<IToggle.IProps>, forwardedRef) => {
    const {
      __scopeToggle,
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      disabled = false,
      dir,
      ...toggleProps
    } = props
    const direction = useDirection(dir)

    const [pressed = false, setPressed] = useControllableState({
      prop: pressedProp,
      onChange: onPressedChange,
      defaultProp: defaultPressed,
      caller: TOGGLE_NAME,
    })

    return (
      <ToggleProvider scope={__scopeToggle} pressed={pressed} disabled={disabled} dir={direction}>
        <Primitive.button
          type="button"
          data-slot="toggle"
          aria-pressed={pressed}
          data-state={pressed ? 'on' : 'off'}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          dir={direction}
          {...toggleProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(props.onClick, () => {
            if (!disabled) {
              setPressed(!pressed)
            }
          })}
        />
      </ToggleProvider>
    )
  },
)

Toggle.displayName = TOGGLE_NAME

export { createToggleScope, TOGGLE_NAME, Toggle, ToggleProvider, useToggleContext }
