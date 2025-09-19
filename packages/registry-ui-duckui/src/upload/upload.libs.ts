import { toast } from 'sonner'
import { uuidv7 } from 'uuidv7'
import { FileTypeEnum } from './upload.constants'
import { FileType } from './upload.types'

export const getFileType = (type: string): string => {
  if (!type) return FileTypeEnum.Unknown
  if (type.startsWith('audio/')) return FileTypeEnum.Audio
  if (type.startsWith('text/')) return FileTypeEnum.Text
  if (type.startsWith('image/')) return FileTypeEnum.Image
  if (type.startsWith('video/')) return FileTypeEnum.Video
  if (type.startsWith('application/pdf')) return FileTypeEnum.Pdf
  return FileTypeEnum.Unknown
}

export const getAttachmentsToState = ({
  e,
  setAttachmentsState,
}: {
  e: React.ChangeEvent<HTMLInputElement>
  setAttachmentsState: React.Dispatch<React.SetStateAction<FileType[]>>
}) => {
  const files = e.currentTarget.files

  if (!files) return toast.error('Please select a file')

  const newAttachments: FileType[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (!file) return
    // if (file !== undefined && file.size > 10 * 1024 * 1024) {
    //   toast.error(
    //     `File has exceeded the max size: ${file.name.slice(0, 15)}...`,
    //   )
    //   return
    //   // continue // Skip this file and continue with the next
    // }

    const attachment: FileType = {
      file: file,
      id: uuidv7(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: null,
    }

    newAttachments.push(attachment)
  }

  setAttachmentsState((prev) => [...prev, ...newAttachments])
  e.currentTarget.value = ''
}

export const downloadAttachment = async ({ attachment }: { attachment: FileType }) => {
  if (attachment.file) {
    const file: Blob = attachment.file as Blob
    return download(file, attachment.name ?? 'image.jpg')
  }

  if (attachment.url) {
    const file = await fetchBlob({
      url: 'https://cdn.dribbble.com/userupload/15140814/file/original-22eddfd50ce84be4acb8bbbd50cf7840.jpg?resize=1600x1200',
    })
    return download(file ?? new Blob([]), attachment.name ?? 'image.jpg')
  }
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = new Date().getTime() + '_' + name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const fetchBlob = async ({ url }: { url: string }): Promise<Blob | null> => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText} (status: ${response.status})`)
    }

    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('Error fetching audio:', error)
    return null
  }
}
