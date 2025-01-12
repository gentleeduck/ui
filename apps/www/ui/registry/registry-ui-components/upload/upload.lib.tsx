import { toast } from 'sonner'
import { FileTypeEnum, MAX_FILE_SIZE } from './upload.constants'
import {
  addFolderToPathArgs,
  FileType,
  FolderOpenArgs,
  FolderType,
  HandleAttachmentProps,
  MoveAttachmentsToPath,
  SelectAttachmentFromFolderContentArgs,
  UploadFilesArgs,
  UploadManagerClass,
  UploadPromiseArgs,
  UploadPromiseReturn,
} from './upload.types'
import { uuidv7 } from 'uuidv7'
import React from 'react'
import { UploadSonnerContentMemo } from './upload-sonner'
import { attachmentSchema, fileTypeSchema, newFolderSchema } from './upload.dto'
import { z } from 'zod'

/**
 * The `UploadManager` class is responsible for handling file upload and attachment management.
 * It provides methods to rename attachments, upload files, manage folder contents, and track the progress of file uploads.
 */
export class UploadManager implements UploadManagerClass {
  // -------------------------------------------------------------------------------------------

  /**
   * Handles the attachment process from a file input, validates the files, and updates the state with valid attachments.
   *
   * @param {HandleAttachmentProps} params - The input event and the function to set the attachments state.
   * @returns {Promise<void>} - Returns a promise resolving to nothing.
   */
  public static async getAttachmentsToState({
    e,
    setAttachmentsState,
  }: HandleAttachmentProps): Promise<void | string | number> {
    const files = e.currentTarget.files

    if (!files) return toast.error('Please select a file')

    const newAttachments: FileType[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Zod validation for the file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`)
        continue // Skip this file and continue with the next
      }

      // Create the file attachment object
      const attachment: FileType = {
        id: uuidv7(),
        file: file,
        name: file.name,
        url: null,
        type: file.type,
        size: file.size.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Validate the attachment object using Zod schema
      try {
        fileTypeSchema.parse(attachment) // Will throw if invalid
        newAttachments.push(attachment)
      } catch (err) {
        if (err instanceof z.ZodError) {
          toast.error(`Attachment validation failed: ${err.errors.map(e => e.message).join(', ')}`)
        } else {
          toast.error(`Unknown error while validating the file: ${file.name}`)
        }
        continue // Skip this file if validation fails
      }
    }

    // Add valid attachments to state
    setAttachmentsState(prev => [...prev, ...newAttachments])

    // Reset the file input value
    e.currentTarget.value = ''
  }
  // -------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------

  /**
   * Updates folder content by adding new attachments to a specific folder, either directly or recursively in nested folders.
   *
   * @param {T[]} array - The array of files and folders.
   * @param {string} folderId - The ID of the folder to update.
   * @param {T[]} newAttachments - The new attachments to be added.
   * @returns {Promise<T[]>} - Returns a promise resolving to the updated attachments array.
   */
  public static async updateFolderContent<T extends FileType | FolderType>(
    array: T[],
    folderId: string,
    newAttachments: T[]
  ): Promise<T[]> {
    const updatedArray = array.map(item => {
      // If the current item is the folder we need to update
      if (item.id === folderId) {
        return {
          ...item,
          files: (item as FolderType).files + newAttachments.length,
          content: [...(item as FolderType).content, ...newAttachments],
        }
      }

      // If the current item contains nested folders, recursively call the function to go deeper
      if (Array.isArray((item as FolderType).content)) {
        return {
          ...item,
          content: this.updateFolderContent((item as FolderType).content, folderId, newAttachments),
        }
      }

      // If the item is not the folder and doesn't have nested folders, return it unchanged
      return item
    })

    try {
      return await new Promise(resolve => setTimeout(() => resolve(updatedArray), 1000))
    } catch (error) {
      return updatedArray
    }
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Moves selected attachments to a specified path in the folder structure.
   *
   * @param {MoveAttachmentsToPath} params - The function to set attachments, selected attachments, and the destination path.
   * @returns {Promise<void>} - Returns a promise resolving to nothing.
   */
  public static async moveAttachmentsToPath({
    setAttachments,
    setSelectedAttachment,
    selectedAttachments,
    path,
  }: MoveAttachmentsToPath): Promise<void> {
    const pathParts = path.split('/').filter(part => part.trim() !== '')

    // Handle the state update for attachments
    setAttachments(prevAttachments => {
      const updatedAttachments = this.deleteAttachmentById(
        prevAttachments,
        selectedAttachments.map(attachment => attachment.id)
      )

      // Recursively process each part of the path
      const processPath = (
        attachments: (FileType | FolderType)[],
        pathParts: string[],
        treeLevel: number
      ): (FileType | FolderType)[] => {
        if (pathParts.length === 0) {
          // If path is empty, add to root (main attachments array)
          if (treeLevel === 1) {
            attachments = [...attachments, ...selectedAttachments]
          }
          return attachments
        }

        const currentFolderName = pathParts[0]
        const remainingPathParts = pathParts.slice(1)

        // Check if the current part is a folder or file
        let folder = attachments.find(attachment => 'name' in attachment && attachment.name === currentFolderName) as
          | FolderType
          | undefined

        // If we are at the last path part and we are dealing with a file, add to the file content
        if (remainingPathParts.length === 0 && folder) {
          folder.content = [...folder.content, ...selectedAttachments] // Add new attachments to file's content
          folder.updatedAt = new Date() // Update the file's last updated time
          folder.files += selectedAttachments.length // Update the file count
          return attachments
        }

        // If the folder doesn't exist, create it
        if (!folder) {
          folder = {
            id: `${currentFolderName}-${Date.now()}`,
            name: currentFolderName,
            content: remainingPathParts.length > 0 ? [] : selectedAttachments, // Only add attachments if it's the last part
            files: remainingPathParts.length > 0 ? 1 : selectedAttachments.length, // Set file count based on content
            createdAt: new Date(),
            updatedAt: new Date(),
            treeLevel,
          }

          // Add the new folder to the attachments array
          attachments.push(folder)
        } else {
          // If folder exists, update it with new content at the last part
          folder.updatedAt = new Date() // Update the folder's last updated time
          folder.files += selectedAttachments.length // Update the files count
        }

        // Continue processing subfolders if there are more path parts
        if ('content' in folder && remainingPathParts.length > 0) {
          folder.content = processPath(folder.content, remainingPathParts, treeLevel + 1)
        }

        return attachments
      }

      // Process the path recursively and update the attachments
      const updatedAttachmentsWithPath = processPath(updatedAttachments, pathParts, 1)

      // Update the selected attachments state
      setSelectedAttachment([])

      // Return the updated attachments array to set it into the state
      return updatedAttachmentsWithPath
    })
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Creates an empty folder with the specified name and tree level.
   *
   * @param {string} name - The name of the folder.
   * @param {number} treeLevel - The tree level of the folder.
   * @returns {FolderType} - The created folder object.
   */
  public static emptyFolder = (name: string, treeLevel: number): FolderType => ({
    id: uuidv7(),
    name,
    files: 0,
    content: [] as (FileType | FolderType)[],
    createdAt: new Date(),
    updatedAt: new Date(),
    treeLevel,
  })

  // -------------------------------------------------------------------------------------------

  /**
   * Adds a folder to the specified path, either in the root or inside a selected folder.
   *
   * @param {addFolderToPathArgs} params - The arguments to add the folder (selected folder, set functions, and folder name).
   * @returns {Promise<void>} - Returns a promise resolving to nothing.
   */

  public static async addFolderToPath({
    selectedFolder,
    setAttachments,
    setSelectedFolder,
    folderName: _folderName,
  }: addFolderToPathArgs): Promise<void | number | string> {
    try {
      const { data, error } = newFolderSchema.safeParse(_folderName)
      if (error) return toast.error('Folder name is required')
      const { folderName } = data

      setAttachments(oldAttachments => {
        if (!selectedFolder.length) {
          // Add folder to root level if no folder is selected
          return [...oldAttachments, this.emptyFolder(folderName, 1)]
        }

        // Use the ID of the most deeply selected folder
        const selectedId = selectedFolder[selectedFolder.length - 1].id
        return this.addToFolderTree({ attachments: oldAttachments, selectedId, folderName })
      })

      setSelectedFolder(oldSelectedFolder => {
        if (!selectedFolder.length) {
          // If no folder is selected, keep the selected folder unchanged
          return oldSelectedFolder
        }
        return this.updateSelectedFolder(
          oldSelectedFolder,
          this.emptyFolder(
            folderName,
            selectedFolder.length ? selectedFolder[selectedFolder.length - 1].treeLevel + 1 : 1
          )
        )
      })

      toast.info('Folder added successfully!')
    } catch (error) {
      toast.error('Error adding folder')
    }
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Recursively adds a folder to the folder tree structure, ensuring it is placed at the correct position.
   *
   * @param {object} params - The attachments array, the selected folder ID, and the folder name.
   * @returns {FileType | FolderType}[] - The updated attachments array with the added folder.
   */
  private static addToFolderTree({
    attachments,
    selectedId,
    folderName,
  }: {
    attachments: (FileType | FolderType)[]
    selectedId: string
    folderName: string
  }): (FileType | FolderType)[] {
    return attachments.map(item => {
      if ('content' in item && item.id === selectedId) {
        return {
          ...item,
          content: [...item.content, this.emptyFolder(folderName, item.treeLevel + 1)],
          files: item.files + 1,
          updatedAt: new Date(),
        }
      } else if ('content' in item) {
        return {
          ...item,
          content: this.addToFolderTree({ attachments: item.content, selectedId, folderName }),
        }
      }
      return item
    })
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Updates the most deeply selected folder with the new folder content.
   *
   * @param {FolderType[]} selectedFolder - The current selected folder array.
   * @param {FolderType} emptyFolder - The empty folder to be added.
   * @returns {FolderType[]} - The updated selected folder array.
   */
  private static updateSelectedFolder(selectedFolder: FolderType[], emptyFolder: FolderType): FolderType[] {
    return selectedFolder.map((folder, index) => {
      if (index === selectedFolder.length - 1) {
        // Update the most deeply selected folder
        return {
          ...folder,
          content: [...folder.content, emptyFolder],
          files: folder.files + 1,
          updatedAt: new Date(),
        }
      }
      return folder
    })
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Searches for an attachment by key, recursively checking nested content.
   *
   * @param {T[]} array - The array of items to search.
   * @param {Function} predicate - The predicate function to match the item.
   * @param {string} key - The key to search within nested items.
   * @returns {T | null} - The found item or null if not found.
   */

  public static searchAttachmentsByKey<T>(array: T[], predicate: (item: T) => boolean, key: string): T | null {
    for (const item of array) {
      // Check if the current item satisfies the predicate for the specified key
      if (predicate(item)) {
        return item // Return the item directly if the predicate matches
      }

      // If the item has the specified key and it's an array, search the nested array
      if (Array.isArray(item[key as keyof T])) {
        const nestedResult = this.searchAttachmentsByKey(item[key as keyof T] as T[], predicate, key)
        if (nestedResult) {
          return nestedResult // Return the exact object found within the nested structure
        }
      }
    }

    return null // Return null if no match is found
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Deletes an attachment by its ID, removing it from the folder structure recursively.
   *
   * @param {T[]} attachments - The array of attachments to modify.
   * @param {string[]} targetIds - The list of IDs to remove.
   * @returns {T[]} - The updated attachments array without the specified IDs.
   */
  public static deleteAttachmentById<T extends FileType | FolderType>(attachments: T[], targetIds: string[]): T[] {
    return attachments
      .filter(attachment => !targetIds.includes(attachment.id)) // Remove target folders at this level
      .map(attachment => {
        if ((attachment as FolderType).content) {
          // Recursively check and clean nested content
          return {
            ...attachment,
            content: this.deleteAttachmentById((attachment as FolderType).content, targetIds),
          }
        }
        return attachment // Return folder if no nested content
      })
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Renames an attachment (file or folder) by its ID.
   * It updates the name and modified timestamp of the attachment.
   * This method also supports recursive renaming for nested folders.
   *
   * @param {React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>>} setAttachments - The state setter function for attachments.
   * @param {string[]} targetIds - The list of attachment IDs to rename.
   * @param {string} newName - The new name to assign to the attachment.
   */
  public static renameAttachmentById(
    setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>>,
    targetIds: string[],
    newName: string
  ): void {
    setAttachments(oldAttachments =>
      oldAttachments.map(attachment => {
        if (targetIds.includes(attachment.id)) {
          // Rename the folder or file
          return { ...attachment, name: newName, updatedAt: new Date() }
        }
        if ((attachment as FolderType).content) {
          // Recursively check and rename nested content
          return {
            ...attachment,
            content: this.renameAttachmentRecursive((attachment as FolderType).content, targetIds, newName),
          } as FolderType
        }
        return attachment // Return the attachment if no match
      })
    )
  }

  /**
   * Recursively renames an attachment by its ID, including nested folders.
   *
   * @param {FileType | FolderType[]} attachments - The list of attachments (files or folders) to rename.
   * @param {string[]} targetIds - The list of attachment IDs to rename.
   * @param {string} newName - The new name to assign to the attachment.
   * @returns {FileType | FolderType[]} - The updated list of attachments with the renamed one(s).
   */
  private static renameAttachmentRecursive(
    attachments: (FileType | FolderType)[],
    targetIds: string[],
    newName: string
  ): (FileType | FolderType)[] {
    return attachments.map(attachment => {
      if (targetIds.includes(attachment.id)) {
        // Rename the folder or file
        return { ...attachment, name: newName, updatedAt: new Date() }
      }
      if ((attachment as FolderType).content) {
        // Recursively check and rename nested content
        return {
          ...attachment,
          content: this.renameAttachmentRecursive((attachment as FolderType).content, targetIds, newName),
        } as FolderType
      }
      return attachment // Return the attachment if no match
    })
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Selects files from a folder's content, toggling their selection status.
   * If all files are selected, they will be deselected; otherwise, they will be selected.
   *
   * @param {SelectAttachmentFromFolderContentArgs} params - The arguments containing the files and the setter function for the selected attachments.
   */
  public static selectAttachmentFromFolderContent({
    filesInCurrentTree,
    setSelectedAttachment,
  }: SelectAttachmentFromFolderContentArgs): void {
    setSelectedAttachment(prevSelected => {
      const allFilesSelected = filesInCurrentTree.every(file =>
        prevSelected.some(attachment => attachment.id === file.id)
      )

      // If all files are already selected, remove them
      if (allFilesSelected) {
        return prevSelected.filter(attachment => !filesInCurrentTree.some(file => file.id === attachment.id))
      }

      // Otherwise, add the files that are not already selected
      const newFiles = filesInCurrentTree.filter(file => !prevSelected.some(attachment => attachment.id === file.id))
      return [...prevSelected, ...newFiles] as FileType[]
    })
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Handles the upload of attachments, validates them, and updates the attachments state.
   * The upload process simulates progress and shows a loading toast.
   *
   * @param {UploadFilesArgs} params - The parameters containing the file input event, selected folder, and setter function for attachments.
   * @returns {Promise<void>} - A promise that resolves when the upload process is complete.
   */
  public static async advancedUploadAttachments({
    e,
    selectedFolder,
    setAttachments,
  }: UploadFilesArgs): Promise<void | string | number> {
    try {
      const files = e.currentTarget.files

      if (!files?.length) {
        return toast.error('Please select a file', {
          position: 'top-right',
        })
      }

      const newAttachments: FileType[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`, { position: 'top-right' })
          continue // Skip this file and continue with the next
        }

