import { toast } from 'sonner'
import {
  FileType,
  FolderType,
  HandleAttachmentProps,
  UploadFilesArgs,
  UploadPromiseArgs,
  UploadPromiseReturn,
} from './upload.types'
import { uuidv7 } from 'uuidv7'
import React from 'react'
import { UploadSonnerContent, UploadSonnerContentMemo } from './upload-sonner'
import { FileTypeEnum, MAX_FILE_SIZE } from './upload.constants'

export const uploadPromise = ({ files, toastId }: UploadPromiseArgs): Promise<UploadPromiseReturn> => {
  return new Promise(resolve => {
    let currentProgress = 0
    const remainingTime = getRemainingTime(currentProgress, 100)

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

export type FolderOpenArgs = {
  attachmentFolder: FolderType
  setSelected: React.Dispatch<React.SetStateAction<FolderType[]>>
  exist_in_tree: boolean
}

export function folderOpen({ attachmentFolder, setSelected, exist_in_tree }: FolderOpenArgs) {
  setSelected(old => {
    if (!exist_in_tree)
      return [...old.filter(item => !(item.treeLevel >= attachmentFolder.treeLevel) && item), attachmentFolder]

    return old.filter(item => !(item.treeLevel >= attachmentFolder.treeLevel))
  })
}

// Helper function to calculate remaining time
export function getRemainingTime(currentProgress: number, maxProgress: number) {
  const progressPercentage = (currentProgress / maxProgress) * 100
  const calculatedRemainingTime = 200 - progressPercentage * 2
  return calculatedRemainingTime > 0 ? calculatedRemainingTime : 0
}

export async function advancedUploadAttachments(props: UploadFilesArgs) {
  const { e, selectedFolder, setAttachments } = props

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
    const promise = await uploadPromise({ files: files.length, toastId })

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
        // Update the attachments recursively
        return updateFolderContent(old, selectedFolderId, newAttachments)
      }

      // If no folder is selected, just add new attachments to the old attachments
      return [...old, ...newAttachments]
    })

    // Clear the input
    e.target.value = ''
  } catch (error) {
    console.log(error)
    toast.error('Upload failed. Please try again.', { position: 'top-right' })
  }
}

export function updateFolderContent<T extends FileType | FolderType>(
  array: T[],
  folderId: string,
  newAttachments: T[]
): T[] {
  return array.map(item => {
    // If the current item is the folder we need to update
    if (item.id === folderId) {
      return {
        ...item,
        content: [...(item as FolderType).content, ...newAttachments],
      }
    }

    // If the current item contains nested folders, recursively call the function to go deeper
    if (Array.isArray((item as FolderType).content)) {
      return {
        ...item,
        content: updateFolderContent((item as FolderType).content, folderId, newAttachments),
      }
    }

    // If the item is not the folder and doesn't have nested folders, return it unchanged
    return item
  })
}

export function formatTime(seconds: number) {
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

export const getFileType = (file: Blob | null): FileTypeEnum => {
  if (!file) return FileTypeEnum.Unknown
  if (file.type.startsWith('audio/')) return FileTypeEnum.Audio
  if (file.type.startsWith('text/')) return FileTypeEnum.Text
  if (file.type.startsWith('image/')) return FileTypeEnum.Image
  if (file.type.startsWith('video/')) return FileTypeEnum.Video
  if (file.type.startsWith('application/pdf')) return FileTypeEnum.Pdf
  return FileTypeEnum.Unknown
}

export const getAttachmentsToState = ({ e, setAttachmentsState }: HandleAttachmentProps) => {
  const files = e.currentTarget.files

  if (!files) return toast.error('Please select a file')

  const newAttachments: FileType[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // if (file.size > 10 * 1024 * 1024) {
    //   toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`)
    //   continue // Skip this file and continue with the next
    // }

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

export const handleAdvancedAttachment = ({ e, setAttachmentsState }: HandleAttachmentProps) => {
  const files = e.currentTarget.files

  if (!files)
    return toast.error('Please select a file', {
      position: 'top-right',
    })

  const newAttachments: FileType[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // if (file.size > 10 * 1024 * 1024) {
    //   toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`)
    //   continue // Skip this file and continue with the next
    // }

    const attachment: FileType = {
      id: uuidv7(),
      file: file,
      name: file.name,
      url: null,
      type: file.type,
      size: file.size.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      treeLevel: 1,
    }

    newAttachments.push(attachment)
  }

  setAttachmentsState(prev => [...prev, ...newAttachments])
  e.currentTarget.value = ''
}

/**
 * Deep merge two objects, recursively merging properties.
 * - Handles arrays, objects, and primitive values.
 * - Ensures immutability by not mutating the original target object.
 *
 * @param target - The target object.
 * @param source - The source object.
 * @returns A new object with merged properties.
 */
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  // Create a new object to avoid mutating the original target
  const output = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = target[key]
      const sourceValue = source[key]

      // Check if both target and source are objects, and not null
      if (isObject(targetValue) && isObject(sourceValue)) {
        // Recursively merge the objects
        output[key] = deepMerge(targetValue, sourceValue as Partial<T[Extract<keyof T, string>] & Record<string, any>>)
      } else {
        // Otherwise, directly assign the source value (includes arrays and primitives)
        output[key] = sourceValue as T[Extract<keyof T, string>]
      }
    }
  }

  return output
}

