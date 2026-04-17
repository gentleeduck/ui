'use client'

import * as React from 'react'
import { useDirection } from '../direction'
import { useId } from '../hooks/use-id'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { createCollection } from '../libs/create-collection'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { ICommand } from './command.types'

const COMMAND_NAME = 'Command'

export const [Collection, useCollection, createCollectionScope] = createCollection<HTMLLIElement, ICommand.IItemData>(
  COMMAND_NAME,
)

const [createCommandContext, createCommandScope] = createContextScope(COMMAND_NAME, [createCollectionScope])

export { createCommandScope }

export const [CommandProvider, useCommandContext] = createCommandContext<ICommand.IContext>(COMMAND_NAME)

const LIST_CONTEXT_NAME = 'CommandList'
const defaultListContext: ICommand.IListContext = {
  onItemLeave: undefined,
  listRef: { current: null },
  emptyRef: { current: null },
}
export const [CommandListProvider, useCommandListContext] = createCommandContext<ICommand.IListContext>(
  LIST_CONTEXT_NAME,
  defaultListContext,
)

const ITEM_CONTEXT_NAME = 'CommandItem'
export const [CommandItemContextProvider, useCommandItemContext] =
  createCommandContext<ICommand.IItemContext>(ITEM_CONTEXT_NAME)

const GROUP_CONTEXT_NAME = 'CommandGroup'
export const [CommandGroupContextProvider, useCommandGroupContext] =
  createCommandContext<ICommand.IGroupContext>(GROUP_CONTEXT_NAME)

type CommandElement = React.ComponentRef<typeof Primitive.div>

export const Command = React.forwardRef<CommandElement, ICommand.IProps>(
  (props: ICommand.IScoped<ICommand.IProps>, forwardedRef) => {
    const { __scopeCommand, dir: dirProp, shouldFilter = true, children, ...commandProps } = props

    const direction = useDirection(dirProp)
    const listId = useId()
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const typeaheadSearchRef = React.useRef('')
    const [search, setSearch] = React.useState('')
    const [selectedItem, setSelectedItem] = React.useState<HTMLLIElement | null>(null)
    const selectedValue = selectedItem?.getAttribute('data-value') ?? null
    const selectedText = selectedItem?.textContent?.trim() ?? null

    return (
      <CommandProvider
        scope={__scopeCommand}
        search={search}
        onSearchChange={setSearch}
        dir={direction}
        listId={listId}
        inputRef={inputRef}
        typeaheadSearchRef={typeaheadSearchRef}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        selectedValue={selectedValue}
        selectedText={selectedText}
        shouldFilter={shouldFilter}>
        <Collection.Provider scope={__scopeCommand}>
          <CommandInner __scopeCommand={__scopeCommand} {...commandProps} ref={forwardedRef}>
            {children}
          </CommandInner>
        </Collection.Provider>
      </CommandProvider>
    )
  },
)

Command.displayName = COMMAND_NAME

const CommandInner = React.forwardRef<
  CommandElement,
  ICommand.IScoped<React.ComponentPropsWithRef<typeof Primitive.div>>
>((props, forwardedRef) => {
  const { __scopeCommand, children, ...commandProps } = props
  const context = useCommandContext(COMMAND_NAME, __scopeCommand)
  const getItems = useCollection(__scopeCommand)

  return (
    <Primitive.div
      data-slot="command"
      dir={context.dir}
      {...commandProps}
      ref={forwardedRef}
      onKeyDown={composeEventHandlers((commandProps as React.HTMLAttributes<HTMLDivElement>).onKeyDown, (event) => {
        if (event.key === 'Tab') {
          event.preventDefault()
          return
        }

        const enabledItems = getItems().filter((item) => !item.disabled && !item.ref.current?.hidden)
        const nodes: HTMLLIElement[] = []
        for (const item of enabledItems) {
          const node = item.ref.current
          if (node) nodes.push(node)
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          if (nodes.length === 0) return
          const currentIndex = context.selectedItem ? nodes.indexOf(context.selectedItem) : -1
          const nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, nodes.length - 1)
          const next = nodes[nextIndex]
          if (next) {
            context.setSelectedItem(next)
            next.scrollIntoView({ block: 'nearest' })
          }
          return
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault()
          if (nodes.length === 0) return
          const currentIndex = context.selectedItem ? nodes.indexOf(context.selectedItem) : nodes.length
          const prevIndex = Math.max(currentIndex - 1, 0)
          const prev = nodes[prevIndex]
          if (prev) {
            context.setSelectedItem(prev)
            prev.scrollIntoView({ block: 'nearest' })
          }
          return
        }

        if (event.key === 'Home') {
          event.preventDefault()
          const first = nodes[0]
          if (first) {
            context.setSelectedItem(first)
            first.scrollIntoView({ block: 'nearest' })
          }
          return
        }

        if (event.key === 'End') {
          event.preventDefault()
          const last = nodes[nodes.length - 1]
          if (last) {
            context.setSelectedItem(last)
            last.scrollIntoView({ block: 'nearest' })
          }
          return
        }

        if (event.key === 'Enter' && context.selectedItem) {
          event.preventDefault()
          context.selectedItem.click()
          return
        }
      })}>
      {children}
    </Primitive.div>
  )
})

CommandInner.displayName = 'CommandInner'
