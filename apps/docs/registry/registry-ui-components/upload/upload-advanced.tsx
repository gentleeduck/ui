'use client'

import React from 'react'
import { ScrollBar, Separator, Skeleton } from '@/registry/default/ui'
import { ScrollArea } from '@/registry/default/ui'
import { Button, buttonVariants } from '../button'
import { Clipboard, X } from 'lucide-react'
import {
  FileType,
  FolderType,
  SelectedFolderType,
  UploadAdvancedContextType,
  UploadAdvancedProviderProps,
  UploadAttachmentsTreeItemProps,
} from './upload.types'
import {
  UploadAdvancedNoAttachments,
  UploadAdvancedAddFolderButton,
  UploadAdvancedAttachmentFile,
  UploadAdvancedAttachmentFolder,
  UploadAdvancedButton,
  UploadAdvancedAlertDeleteAttachments,
  UploadAdvancedAlertMoveAction,
  UploadAttachmentActionsMenu,
  UploadAdvancedDownloadAttachments,
  UploadAdvancedNavigationLayout,
  UploadReloadButton,
  UploadAdvancedSearchButton,
  UploadAdvancedSelectAllLayout,
  UploadAdvancedViewButton,
  UploadAdvancedAttachmentsRowFile,
  UploadAdvancedAttachmentsRowFolder,
} from './upload-advanced-chunks'

import { format } from 'date-fns'
import { filesize } from 'filesize'
import { cn } from '@/lib'
import { CONTENT_WIDTH_PREVIEW_OPEN, PREVIEW_WIDTH, TREE_HEIGHT, TREE_WIDTH } from './upload.constants'
import { searchAttachmentsByKey } from './upload.lib'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../table'

const UploadAdvancedContext = React.createContext<UploadAdvancedContextType<FileType | FolderType> | null>(null)

export const useUploadAdvancedContext = (): UploadAdvancedContextType<FileType | FolderType> => {
  const context = React.useContext(UploadAdvancedContext)
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider')
  }
  return context
}

export const UploadAdvancedProvider = ({
  selectedFolder,
  attachments,
  className,
  currentBucket,
  children,
  actions,
  ...props
}: UploadAdvancedProviderProps): JSX.Element => {
  const [_selectedFolder, setSelectedFolder] = React.useState<SelectedFolderType[]>(selectedFolder ?? [])
  const [_attachments, setAttachments] = React.useState<(FileType | FolderType)[]>(attachments ?? [])
  const [attachmentsState, setAttachmentsState] = React.useState<(FileType | FolderType)[]>([])
  const [previewFile, setPreviewFile] = React.useState<FileType | null>(null)
  const [uploadQuery, setUploadQuery] = React.useState<string>('')
  const [selectedAttachments, setSelectedAttachments] = React.useState<FileType[]>([])
  const [uploadView, setUploadView] = React.useState<'column' | 'row'>(
    (localStorage.getItem('View') as 'column' | 'row') ?? 'column'
  )

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
        selectedAttachments,
        setSelectedAttachments,
        currentBucket,
        uploadView,
        setUploadView,
        actions,
      }}
    >
      <div
        className={cn('flex flex-col w-full rounded-md bg-muted/10 border-border border overflow-hidden', className)}
        {...props}
      >
        {children}
      </div>
    </UploadAdvancedContext.Provider>
  )
}

export const UploadAdvancedHeader = () => {
  return (
    <>
      <div className="w-full h-[42px] overflow-hidden relative">
        <UploadAdvancedActionsLayout />
        <UploadAdvancedMultiSelectLayout />
      </div>
      <Separator />
    </>
  )
}

export const UploadAdvancedActionsLayout = () => {
  const ctx = useUploadAdvancedContext()

  return (
    <div className="flex items-center justify-between">
      <UploadAdvancedNavigationLayout />
      <div
        className={cn(
          'space-x-2 flex items-center place-content-end w-full m-0 p-2 transition-all duration-300 ease-in-out',
          ctx.selectedAttachments.length > 0 ? 'translate-y-[-42px]' : 'translate-y-0'
        )}
      >
        <UploadReloadButton />
        <UploadAdvancedViewButton />
        <Separator
          orientation="vertical"
          className="h-6"
        />
        <UploadAdvancedButton />
        <UploadAdvancedAddFolderButton />
        <Separator
          orientation="vertical"
          className="h-6"
        />
        <UploadAdvancedSearchButton />
      </div>
    </div>
  )
}