/**
 * Helper function to check if a value is a plain object (and not an array or null).
 *
 * @param value - The value to check.
 * @returns Whether the value is a plain object.
 */
const isObject = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function addFolderToPath({
  selectedFolder,
  setAttachments,
  setSelectedFolder,
  folderName,
}: {
  selectedFolder: FolderType[]
  setSelectedFolder: React.Dispatch<React.SetStateAction<FolderType[]>>
  setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>>
  folderName: string
}) {
  const emptyFolder: FolderType = {
    id: Math.random().toString(36).slice(2),
    name: folderName,
    content: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    treeLevel: selectedFolder.length ? selectedFolder[selectedFolder.length - 1].treeLevel + 1 : 1,
  }

  const addToFolderTree = (items: (FileType | FolderType)[], selectedId: string): (FileType | FolderType)[] => {
    return items.map(item => {
      if ('content' in item && item.id === selectedId) {
        return {
          ...item,
          content: [...item.content, emptyFolder],
          updatedAt: new Date(),
        }
      } else if ('content' in item) {
        return {
          ...item,
          content: addToFolderTree(item.content, selectedId),
        }
      }
      return item
    })
  }

  const updateSelectedFolder = (selectedFolder: FolderType[], emptyFolder: FolderType): FolderType[] => {
    return selectedFolder.map((folder, index) => {
      if (index === selectedFolder.length - 1) {
        // Update the most deeply selected folder
        return {
          ...folder,
          content: [...folder.content, emptyFolder],
          updatedAt: new Date(),
        }
      }
      return folder
    })
  }

  setAttachments(oldAttachments => {
    if (!selectedFolder.length) {
      // Add folder to root level if no folder is selected
      return [...oldAttachments, emptyFolder]
    }

    // Use the ID of the most deeply selected folder
    const selectedId = selectedFolder[selectedFolder.length - 1].id
    return addToFolderTree(oldAttachments, selectedId)
  })

  setSelectedFolder(oldSelectedFolder => {
    if (!selectedFolder.length) {
      // If no folder is selected, keep the selected folder unchanged
      return oldSelectedFolder
    }
    return updateSelectedFolder(oldSelectedFolder, emptyFolder)
  })

  toast.info('Folder added successfully!')
}

export function searchAttachmentsByKey<T>(array: T[], predicate: (item: T) => boolean, key: string): T | null {
  for (const item of array) {
    // Check if the current item satisfies the predicate for the specified key
    if (predicate(item)) {
      return item // Return the item directly if the predicate matches
    }

    // If the item has the specified key and it's an array, search the nested array
    if (Array.isArray(item[key as keyof T])) {
      const nestedResult = searchAttachmentsByKey(item[key as keyof T] as T[], predicate, key)
      if (nestedResult) {
        return nestedResult // Return the exact object found within the nested structure
      }
    }
  }

  return null // Return null if no match is found
}

