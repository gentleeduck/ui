import { ScrollArea } from '@/registry/default/ui'
import { Button } from '../button'

// NOTE: UPLOAD TYPES

/**
 * Context type for managing uploads.
 * @template T - The type of attachments.
 */
export interface UploadContextType<T extends Record<string, any>> {
  attachments: T[] // List of attachments
  setAttachments: React.Dispatch<React.SetStateAction<T[]>> // Function to update attachments
  attachmentsState: T[] // State of attachments
  setAttachmentsState: React.Dispatch<React.SetStateAction<T[]>> // Function to update attachments state
}

/**
 * Props for the Upload component.
 * @extends {React.HTMLProps<HTMLDivElement>}
 */
export interface UploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode // Trigger element for the upload action
  content: React.ReactNode // Content to display in the upload area
}

/**
 * Props for the UploadTrigger component.
 * @extends {React.HTMLProps<HTMLDivElement>}
 */
export interface UploadTriggerProps extends React.HTMLProps<HTMLDivElement> {}

/**
 * Props for the UploadInput component.
 * @extends {React.HTMLProps<HTMLDivElement>}
 */
export interface UploadInputProps extends React.HTMLProps<HTMLDivElement> {}

/**
 * Props for the UploadContent component.
 * @extends {React.ComponentPropsWithoutRef<typeof ScrollArea>}
 */
export interface UploadContentProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {}

/**
 * Props for the UploadItem component.
 * @extends {React.HTMLProps<HTMLDivElement>}
 */
export interface UploadItemProps extends React.HTMLProps<HTMLDivElement> {
  attachment: FileType // The attachment to display
}

/**
 * Props for the UploadItemRemove component.
 * @extends {React.HTMLProps<HTMLDivElement>}
 */
export interface UploadtItemRemoveProps extends React.HTMLProps<HTMLDivElement> {}

// NOTE: SHARED TYPES

/**
 * Type representing a file attachment.
 */
export interface FileType {
  id: string // Unique identifier for the file
  file: Blob | null // The file blob
  url: string | null // URL of the file
  type: string // MIME type of the file
  name: string // Name of the file
  size: string // Size of the file
  createdAt: Date // Creation date of the file
  updatedAt: Date // Last updated date of the file
  treeLevel?: number // Level in the folder structure
}

/**
 * Type representing a folder containing attachments.
 */
export type FolderType = {
  id: string // Unique identifier for the folder
  name: string // Name of the folder
  content: (FileType | FolderType)[] // Content of the folder (files and subfolders)
  files: number // Number of files in the folder
  createdAt: Date // Creation date of the folder
  updatedAt: Date // Last updated date of the folder
  treeLevel: number // Level in the folder structure
}

/**
 * Type representing a selected folder.
 */
export type SelectedFolderType = FolderType & {}

// ------------------------------------------------------------------------------------------------
// NOTE: ADVANCED TYPES

/**
 * Context type for managing advanced upload features.
 * @template T - The type of attachments.
 */
export interface UploadAdvancedContextType<T extends Record<string, any>> extends UploadContextType<T> {
  selectedFolder: SelectedFolderType[] // Currently selected folders
  setSelectedFolder: React.Dispatch<React.SetStateAction<SelectedFolderType[]>> // Function to update selected folders
  previewFile: FileType | null // Currently previewed file
  setPreviewFile: React.Dispatch<React.SetStateAction<FileType | null>> // Function to update the previewed file
  uploadQuery: string // Current search query for uploads
  setUploadQuery: React.Dispatch<React.SetStateAction<string>> // Function to update the search query
  selectedAttachments: FileType[] // Currently selected attachments
  setSelectedAttachments: React.Dispatch<React.SetStateAction<FileType[]>> // Function to update selected attachments
  currentBucket: string // Current bucket name
  uploadView: 'column' | 'row' // Currently selected view
  setUploadView: React.Dispatch<React.SetStateAction<'column' | 'row'>> // Function to update the view
}

/**
 * Props for the UploadAdvancedProvider component.
 * @extends {React.HTMLProps<HTMLDivElement>}
 */