export const UploadAdvancedMultiSelectLayout = () => {
  const { selectedAttachments, setSelectedAttachments } = useUploadAdvancedContext()

  return (
    <>
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 space-x-2 flex items-center w-full m-0 p-2 transition-all duration-300 ease-in-out bg-background pointer-events-all',
          selectedAttachments.length > 0 ? '' : 'opacity-0 pointer-events-none'
        )}
      >
        <Button
          size={'xs'}
          variant={'ghost'}
          className="p-1 h-auto"
          onClick={() => setSelectedAttachments([])}
          icon={{ children: X }}
        />
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {selectedAttachments.length} Attachment
            {selectedAttachments.length === 1 ? ' is' : 's are'} selected
          </span>
          <Separator
            orientation="vertical"
            className="h-6"
          />
          <UploadAdvancedDownloadAttachments itemsName={[...selectedAttachments.map(item => item.name)]} />
          <Separator
            orientation="vertical"
            className="h-6"
          />
          <UploadAdvancedAlertMoveAction itemsName={[...selectedAttachments.map(item => item.name)]} />
          <UploadAdvancedAlertDeleteAttachments
            itemsName={[...selectedAttachments.map(item => item.name)]}
            className={cn(
              buttonVariants({
                className: 'w-fit',
                size: 'xs',
                variant: 'destructive',
                border: 'destructive',
              })
            )}
            itemsToDelete={[...selectedAttachments.map(item => item.id)]}
          />
        </div>
      </div>
    </>
  )
}

export const UploadAdnvacedContent = React.memo(() => {
  const Component = () => {
    const { uploadView } = useUploadAdvancedContext()
    return uploadView === 'column' ? <UploadAdvancedColumnView /> : <UploadAdvancedRowView />
  }

  return (
    <div className="h-full relative">
      <UploadFilePreview />
      <Component />
    </div>
  )
})

