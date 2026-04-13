import * as React from 'react'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCommandContext, useCommandListContext } from './command'

const EMPTY_NAME = 'CommandEmpty'

type CommandEmptyElement = React.ComponentRef<typeof Primitive.div>

export interface ICommandEmptyProps extends React.ComponentPropsWithRef<typeof Primitive.div> {}

export const CommandEmpty = React.forwardRef<CommandEmptyElement, ICommandEmptyProps>(
  (props: ScopedProps<ICommandEmptyProps>, forwardedRef) => {
    const { __scopeCommand, ...emptyProps } = props
    const context = useCommandContext(EMPTY_NAME, __scopeCommand)
    const listContext = useCommandListContext(EMPTY_NAME, __scopeCommand)
    const composedRef = useComposedRefs(forwardedRef, listContext.emptyRef)

    return (
      <Primitive.div
        data-slot="command-empty"
        role="status"
        aria-live="polite"
        dir={context.dir}
        hidden
        {...emptyProps}
        ref={composedRef}
      />
    )
  },
)

CommandEmpty.displayName = EMPTY_NAME
