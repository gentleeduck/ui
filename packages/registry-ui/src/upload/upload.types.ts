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

export interface IUploadContextType<T extends Record<string, any>> {
  attachments: FileType[]
  setAttachments: React.Dispatch<React.SetStateAction<FileType[]>>
  attachmentsState: T[]
  setAttachmentsState: React.Dispatch<React.SetStateAction<T[]>>
}

export interface IUploadInputProps extends React.HTMLProps<HTMLDivElement> {}

export interface IUploadItemProps extends React.HTMLProps<HTMLDivElement> {
  attachment: FileType
}

export interface IUploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode
  content: React.ReactNode
}

export interface IUploadTriggerProps extends React.HTMLProps<HTMLDivElement> {}

export interface IUploadtItemRemoveProps extends React.HTMLProps<HTMLDivElement> {}

export interface IUploadContentProps extends React.ComponentPropsWithRef<typeof ScrollArea> {}

export interface IStateWithExtraFeatures<T extends Record<string, any>> {
  data: T | null
  state: 'pending' | 'success' | 'error'
}
