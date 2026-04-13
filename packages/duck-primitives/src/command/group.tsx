import * as React from 'react'
import { useId } from '../hooks/use-id'
import { Primitive } from '../primitive-elements'
import { CommandGroupContextProvider, type ScopedProps, useCommandContext } from './command'

const GROUP_NAME = 'CommandGroup'

type CommandGroupElement = React.ComponentRef<typeof Primitive.div>

export interface ICommandGroupProps extends React.ComponentPropsWithRef<typeof Primitive.div> {
  heading?: React.ReactNode
}

export const CommandGroup = React.forwardRef<CommandGroupElement, ICommandGroupProps>(
  (props: ScopedProps<ICommandGroupProps>, forwardedRef) => {
    const { __scopeCommand, heading, children, ...groupProps } = props
    const context = useCommandContext(GROUP_NAME, __scopeCommand)
    const headingId = useId()

    return (
      <CommandGroupContextProvider scope={__scopeCommand} id={headingId}>
        <Primitive.div
          data-slot="command-group"
          role="group"
          dir={context.dir}
          aria-labelledby={heading ? headingId : undefined}
          {...groupProps}
          ref={forwardedRef}>
          {heading && (
            <Primitive.div data-slot="command-group-heading" id={headingId} dir={context.dir}>
              {heading}
            </Primitive.div>
          )}
          {children}
        </Primitive.div>
      </CommandGroupContextProvider>
    )
  },
)

CommandGroup.displayName = GROUP_NAME
