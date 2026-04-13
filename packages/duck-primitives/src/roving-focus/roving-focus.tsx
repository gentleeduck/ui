import * as React from 'react'
import { useDirection } from '../direction'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useControllableState } from '../hooks/use-controllable-state'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { createCollection } from '../libs/create-collection'
import { createContextScope, type Scope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { Direction, Orientation } from './roving-focus.libs'
import { focusFirst } from './roving-focus.libs'

const ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

const GROUP_NAME = 'RovingFocusGroup'

type ItemData = { id: string; focusable: boolean; active: boolean }
export const [Collection, useCollection, createCollectionScope] = createCollection<HTMLSpanElement, ItemData>(
  GROUP_NAME,
)

export type ScopedProps<P> = P & { __scopeRovingFocusGroup?: Scope }
const [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(GROUP_NAME, [
  createCollectionScope,
])

interface IRovingFocusGroupOptions {
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
}

type RovingContextValue = IRovingFocusGroupOptions & {
  currentTabStopId: string | null
  onItemFocus(tabStopId: string): void
  onItemShiftTab(): void
  onFocusableItemAdd(): void
  onFocusableItemRemove(): void
}

export const [RovingFocusProvider, useRovingFocusContext] =
  createRovingFocusGroupContext<RovingContextValue>(GROUP_NAME)

type RovingFocusGroupElement = RovingFocusGroupImplElement
export interface IRovingFocusGroupProps extends IRovingFocusGroupImplProps {}

/** Container that manages roving tabindex focus within a group of items. */
const RovingFocusGroup = React.forwardRef<RovingFocusGroupElement, IRovingFocusGroupProps>(
  (props: ScopedProps<IRovingFocusGroupProps>, forwardedRef) => {
    return (
      <Collection.Provider scope={props.__scopeRovingFocusGroup}>
        <Collection.Slot scope={props.__scopeRovingFocusGroup}>
          <RovingFocusGroupImpl {...props} ref={forwardedRef} />
        </Collection.Slot>
      </Collection.Provider>
    )
  },
)

RovingFocusGroup.displayName = GROUP_NAME

type RovingFocusGroupImplElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface IRovingFocusGroupImplProps extends Omit<PrimitiveDivProps, 'dir'>, IRovingFocusGroupOptions {
  currentTabStopId?: string | null
  defaultCurrentTabStopId?: string
  onCurrentTabStopIdChange?: (tabStopId: string | null) => void
  onEntryFocus?: (event: Event) => void
  preventScrollOnEntryFocus?: boolean
}

const RovingFocusGroupImpl = React.forwardRef<RovingFocusGroupImplElement, IRovingFocusGroupImplProps>(
  (props: ScopedProps<IRovingFocusGroupImplProps>, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      orientation,
      loop = false,
      dir,
      currentTabStopId: currentTabStopIdProp,
      defaultCurrentTabStopId,
      onCurrentTabStopIdChange,
      onEntryFocus,
      preventScrollOnEntryFocus = false,
      ...groupProps
    } = props
    const ref = React.useRef<RovingFocusGroupImplElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const direction = useDirection(dir)
    const [currentTabStopId, setCurrentTabStopId] = useControllableState({
      prop: currentTabStopIdProp,
      defaultProp: defaultCurrentTabStopId ?? null,
      onChange: onCurrentTabStopIdChange,
      caller: GROUP_NAME,
    })
    const [isTabbingBackOut, setIsTabbingBackOut] = React.useState(false)
    const handleEntryFocus = useCallbackRef(onEntryFocus)
    const getItems = useCollection(__scopeRovingFocusGroup)
    const isClickFocusRef = React.useRef(false)
    const [focusableItemsCount, setFocusableItemsCount] = React.useState(0)

    React.useEffect(() => {
      const node = ref.current
      if (node) {
        node.addEventListener(ENTRY_FOCUS, handleEntryFocus)
        return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus)
      }
    }, [handleEntryFocus])

    return (
      <RovingFocusProvider
        scope={__scopeRovingFocusGroup}
        orientation={orientation}
        dir={direction}
        loop={loop}
        currentTabStopId={currentTabStopId}
        onItemFocus={React.useCallback((tabStopId) => setCurrentTabStopId(tabStopId), [setCurrentTabStopId])}
        onItemShiftTab={React.useCallback(() => setIsTabbingBackOut(true), [])}
        onFocusableItemAdd={React.useCallback(() => setFocusableItemsCount((prevCount) => prevCount + 1), [])}
        onFocusableItemRemove={React.useCallback(() => setFocusableItemsCount((prevCount) => prevCount - 1), [])}>
        <Primitive.div
          data-slot="roving-focus-group"
          tabIndex={isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0}
          data-orientation={orientation}
          {...groupProps}
          ref={composedRefs}
          style={{ outline: 'none', ...props.style }}
          onMouseDown={composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true
          })}
          onFocus={composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS)
              event.currentTarget.dispatchEvent(entryFocusEvent)
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable)
                const activeItem = items.find((item) => item.active)
                const currentItem = items.find((item) => item.id === currentTabStopId)
                const candidateItems = [activeItem, currentItem, ...items].filter(Boolean) as typeof items
                // biome-ignore lint/style/noNonNullAssertion: focusable items always have mounted refs within the roving focus group
                const candidateNodes = candidateItems.map((item) => item.ref.current!)
                focusFirst(candidateNodes, preventScrollOnEntryFocus)
              }
            }
            isClickFocusRef.current = false
          })}
          onBlur={composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))}
        />
      </RovingFocusProvider>
    )
  },
)

RovingFocusGroupImpl.displayName = 'RovingFocusGroupImpl'

export { createRovingFocusGroupScope, RovingFocusGroup }
