import { useDialog } from './dialog.hooks'

export type DialogContextProps =
  | (ReturnType<typeof useDialog> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
      setTitleId: React.Dispatch<React.SetStateAction<string | undefined>>
      closeButton: boolean
    })
  | null

export type DialogOptions = {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeButton?: boolean
}
