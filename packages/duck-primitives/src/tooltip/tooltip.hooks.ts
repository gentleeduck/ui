import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import React from 'react'
import type { TooltipOptions } from './tooltip.types'

export function useTooltip({
  defaultOpen = false,
  placement = 'top',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  sideOffset = 4,
  alignOffset = 0,
  mainAxis = true,
  delayDuration = 150,
  skipDelayDuration = 150,
}: TooltipOptions): ReturnType<typeof useFloating> & {
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
      fallbackAxisSideDirection: 'start',
      mainAxis,
      padding: 4,
    }),
    shift({ padding: 4 }),
  ]

  const data = useFloating({
    middleware,
    onOpenChange: setOpen,
    open,
    placement,
    strategy: 'absolute',
    whileElementsMounted: autoUpdate,
  })

  const context = data.context

  const dismiss = useDismiss(context, {
    outsidePress: false,
  })
  const role = useRole(context, {})

  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  })

  const hover = useHover(context, {
    delay: { close: delayDuration, open: delayDuration },
    enabled: controlledOpen == null,
    move: false,
    restMs: skipDelayDuration,
  })

  const interactions = useInteractions([dismiss, focus, role, hover])

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
