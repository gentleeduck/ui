import { toast } from 'sonner'
import { FileType } from './upload.constants'
import { AttachmentType, HandleAttachmentProps } from './upload.types'
import { uuidv7 } from 'uuidv7'

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