/**
 * Recursively deletes folders by an array of IDs, including all their nested content.
 * @param attachments The list of folders or attachments.
 * @param targetIds The array of IDs of the folders to delete.
 * @returns Updated folder structure with the target folders and their nested content removed.
 */
export function deleteAttachmentById<T extends FileType | FolderType>(attachments: T[], targetIds: string[]): T[] {
  return attachments
    .filter(attachment => !targetIds.includes(attachment.id)) // Remove target folders at this level
    .map(attachment => {
      if ((attachment as FolderType).content) {
        // Recursively check and clean nested content
        return {
          ...attachment,
          content: deleteAttachmentById((attachment as FolderType).content, targetIds),
        }
      }
      return attachment // Return folder if no nested content
    })
}

/**
 * Recursively renames folders or files by their IDs.
 * @param attachments The list of folders or attachments.
 * @param targetIds The array of IDs of the folders or files to rename.
 * @param newName The new name for the target folders or files.
 * @returns Updated folder structure with the renamed items.
 */
export function renameAttachmentById<T extends FileType | FolderType>(
  attachments: T[],
  targetIds: string[],
  newName: string
): T[] {
  return attachments.map(attachment => {
    if (targetIds.includes(attachment.id)) {
      // Rename the folder or file
      return { ...attachment, name: newName, updatedAt: new Date() }
    }
    if ((attachment as FolderType).content) {
      // Recursively check and rename nested content
      return {
        ...attachment,
        content: renameAttachmentById((attachment as FolderType).content, targetIds, newName),
      }
    }
    return attachment // Return folder if no match
  })
}

export const moveAttachmentsToPath = ({
  setAttachments,
  setSelectedAttachment,
  selectedAttachments,
  path,
}: {
  setAttachments: React.Dispatch<React.SetStateAction<(FileType | FolderType)[]>>
  setSelectedAttachment: React.Dispatch<React.SetStateAction<FileType[]>>
  selectedAttachments: FileType[]
  path: string
}): void => {
  const pathParts = path.split('/').filter(part => part.trim() !== '')

  // Handle the state update for attachments
  setAttachments(prevAttachments => {
    const updatedAttachments = deleteAttachmentById(
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
        return attachments
      }

      // If the folder doesn't exist, create it
      if (!folder) {
        folder = {
          id: `${currentFolderName}-${Date.now()}`,
          name: currentFolderName,
          content: remainingPathParts.length > 0 ? [] : selectedAttachments, // Only add attachments if it's the last part
          createdAt: new Date(),
          updatedAt: new Date(),
          treeLevel,
        }

        // Add the new folder to the attachments array
        attachments.push(folder)
      } else {
        // If folder exists, update it with new content at the last part
        folder.updatedAt = new Date() // Update the folder's last updated time
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

export function selectAttachmentFromFolderContent({
  filesInCurrentTree,
  setSelectedAttachment,
}: {
  filesInCurrentTree: (FileType | FolderType)[]
  setSelectedAttachment: React.Dispatch<React.SetStateAction<FileType[]>>
  checkState?: boolean
}) {
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

export const uploadAttachmentPromise = (files: number, toastId: string): Promise<UploadPromiseReturn> => {
  toast.loading(
    <UploadSonnerContent
      progress={0}
      files={files}
    />,
    {
      duration: 400000,
      id: toastId,
    }
  )

  return new Promise(resolve => {
    let currentProgress = 0

    toast.loading(
      <UploadSonnerContent
        progress={currentProgress}
        files={files}
      />,
      {
        duration: 400000,
        id: toastId,
      }
    )

    const intervalId = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 1 // Increment progress by a random value
      if (currentProgress > 100) currentProgress = 100 // Ensure progress does not exceed 100%

      if (currentProgress >= 100) {
        clearInterval(intervalId) // Clear the interval once upload is complete
        resolve({ progress: currentProgress, message: 'Upload complete', files: 3, toastId }) // Resolve the promise when progress reaches 100
      }

      toast.loading(
        <UploadSonnerContent
          progress={currentProgress}
          files={files}
        />,
        {
          id: toastId,
        }
      )
    }, 20) // Adjust the interval time as needed
  })
}
