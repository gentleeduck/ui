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

  const openRef = React.useRef(open)
  React.useEffect(() => {
    openRef.current = open
  }, [open])

  const middleware = [
    offset({ crossAxis: alignOffset, mainAxis: sideOffset }),
    flip({
      crossAxis: placement.includes('-'),
      fallbackAxisSideDirection: 'end',
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

  // IMPORTANT: don’t allow normal click-to-open when this is a context menu
  const click = useClick(context, {
    enabled: controlledOpen == null && !contextMenu,
  })

  const dismiss = useDismiss(context)
  const role = useRole(context, contextMenu ? { role: 'menu' } : {})

  const hover = useHover(context, {
    delay: { close: 150, open: 150 },
    enabled: enableHover && !contextMenu,
    move: true,
    restMs: 200,
  })

  const interactions = useInteractions([click, dismiss, role, hover])

  React.useEffect(() => {
    if (!contextMenu) return

    // keep a stable handle to the actual trigger element (works even after setPositionReference)
    const domRef =
      (data.refs.domReference?.current as HTMLElement | null) ?? (data.refs.reference.current as HTMLElement | null)

    if (!domRef) return

    const onTriggerContextMenu = (e: MouseEvent) => {
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
    }

    // right-click anywhere else should only close (and never open)
    const onDocContextMenuCapture = (e: MouseEvent) => {
      if (!openRef.current) return

      const target = e.target as Node
      const floatingEl = data.refs.floating.current as HTMLElement | null

      const insideTrigger = domRef.contains(target)
      const insideFloating = floatingEl?.contains(target) ?? false

      if (!insideTrigger && !insideFloating) {
        setOpen(false)
        // do NOT preventDefault: let browser context menu show
      }
    }

    domRef.addEventListener('contextmenu', onTriggerContextMenu)
    document.addEventListener('contextmenu', onDocContextMenuCapture, true)

    return () => {
      domRef.removeEventListener('contextmenu', onTriggerContextMenu)
      document.removeEventListener('contextmenu', onDocContextMenuCapture, true)
    }
  }, [contextMenu, data.refs, setOpen])

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
