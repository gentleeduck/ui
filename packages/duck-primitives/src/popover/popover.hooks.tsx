import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import * as React from 'react'
import { PopoverOptions } from './popover.types'

export function usePopover({
  defaultOpen = false,
  placement = 'bottom',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  sideOffset = 4,
  alignOffset = 0,
  matchWidth = false,
  enableHover = false,
  mainAxis = true,
  contextMenu = false,
}: PopoverOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const middleware = [
    offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
    flip({
      crossAxis: placement.includes('-'),
      mainAxis,
      fallbackAxisSideDirection: 'end',
      // @ts-ignore
      fallbackPlacements: contextMenu ? ['left-start'] : null,
      padding: 4,
    }),
    shift({ padding: 4 }),
  ]

  if (matchWidth) {
    middleware.push(
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          })
        },
      }),
    )
  }

  const data = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    strategy: contextMenu ? 'fixed' : 'absolute',
    middleware,
  })

  const context = data.context

  const click = useClick(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, contextMenu ? { role: 'menu' } : {})

  const hover = useHover(context, {
    move: true,
    restMs: 200,
    enabled: enableHover,
    delay: { open: 150, close: 150 },
  })

  const interactions = useInteractions([click, dismiss, role, hover])
  const allowMouseUpCloseRef = React.useRef(false)

  React.useEffect(() => {
    if (!contextMenu) return
    let timeout: number

    function onContextMenu(e: MouseEvent) {
      e.preventDefault()

      data.refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          }
        },
      })

      setOpen(true)
      clearTimeout(timeout)

      allowMouseUpCloseRef.current = false
      timeout = window.setTimeout(() => {
        allowMouseUpCloseRef.current = true
      }, 300)
    }

    function onMouseUp() {
      if (allowMouseUpCloseRef.current) {
        setOpen(false)
      }
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('mouseup', onMouseUp)
      clearTimeout(timeout)
    }
  }, [data.refs])

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
    }),
    [open, setOpen, interactions, data, modal],
  )
}
