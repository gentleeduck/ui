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
  UploadPromiseArgs,
  UploadPromiseReturn,
} from './upload.types'
import { uuidv7 } from 'uuidv7'
import React from 'react'
import { UploadSonnerContentMemo } from './upload-sonner'

export class UploadManager {
  public static async getAttachmentsToState({ e, setAttachmentsState }: HandleAttachmentProps) {
    const files = e.currentTarget.files

    if (!files) return toast.error('Please select a file')

    const newAttachments: FileType[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`)
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
      }

      newAttachments.push(attachment)
    }

    setAttachmentsState(prev => [...prev, ...newAttachments])
    e.currentTarget.value = ''
  }

  // -------------------------------------------------------------------------------------------

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
      console.log(updatedAttachmentsWithPath)

      // Update the selected attachments state
      setSelectedAttachment([])

      // Return the updated attachments array to set it into the state
      return updatedAttachmentsWithPath
    })
  }

  // -------------------------------------------------------------------------------------------

  public static emptyFolder = (name: string, treeLevel: number) => ({
    id: uuidv7(),
    name,
    files: 0,
    content: [] as (FileType | FolderType)[],
    createdAt: new Date(),
    updatedAt: new Date(),
    treeLevel,
  })

  public static async addFolderToPath({
    selectedFolder,
    setAttachments,
    setSelectedFolder,
    folderName,
  }: addFolderToPathArgs) {
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
  }

  // -------------------------------------------------------------------------------------------

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
        return attachment // Return folder if no match
      })
    )
  }

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
      return attachment // Return folder if no match
    })
  }

  // -------------------------------------------------------------------------------------------

  public static selectAttachmentFromFolderContent({
    filesInCurrentTree,
    setSelectedAttachment,
  }: SelectAttachmentFromFolderContentArgs): void {
    setSelectedAttachment(prevSelected => {
      const allFilesSelected = filesInCurrentTree.every(file =>
        prevSelected.some(attachment => attachment.id === file.id)
      )

      // If all files are already selected, remove them
      if (allFilesSelected)
        return prevSelected.filter(attachment => !filesInCurrentTree.some(file => file.id === attachment.id))
      // Otherwise, add the files that are not already selected
      const newFiles = filesInCurrentTree.filter(file => !prevSelected.some(attachment => attachment.id === file.id))
      return [...prevSelected, ...newFiles] as FileType[]
    })
  }

  // -------------------------------------------------------------------------------------------

  public static async advancedUploadAttachments({ e, selectedFolder, setAttachments }: UploadFilesArgs) {
    try {
      const files = e.currentTarget.files

      if (!files?.length)
        return toast.error('Please select a file', {
          position: 'top-right',
        })

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

        newAttachments.push(attachment)
      }

      // random id
      const toastId = uuidv7()

      // Upload promise
      const promise = await UploadManager.uploadPromise({ files: files.length, toastId })

      // Show upload progress toast
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

        // Resolve the promise once progress reaches 100%
        if (currentProgress >= 100) {
          clearInterval(intervalId)
          resolve({ progress: currentProgress, files, remainingTime, message: 'Upload complete', toastId })
        }
      }, 20)
    })
  }

  // -------------------------------------------------------------------------------------------

  public static folderOpen({ attachmentFolder, setSelected, exist_in_tree }: FolderOpenArgs) {
    setSelected(old => {
      if (!exist_in_tree)
        return [...old.filter(item => !(item.treeLevel >= attachmentFolder.treeLevel) && item), attachmentFolder]

      return old.filter(item => !(item.treeLevel >= attachmentFolder.treeLevel))
    })
  }

  // -------------------------------------------------------------------------------------------

  public static getFileType(file: Blob | null): FileTypeEnum {
    if (!file) return FileTypeEnum.Unknown
    if (file.type.startsWith('audio/')) return FileTypeEnum.Audio
    if (file.type.startsWith('text/')) return FileTypeEnum.Text
    if (file.type.startsWith('image/')) return FileTypeEnum.Image
    if (file.type.startsWith('video/')) return FileTypeEnum.Video
    if (file.type.startsWith('application/pdf')) return FileTypeEnum.Pdf
    return FileTypeEnum.Unknown
  }

  public static getRemainingTime(currentProgress: number, maxProgress: number) {
    const progressPercentage = (currentProgress / maxProgress) * 100
    const calculatedRemainingTime = 200 - progressPercentage * 2
    return calculatedRemainingTime > 0 ? calculatedRemainingTime : 0
  }

  public static formatTime(seconds: number) {
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
