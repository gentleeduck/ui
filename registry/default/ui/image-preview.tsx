import { cn } from '@/lib'
import React from 'react'
import { AsyncImage } from 'loadable-image'
import { AttachmentType } from './upload'
import { DropdownMenuView } from './dropdown-menu'
import { CircleX, Download, Ellipsis, Trash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogWrapper,
  Skeleton,
} from './ShadcnUI'
import { ScrollArea } from './scroll-area'
import { filesize } from 'filesize'
import { downloadAttachment } from './comment'
import { Button } from './button'

export interface ImagePreviewProps extends React.HTMLProps<HTMLImageElement> {}

export const ImagePreview = React.forwardRef<HTMLImageElement, ImagePreviewProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn('grid grid-cols-3 gap-x-2 max-w-[90%]', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

export interface ImagePreviewItemProps extends React.HTMLProps<HTMLDivElement> {
  attachment?: AttachmentType
}

export const ImagePreviewItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, attachment, children, ...props }, ref) => {
    return (
      <div
        className={cn('relative h-fit', className)}
        ref={ref}
        {...props}
      >
        <Dialog>{children}</Dialog>
      </div>
    )
  }
)

export interface ImagePreviewTriggerProps extends React.ComponentPropsWithoutRef<typeof DialogTrigger> {
  attachment?: AttachmentType
}
export const ImagePreviewTrigger = React.forwardRef<HTMLButtonElement, ImagePreviewTriggerProps>(
  ({ className, attachment, children, ...props }, ref) => {
    const url = attachment ? (attachment.url ? attachment.url : URL.createObjectURL(attachment.file as Blob)) : null
    const [error, setError] = React.useState<boolean>(false)

    return (
      <DialogTrigger
        className={cn('relative', error && 'pointer-events-none opacity-70', className)}
        ref={ref}
        {...props}
      >
        {children ? (
          children
        ) : (
          <picture className="w-full h-[100px] rounded-lg overflow-hidden cursor-pointer">
            <AsyncImage
              src={url ?? ''}
              loading="lazy"
              style={{ width: 115.35, height: 116.4 }}
              loader={<Skeleton className="w-full h-[100px] rounded-lg object-cover object-center" />}
              onError={() => {
                setError(true)
              }}
              error={
                <div className="w-full h-[100px] rounded-lg object-cover object-center items-center flex flex-col gap-2 place-content-center bg-red-800/40 text-red-400">
                  <CircleX className="size-5 mx-auto" />
                  <span className="text-sm text-center">Failed</span>
                </div>
              }
              className="w-full h-[100px] rounded-lg object-cover object-center"
              alt={attachment?.name ?? ''}
            />
          </picture>
        )}
      </DialogTrigger>
    )
  }
)

export interface FetchAudioBlobParams {
  url: string
}

export const fetchBlob = async ({ url }: FetchAudioBlobParams): Promise<Blob | null> => {
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

export interface ImagePreviewContentProps extends React.HTMLProps<HTMLDivElement> {
  attachment?: AttachmentType
}

export const ImagePreviewContent = React.forwardRef<HTMLDivElement, ImagePreviewContentProps>(
  ({ className, attachment, children, ...props }, ref) => {
    const url = attachment ? (attachment.url ? attachment.url : URL.createObjectURL(attachment.file as Blob)) : null
    return (
      <DialogContent
        className={cn('max-w-[1000px] w-[1000px] h-[600px] p-4', className)}
        ref={ref}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            <div>
              <DialogTitle className="text-xl font-bold max-w-[85%]">{attachment?.name ?? ''}</DialogTitle>
              <DialogDescription className="text-sm flex items-start text-accent-foreground/80">
                Size:
                <span className="text-muted-foreground truncate">{filesize(attachment?.size ?? 0, { round: 0 })}</span>
              </DialogDescription>
            </div>
            <ScrollArea className="h-full w-full rounded-lg relative">
              <Button
                className="absolute top-4 right-4 hover:bg-primary"
                icon={{ children: Download }}
                onClick={() => {
                  downloadAttachment({ attachment: attachment! })
                }}
                label={{ children: 'Download' }}
              />
              <img
                className="w-full h-full object-cover object-center cursor-pointer"
                src={url ?? ''}
              />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    )
  }
)