        const attachment: FileType = {
          id: uuidv7(),
          file: file,
          name: file.name,
          url: null,
          type: file.type,
          size: file.size.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          treeLevel: selectedFolder.length ? selectedFolder[selectedFolder.length - 1].treeLevel + 1 : 1,
        }

        // Zod validation for the attachment
        try {
          attachmentSchema.parse(attachment)
          newAttachments.push(attachment)
        } catch (err) {
          if (err instanceof z.ZodError) {
            toast.error(`Attachment validation failed: ${err.errors.map(e => e.message).join(', ')}`)
          }
          continue
        }
      }

      // random id for the toast
      const toastId = uuidv7()

      // Mock the upload promise with the interval
      const promise = await this.uploadPromise({ files: files.length, toastId })

      // Show upload success toast
      promise &&
        toast.success(`Successfully Uploaded ${files.length} file${files.length > 1 ? 's' : ''}`, {
          duration: 2000,
          position: 'top-right',
          id: toastId,
        })

      setAttachments(old => {
        if (selectedFolder.length > 0) {
          const selectedFolderId = selectedFolder[selectedFolder.length - 1].id

          // Define an async function to update the attachments
          const updateAttachments = async () => await this.updateFolderContent(old, selectedFolderId, newAttachments)

          // Call the async function and update the state
          updateAttachments().then(updatedAttachments => setAttachments(updatedAttachments))

          // Return the old state to avoid immediate state update
          return old
        }

        // If no folder is selected, just add new attachments to the old attachments
        return [...old, ...newAttachments]
      })

      // Clear the input
      e.target.value = ''
    } catch (error) {
      console.log(error)
      toast.error('Upload failed. Please try again.', { position: 'top-center' })
    }
  }

  /**
   * Simulates an upload process with progress updates.
   *
   * @param {UploadPromiseArgs} params - The arguments containing the number of files and toast ID.
   * @returns {Promise<UploadPromiseReturn>} - A promise that resolves with the upload progress.
   */
  private static async uploadPromise({ files, toastId }: UploadPromiseArgs): Promise<UploadPromiseReturn> {
    return new Promise(resolve => {
      let currentProgress = 0
      const remainingTime = this.getRemainingTime(currentProgress, 100)

      // Show initial toast loading message
      toast.loading(
        <UploadSonnerContentMemo
          progress={currentProgress}
          remainingTime={remainingTime}
          files={files}
        />,
        { id: toastId }
      )

      // Simulate progress update with interval
      const intervalId = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 10) + 1
        if (currentProgress > 100) currentProgress = 100

        // Update toast content with the new progress and remaining time
        toast.loading(
          <UploadSonnerContentMemo
            progress={currentProgress}
            remainingTime={remainingTime}
            files={files}
          />,
          { id: toastId }
        )

        // TODO: Mocked endpoint call here (replace with your actual endpoint)
        // Example:
        // await fetch('/your-endpoint', {
        //   method: 'POST',
        //   body: JSON.stringify({ files: files, progress: currentProgress }),
        //   headers: { 'Content-Type': 'application/json' },
        // });

        // Resolve the promise once progress reaches 100%
        if (currentProgress >= 100) {
          clearInterval(intervalId)

          resolve({ progress: currentProgress, files, remainingTime, message: 'Upload complete', toastId })
        }
      }, 20)
    })
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Opens a folder in the folder structure and updates the selected folder state.
   * If the folder is already open, it will be closed; otherwise, it will be opened.
   *
   * @param {FolderOpenArgs} params - The arguments containing the folder to open, the setter function for selected folder, and whether the folder exists in the tree.
   */
  public static folderOpen({ attachmentFolder, setSelected, exist_in_tree }: FolderOpenArgs) {
    setSelected(old => {
      if (!exist_in_tree)
        return [...old.filter(item => !(item.treeLevel >= attachmentFolder.treeLevel) && item), attachmentFolder]

      return old.filter(item => !(item.treeLevel >= attachmentFolder.treeLevel))
    })
  }

  // -------------------------------------------------------------------------------------------

  /**
   * Determines the file type based on the MIME type.
   *
   * @param {Blob | null} file - The file to check.
   * @returns {FileTypeEnum} - The file type enum value based on the MIME type.
   */
  public static getFileType(file: Blob | null): FileTypeEnum {
    if (!file) return FileTypeEnum.Unknown
    if (file.type.startsWith('audio/')) return FileTypeEnum.Audio
    if (file.type.startsWith('text/')) return FileTypeEnum.Text
    if (file.type.startsWith('image/')) return FileTypeEnum.Image
    if (file.type.startsWith('video/')) return FileTypeEnum.Video
    if (file.type.startsWith('application/pdf')) return FileTypeEnum.Pdf
    return FileTypeEnum.Unknown
  }

  /**
   * Calculates the remaining time based on the current progress and maximum progress.
   *
   * @param {number} currentProgress - The current progress of the upload.
   * @param {number} maxProgress - The maximum progress value (usually 100).
   * @returns {number} - The remaining time in seconds.
   */
  public static getRemainingTime(currentProgress: number, maxProgress: number): number {
    const progressPercentage = (currentProgress / maxProgress) * 100
    const calculatedRemainingTime = 200 - progressPercentage * 2
    return calculatedRemainingTime > 0 ? calculatedRemainingTime : 0
  }

  /**
   * Formats a time duration in seconds into a human-readable format.
   *
   * @param {number} seconds - The time duration in seconds.
   * @returns {string} - The formatted time string (e.g., "2d", "3h", "45m").
   */
  public static formatTime(seconds: number): string {
    const days = Math.floor(seconds / (24 * 3600))
    seconds %= 24 * 3600
    const hours = Math.floor(seconds / 3600)
    seconds %= 3600
    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)

    if (days > 0) return `${days}d `
    if (hours > 0) return `${hours}h `
    if (minutes > 0) return `${minutes}m `
    return `${seconds}s`
  }
}
