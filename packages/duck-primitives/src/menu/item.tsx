import * as React from 'react'
import { flushSync } from 'react-dom'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { useMenuContentContext } from './content'
import { Collection, useMenuRootContext, useRovingFocusGroupScope } from './menu'
import { SELECTION_KEYS, whenMouse } from './menu.libs'
import type { IMenu } from './menu.types'

const ITEM_NAME = 'MenuItem'
const ITEM_SELECT = 'menu.itemSelect'

type MenuItemImplElement = React.ComponentRef<typeof Primitive.div>
type MenuItemElement = MenuItemImplElement

const MenuItem = React.forwardRef<MenuItemElement, IMenu.IItemProps>(
  (props: IMenu.IScoped<IMenu.IItemProps>, forwardedRef) => {
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
          if (!isPointerDownRef.current) event.currentTarget?.click()
        })}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== ''
          if (disabled || (isTypingAhead && event.key === ' ')) return
          if (SELECTION_KEYS.includes(event.key)) {
            event.currentTarget.click()
            event.preventDefault()
          }
        })}
      />
    )
  },
)

MenuItem.displayName = ITEM_NAME

const MenuItemImpl = React.forwardRef<MenuItemImplElement, IMenu.IItemImplProps>(
  (props: IMenu.IScoped<IMenu.IItemImplProps>, forwardedRef) => {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props
    const rootContext = useMenuRootContext(ITEM_NAME, __scopeMenu)
    const contentContext = useMenuContentContext(ITEM_NAME, __scopeMenu)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu)
    const ref = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const [isFocused, setIsFocused] = React.useState(false)

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

export { MenuItem, MenuItemImpl }
