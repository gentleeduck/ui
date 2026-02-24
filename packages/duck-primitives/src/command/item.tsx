import * as React from 'react'
import { useId } from '../hooks/use-id'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import {
  Collection,
  CommandItemContextProvider,
  type CommandItemContextValue,
  type ScopedProps,
  useCommandContext,
  useCommandListContext,
} from './command'

const ITEM_NAME = 'CommandItem'

type CommandItemElement = React.ComponentRef<typeof Primitive.li>

export interface CommandItemProps extends Omit<React.ComponentPropsWithRef<typeof Primitive.li>, 'onSelect'> {
  value?: string
  disabled?: boolean
  textValue?: string
  onSelect?: (value: string) => void
}

export const CommandItem = React.forwardRef<CommandItemElement, CommandItemProps>(
  (props: ScopedProps<CommandItemProps>, forwardedRef) => {
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
    const [isFocused, setIsFocused] = React.useState(false)
    const [textValue, setTextValue] = React.useState(textValueProp ?? '')
    const textId = useId()
    const pointerTypeRef = React.useRef<React.PointerEvent['pointerType']>('touch')

    // Read text content from DOM via ref callback (like SelectItem's onItemTextChange)
    const composedRefs = useComposedRefs(forwardedRef, (node: HTMLLIElement | null) => {
      if (node && !textValueProp) {
        setTextValue((prev) => prev || (node.textContent ?? '').trim())
      }
    })

    const handleSelect = () => {
      if (!disabled) {
        onSelect?.(value)
      }
    }

    const itemContextValue = React.useMemo<CommandItemContextValue>(
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
            data-slot="command-item"
            role="option"
            dir={context.dir}
            data-highlighted={isFocused ? '' : undefined}
            aria-selected={isFocused}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? undefined : -1}
            {...itemProps}
            ref={composedRefs}
            onFocus={composeEventHandlers(itemProps.onFocus, () => setIsFocused(true))}
            onBlur={composeEventHandlers(itemProps.onBlur, () => setIsFocused(false))}
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
                event.currentTarget.focus({ preventScroll: true })
              }
            })}
            onPointerLeave={composeEventHandlers(itemProps.onPointerLeave, (event) => {
              if (event.currentTarget === document.activeElement) {
                listContext.onItemLeave?.()
              }
            })}
            onKeyDown={composeEventHandlers(itemProps.onKeyDown, (event) => {
              // Block space selection during typeahead (same as Select's item pattern)
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
