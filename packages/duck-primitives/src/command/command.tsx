'use client'

import * as React from 'react'
import type { IDirection } from '../direction'
import { useDirection } from '../direction'
import { useId } from '../hooks/use-id'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { createCollection } from '../libs/create-collection'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'

const COMMAND_NAME = 'Command'

export type { Scope }
export type ScopedProps<P> = P & { __scopeCommand?: Scope }

type CommandItemData = { value: string; disabled: boolean; textValue: string }

export const [Collection, useCollection, createCollectionScope] = createCollection<HTMLLIElement, CommandItemData>(
  COMMAND_NAME,
)

const [createCommandContext, createCommandScope] = createContextScope(COMMAND_NAME, [createCollectionScope])

export { createCommandScope }

type CommandContextValue = {
  search: string
  onSearchChange: (search: string) => void
  dir: IDirection.Kind
  listId: string
  inputRef: React.RefObject<HTMLInputElement | null>
  typeaheadSearchRef: React.RefObject<string>
  selectedItem: HTMLLIElement | null
  setSelectedItem: (item: HTMLLIElement | null) => void
  selectedValue: string | null
  selectedText: string | null
  shouldFilter: boolean
}

export const [CommandProvider, useCommandContext] = createCommandContext<CommandContextValue>(COMMAND_NAME)

export type CommandListContextValue = {
  onItemLeave?: () => void
  listRef: React.RefObject<HTMLUListElement | null>
  emptyRef: React.RefObject<HTMLDivElement | null>
}

const LIST_CONTEXT_NAME = 'CommandList'
const defaultListContext: CommandListContextValue = {
  onItemLeave: undefined,
  listRef: { current: null },
  emptyRef: { current: null },
}
export const [CommandListProvider, useCommandListContext] = createCommandContext<CommandListContextValue>(
  LIST_CONTEXT_NAME,
  defaultListContext,
)

export type CommandItemContextValue = {
  value: string
  disabled: boolean
  textId: string
  onItemTextChange(node: HTMLElement | null): void
}

const ITEM_CONTEXT_NAME = 'CommandItem'
export const [CommandItemContextProvider, useCommandItemContext] =
  createCommandContext<CommandItemContextValue>(ITEM_CONTEXT_NAME)

type CommandGroupContextValue = { id: string }

const GROUP_CONTEXT_NAME = 'CommandGroup'
export const [CommandGroupContextProvider, useCommandGroupContext] =
  createCommandContext<CommandGroupContextValue>(GROUP_CONTEXT_NAME)

type CommandElement = React.ComponentRef<typeof Primitive.div>

export interface ICommandProps extends React.ComponentPropsWithRef<typeof Primitive.div> {
  dir?: IDirection.Kind
  shouldFilter?: boolean
}

export const Command = React.forwardRef<CommandElement, ICommandProps>(
  (props: ScopedProps<ICommandProps>, forwardedRef) => {
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

const CommandInner = React.forwardRef<CommandElement, ScopedProps<React.ComponentPropsWithRef<typeof Primitive.div>>>(
  (props, forwardedRef) => {
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
          // biome-ignore lint/style/noNonNullAssertion: collection item refs are always mounted when the command is rendered
          const nodes = enabledItems.map((item) => item.ref.current!).filter(Boolean)

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
            if (nodes.length > 0) {
              // biome-ignore lint/style/noNonNullAssertion: guarded by nodes.length > 0 check above
              context.setSelectedItem(nodes[0]!)
              nodes[0]?.scrollIntoView({ block: 'nearest' })
            }
            return
          }

          if (event.key === 'End') {
            event.preventDefault()
            if (nodes.length > 0) {
              // biome-ignore lint/style/noNonNullAssertion: guarded by nodes.length > 0 check above
              const last = nodes[nodes.length - 1]!
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
  },
)

CommandInner.displayName = 'CommandInner'
