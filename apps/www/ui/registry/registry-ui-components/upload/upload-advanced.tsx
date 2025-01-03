'use client'

import React from 'react'
import {
  AlertDialogSheet,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuView,
  Progress,
  ScrollBar,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '@/registry/default/ui'
import { ContextMenu, ContextMenuTrigger } from '@/registry/default/ui'
import { Input } from '@/registry/default/ui'
import { ScrollArea } from '@/registry/default/ui'
import { filesize } from 'filesize'
import { Button, buttonVariants } from '../button'
import { CircleCheck, Download, Ellipsis, Folder, FolderOpen, Loader, Trash, Upload as UploadIcon } from 'lucide-react'
import {
  AttachmentType,
  FolderType,
  SelectedFolderType,
  UploadAdvancedContextType,
  UploadContentProps,
  UploadContextType,
  UploadInputPsrops,
  UploadItemProps,
  UploadProps,
  UploadtItemRemoveProps,
  UploadTriggerProps,
} from './upload.types'
import { fileTypeIcons, UploadOrDragSvg } from './upload.constants'
import { formatTime, getFileType, handleAttachment, uploadFiles } from './upload.lib'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { downloadAttachment } from '@/registry/default/ui/comment'
import { uuidv7 } from 'uuidv7'
import { AlertDelete } from '../alert'

const UploadAdvancedContext = React.createContext<UploadAdvancedContextType<AttachmentType | FolderType> | null>(null)

export const useUploadAdvancedContext = () => {
  const context = React.useContext(UploadAdvancedContext)
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider')
  }
  return context
}

export const UploadAdvancedProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFolder, setSelectedFolder] = React.useState<SelectedFolderType[]>([])
  const [attachments, setAttachments] = React.useState<(AttachmentType | FolderType)[]>([])
  const [attachmentsState, setAttachmentsState] = React.useState<(AttachmentType | FolderType)[]>([])

  return (
    <UploadAdvancedContext.Provider
      value={{
        attachments,
        setAttachments,
        attachmentsState,
        setAttachmentsState,
        selectedFolder,
        setSelectedFolder,
      }}
    >
      {children}
    </UploadAdvancedContext.Provider>
  )
}

export const UploadAdvancedButton = () => {
  const { setAttachments, selectedFolder, setSelectedFolder } = useUploadAdvancedContext() ?? {}

  return (
    <>
      <Button
        className="relative "
        variant={'default'}
        size={'xs'}
        icon={{ children: UploadIcon }}
      >
        <Input
          placeholder="Filter files..."
          type="file"
          className="absolute w-full h-full opacity-0 cursor-pointer"
          multiple={true}
          onChange={e => uploadFiles({ e, selectedFolder, setSelectedFolder, setAttachments })}
        />
        Upload file
      </Button>
    </>
  )
}

