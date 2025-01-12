'use client'

import React from 'react'
import { ScrollBar, Separator } from '@/registry/default/ui'
import { Input } from '@/registry/default/ui'
import { ScrollArea } from '@/registry/default/ui'
import { Button } from '../button'
import { Download, Trash, Upload as UploadIcon, Clipboard, X } from 'lucide-react'
import { AttachmentType, FolderType, SelectedFolderType, UploadAdvancedContextType } from './upload.types'
import { searchNestedArrayByKey, uploadFiles } from './upload.lib'
import { UploadAttachmentsTreeItem } from './upload-chunks'
import { format } from 'date-fns'
import { filesize } from 'filesize'
import { cn } from '@/lib'

const UploadAdvancedContext = React.createContext<UploadAdvancedContextType<AttachmentType | FolderType> | null>(null)

export const useUploadAdvancedContext = () => {
  const context = React.useContext(UploadAdvancedContext)
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider')
  }
  return context
}

export const UploadAdvancedProvider = ({
  selectedFolder,
  attachments,
  children,
}: {
  selectedFolder?: SelectedFolderType[]
  attachments: (AttachmentType | FolderType)[]
  children: React.ReactNode
}) => {
  const [_selectedFolder, setSelectedFolder] = React.useState<SelectedFolderType[]>(selectedFolder ?? [])
  const [_attachments, setAttachments] = React.useState<(AttachmentType | FolderType)[]>(attachments ?? [])
  const [attachmentsState, setAttachmentsState] = React.useState<(AttachmentType | FolderType)[]>([])
  const [previewFile, setPreviewFile] = React.useState<AttachmentType | null>(null)
  const [uploadQuery, setUploadQuery] = React.useState<string>('')
  const [selecttedAttachment, setSelectedAttachment] = React.useState<(AttachmentType | FolderType)[]>([])

  return (
    <UploadAdvancedContext.Provider
      value={{
        attachments: _attachments,
        setAttachments,
        attachmentsState,
        setAttachmentsState,
        selectedFolder: _selectedFolder,
        setSelectedFolder,
        previewFile,
        setPreviewFile,
        uploadQuery,
        setUploadQuery,
        selecttedAttachment,
        setSelectedAttachment,
      }}
    >
      {children}
    </UploadAdvancedContext.Provider>
  )
}

export const UploadAdvancedButton = () => {
  const { setAttachments, selectedFolder, setSelectedFolder } = useUploadAdvancedContext() ?? {}

  const memoizedUploadFiles = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      uploadFiles({ e, selectedFolder, setSelectedFolder, setAttachments })
    },
    [selectedFolder, setSelectedFolder, setAttachments]
  )
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
          onChange={e => memoizedUploadFiles(e)}
        />
        Upload file
      </Button>
    </>
  )
}

export const UploadAdnvacedContent = React.memo(() => {
  return (
    <div className="h-full">
      <UploadFilePreview />
      <ScrollArea className="h-full">
        <div className="flex items-center h-full rounded-md relative overflow-hidden">
          <UploadAttachmentsTreeItem />
          <UploadTreeExtender />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
})

export const UploadTreeExtender = () => {
  const { selectedFolder, attachments, uploadQuery } = useUploadAdvancedContext() ?? {}

  return (
    selectedFolder.length > 0 &&
    selectedFolder.map((folderContent, idx) => {
      const item = searchNestedArrayByKey(attachments, folder => folder.id === folderContent?.id, 'content')
      const filtered = !uploadQuery
        ? (item as FolderType)?.content
        : (item as FolderType)?.content.filter(item => item.name.toLowerCase().includes(uploadQuery.toLowerCase()))
      return (
        item && (
          <div
            key={item.id}
            className="flex items-center h-full rounded-md"
          >
            <UploadAttachmentsTreeItem
              attachments={filtered}
              key={item.id}
            />
            {idx !== selectedFolder.length - 1 && <Separator orientation="vertical" />}
          </div>
        )
      )
    })
  )
}

export const UploadFilePreview = React.memo(() => {
  const { previewFile, setPreviewFile } = useUploadAdvancedContext() ?? {}
  return (
    <div
      className={cn(
        'absolute top-0 right-0 h-full w-[400px] duration-300 ease-in-out translate-x-[100%] z-10 bg-[#121212]',
        previewFile && 'translate-x-0'
      )}
    >
      <ScrollArea className="h-full">
        <Button
          size={'xs'}
          variant={'nothing'}
          className="absolute top-2 right-4 p-0"
          icon={{ children: X }}
          onClick={() => setPreviewFile(null)}
        />
        <div className="border-l border-l-border bg-muted/10 w-full h-full px-4 py-8">
          <div className="border border-border w-full h-[180px] flex items-center justify-center rounded-md overflow-hidden">
            <img
              src={URL.createObjectURL((previewFile?.file as Blob) ?? new Blob())}
              className="object-contain size-full"
              alt={previewFile?.name}
            />
          </div>
          <div className="my-4 flex flex-col gap-1">
            <h6 className="text-sm font-medium truncate max-w-[70%]">{previewFile?.name}</h6>
            <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
              <span>{previewFile?.type}</span>-
              <span>
                {filesize(previewFile?.file ? +previewFile?.file.size : 0, {
                  round: 0,
                })}
              </span>
            </p>
          </div>
          <div className="my-4 flex flex-col gap-1">
            <h6 className="text-xs font-medium text-accent-foreground/90">Created at</h6>
            <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
              {previewFile ? format(new Date(previewFile?.createdAt ?? Date.now()), 'dd/MM/yyyy hh:mm:ss a') : ''}
            </p>
          </div>
          <div className="my-4 flex flex-col gap-1">
            <h6 className="text-xs font-medium text-accent-foreground/90">Updated at</h6>
            <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
              {previewFile ? format(new Date(previewFile?.updatedAt ?? Date.now()), 'dd/MM/yyyy hh:mm:ss a') : ''}
            </p>
          </div>
          <div className="my-4 flex flex-row gap-2 [&_button]:px-3 mt-4">
            <Button
              size={'xs'}
              variant={'muted'}
              border={'muted'}
              icon={{ children: Download }}
            >
              Download
            </Button>
            <Button
              size={'xs'}
              variant={'muted'}
              border={'muted'}
              icon={{ children: Clipboard }}
            >
              Get URL
            </Button>
          </div>
          <Separator />
          <div className="my-4 flex flex-row gap-2 [&_button]:px-3">
            <Button
              size={'xs'}
              variant={'destructive'}
              border={'destructive'}
              icon={{ children: Trash }}
            >
              Delete
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})
