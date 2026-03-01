import { Button } from '../button'
import { ScrollArea } from '../scroll-area'

export type FileType = {
  id: string
  file: File
  name: string
  url: string | null
  type: string
  size: number
}

export type UploadRenameAttachmentButtonProps = {
  attachment: FileType[]
}

export interface UploadContextType<T extends Record<string, any>> {
  attachments: FileType[]
  setAttachments: React.Dispatch<React.SetStateAction<FileType[]>>
  attachmentsState: T[]
  setAttachmentsState: React.Dispatch<React.SetStateAction<T[]>>
}

export interface UploadInputProps extends React.HTMLProps<HTMLDivElement> {}

export interface UploadItemProps extends React.HTMLProps<HTMLDivElement> {
  attachment: FileType
}

export interface UploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode
  content: React.ReactNode
}

export interface UploadTriggerProps extends React.HTMLProps<HTMLDivElement> {}

export interface UploadtItemRemoveProps extends React.HTMLProps<HTMLDivElement> {}

export interface UploadContentProps extends React.ComponentPropsWithRef<typeof ScrollArea> {}

export interface StateWithExtraFeatures<T extends Record<string, any>> {
  data: T | null
  state: 'pending' | 'success' | 'error'
}
