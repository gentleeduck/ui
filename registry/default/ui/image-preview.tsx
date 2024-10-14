import { cn } from '@/lib'
import React from 'react'
import { AttachmentType } from './upload'
import { DropdownMenuView } from './dropdown-menu'
import { Download, Ellipsis, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogWrapper } from './ShadcnUI'
import { ScrollArea } from './scroll-area'
import { filesize } from 'filesize'
import { downloadAttachment } from './comment'

export interface ImagePreviewProps extends React.HTMLProps<HTMLImageElement> {}

export const ImagePreview = React.forwardRef<HTMLImageElement, ImagePreviewProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn('grid grid-cols-3 gap-2 max-w-[90%] my-2', className)}
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

    return (
      <DialogTrigger
        className={cn('relative', className)}
        ref={ref}
        {...props}
      >
        {children ? (
          children
        ) : (
          <picture className="w-full h-[100px] rounded-lg overflow-hidden cursor-pointer">
            <img
              className={cn('w-full h-[100px] rounded-lg object-cover object-center', className)}
              src={url ?? ''}
            />
          </picture>
        )}
      </DialogTrigger>
    )
  }
)

export interface ImagePreviewContentProps extends React.HTMLProps<HTMLDivElement> {
  attachment?: AttachmentType
}

export const ImagePreviewContent = React.forwardRef<HTMLDivElement, ImagePreviewContentProps>(
  ({ className, attachment, children, ...props }, ref) => {
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
                <p className="text-muted-foreground truncate">{filesize(attachment?.size ?? 0, { round: 0 })}</p>
              </DialogDescription>
            </div>
            <ScrollArea className="h-full w-full rounded-lg">
              <img
                className="w-full h-full object-cover object-center cursor-pointer"
                src={attachment?.url ?? ''}
              />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    )
  }
)
