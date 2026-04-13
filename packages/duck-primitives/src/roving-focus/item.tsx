/** RovingFocusGroupItem - an item within a roving focus group. */
import * as React from 'react'
import { useId } from '../hooks/use-id'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { Collection, type ScopedProps, useCollection, useRovingFocusContext } from './roving-focus'
import { focusFirst, getFocusIntent, wrapArray } from './roving-focus.libs'

const ITEM_NAME = 'RovingFocusGroupItem'

type RovingFocusItemElement = React.ComponentRef<typeof Primitive.span>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>
interface IRovingFocusGroupItemProps extends PrimitiveSpanProps {
  tabStopId?: string
  focusable?: boolean
  active?: boolean
}

const RovingFocusGroupItem = React.forwardRef<RovingFocusItemElement, IRovingFocusGroupItemProps>(
  (props: ScopedProps<IRovingFocusGroupItemProps>, forwardedRef) => {
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
            // We prevent focusing non-focusable items on mousedown.
            // Even though the item has tabIndex={-1}, that only means take it
            // out of the tab order.
            if (!focusable) event.preventDefault()
            // Safari does not focus a button when clicked so we run our logic
            // on mousedown also
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
              // biome-ignore lint/style/noNonNullAssertion: focusable items always have mounted refs within the roving focus group
              let candidateNodes = items.map((item) => item.ref.current!)

              if (focusIntent === 'last') {
                candidateNodes.reverse()
              } else if (focusIntent === 'prev' || focusIntent === 'next') {
                if (focusIntent === 'prev') candidateNodes.reverse()
                const currentIndex = candidateNodes.indexOf(event.currentTarget as HTMLElement)
                candidateNodes = context.loop
                  ? wrapArray(candidateNodes, currentIndex + 1)
                  : candidateNodes.slice(currentIndex + 1)
              }

              // setTimeout here because changing focus inside keydown would be stopped
              setTimeout(() => focusFirst(candidateNodes))
            }
          })}
        />
      </Collection.ItemSlot>
    )
  },
)

RovingFocusGroupItem.displayName = ITEM_NAME

export type { IRovingFocusGroupItemProps }
export { RovingFocusGroupItem }
