import { File, FileAudio, FileImage, FileText, FileVideo, X } from 'lucide-react'
import React from 'react'
import { AlertDialogCustom } from './alert-dialog'
import { ContextMenu, ContextMenuTrigger } from './context-menu'
import { Input } from './input'
import { ScrollArea } from './scroll-area'
import { uuidv7 } from 'uuidv7'
import { toast } from 'sonner'
import { filesize } from 'filesize'
import { cn } from '@/lib'
import { Button } from '@/registry'
import { Upload as UploadIcon } from 'lucide-react'

// Define an enum for file types
export enum FileType {
  Audio = 'audio',
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Pdf = 'pdf',
  Unknown = 'unknown',
}

// Mapping file types to their corresponding Lucide icons
export const fileTypeIcons = {
  [FileType.Audio]: <FileAudio className="w-8 h-8" />,
  [FileType.Text]: <FileText className="w-8 h-8" />,
  [FileType.Image]: <FileImage className="w-8 h-8" />,
  [FileType.Video]: <FileVideo className="w-8 h-8" />,
  [FileType.Pdf]: <FileText className="w-8 h-8" />,
  [FileType.Unknown]: <File className="w-8 h-8" />,
}

// Function to determine the file type based on the file's MIME type
export const getFileType = (file: Blob | null): FileType => {
  if (!file) return FileType.Unknown
  if (file.type.startsWith('audio/')) return FileType.Audio
  if (file.type.startsWith('text/')) return FileType.Text
  if (file.type.startsWith('image/')) return FileType.Image
  if (file.type.startsWith('video/')) return FileType.Video
  if (file.type.startsWith('application/pdf')) return FileType.Pdf
  return FileType.Unknown
}

export interface AttachmentType {
  id: string
  file: Blob | null
  url: string | null
  type: string
  name: string
  size: string
}

export interface UploadContextType {
  attachments: AttachmentType[]
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentType[]>>
  attachmentsState: AttachmentType[]
  setAttachmentsState: React.Dispatch<React.SetStateAction<AttachmentType[]>>
}

// Upload Context
const UploadContext = React.createContext<UploadContextType | null>(null)

export const useUploadContext = () => {
  const context = React.useContext(UploadContext)
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider')
  }
  return context
}

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
  const [attachments, setAttachments] = React.useState<AttachmentType[]>([])
  const [attachmentsState, setAttachmentsState] = React.useState<AttachmentType[]>([])

  return (
    <UploadContext.Provider value={{ attachments, setAttachments, attachmentsState, setAttachmentsState }}>
      {children}
    </UploadContext.Provider>
  )
}

// Upload
export interface UploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode
  content: React.ReactNode
}

export const Upload = ({ children, trigger, content }: UploadProps) => {
  const { setAttachments, attachmentsState, setAttachmentsState } = useUploadContext()
  return (
    <>
      {children ? (
        children
      ) : (
        <AlertDialogCustom
          type="sheet"
          drawerData={attachmentsState.length > 0}
          header={{
            head: 'Upload File',
            description: 'Set your daily calorie goal',
          }}
          actions={{
            continue: () => {
              setAttachments([])
              setAttachmentsState([])
            },
          }}
          footer={{
            className: 'Upload an attachment to your comment.',
            submit: {
              onClick: () => {
                setAttachments(prev => [...prev, ...attachmentsState])
                setAttachmentsState([])
              },
              disabled: attachmentsState.length === 0,
              children: <Button disabled={attachmentsState.length === 0}>Submit</Button>,
            },
            cancel: {
              children: <Button variant="outline">Cancel</Button>,
            },
          }}
          state={attachmentsState.length}
          trigger={{ children: trigger }}
          content={{ children: content }}
        />
      )}
    </>
  )
}

// Upload Trigger
export interface UploadTriggerProps extends React.HTMLProps<HTMLDivElement> {}

export const UploadTrigger = React.forwardRef<HTMLDivElement, UploadTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn(className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
)

