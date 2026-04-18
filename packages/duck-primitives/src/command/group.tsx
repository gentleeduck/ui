import * as React from 'react'
import { useId } from '../hooks/use-id'
import { Primitive } from '../primitive-elements'
import { CommandGroupContextProvider, useCommandContext } from './command'
import type { ICommand } from './command.types'

const GROUP_NAME = 'CommandGroup'

type CommandGroupElement = React.ComponentRef<typeof Primitive.div>

export const CommandGroup = React.forwardRef<CommandGroupElement, ICommand.IGroupProps>(
  (props: ICommand.IScoped<ICommand.IGroupProps>, forwardedRef) => {
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