export const UploadAdnvacedContent = () => {
  const { selectedFolder, attachments } = useUploadAdvancedContext() ?? {}

  return (
    <ScrollArea className="h-full">
      <div className="flex items-center h-full rounded-md">
        <div className="flex items-center h-full rounded-md">
          <UploadAttachmentsTreeItem attachments={attachments} />
          <Separator orientation="vertical" />
        </div>
        {selectedFolder.length > 0 &&
          selectedFolder.map((folderContent, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center h-full rounded-md"
              >
                <UploadAttachmentsTreeItem attachments={folderContent.content} />
                {idx !== selectedFolder.length - 1 && <Separator orientation="vertical" />}
              </div>
            )
          })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export type UploadAttachmentsTreeItemProps = {
  attachments: (AttachmentType | FolderType)[]
}

export const UploadAttachmentsTreeItem = ({ attachments }: UploadAttachmentsTreeItemProps) => {
  const { selectedFolder, setSelectedFolder } = useUploadAdvancedContext()

  return attachments?.length > 0 ? (
    <ScrollArea className="h-full rounded-md w-[250px] p-2 bg-muted/10">
      <div className="flex flex-col gap-1">
        {attachments?.map(attachment => {
          if ((attachment as AttachmentType).file) {
            return <UploadAttachmentFile attachmentFile={attachment as AttachmentType} />
          }
          if ((attachment as FolderType).files) {
            return (
              <UploadAttachmentFolder
                attachmentFolder={attachment as FolderType}
                selected={selectedFolder}
                setSelected={setSelectedFolder}
              />
            )
          }
        })}
      </div>
    </ScrollArea>
  ) : (
    <EmptyFolder />
  )
}

/*
 * Empty Folder
 */
export const EmptyFolder = () => {
  return (
    <div className="border-r border-r-border bg-muted/10 w-[250px] h-full p-4 flex items-center flex-col space-y-2 justify-center">
      <UploadOrDragSvg className="size-[100px]" />
      <p className="text-center w-full text-sm font-medium">Drop your files here</p>
      <p className="text-accent-foreground/70 text-center w-full text-xs max-w-[150px]">
        Or upload them via the "Upload file" button above
      </p>
    </div>
  )
}

export const UploadAttachmentFolder = (props: {
  attachmentFolder: FolderType
  selected: SelectedFolderType[]
  setSelected: React.Dispatch<React.SetStateAction<SelectedFolderType[]>>
}) => {
  const { attachmentFolder, selected, setSelected } = props
  const exist_in_tree = selected?.some(item => item.id === attachmentFolder.id)

  return (
    <div className="relative">
      <div
        className={cn(
          'relative bg-card-foreground/5 rounded-md overflow-hidden w-full flex items-center justify-start gap-1 p-2 hover:bg-card-foreground/15 transition-all cursor-pointer [&_*]:select-none',
          exist_in_tree && 'bg-card-foreground/15'
        )}
        onClick={() => {
          setSelected(old => {
            if (!exist_in_tree)
              return [...old.filter(item => !(item.treeLevel >= attachmentFolder.treeLevel) && item), attachmentFolder]

            return old.filter(item => !(item.treeLevel >= attachmentFolder.treeLevel))
          })
        }}
      >
        <div className="relative [&_svg]:size-4">
          {exist_in_tree ? <FolderOpen /> : <Folder className={cn(attachmentFolder.files > 0 && 'fill-white')} />}
        </div>
        <h6 className="text-xs font-medium truncate max-w-[70%]">{attachmentFolder.name} </h6>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={'xs'}
            variant={'ghost'}
            className="h-4 w-6 absolute top-1/2 right-2 -translate-y-1/2"
            icon={{ children: Ellipsis }}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="">
          <div className="flex flex-col items-start justify-start [&_button]:justify-between [&_button]:w-full [&_button]:rounded-sm [&>div]:p-0 [&>div]:justify-between [&>div]:flex [&>div]:items-center [&>div]:w-full">
            <div>
              <AlertDelete
                itemName={attachmentFolder.name + ' folder'}
                command={{
                  label: 'Alt+D',
                  key: 'Alt+d',
                  variant: 'nothing',
                  className: 'text-accent-foreground/40 w-full ml-6',
                }}
                onCancel={() => {}}
                onContinue={() => {}}
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const UploadAttachmentFile = ({ attachmentFile }: { attachmentFile: AttachmentType }) => {
  const fileType = getFileType(attachmentFile.file)
  return (
    <div className="relative">
      <Sheet>
        <SheetTrigger asChild>
          <div
            className={cn(
              'relative bg-card-foreground/5 rounded-md overflow-hidden w-full flex items-center justify-start gap-1 p-2 hover:bg-card-foreground/15 transition-all cursor-pointer'
            )}
            onClick={() => {}}
          >
            <div className="relative [&_svg]:size-4">{fileTypeIcons[fileType]}</div>
            <h6 className="text-xs font-medium truncate max-w-[70%]">{attachmentFile.name} </h6>
          </div>
        </SheetTrigger>
        <SheetContent className="w-[400px] flex flex-col gap-2 justify-between">
          <div>
            <div>
              <picture>
                <img
                  src={URL.createObjectURL(attachmentFile.file as Blob)}
                  alt=""
                />
              </picture>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button>Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={'xs'}
            variant={'ghost'}
            className="h-4 w-6 absolute top-1/2 right-2 -translate-y-1/2"
            icon={{ children: Ellipsis }}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="">
          <div className="flex flex-col items-start justify-start [&_button]:justify-between [&_button]:w-full [&_button]:rounded-sm [&>div]:p-0 [&>div]:justify-between [&>div]:flex [&>div]:items-center [&>div]:w-full">
            <DropdownMenuItem>
              <Button
                size={'xs'}
                variant={'ghost'}
                onClick={() => {}}
                icon={{ children: Download, className: 'h-4 w-4' }}
              >
                Download
              </Button>
            </DropdownMenuItem>
            <div>
              <AlertDelete
                itemName={attachmentFile.name + ' folder'}
                command={{
                  label: 'Alt+D',
                  key: 'Alt+d',
                  variant: 'nothing',
                  className: 'text-accent-foreground/40 w-full ml-6',
                }}
                onCancel={() => {}}
                onContinue={() => {}}
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
