import * as React from 'react'
import { useId } from '../hooks/use-id'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { Collection, useCollection, useRovingFocusContext } from './roving-focus'
import { focusFirst, getFocusIntent, wrapArray } from './roving-focus.libs'
import type { IRovingFocus } from './roving-focus.types'

const ITEM_NAME = 'RovingFocusGroupItem'

type RovingFocusItemElement = React.ComponentRef<typeof Primitive.span>

const RovingFocusGroupItem = React.forwardRef<RovingFocusItemElement, IRovingFocus.IItemProps>(
  (props: IRovingFocus.IScoped<IRovingFocus.IItemProps>, forwardedRef) => {
    const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, ...itemProps } = props
    const autoId = useId()
    const id = tabStopId || autoId
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup)
    const isCurrentTabStop = context.currentTabStopId === id
    const getItems = useCollection(__scopeRovingFocusGroup)

    const { onFocusableItemAdd, onFocusableItemRemove } = context

    React.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd()
        return () => onFocusableItemRemove()
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove])

    return (
      <Collection.ItemSlot scope={__scopeRovingFocusGroup} id={id} focusable={focusable} active={active}>
        <Primitive.span
          data-slot="roving-focus-item"
          tabIndex={isCurrentTabStop ? 0 : -1}
          data-orientation={context.orientation}
          {...itemProps}
          ref={forwardedRef}
          onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
            if (!focusable) event.preventDefault()
            else context.onItemFocus(id)
          })}
          onFocus={composeEventHandlers(props.onFocus, () => context.onItemFocus(id))}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            if (event.key === 'Tab' && event.shiftKey) {
              context.onItemShiftTab()
              return
            }

            if (event.target !== event.currentTarget) return

            const focusIntent = getFocusIntent(event, context.orientation, context.dir)
            if (focusIntent !== undefined) {
              if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
              event.preventDefault()

              const items = getItems().filter((item) => item.focusable)
              let candidateNodes: HTMLElement[] = []
              for (const item of items) {
                const node = item.ref.current
                if (node) candidateNodes.push(node)
              }

              if (focusIntent === 'last') {
                candidateNodes.reverse()
              } else if (focusIntent === 'prev' || focusIntent === 'next') {
                if (focusIntent === 'prev') candidateNodes.reverse()
                const currentIndex = candidateNodes.indexOf(event.currentTarget as HTMLElement)
                candidateNodes = context.loop
                  ? wrapArray(candidateNodes, currentIndex + 1)
                  : candidateNodes.slice(currentIndex + 1)
              }

              setTimeout(() => focusFirst(candidateNodes))
            }
          })}
        />
      </Collection.ItemSlot>
    )
  },
)

RovingFocusGroupItem.displayName = ITEM_NAME

export { RovingFocusGroupItem }
