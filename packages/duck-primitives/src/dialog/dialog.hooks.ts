import { useClick, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'

import * as React from 'react'
import { DialogContext } from './dialog'
import type { DialogOptions } from './dialog.types'

export function useDialog({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  closeButton = true,
  modal = false,
}: DialogOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [labelId, setLabelId] = React.useState<string | undefined>()
  const [titleId, setTitleId] = React.useState<string | undefined>()
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>()

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    onOpenChange: setOpen,
    open,
  })

  const context = data.context

  const click = useClick(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })
  const role = useRole(context)

  const interactions = useInteractions([click, dismiss, role])

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      closeButton,
      descriptionId,
      labelId,
      modal,
      setDescriptionId,
      setLabelId,
      setTitleId,
      titleId,
    }),
    [open, setOpen, interactions, data, labelId, descriptionId, setTitleId],
  )
}

export const useDialogContext = () => {
  const context = React.useContext(DialogContext)

  if (context == null) {
    throw new Error('Dialog components must be wrapped in <Dialog />')
  }

  return context
}

// import {
//   autoUpdate,
//   flip,
//   offset,
//   Placement,
//   shift,
//   size,
//   useClick,
//   useDismiss,
//   useFloating,
//   useHover,
//   useInteractions,
//   useRole,
// } from '@floating-ui/react'
// import * as React from 'react'
// import { DialogContext } from './dialog'
//
// interface PopoverOptions {
//   defaultOpen?: boolean
//   placement?: Placement
//   modal?: boolean
//   open?: boolean
//   onOpenChange?: (open: boolean) => void
//   sideOffset?: number
//   alignOffset?: number
//   matchWidth?: boolean
//   enableHover?: boolean
//   mainAxis?: boolean
//   closeButton?: boolean
// }
// export function useDialog({
//   defaultOpen = false,
//   placement = 'bottom',
//   modal,
//   open: controlledOpen,
//   onOpenChange: setControlledOpen,
//   sideOffset = 4,
//   alignOffset = 0,
//   matchWidth = false,
//   enableHover = false,
//   mainAxis = true,
//   closeButton = true,
// }: PopoverOptions) {
//   const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
//   const [labelId, setLabelId] = React.useState<string | undefined>()
//   const [titleId, setTitleId] = React.useState<string | undefined>()
//   const [descriptionId, setDescriptionId] = React.useState<string | undefined>()
//
//   const open = controlledOpen ?? uncontrolledOpen
//   const setOpen = setControlledOpen ?? setUncontrolledOpen
//
//   const middleware = [
//     offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
//     flip({
//       crossAxis: placement.includes('-'),
//       mainAxis,
//       fallbackAxisSideDirection: 'end',
//       // fallbackPlacements: contextMenu ? ['left-start'] : null,
//       padding: 4,
//     }),
//     shift({ padding: 4 }),
//   ]
//
//   if (matchWidth) {
//     middleware.push(
//       size({
//         apply({ rects, elements }) {
//           Object.assign(elements.floating.style, {
//             minWidth: `${rects.reference.width}px`,
//           })
//         },
//       }),
//     )
//   }
//
//   const data = useFloating({
//     open,
//     onOpenChange: setOpen,
//     placement,
//     whileElementsMounted: autoUpdate,
//     strategy: 'absolute',
//     middleware,
//   })
//
//   const context = data.context
//
//   const click = useClick(context, {
//     enabled: controlledOpen == null,
//   })
//   const dismiss = useDismiss(context)
//   const role = useRole(context, {})
//
//   const hover = useHover(context, {
//     move: true,
//     restMs: 200,
//     enabled: enableHover,
//     delay: { open: 150, close: 150 },
//   })
//
//   const interactions = useInteractions([click, dismiss, role, hover])
//
//   return React.useMemo(
//     () => ({
//       open,
//       setOpen,
//       ...interactions,
//       ...data,
//       modal,
//       labelId,
//       descriptionId,
//       titleId,
//       setLabelId,
//       setDescriptionId,
//       setTitleId,
//       closeButton,
//     }),
//     [open, setOpen, interactions, data, modal],
//   )
// }
