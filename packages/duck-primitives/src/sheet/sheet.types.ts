import { useSheet } from './sheet.hooks'

export type SheetContextProps =
  | (ReturnType<typeof useSheet> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
      setTitleId: React.Dispatch<React.SetStateAction<string | undefined>>
      closeButton: boolean
    })
  | null

export type SheetOptions = {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeButton?: boolean
}
