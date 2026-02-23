import * as React from 'react'
import { useId } from '../hooks/use-id'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, SelectGroupContextProvider } from './select'

const GROUP_NAME = 'SelectGroup'

type SelectGroupElement = React.ComponentRef<typeof Primitive.div>

export interface SelectGroupProps extends React.ComponentPropsWithRef<typeof Primitive.div> {}

export const SelectGroup = React.forwardRef<SelectGroupElement, SelectGroupProps>(
  (props: ScopedProps<SelectGroupProps>, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props
    const groupId = useId()
    return (
      <SelectGroupContextProvider scope={__scopeSelect} id={groupId}>
        <Primitive.div role="group" aria-labelledby={groupId} {...groupProps} ref={forwardedRef} />
      </SelectGroupContextProvider>
    )
  },
)

SelectGroup.displayName = GROUP_NAME
