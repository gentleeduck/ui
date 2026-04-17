import * as React from 'react'
import { useId } from '../hooks/use-id'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { Collection, CommandItemContextProvider, useCommandContext, useCommandListContext } from './command'
import type { ICommand } from './command.types'

const ITEM_NAME = 'CommandItem'

type CommandItemElement = React.ComponentRef<typeof Primitive.li>

export const CommandItem = React.forwardRef<CommandItemElement, ICommand.IItemProps>(
  (props: ICommand.IScoped<ICommand.IItemProps>, forwardedRef) => {
    const {
      __scopeCommand,
      value = '',
      disabled = false,
      textValue: textValueProp,
      onSelect,
      children,
      ...itemProps
    } = props
    const context = useCommandContext(ITEM_NAME, __scopeCommand)
    const listContext = useCommandListContext(ITEM_NAME, __scopeCommand)
    const [textValue, setTextValue] = React.useState(textValueProp ?? '')
    const textId = useId()
    const itemId = useId()
    const itemRef = React.useRef<HTMLLIElement | null>(null)
    const pointerTypeRef = React.useRef<React.PointerEvent['pointerType']>('touch')

    const composedRefs = useComposedRefs(forwardedRef, itemRef, (node: HTMLLIElement | null) => {
      if (node && !textValueProp) {
        setTextValue((prev) => prev || (node.textContent ?? '').trim())
      }
    })

    const isHighlighted = context.selectedItem !== null && context.selectedItem === itemRef.current

    const handleSelect = () => {
      if (!disabled) {
        onSelect?.(value)
      }
    }

    const itemContextValue = React.useMemo<ICommand.IItemContext>(
      () => ({
        value,
        disabled,
        textId,
        onItemTextChange: (node) => {
          setTextValue((prev) => prev || (node?.textContent ?? '').trim())
        },
      }),
      [value, disabled, textId],
    )

    return (
      <CommandItemContextProvider scope={__scopeCommand} {...itemContextValue}>
        <Collection.ItemSlot scope={__scopeCommand} value={value} disabled={disabled} textValue={textValue}>
          <Primitive.li
            id={itemId}
            data-slot="command-item"
            data-value={value}
            role="option"
            dir={context.dir}
            data-highlighted={isHighlighted ? '' : undefined}
            aria-selected={isHighlighted}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? undefined : -1}
            {...itemProps}
            ref={composedRefs}
            onFocus={composeEventHandlers(itemProps.onFocus, (event) => {
              context.setSelectedItem(event.currentTarget)
            })}
            onBlur={composeEventHandlers(itemProps.onBlur, () => {})}
            onClick={composeEventHandlers(itemProps.onClick, () => {
              if (pointerTypeRef.current !== 'mouse') handleSelect()
            })}
            onPointerUp={composeEventHandlers(itemProps.onPointerUp, () => {
              if (pointerTypeRef.current === 'mouse') handleSelect()
            })}
            onPointerDown={composeEventHandlers(itemProps.onPointerDown, (event) => {
              pointerTypeRef.current = event.pointerType
            })}
            onPointerMove={composeEventHandlers(itemProps.onPointerMove, (event) => {
              pointerTypeRef.current = event.pointerType
              if (disabled) {
                listContext.onItemLeave?.()
              } else if (pointerTypeRef.current === 'mouse') {
                context.setSelectedItem(event.currentTarget)
              }
            })}
            onPointerLeave={composeEventHandlers(itemProps.onPointerLeave, (event) => {
              if (event.currentTarget === document.activeElement) {
                listContext.onItemLeave?.()
              }
            })}
            onKeyDown={composeEventHandlers(itemProps.onKeyDown, (event) => {
              const isTypingAhead = context.typeaheadSearchRef?.current !== ''
              if (isTypingAhead && event.key === ' ') return
              if (event.key === 'Enter' || event.key === ' ') {
                handleSelect()
                if (event.key === ' ') event.preventDefault()
              }
            })}>
            {children}
          </Primitive.li>
        </Collection.ItemSlot>
      </CommandItemContextProvider>
    )
  },
)

CommandItem.displayName = ITEM_NAME
