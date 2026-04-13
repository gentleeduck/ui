import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCommandContext } from './command'

const SEPARATOR_NAME = 'CommandSeparator'

type CommandSeparatorElement = React.ComponentRef<typeof Primitive.div>

export interface ICommandSeparatorProps extends React.ComponentPropsWithRef<typeof Primitive.div> {}

export const CommandSeparator = React.forwardRef<CommandSeparatorElement, ICommandSeparatorProps>(
  (props: ScopedProps<ICommandSeparatorProps>, forwardedRef) => {
    const { __scopeCommand, ...separatorProps } = props
    const context = useCommandContext(SEPARATOR_NAME, __scopeCommand)

    return (
      <Primitive.div
        data-slot="command-separator"
        role="separator"
        aria-hidden
        dir={context.dir}
        {...separatorProps}
        ref={forwardedRef}
      />
    )
  },
)

CommandSeparator.displayName = SEPARATOR_NAME
