import * as React from 'react'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { Collection, CommandListProvider, useCollection, useCommandContext } from './command'
import type { ICommand } from './command.types'

const LIST_NAME = 'CommandList'

type CommandListElement = React.ComponentRef<typeof Primitive.ul>

export const CommandList = React.forwardRef<CommandListElement, ICommand.IListProps>(
  (props: ICommand.IScoped<ICommand.IListProps>, forwardedRef) => {
    const { __scopeCommand, ...listProps } = props
    const context = useCommandContext(LIST_NAME, __scopeCommand)
    const getItems = useCollection(__scopeCommand)
    const listRef = React.useRef<HTMLUListElement | null>(null)
    const emptyRef = React.useRef<HTMLDivElement | null>(null)
    const composedRef = useComposedRefs(forwardedRef, listRef)

    const handleItemLeave = React.useCallback(() => {
      context.setSelectedItem(null)
      context.inputRef.current?.focus({ preventScroll: true })
    }, [context.inputRef, context.setSelectedItem])

    // skip when shouldFilter is false so consumers can apply their own filtering
    React.useEffect(() => {
      if (!context.shouldFilter) return

      const items = getItems()
      if (items.length === 0) return

      let hiddenCount = 0

      for (const item of items) {
        const el = item.ref.current
        if (!el) continue
        const text = item.textValue || el.textContent || ''
        if (context.search && !text.toLowerCase().includes(context.search.toLowerCase())) {
          el.hidden = true
          hiddenCount++
        } else {
          el.hidden = false
        }
      }

      const firstVisible = items.find((i) => !i.ref.current?.hidden)
      context.setSelectedItem(firstVisible?.ref.current ?? null)

      if (emptyRef.current) {
        emptyRef.current.hidden = hiddenCount < items.length
      }

      // hide groups (and their trailing separator) that have no visible items
      if (listRef.current) {
        const groups = listRef.current.querySelectorAll('[data-slot="command-group"]')
        for (let i = 0; i < groups.length; i++) {
          const group = groups[i] as HTMLElement
          const visibleItems = group.querySelectorAll('[data-slot="command-item"]:not([hidden])')
          const nextSep = group.nextElementSibling
          const hasSep = nextSep?.getAttribute('data-slot') === 'command-separator'

          if (visibleItems.length === 0) {
            group.hidden = true
            if (hasSep && nextSep) (nextSep as HTMLElement).hidden = true
          } else {
            group.hidden = false
            if (hasSep && nextSep) (nextSep as HTMLElement).hidden = false
          }
        }
      }
    }, [context.search, context.shouldFilter, getItems, context.setSelectedItem])

    return (
      <CommandListProvider scope={__scopeCommand} onItemLeave={handleItemLeave} listRef={listRef} emptyRef={emptyRef}>
        <Collection.Slot scope={__scopeCommand}>
          <Primitive.ul
            data-slot="command-list"
            role="listbox"
            id={context.listId}
            dir={context.dir}
            {...listProps}
            ref={composedRef}
          />
        </Collection.Slot>
      </CommandListProvider>
    )
  },
)

CommandList.displayName = LIST_NAME
