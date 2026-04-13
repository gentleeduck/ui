/** MenuRadioGroup component - groups radio menu items for single selection. */
import * as React from 'react'

import { useCallbackRef } from '../hooks/use-callback-ref'
import { type IMenuGroupProps, MenuGroup } from './group'
import { createMenuContext, type ScopedProps } from './menu'

const RADIO_GROUP_NAME = 'MenuRadioGroup'

type MenuRadioGroupElement = React.ComponentRef<typeof MenuGroup>
interface IMenuRadioGroupProps extends IMenuGroupProps {
  value?: string
  onValueChange?: (value: string) => void
}

const [RadioGroupProvider, useRadioGroupContext] = createMenuContext<IMenuRadioGroupProps>(RADIO_GROUP_NAME, {
  value: undefined,
  onValueChange: () => {},
})

const MenuRadioGroup = React.forwardRef<MenuRadioGroupElement, IMenuRadioGroupProps>(
  (props: ScopedProps<IMenuRadioGroupProps>, forwardedRef) => {
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

export type { IMenuRadioGroupProps, MenuRadioGroupElement }
export { MenuRadioGroup, RadioGroupProvider, useRadioGroupContext }
