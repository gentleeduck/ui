import * as React from 'react'
import type { IDirection } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { composeEventHandlers } from '../libs/compose-event-handler'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'

const TOGGLE_NAME = 'Toggle'

type ScopedProps<P> = P & { __scopeToggle?: Scope }
const [createToggleContext, createToggleScope] = createContextScope(TOGGLE_NAME)

type ToggleContextValue = {
  pressed: boolean
  disabled: boolean
  dir: IDirection.Kind
}

const [ToggleProvider, useToggleContext] = createToggleContext<ToggleContextValue>(TOGGLE_NAME)

type ToggleElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

interface IToggleProps extends PrimitiveButtonProps {
  /**
   * The controlled pressed state of the toggle.
   */
  pressed?: boolean
  /**
   * The pressed state when initially rendered. Use when you do not need to control the state.
   */
  defaultPressed?: boolean
  /**
   * Event handler called when the pressed state changes.
   */
  onPressedChange?(pressed: boolean): void
  /**
   * The reading direction.
   */
  dir?: IDirection.Kind
}

const Toggle = React.forwardRef<ToggleElement, IToggleProps>((props: ScopedProps<IToggleProps>, forwardedRef) => {
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
})

Toggle.displayName = TOGGLE_NAME

export type { IToggleProps, ScopedProps, ToggleContextValue }
export { createToggleScope, TOGGLE_NAME, Toggle, ToggleProvider, useToggleContext }
