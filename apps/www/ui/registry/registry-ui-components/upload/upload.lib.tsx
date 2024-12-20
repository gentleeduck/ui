import { toast } from 'sonner'
import { FileType, MAX_SIZE } from './upload.constants'
import {
  AttachmentType,
  FolderType,
  HandleAttachmentProps,
  UploadFilesArgs,
  UploadPromiseArgs,
  UploadPromiseReturn,
} from './upload.types'
import { uuidv7 } from 'uuidv7'
import { UploadSonnerContentMemo } from './upload'
import React from 'react'

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
        resolve({ progress: currentProgress, files, remainingTime })
      }
    }, 200)
  })
}

// Helper function to calculate remaining time
export function getRemainingTime(currentProgress: number, maxProgress: number) {
  const progressPercentage = (currentProgress / maxProgress) * 100
  const calculatedRemainingTime = 200 - progressPercentage * 2
  return calculatedRemainingTime > 0 ? calculatedRemainingTime : 0
}

export async function uploadFiles(props: UploadFilesArgs) {
  const { e, selectedFolder, setSelectedFolder, setAttachments } = props

  try {
    const files = e.currentTarget.files

    if (!files?.length)
      return toast.error('Please select a file', {
        position: 'top-right',
      })

    const newAttachments: AttachmentType[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (file.size > MAX_SIZE) {
        toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`)
        continue // Skip this file and continue with the next
      }

      const attachment: AttachmentType = {
        id: uuidv7(),
        file: file,
        name: file.name,
        url: null,
        type: file.type,
        size: file.size.toString(),
      }

      newAttachments.push(attachment)
    }

    // random id
    const toastId = Math.random()

    // Upload promise
    const promise = await uploadPromise({ files: files.length, toastId })

    // Show upload progress toast
    promise &&
      toast.success(`Successfully Uploaded ${files.length} file${files.length > 1 ? 's' : ''}`, {
        duration: 2000,
        id: toastId,
      })

    // After the upload is done, update the state
    if (selectedFolder.length > 0) {
      return setSelectedFolder(old => {
        return old.map(item =>
          item.id === selectedFolder[selectedFolder.length - 1].id
            ? {
                ...item,
                files: (item as FolderType).files + newAttachments.length,
                content: [...selectedFolder[selectedFolder.length - 1]?.content, ...newAttachments],
              }
            : item
        )
      })
    }

    // console.log()
    setAttachments(old => {
      if (selectedFolder.length > 0) {
        return old.map(item =>
          item.id === selectedFolder[selectedFolder.length - 1].id
            ? {
                ...item,
                files: (item as FolderType).files + newAttachments.length,
                content: [...selectedFolder[selectedFolder.length - 1]?.content, ...newAttachments],
              }
            : item
        )
      }
      return [...old, ...newAttachments]
    })

    // Clear the input
    e.target.value = ''
  } catch (error) {
    console.log(error)
    toast.error('Upload failed. Please try again.')
  }
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

export const getFileType = (file: Blob | null): FileType => {
  if (!file) return FileType.Unknown
  if (file.type.startsWith('audio/')) return FileType.Audio
  if (file.type.startsWith('text/')) return FileType.Text
  if (file.type.startsWith('image/')) return FileType.Image
  if (file.type.startsWith('video/')) return FileType.Video
  if (file.type.startsWith('application/pdf')) return FileType.Pdf
  return FileType.Unknown
}

export const handleAttachment = ({ e, setAttachmentsState }: HandleAttachmentProps) => {
  const files = e.currentTarget.files

  if (!files) return toast.error('Please select a file')

  const newAttachments: AttachmentType[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // if (file.size > 10 * 1024 * 1024) {
    //   toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`)
    //   continue // Skip this file and continue with the next
    // }

    const attachment: AttachmentType = {
      id: uuidv7(),
      file: file,
      name: file.name,
      url: null,
      type: file.type,
      size: file.size.toString(),
    }

    newAttachments.push(attachment)
  }

  console.log(newAttachments)
  setAttachmentsState(prev => [...prev, ...newAttachments])
  e.currentTarget.value = ''
}

export const handleAdvancedAttachment = ({ e, setAttachmentsState }: HandleAttachmentProps) => {
  const files = e.currentTarget.files

  if (!files)
    return toast.error('Please select a file', {
      position: 'top-right',
    })

  const newAttachments: AttachmentType[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // if (file.size > 10 * 1024 * 1024) {
    //   toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`)
    //   continue // Skip this file and continue with the next
    // }

    const attachment: AttachmentType = {
      id: uuidv7(),
      file: file,
      name: file.name,
      url: null,
      type: file.type,
      size: file.size.toString(),
    }

    newAttachments.push(attachment)
  }

  console.log(newAttachments)
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
