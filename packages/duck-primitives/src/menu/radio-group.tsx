import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { MenuGroup } from './group'
import { createMenuContext } from './menu'
import type { IMenu } from './menu.types'

const RADIO_GROUP_NAME = 'MenuRadioGroup'

type MenuRadioGroupElement = React.ComponentRef<typeof MenuGroup>

const [RadioGroupProvider, useRadioGroupContext] = createMenuContext<IMenu.IRadioGroupProps>(RADIO_GROUP_NAME, {
  value: undefined,
  onValueChange: () => {},
})

const MenuRadioGroup = React.forwardRef<MenuRadioGroupElement, IMenu.IRadioGroupProps>(
  (props: IMenu.IScoped<IMenu.IRadioGroupProps>, forwardedRef) => {
    const { value, onValueChange, ...groupProps } = props
    const handleValueChange = useCallbackRef(onValueChange)
    return (
      <RadioGroupProvider scope={props.__scopeMenu} value={value} onValueChange={handleValueChange}>
        <MenuGroup {...groupProps} ref={forwardedRef} />
      </RadioGroupProvider>
    )
  },
)

MenuRadioGroup.displayName = RADIO_GROUP_NAME

export { MenuRadioGroup, RadioGroupProvider, useRadioGroupContext }
