/** ContextMenuTrigger -- opens the context menu on right-click or long-press. */
import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import type { IPoint } from '../libs/shared-utils'
import * as MenuPrimitive from '../menu'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './context-menu'
import { useContextMenuContext, useMenuScope } from './context-menu'

const TRIGGER_NAME = 'ContextMenuTrigger'

type ContextMenuTriggerElement = React.ComponentRef<typeof Primitive.span>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>
interface IContextMenuTriggerProps extends PrimitiveSpanProps {
  disabled?: boolean
}

const ContextMenuTrigger = React.forwardRef<ContextMenuTriggerElement, IContextMenuTriggerProps>(
  (props: ScopedProps<IContextMenuTriggerProps>, forwardedRef) => {
    const { __scopeContextMenu, disabled = false, ...triggerProps } = props
    const context = useContextMenuContext(TRIGGER_NAME, __scopeContextMenu)
    const menuScope = useMenuScope(__scopeContextMenu)
    const pointRef = React.useRef<IPoint>({ x: 0, y: 0 })
    const virtualRef = React.useRef({
      getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
    })
    const longPressTimerRef = React.useRef(0)
    const clearLongPress = React.useCallback(() => window.clearTimeout(longPressTimerRef.current), [])
    const handleOpen = (event: React.MouseEvent | React.PointerEvent) => {
      pointRef.current = { x: event.clientX, y: event.clientY }
      context.onOpenChange(true)
    }

    React.useEffect(() => clearLongPress, [clearLongPress])
    React.useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress])

    return (
      <>
        <MenuPrimitive.Anchor {...menuScope} virtualRef={virtualRef} />
        <Primitive.span
          data-slot="context-menu-trigger"
          data-state={context.open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          dir={context.dir}
          {...triggerProps}
          ref={forwardedRef}
          // prevent iOS context menu from appearing
          style={{ WebkitTouchCallout: 'none', ...props.style }}
          // if trigger is disabled, enable the native Context Menu
          onContextMenu={
            disabled
              ? props.onContextMenu
              : composeEventHandlers(props.onContextMenu, (event) => {
                  // clearing the long press here because some platforms already support
                  // long press to trigger a `contextmenu` event
                  clearLongPress()
                  handleOpen(event)
                  event.preventDefault()
                })
          }
          onPointerDown={
            disabled
              ? props.onPointerDown
              : composeEventHandlers(
                  props.onPointerDown,
                  whenTouchOrPen((event) => {
                    // clear the long press here in case there's multiple touch points
                    clearLongPress()
                    longPressTimerRef.current = window.setTimeout(() => handleOpen(event), 700)
                  }),
                )
          }
          onPointerMove={
            disabled ? props.onPointerMove : composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress))
          }
          onPointerCancel={
            disabled
              ? props.onPointerCancel
              : composeEventHandlers(props.onPointerCancel, whenTouchOrPen(clearLongPress))
          }
          onPointerUp={
            disabled ? props.onPointerUp : composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))
          }
        />
      </>
    )
  },
)

ContextMenuTrigger.displayName = TRIGGER_NAME

/** Filters pointer events to only fire for touch or pen input. */
function whenTouchOrPen<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType !== 'mouse' ? handler(event) : undefined)
}

export type { IContextMenuTriggerProps }
export { ContextMenuTrigger, whenTouchOrPen }
