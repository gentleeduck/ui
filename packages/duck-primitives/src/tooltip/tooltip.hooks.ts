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
import { TooltipOptions } from './tooltip.types'

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
}: TooltipOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const middleware = [
    offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
    flip({
      crossAxis: placement.includes('-'),
      mainAxis,
      fallbackAxisSideDirection: 'start',
      padding: 4,
    }),
    shift({ padding: 4 }),
  ]

  const data = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    strategy: 'absolute',
    middleware,
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
    move: false,
    restMs: skipDelayDuration,
    enabled: controlledOpen == null,
    delay: { open: delayDuration, close: delayDuration },
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
