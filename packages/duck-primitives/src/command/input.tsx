import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { useCommandContext } from './command'
import type { ICommand } from './command.types'

const INPUT_NAME = 'CommandInput'

type CommandInputElement = React.ComponentRef<typeof Primitive.input>

export const CommandInput = React.forwardRef<CommandInputElement, ICommand.IInputProps>(
  (props: ICommand.IScoped<ICommand.IInputProps>, forwardedRef) => {
    const { __scopeCommand, ...inputProps } = props
    const context = useCommandContext(INPUT_NAME, __scopeCommand)
    const composedRef = useComposedRefs(forwardedRef, context.inputRef)

    return (
      <Primitive.input
        data-slot="command-input"
        role="combobox"
        dir={context.dir}
        aria-expanded="true"
        aria-controls={context.listId}
        aria-autocomplete="list"
        {...inputProps}
        ref={composedRef}
        onChange={composeEventHandlers(inputProps.onChange, (e: React.ChangeEvent<HTMLInputElement>) => {
          context.onSearchChange(e.target.value)
        })}
      />
    )
  },
)

CommandInput.displayName = INPUT_NAME
