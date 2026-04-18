import { Button } from '../button'
import { ScrollArea } from '../scroll-area'

export interface IFileType {
  id: string
  file: File
  name: string
  url: string | null
  type: string
  size: number
}
export type FileType = IFileType

export interface IUploadRenameAttachmentButtonProps {
  attachment: IFileType[]
}
export type UploadRenameAttachmentButtonProps = IUploadRenameAttachmentButtonProps

export interface IUploadContextType<T extends Record<string, unknown>> {
  attachments: IFileType[]
  setAttachments: React.Dispatch<React.SetStateAction<IFileType[]>>
  attachmentsState: T[]
  setAttachmentsState: React.Dispatch<React.SetStateAction<T[]>>
}

export interface IUploadInputProps extends React.HTMLProps<HTMLDivElement> {}

export interface IUploadItemProps extends React.HTMLProps<HTMLDivElement> {
  attachment: IFileType
}

export interface IUploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode
  content: React.ReactNode
}

export interface IUploadTriggerProps extends React.HTMLProps<HTMLDivElement> {}

export interface IUploadItemRemoveProps extends React.HTMLProps<HTMLDivElement> {}
export type IUploadtItemRemoveProps = IUploadItemRemoveProps

export interface IUploadContentProps extends React.ComponentPropsWithRef<typeof ScrollArea> {}

export interface IStateWithExtraFeatures<T extends Record<string, unknown>> {
  data: T | null
  state: 'pending' | 'success' | 'error'
}
