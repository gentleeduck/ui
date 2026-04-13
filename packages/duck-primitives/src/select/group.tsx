import * as React from 'react'
import { useId } from '../hooks/use-id'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, SelectGroupContextProvider, useSelectContext } from './select'

const GROUP_NAME = 'SelectGroup'

type SelectGroupElement = React.ComponentRef<typeof Primitive.div>

export interface ISelectGroupProps extends React.ComponentPropsWithRef<typeof Primitive.div> {}

export const SelectGroup = React.forwardRef<SelectGroupElement, ISelectGroupProps>(
  (props: ScopedProps<ISelectGroupProps>, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props
    const context = useSelectContext(GROUP_NAME, __scopeSelect)
    const groupId = useId()
    return (
      <SelectGroupContextProvider scope={__scopeSelect} id={groupId}>
        <Primitive.div
          data-slot="select-group"
          role="group"
          aria-labelledby={groupId}
          dir={context.dir}
          {...groupProps}
          ref={forwardedRef}
        />
      </SelectGroupContextProvider>
    )
  },
)

SelectGroup.displayName = GROUP_NAME
