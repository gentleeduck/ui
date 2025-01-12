import { ScrollArea } from '@/registry/default/ui'
import { Button, CommandType } from '../button'

// NOTE: UPLOAD TYPES
export interface UploadContextType<T extends Record<string, any>> {
  attachments: T[]
  setAttachments: React.Dispatch<React.SetStateAction<T[]>>
  attachmentsState: T[]
  setAttachmentsState: React.Dispatch<React.SetStateAction<T[]>>
}

export interface UploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode
  content: React.ReactNode
}

export interface UploadTriggerProps extends React.HTMLProps<HTMLDivElement> {}

export interface UploadInputProps extends React.HTMLProps<HTMLDivElement> {}

export interface UploadContentProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {}

export interface UploadItemProps extends React.HTMLProps<HTMLDivElement> {
  attachment: FileType
}
export interface UploadtItemRemoveProps extends React.HTMLProps<HTMLDivElement> {}

// NOTE: SHARED TYPES
export interface FileType {
  id: string
  file: Blob | null
  url: string | null
  type: string
  name: string
  size: string
  createdAt: Date
  updatedAt: Date
  treeLevel?: number
}

export type FolderType = {
  id: string
  name: string
  content: (FileType | FolderType)[]
  files: number
  createdAt: Date
  updatedAt: Date
  treeLevel: number
}

// ------------------------------------------------------------------------------------------------

export interface HandleAttachmentProps {
  e: React.ChangeEvent<HTMLInputElement>
  setAttachmentsState: React.Dispatch<React.SetStateAction<FileType[]>>
}

export type SelectedFolderType = FolderType & {}

export type UploadFilesArgs = {
  e: React.ChangeEvent<HTMLInputElement>
  selectedFolder: FolderType[]
  setSelectedFolder: React.Dispatch<React.SetStateAction<FolderType[]>>
  setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>>
}

export type UploadPromiseArgs = {
  files: number
  toastId: string
}

export type UploadPromiseReturn = {
  files: number
  progress: number
  remainingTime?: number | undefined
  message: string
  toastId: string
}

export type UploadAttachmentsTreeItemProps = {
  attachments?: (FileType | FolderType)[]
}

// ------------------------------------------------------------------------------------------------
// NOTE: ADVANCED TYPES

export interface UploadAdvancedContextType<T extends Record<string, any>> extends UploadContextType<T> {
  selectedFolder: SelectedFolderType[]
  setSelectedFolder: React.Dispatch<React.SetStateAction<SelectedFolderType[]>>
  previewFile: FileType | null
  setPreviewFile: React.Dispatch<React.SetStateAction<FileType | null>>
  uploadQuery: string
  setUploadQuery: React.Dispatch<React.SetStateAction<string>>
  selectedAttachments: FileType[]
  setSelectedAttachments: React.Dispatch<React.SetStateAction<FileType[]>>
  currentBucket: string
}

export interface UploadAdvancedProviderProps extends React.HTMLProps<HTMLDivElement> {
  selectedFolder?: SelectedFolderType[]
  attachments?: (FileType | FolderType)[]
  currentBucket: string
}

// ------------------------------------------------------------------------------------------------
// NOTE : CHUNKS TYPES

export interface UploadAlertMoveActionProps extends React.ComponentPropsWithoutRef<typeof Button> {
  itemsName: string[]
}

export interface UploadAlertDeleteActionProps extends UploadAlertMoveActionProps {
  itemsToDelete: string[]
}

// ------------------------------------------------------------------------------------------------
// NOTE: UPLOAD SONNER COMPONENTS
export type UploadSonnerProps = {
  progress: number
  files: number
}

// ------------------------------------------------------------------------------------------------
// NOTE: UPLOAD LIBs
export type SelectAttachmentFromFolderContentArgs = {
  filesInCurrentTree: (FileType | FolderType)[]
  setSelectedAttachment: React.Dispatch<React.SetStateAction<FileType[]>>
  checkState?: boolean
}

export type addFolderToPathArgs = {
  selectedFolder: FolderType[]
  setSelectedFolder: React.Dispatch<React.SetStateAction<FolderType[]>>
  setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>>
  folderName: string
}

export type MoveAttachmentsToPath = {
  setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>>
  setSelectedAttachment: React.Dispatch<React.SetStateAction<FileType[]>>
  selectedAttachments: FileType[]
  path: string
}

export type FolderOpenArgs = {
  attachmentFolder: FolderType
  setSelected: React.Dispatch<React.SetStateAction<FolderType[]>>
  exist_in_tree: boolean
}
