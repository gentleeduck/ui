import * as React from 'react'
import { useControllableState } from '../hooks/use-controllable-state'
import type { Direction } from '../hooks/use-direction'
import { useDirection } from '../hooks/use-direction'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { createRovingFocusGroupScope } from '../roving-focus'

const RADIO_GROUP_NAME = 'RadioGroup'

type ScopedProps<P> = P & { __scopeRadioGroup?: Scope }
const [createRadioGroupContext, createRadioGroupScope] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
])
const useRovingFocusGroupScope = createRovingFocusGroupScope()

type RadioGroupContextValue = {
  value: string
  onValueChange(value: string): void
  disabled: boolean
  required: boolean
  name?: string
  dir: Direction
}

const [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext<RadioGroupContextValue>(RADIO_GROUP_NAME)

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/

type RadioGroupElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>

interface RadioGroupProps extends PrimitiveDivProps {
  /**
   * The controlled value of the checked radio item.
   */
  value?: string
  /**
   * The value of the radio item that should be checked when initially rendered.
   */
  defaultValue?: string
  /**
   * Event handler called when the value changes.
   */
  onValueChange?(value: string): void
  /**
   * Whether the group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group is required in a form.
   * @defaultValue false
   */
  required?: boolean
  /**
   * The name used when submitting an HTML form.
   */
  name?: string
  /**
   * The reading direction.
   */
  dir?: Direction
  /**
   * The orientation of the group for arrow key navigation.
   */
  orientation?: RovingFocusGroupProps['orientation']
  /**
   * Whether keyboard navigation should loop.
   * @defaultValue true
   */
  loop?: RovingFocusGroupProps['loop']
}

const RadioGroup = React.forwardRef<RadioGroupElement, RadioGroupProps>(
  (props: ScopedProps<RadioGroupProps>, forwardedRef) => {
    const {
      __scopeRadioGroup,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      name,
      dir,
      orientation,
      loop = true,
      ...groupProps
    } = props
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup)
    const direction = useDirection(dir)

    const [value = '', setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? '',
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME,
    })

    return (
      <RadioGroupProvider
        scope={__scopeRadioGroup}
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        required={required}
        name={name}
        dir={direction}>
        <RovingFocusGroup.Root asChild {...rovingFocusGroupScope} orientation={orientation} dir={direction} loop={loop}>
          <Primitive.div
            role="radiogroup"
            data-slot="radio-group"
            aria-required={required}
            aria-orientation={orientation}
            data-disabled={disabled ? '' : undefined}
            dir={direction}
            {...groupProps}
            ref={forwardedRef}
          />
        </RovingFocusGroup.Root>
      </RadioGroupProvider>
    )
  },
)

RadioGroup.displayName = RADIO_GROUP_NAME

export {
  RADIO_GROUP_NAME,
  createRadioGroupScope,
  RadioGroupProvider,
  useRadioGroupContext,
  useRovingFocusGroupScope,
  RadioGroup,
}
export type { ScopedProps, RadioGroupProps }
