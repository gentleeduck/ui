/** MenuRadioGroup component - groups radio menu items for single selection. */
import * as React from 'react'

import { useCallbackRef } from '../hooks/use-callback-ref'
import { MenuGroup, type MenuGroupProps } from './group'
import { createMenuContext, type ScopedProps } from './menu'

const RADIO_GROUP_NAME = 'MenuRadioGroup'

type MenuRadioGroupElement = React.ElementRef<typeof MenuGroup>
interface MenuRadioGroupProps extends MenuGroupProps {
  value?: string
  onValueChange?: (value: string) => void
}

const [RadioGroupProvider, useRadioGroupContext] = createMenuContext<MenuRadioGroupProps>(RADIO_GROUP_NAME, {
  value: undefined,
  onValueChange: () => {},
})

const MenuRadioGroup = React.forwardRef<MenuRadioGroupElement, MenuRadioGroupProps>(
  (props: ScopedProps<MenuRadioGroupProps>, forwardedRef) => {
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
export type { MenuRadioGroupProps, MenuRadioGroupElement }
