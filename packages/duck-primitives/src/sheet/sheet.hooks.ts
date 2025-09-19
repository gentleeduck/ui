import { useClick, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'

import * as React from 'react'
import { SheetContext } from './sheet'
import type { SheetOptions } from './sheet.types'

export function useSheet({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  closeButton = true,
}: SheetOptions) {
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
      setDescriptionId,
      setLabelId,
      setTitleId,
      titleId,
    }),
    [open, setOpen, interactions, data, labelId, descriptionId, setTitleId],
  )
}

export const useSheetContext = () => {
  const context = React.useContext(SheetContext)

  if (context == null) {
    throw new Error('Sheet components must be wrapped in <Sheet />')
  }

  return context
}