export interface UploadAdvancedProviderProps extends React.HTMLProps<HTMLDivElement> {
  selectedFolder?: SelectedFolderType[] // Currently selected folders
  attachments?: (FileType | FolderType)[] // List of attachments
  currentBucket: string // Current bucket name
}

// ------------------------------------------------------------------------------------------------
// NOTE: CHUNKS TYPES

/**
 * Props fkjor the UploadDownloadAttachments component.  * @extends {React.ComponentPropsWithoutRef<typeof Button>}
 * @property {string[]} itemsName - Names of the items to download
 * @property {boolean} withinDropdown - Whether the button is within a dropdown
 */
export interface UploadDownloadAttachmentsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  itemsName: string[]
  withinDropdown?: boolean
}

/**
 * Props for the UploadRenameAttachmentButton component.
 *
 * @typedef {Object} UploadRenameAttachmentButtonProps
 * @property {FileType|FolderType} attachment - The attachment to be uploaded or renamed.
 */
export type UploadRenameAttachmentButtonProps = {
  attachment: FileType | FolderType
}

/**
 * Props for the UploadAttachmentsTreeItem component.
 */
export type UploadAttachmentsTreeItemProps = {
  attachments?: (FileType | FolderType)[] // List of attachments to display
}

/**
 * Props for the UploadAlertMoveAction component.
 * @extends {React.ComponentPropsWithoutRef<typeof Button>}
 */
export interface UploadAlertMoveActionProps extends React.ComponentPropsWithoutRef<typeof Button> {
  itemsName: string[] // Names of items to move
}

/**
 * Props for the UploadAlertDeleteAction component.
 * @extends {UploadAlertMoveActionProps}
 */
export interface UploadAlertDeleteActionProps extends UploadAlertMoveActionProps {
  itemsToDelete: string[] // IDs of items to delete
}

// ------------------------------------------------------------------------------------------------
// NOTE: UPLOAD SONNER COMPONENTS

/**
 * Props for the UploadSonner component.
 */
export type UploadSonnerProps = {
  progress: number // Current upload progress
  files: number // Number of files being uploaded
  remainingTime?: number // Remaining time for the upload
}

// ------------------------------------------------------------------------------------------------
// NOTE: UPLOAD LIBs

/**
 * Type for the `UploadManager` class.
 * This class handles file upload, attachment management, and file/folder operations.
 */
export declare class UploadManagerClass {
  /**
   * Renames an attachment (file or folder) by its ID.
   * Updates the name and modification timestamp of the target attachment.
   * If the attachment is a folder, it recursively renames any matching attachments in its content.
   *
   * @param setAttachments - The function to update the attachments state.
   * @param targetIds - An array of attachment IDs to target for renaming.
   * @param newName - The new name to assign to the targeted attachment(s).
   *
   * @returns void
   */
  public static renameAttachmentById(
    setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>>,
    targetIds: string[],
    newName: string
  ): void

  /**
   * Helper method to rename attachments recursively in a folder's content.
   *
   * @param attachments - The list of attachments to search through.
   * @param targetIds - An array of attachment IDs to target for renaming.
   * @param newName - The new name to assign to the targeted attachment(s).
   *
   * @returns A new list of attachments with the renamed attachment(s).
   */
  private static renameAttachmentRecursive(
    attachments: (FileType | FolderType)[],
    targetIds: string[],
    newName: string
  ): (FileType | FolderType)[]

  /**
   * Selects files from a folder and adds or removes them from the list of selected attachments.
   * If all files are selected, they will be deselected; otherwise, new files will be selected.
   *
   * @param filesInCurrentTree - The list of files in the current folder.
   * @param setSelectedAttachment - Function to update the selected attachments state.
   *
   * @returns void
   */
  public static selectAttachmentFromFolderContent({
    filesInCurrentTree,
    setSelectedAttachment,
  }: SelectAttachmentFromFolderContentArgs): void

  /**
   * Uploads files with progress tracking and validation.
   * It performs validation of files, tracks upload progress, and updates the state with new attachments.
   *
   * @param e - The event object containing the selected files.
   * @param selectedFolder - The folder where the files will be uploaded.
   * @param setAttachments - The function to update the attachments state.
   *
   * @returns void
   */
  public static advancedUploadAttachments({ e, selectedFolder, setAttachments }: UploadFilesArgs): Promise<void>

