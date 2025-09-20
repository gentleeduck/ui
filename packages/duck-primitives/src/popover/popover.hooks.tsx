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
import type { PopoverOptions } from './popover.types'

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
}: PopoverOptions): ReturnType<typeof useFloating> & {
  open: boolean
  setOpen: (open: boolean) => void
  modal?: boolean
} {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const middleware = [
    offset({ crossAxis: alignOffset, mainAxis: sideOffset }),
    flip({
      crossAxis: placement.includes('-'),
      fallbackAxisSideDirection: 'end',
      // biome-ignore lint: false positive
      // @ts-ignore
      fallbackPlacements: contextMenu ? ['left-start'] : null,
      mainAxis,
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
    middleware,
    onOpenChange: setOpen,
    open,
    placement,
    strategy: contextMenu ? 'fixed' : 'absolute',
    whileElementsMounted: autoUpdate,
  })

  const context = data.context

  const click = useClick(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, contextMenu ? { role: 'menu' } : {})

  const hover = useHover(context, {
    delay: { close: 150, open: 150 },
    enabled: enableHover,
    move: true,
    restMs: 200,
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
            bottom: e.clientY,
            height: 0,
            left: e.clientX,
            right: e.clientX,
            top: e.clientY,
            width: 0,
            x: e.clientX,
            y: e.clientY,
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