// Upload Input
export interface UploadInputProps extends React.HTMLProps<HTMLDivElement> {}

export const UploadInput = React.forwardRef<HTMLDivElement, UploadInputProps>(
  ({ className, children, ...props }, ref) => {
    const { setAttachmentsState } = useUploadContext()

    return (
      <div
        className={cn(className)}
        ref={ref}
        {...props}
      >
        <ContextMenu>
          <ContextMenuTrigger className="relative flex flex-col items-center justify-center w-full h-64 rounded-md border border-dashed border-border text-sm leading-5 transition-colors duration-100 ease-in-out hover:bg-muted/10">
            <div className="grid place-items-center gap-4">
              <UploadIcon className="size-[30px]" />
              <span>Click to upload</span>
            </div>
            <Input
              placeholder="Filter files..."
              type="file"
              className="absolute w-full h-full opacity-0 cursor-pointer"
              multiple={true}
              onChange={e => handleAttachment({ e, setAttachmentsState })}
            />
          </ContextMenuTrigger>
        </ContextMenu>
        <p className="mt-2 text-muted-foreground text-[.9rem]"> Supports all file types.</p>
      </div>
    )
  }
)

export interface UploadContentProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {}
export const UploadContent = React.forwardRef<HTMLDivElement, UploadContentProps>(
  ({ className, children, ...props }, ref) => {
    const { attachmentsState, setAttachmentsState } = useUploadContext()

    return (
      <ScrollArea
        className={cn('flex flex-col gap-2 max-h-[39ch] md:max-h-[43ch]', className)}
        ref={ref}
        {...props}
      >
        {children}
        <div className="flex flex-col gap-2">
          {attachmentsState.map(attachment => {
            return (
              <UploadItem
                key={attachment.id}
                attachment={attachment}
              >
                <UploadtItemRemove
                  className="absolute top-1/2 -translate-y-1/2 right-2"
                  onClick={() => {
                    setAttachmentsState(prev => prev.filter(item => item.id !== attachment.id))
                  }}
                />
              </UploadItem>
            )
          })}
        </div>
      </ScrollArea>
    )
  }
)

// Upload Item
export interface UploadItemProps extends React.HTMLProps<HTMLDivElement> {
  attachment: AttachmentType
}

export const UploadItem = React.forwardRef<HTMLDivElement, UploadItemProps>(
  ({ attachment, children, className, ...props }, ref) => {
    const fileType = getFileType(attachment.file)
    return (
      <div
        className={cn('relative flex items-center gap-4 bg-secondary/20 rounded-md p-2', className)}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-4">
          <div className="relative">{fileTypeIcons[fileType]}</div>
          <div className="grid items-start">
            <h3 className="inline-block text-[.9rem] truncate max-w-[200px]">{attachment.name || 'Empty File'}</h3>
            <p className="inline-block truncate text-semibold text-[.8rem] max-w-[300px]">
              {filesize(attachment.file ? +attachment.file.size : 0, { round: 0 })}
            </p>
          </div>
        </div>
        {children}
      </div>
    )
  }
)

// Attachment Remove Component
export interface UploadtItemRemoveProps extends React.HTMLProps<HTMLDivElement> {}

export const UploadtItemRemove = React.forwardRef<HTMLDivElement, UploadtItemRemoveProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'size-4 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer',
          className
        )}
        ref={ref}
        {...props}
      >
        <X className="w-4 h-4" />
      </div>
    )
  }
)

// Handle Attachment Function
export interface HandleAttachmentProps {
  e: React.ChangeEvent<HTMLInputElement>
  setAttachmentsState: React.Dispatch<React.SetStateAction<AttachmentType[]>>
}

export const handleAttachment = ({ e, setAttachmentsState }: HandleAttachmentProps) => {
  const files = e.currentTarget.files

  if (!files) return toast.error('Please select a file')

  const newAttachments: AttachmentType[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (file.size > 10 * 1024 * 1024) {
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

  setAttachmentsState(prev => [...prev, ...newAttachments])
  e.currentTarget.value = ''
}