  /**
   * Simulates the file upload process and provides progress updates.
   *
   * @param files - The number of files to upload.
   * @param toastId - The ID for the toast notification showing the upload progress.
   *
   * @returns A promise that resolves when the upload reaches 100% progress.
   */
  private static uploadPromise({ files, toastId }: UploadPromiseArgs): Promise<UploadPromiseReturn>

  /**
   * Opens a folder and updates the selected folder state.
   * If the folder is not already in the tree, it is added to the selection.
   *
   * @param attachmentFolder - The folder to open.
   * @param setSelected - The function to update the selected folders state.
   * @param exist_in_tree - Flag to check if the folder already exists in the selection.
   *
   * @returns void
   */
  public static folderOpen({ attachmentFolder, setSelected, exist_in_tree }: FolderOpenArgs): void

  /**
   * Determines the file type based on the MIME type of the file.
   *
   * @param file - The file whose type is to be determined.
   *
   * @returns The type of the file (Audio, Text, Image, Video, Pdf, Unknown).
   */
  public static getFileType(file: Blob | null): FileTypeEnum

  /**
   * Calculates the remaining time for the file upload based on the current progress.
   *
   * @param currentProgress - The current upload progress (0-100).
   * @param maxProgress - The maximum progress value (usually 100).
   *
   * @returns The estimated remaining time for the upload.
   */
  public static getRemainingTime(currentProgress: number, maxProgress: number): number

  /**
   * Formats the given time (in seconds) into a human-readable string (e.g., "2h 30m").
   *
   * @param seconds - The time in seconds to format.
   *
   * @returns The formatted time string.
   */
  public static formatTime(seconds: number): string
}

/**
 * Arguments for selecting attachments from folder content.
 */
export type SelectAttachmentFromFolderContentArgs = {
  filesInCurrentTree: (FileType | FolderType)[] // Files in the current tree
  setSelectedAttachment: React.Dispatch<React.SetStateAction<FileType[]>> // Function to set selected attachments
  checkState?: boolean // Optional state check
}

/**
 * Arguments for adding a folder to the current path.
 */
export type addFolderToPathArgs = {
  selectedFolder: FolderType[] // Currently selected folder
  setSelectedFolder: React.Dispatch<React.SetStateAction<FolderType[]>> // Function to set selected folders
  setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>> // Function to set attachments
  folderName: string | undefined // Name of the folder to add
}

/**
 * Arguments for moving attachments to a specified path.
 */
export type MoveAttachmentsToPath = {
  setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>> // Function to set attachments
  setSelectedAttachment: React.Dispatch<React.SetStateAction<FileType[]>> // Function to set selected attachments
  selectedAttachments: FileType[] // Currently selected attachments
  path: string // Path to move the attachments to
}

/**
 * Arguments for opening a folder.
 */
export type FolderOpenArgs = {
  attachmentFolder: FolderType // The folder to open
  setSelected: React.Dispatch<React.SetStateAction<FolderType[]>> // Function to set selected folders
  exist_in_tree: boolean // Whether the folder exists in the tree
}

/**
 * Props for handling attachments.
 */
export interface HandleAttachmentProps {
  e: React.ChangeEvent<HTMLInputElement> // Change event from the input
  setAttachmentsState: React.Dispatch<React.SetStateAction<FileType[]>> // Function to set attachments state
}

/**
 * Arguments for uploading files.
 */
export type UploadFilesArgs = {
  e: React.ChangeEvent<HTMLInputElement> // Change event from the input
  selectedFolder: FolderType[] // Currently selected folder
  setSelectedFolder: React.Dispatch<React.SetStateAction<FolderType[]>> // Function to set selected folders
  setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>> // Function to set attachments
}

/**
 * Arguments for the upload promise.
 */
export type UploadPromiseArgs = {
  files: number // Number of files to upload
  toastId: string // ID for the toast notification
}

/**
 * Return type for the upload promise.
 */
export type UploadPromiseReturn = {
  files: number // Number of files uploaded
  progress: number // Current upload progress
  remainingTime?: number | undefined // Optional remaining time for the upload
  message: string // Message indicating the status of the upload
  toastId: string // ID for the toast notification
}
