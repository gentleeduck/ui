import { ScrollArea } from '@/registry/default/ui'

export interface AttachmentType {
  id: string
  file: Blob | null
  url: string | null
  type: string
  name: string
  size: string
  createdAt: Date
  updatedAt: Date
  treeLevel: number
}

export interface UploadContextType<T extends Record<string, any>> {
  attachments: T[]
  setAttachments: React.Dispatch<React.SetStateAction<T[]>>
  attachmentsState: T[]
  setAttachmentsState: React.Dispatch<React.SetStateAction<T[]>>
}

export interface UploadAdvancedContextType<T extends Record<string, any>> extends UploadContextType<T> {
  selectedFolder: SelectedFolderType[]
  setSelectedFolder: React.Dispatch<React.SetStateAction<SelectedFolderType[]>>
  previewFile: AttachmentType | null
  setPreviewFile: React.Dispatch<React.SetStateAction<AttachmentType | null>>
  uploadQuery: string
  setUploadQuery: React.Dispatch<React.SetStateAction<string>>
  selecttedAttachment: (AttachmentType | FolderType)[]
  setSelectedAttachment: React.Dispatch<React.SetStateAction<(AttachmentType | FolderType)[]>>
}

export interface UploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode
  content: React.ReactNode
}

export interface UploadTriggerProps extends React.HTMLProps<HTMLDivElement> {}

export interface UploadInputProps extends React.HTMLProps<HTMLDivElement> {}

export interface UploadContentProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {}

export interface UploadItemProps extends React.HTMLProps<HTMLDivElement> {
  attachment: AttachmentType
}

export interface UploadtItemRemoveProps extends React.HTMLProps<HTMLDivElement> {}

export interface HandleAttachmentProps {
  e: React.ChangeEvent<HTMLInputElement>
  setAttachmentsState: React.Dispatch<React.SetStateAction<AttachmentType[]>>
}

export type FolderType = {
  id: string
  name: string
  content: (AttachmentType | FolderType)[]
  files: number
  createdAt: Date
  updatedAt: Date
  treeLevel: number
}

export type SelectedFolderType = FolderType & {}

export type UploadFilesArgs = {
  e: React.ChangeEvent<HTMLInputElement>
  selectedFolder: FolderType[]
  setSelectedFolder: React.Dispatch<React.SetStateAction<FolderType[]>>
  setAttachments: React.Dispatch<React.SetStateAction<(AttachmentType | FolderType)[]>>
}

export type UploadPromiseArgs = {
  files: number
  toastId: number
}

export type UploadPromiseReturn = { files: number; progress: number; remainingTime: number }

export type UploadAttachmentsTreeItemProps = {
  attachments?: (AttachmentType | FolderType)[]
}