export const UploadAdvancedColumnView = () => {
  const { previewFile, attachments } = useUploadAdvancedContext() ?? {}
  return (
    <ScrollArea
      className={cn(
        'transition-all duration-300 ease-in-out w-full [&>div>div]:h-full',
        TREE_HEIGHT,
        previewFile && CONTENT_WIDTH_PREVIEW_OPEN
      )}
    >
      <div className="flex items-center h-full rounded-md relative overflow-hidden">
        <UploadAttachmentsTree attachments={attachments} />
        <UploadTreeExtender />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export const UploadAttachmentsTree = React.memo(({ attachments }: UploadAttachmentsTreeItemProps) => {
  const { uploadQuery } = useUploadAdvancedContext()

  const filteredItems = (
    uploadQuery ? attachments?.filter(item => item.name.toLowerCase().includes(uploadQuery.toLowerCase())) : attachments
  ) as (FileType | FolderType)[]

  return filteredItems?.length > 0 ? (
    <div className="flex items-start h-full rounded-md">
      <div className="flex flex-col h-full rounded-md">
        <UploadAdvancedSelectAllLayout attachments={attachments} />
        <ScrollArea className={cn('rounded-md p-2 bg-muted/10', TREE_WIDTH, TREE_HEIGHT)}>
          <div className="flex flex-col gap-1 h-full">
            {filteredItems.map(attachment => {
              if ((attachment as FileType).url) {
                return (
                  <UploadAdvancedAttachmentFile
                    attachmentFile={attachment as FileType}
                    key={attachment.id}
                  />
                )
              }
              return (
                <UploadAdvancedAttachmentFolder
                  key={attachment.id}
                  attachmentFolder={attachment as FolderType}
                />
              )
            })}
          </div>
        </ScrollArea>
      </div>
      <Separator orientation="vertical" />
    </div>
  ) : (
    <UploadAdvancedNoAttachments />
  )
})

export const UploadTreeExtender = (): JSX.Element => {
  const { selectedFolder, attachments, uploadQuery } = useUploadAdvancedContext()

  return (
    <>
      {selectedFolder.length > 0 &&
        selectedFolder.map((folderContent, idx) => {
          const item = searchAttachmentsByKey(attachments, folder => folder.id === folderContent?.id, 'content')
          const filtered = !uploadQuery
            ? (item as FolderType)?.content
            : (item as FolderType)?.content.filter(item => item.name.toLowerCase().includes(uploadQuery.toLowerCase()))
          return (
            item && (
              <div
                key={item.id}
                className="flex items-center h-full rounded-md"
              >
                <UploadAttachmentsTree
                  attachments={filtered}
                  key={item.id}
                />
                {idx !== selectedFolder.length - 1 && <Separator orientation="vertical" />}
              </div>
            )
          )
        })}
    </>
  )
}

export const UploadAdvancedRowView = () => {
  const { previewFile } = useUploadAdvancedContext() ?? {}
  return (
    <ScrollArea
      className={cn(
        'transition-all duration-300 ease-in-out w-full',
        TREE_HEIGHT,
        previewFile && CONTENT_WIDTH_PREVIEW_OPEN
      )}
    >
      <UploadAttachmentsRow />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export const UploadAttachmentsRow = () => {
  const { attachments, uploadQuery, selectedFolder } = useUploadAdvancedContext()

  const filteredItems = React.useMemo(() => {
    // if (!uploadQuery) return selectedFolder?.length ? selectedFolder.slice(-1)[0].content || [] : attachments || []

    if (!uploadQuery)
      return selectedFolder?.length
        ? (
            searchAttachmentsByKey(
              attachments,
              folder => folder.id === selectedFolder.slice(-1)?.[0]?.id,
              'content'
            ) as FolderType
          ).content || []
        : attachments || []

    return attachments?.filter(item => item.name.toLowerCase().includes(uploadQuery.toLowerCase())) || []
  }, [attachments, uploadQuery, selectedFolder])

  return (
    <div className="w-full h-full">
      {filteredItems?.length > 0 ? (
        <Table>
          <TableHeader className="bg-muted/70 [&_th]:py-2 [&_th]:h-fit [&_th]:text-muted-foreground [&_th]:text-xs">
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead className="w-[100px]">Size</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[200px]">Created At</TableHead>
              <TableHead className="w-[200px]">Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map(attachment =>
              (attachment as FolderType).content?.length >= 0 ? (
                <UploadAdvancedAttachmentsRowFolder attachmentFolder={attachment as FolderType} />
              ) : (
                <UploadAdvancedAttachmentsRowFile attachmentFile={attachment as FileType} />
              )
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="[&>div]:border-none [&_>div]:w-full [&_div]:h-full h-full">
          <UploadAdvancedNoAttachments />
        </div>
      )}
    </div>
  )
}

/**
 * A component that renders a preview of the selected file.
 *
 * When a file is selected, the preview appears with a smooth transition effect and displays the file's name, type, size, created and updated at information.
 * The preview also includes a download button, a button to copy the file's URL to the clipboard, and a delete button.
 *
 * @returns {JSX.Element} The rendered file preview component.
 */
export const UploadFilePreview = (): JSX.Element => {
  const { previewFile, setPreviewFile, attachments } = useUploadAdvancedContext()

  const file_exists = searchAttachmentsByKey(attachments, item => item.id === previewFile?.id, 'content')

  console.log(previewFile)
  return (
    <>
      <div
        className={cn(
          PREVIEW_WIDTH,
          'absolute top-0 right-0 h-full duration-300 ease-in-out translate-x-[100%] z-10 dark:bg-[#121212] bg-card',
          file_exists && 'translate-x-0'
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
                src={previewFile?.url ?? ''}
                className="object-contain size-full"
                alt={previewFile?.name}
              />
            </div>
            <div className="my-4 flex flex-col gap-1">
              <h6 className="text-sm font-medium truncate max-w-[70%]">{previewFile?.name}</h6>
              <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
                <span>{previewFile?.type ?? 'not-specified'}</span>-
                <span>
                  {filesize(previewFile?.size ?? 0, {
                    round: 0,
                  })}
                </span>
              </p>
            </div>
            <div className="my-4 flex flex-col gap-1">
              <h6 className="text-xs font-medium text-accent-foreground/90">Created at</h6>
              <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
                {previewFile ? format(new Date(previewFile?.created_at ?? Date.now()), 'dd/MM/yyyy hh:mm:ss a') : ''}
              </p>
            </div>
            <div className="my-4 flex flex-col gap-1">
              <h6 className="text-xs font-medium text-accent-foreground/90">Updated at</h6>
              <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
                {previewFile ? format(new Date(previewFile?.updated_at ?? Date.now()), 'dd/MM/yyyy hh:mm:ss a') : ''}
              </p>
            </div>
            <div className="flex flex-row gap-2 [&_button]:px-3 mt-4 mb-2 ">
              <UploadAdvancedDownloadAttachments
                itemsName={[previewFile?.name ?? '']}
                withinDropdown={false}
              />
              <Button
                size={'xs'}
                // variant={'secondary'}
                icon={{ children: Clipboard }}
              >
                Get URL
              </Button>
            </div>
            <Separator />
            <div className="my-2 flex flex-row gap-2 [&_button]:px-3">
              <UploadAdvancedAlertDeleteAttachments
                itemsName={[previewFile?.name ?? '']}
                className={cn(
                  buttonVariants({
                    className: 'w-fit',
                    size: 'xs',
                    variant: 'destructive',
                    border: 'destructive',
                  })
                )}
                itemsToDelete={[previewFile?.id ?? '']}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
