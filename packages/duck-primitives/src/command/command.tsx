'use client'

import * as React from 'react'
import type { Direction } from '../hooks/use-direction'
import { useDirection } from '../hooks/use-direction'
import { useId } from '../hooks/use-id'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { createCollection } from '../libs/create-collection'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import {
  focusFirst,
  getNavigationCandidates,
  NAVIGATION_KEYS,
  useTypeaheadListNavigation,
  useVimNavigation,
} from '../libs/list-navigation'
import { Primitive } from '../primitive-elements'

const COMMAND_NAME = 'Command'

export type { Scope }
export type ScopedProps<P> = P & { __scopeCommand?: Scope }

/* -------------------------------------------------------------------------------------------------
 * Collection (same pattern as Select -- select.tsx:24-26)
 * -----------------------------------------------------------------------------------------------*/

type CommandItemData = { value: string; disabled: boolean; textValue: string }

export const [Collection, useCollection, createCollectionScope] = createCollection<HTMLLIElement, CommandItemData>(
  COMMAND_NAME,
)

/* -------------------------------------------------------------------------------------------------
 * Scope chain (same pattern as Select -- select.tsx:29-31)
 * -----------------------------------------------------------------------------------------------*/

const [createCommandContext, createCommandScope] = createContextScope(COMMAND_NAME, [createCollectionScope])
export { createCommandScope }

/* -------------------------------------------------------------------------------------------------
 * CommandContext -- root state (like SelectProvider)
 * -----------------------------------------------------------------------------------------------*/

type CommandContextValue = {
  search: string
  onSearchChange: (search: string) => void
  dir: Direction
  listId: string
  inputRef: React.RefObject<HTMLInputElement | null>
  typeaheadSearchRef: React.RefObject<string>
}

export const [CommandProvider, useCommandContext] = createCommandContext<CommandContextValue>(COMMAND_NAME)

/* -------------------------------------------------------------------------------------------------
 * CommandListContext -- list/content state (like SelectContentProvider)
 * -----------------------------------------------------------------------------------------------*/

export type CommandListContextValue = {
  onItemLeave?: () => void
  listRef: React.RefObject<HTMLUListElement | null>
  emptyRef: React.RefObject<HTMLDivElement | null>
  selectedItem: HTMLLIElement | null
}

const LIST_CONTEXT_NAME = 'CommandList'
export const [CommandListProvider, useCommandListContext] =
  createCommandContext<CommandListContextValue>(LIST_CONTEXT_NAME)

/* -------------------------------------------------------------------------------------------------
 * CommandItemContext -- per-item state (like SelectItemContextProvider)
 * -----------------------------------------------------------------------------------------------*/

export type CommandItemContextValue = {
  value: string
  disabled: boolean
  textId: string
  onItemTextChange(node: HTMLElement | null): void
}

const ITEM_CONTEXT_NAME = 'CommandItem'
export const [CommandItemContextProvider, useCommandItemContext] =
  createCommandContext<CommandItemContextValue>(ITEM_CONTEXT_NAME)

/* -------------------------------------------------------------------------------------------------
 * CommandGroupContext -- per-group state (like SelectGroupContextProvider)
 * -----------------------------------------------------------------------------------------------*/

type CommandGroupContextValue = { id: string }

const GROUP_CONTEXT_NAME = 'CommandGroup'
export const [CommandGroupContextProvider, useCommandGroupContext] =
  createCommandContext<CommandGroupContextValue>(GROUP_CONTEXT_NAME)

/* -------------------------------------------------------------------------------------------------
 * Command root
 * -----------------------------------------------------------------------------------------------*/

type CommandElement = React.ComponentRef<typeof Primitive.div>

export interface CommandProps extends React.ComponentPropsWithRef<typeof Primitive.div> {
  dir?: Direction
}

export const Command = React.forwardRef<CommandElement, CommandProps>(
  (props: ScopedProps<CommandProps>, forwardedRef) => {
    const { __scopeCommand, dir: dirProp, children, ...commandProps } = props

    const direction = useDirection(dirProp)
    const listId = useId()
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const typeaheadSearchRef = React.useRef('')
    const [search, setSearch] = React.useState('')

    return (
      <CommandProvider
        scope={__scopeCommand}
        search={search}
        onSearchChange={setSearch}
        dir={direction}
        listId={listId}
        inputRef={inputRef}
        typeaheadSearchRef={typeaheadSearchRef}>
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

/* -------------------------------------------------------------------------------------------------
 * CommandInner -- sits inside Collection.Provider so it can consume useCollection
 *                 and handle keyboard navigation + typeahead on the root div.
 * -----------------------------------------------------------------------------------------------*/

const CommandInner = React.forwardRef<CommandElement, ScopedProps<React.ComponentPropsWithRef<typeof Primitive.div>>>(
  (props, forwardedRef) => {
    const { __scopeCommand, children, ...commandProps } = props
    const context = useCommandContext(COMMAND_NAME, __scopeCommand)
    const getItems = useCollection(__scopeCommand)

    const [, handleTypeaheadSearch, resetTypeaheadState] = useTypeaheadListNavigation({
      getItems: () => getItems().filter((item) => !item.disabled && !item.ref.current?.hidden),
      getItemElement: (item) => item.ref.current as HTMLElement | null,
      getItemTextValue: (item) => item.textValue || (item.ref.current?.textContent ?? '').trim(),
      onMatch: (item) => {
        const node = item.ref.current as HTMLElement | null
        if (node) setTimeout(() => node.focus())
      },
      externalSearchRef: context.typeaheadSearchRef,
    })

    const handleVimKey = useVimNavigation({ onNavigate: resetTypeaheadState })

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

          const inputFocused = document.activeElement === context.inputRef.current

          // When the input has focus, only ArrowDown navigates to items.
          // All other keys (Home, End, ArrowUp, printable chars) are left to native input.
          if (inputFocused) {
            if (event.key === 'ArrowDown') {
              const items = getItems().filter((item) => !item.disabled && !item.ref.current?.hidden)
              if (items.length > 0) {
                event.preventDefault()
                const nodes = items.map((item) => item.ref.current!)
                setTimeout(() => focusFirst(nodes))
              }
            }
            return
          }

          // From here, an item is focused.

          // Vim keybindings (gg -> top, G -> bottom). Checked before typeahead
          // so Shift+G is not sent to typeahead search.
          const enabledItems = getItems().filter((item) => !item.disabled && !item.ref.current?.hidden)
          const nodes = enabledItems.map((item) => item.ref.current!)
          if (handleVimKey(event, nodes)) return

          // Typeahead: printable char including space (same as Select's content.tsx).
          // Runs before nav so space can join an active typeahead search.
          // Item's onKeyDown fires first (bubbling), so it checks isTypingAhead
          // before this handler adds the char to the search string.
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
          if (!isModifierKey && event.key.length === 1) {
            handleTypeaheadSearch(event.key)
          }

          if ((NAVIGATION_KEYS as readonly string[]).includes(event.key)) {
            const candidateNodes = getNavigationCandidates(nodes, event.key, document.activeElement)

            // At boundary (first/last item), stay put
            if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && candidateNodes.length === 0) {
              event.preventDefault()
              return
            }

            event.preventDefault()
            setTimeout(() => focusFirst(candidateNodes))
            return
          }
        })}>
        {children}
      </Primitive.div>
    )
  },
)

CommandInner.displayName = 'CommandInner'
