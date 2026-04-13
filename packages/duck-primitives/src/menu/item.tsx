/** MenuItem component - an interactive item within a menu. */
import * as React from 'react'
import { flushSync } from 'react-dom'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { useMenuContentContext } from './content'
import { Collection, type ScopedProps, useMenuRootContext, useRovingFocusGroupScope } from './menu'
import { SELECTION_KEYS, whenMouse } from './menu.libs'

const ITEM_NAME = 'MenuItem'
const ITEM_SELECT = 'menu.itemSelect'

type MenuItemImplElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface IMenuItemImplProps extends PrimitiveDivProps {
  disabled?: boolean
  textValue?: string
}

type MenuItemElement = MenuItemImplElement
interface IMenuItemProps extends Omit<IMenuItemImplProps, 'onSelect'> {
  onSelect?: (event: Event) => void
}

const MenuItem = React.forwardRef<MenuItemElement, IMenuItemProps>((props: ScopedProps<IMenuItemProps>, forwardedRef) => {
  const { disabled = false, onSelect, ...itemProps } = props
  const ref = React.useRef<HTMLDivElement>(null)
  const rootContext = useMenuRootContext(ITEM_NAME, props.__scopeMenu)
  const contentContext = useMenuContentContext(ITEM_NAME, props.__scopeMenu)
  const composedRefs = useComposedRefs(forwardedRef, ref)
  const isPointerDownRef = React.useRef(false)

  const handleSelect = () => {
    const menuItem = ref.current
    if (!disabled && menuItem) {
      const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true })
      menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true })
      flushSync(() => menuItem.dispatchEvent(itemSelectEvent))
      if (itemSelectEvent.defaultPrevented) {
        isPointerDownRef.current = false
      } else {
        rootContext.onClose()
      }
    }
  }

  return (
    <MenuItemImpl
      {...itemProps}
      ref={composedRefs}
      disabled={disabled}
      onClick={composeEventHandlers(props.onClick, handleSelect)}
      onPointerDown={(event) => {
        props.onPointerDown?.(event)
        isPointerDownRef.current = true
      }}
      onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
        // Pointer down can move to a different menu item which should activate it on pointer up.
        // We dispatch a click for selection to allow composition with click based triggers and to
        // prevent Firefox from getting stuck in text selection mode when the menu closes.
        if (!isPointerDownRef.current) event.currentTarget?.click()
      })}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
        const isTypingAhead = contentContext.searchRef.current !== ''
        if (disabled || (isTypingAhead && event.key === ' ')) return
        if (SELECTION_KEYS.includes(event.key)) {
          event.currentTarget.click()
          /**
           * We prevent default browser behaviour for selection keys as they should trigger
           * a selection only:
           * - prevents space from scrolling the page.
           * - if keydown causes focus to move, prevents keydown from firing on the new target.
           */
          event.preventDefault()
        }
      })}
    />
  )
})

MenuItem.displayName = ITEM_NAME

const MenuItemImpl = React.forwardRef<MenuItemImplElement, IMenuItemImplProps>(
  (props: ScopedProps<IMenuItemImplProps>, forwardedRef) => {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props
    const rootContext = useMenuRootContext(ITEM_NAME, __scopeMenu)
    const contentContext = useMenuContentContext(ITEM_NAME, __scopeMenu)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu)
    const ref = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const [isFocused, setIsFocused] = React.useState(false)

    // get the item's `.textContent` as default strategy for typeahead `textValue`
    const [textContent, setTextContent] = React.useState('')
    React.useEffect(() => {
      const menuItem = ref.current
      if (menuItem) {
        setTextContent((menuItem.textContent ?? '').trim())
      }
    }, [])

    return (
      <Collection.ItemSlot scope={__scopeMenu} disabled={disabled} textValue={textValue ?? textContent}>
        <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!disabled}>
          <Primitive.div
            data-slot="menu-item"
            role="menuitem"
            data-highlighted={isFocused ? '' : undefined}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            dir={rootContext.dir}
            {...itemProps}
            ref={composedRefs}
            /**
             * We focus items on `pointerMove` to achieve the following:
             *
             * - Mouse over an item (it focuses)
             * - Leave mouse where it is and use keyboard to focus a different item
             * - Wiggle mouse without it leaving previously focused item
             * - Previously focused item should re-focus
             *
             * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
             * wiggles. This is to match native menu implementation.
             */
            onPointerMove={composeEventHandlers(
              props.onPointerMove,
              whenMouse((event) => {
                if (disabled) {
                  contentContext.onItemLeave(event)
                } else {
                  contentContext.onItemEnter(event)
                  if (!event.defaultPrevented) {
                    const item = event.currentTarget
                    item.focus({ preventScroll: true })
                  }
                }
              }),
            )}
            onPointerLeave={composeEventHandlers(
              props.onPointerLeave,
              whenMouse((event) => contentContext.onItemLeave(event)),
            )}
            onFocus={composeEventHandlers(props.onFocus, () => setIsFocused(true))}
            onBlur={composeEventHandlers(props.onBlur, () => setIsFocused(false))}
          />
        </RovingFocusGroup.Item>
      </Collection.ItemSlot>
    )
  },
)

MenuItemImpl.displayName = 'MenuItemImpl'

export type { MenuItemElement, IMenuItemImplProps, IMenuItemProps }
export { MenuItem, MenuItemImpl }
