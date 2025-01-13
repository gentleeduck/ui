'use client'

import React from 'react'
import { ScrollBar, Separator } from '@/registry/default/ui'
import { ScrollArea } from '@/registry/default/ui'
import { Button, buttonVariants } from '../button'
import { Clipboard, X } from 'lucide-react'
import {
  FileType,
  FolderType,
  SelectedFolderType,
  UploadAdvancedContextType,
  UploadAdvancedProviderProps,
} from './upload.types'
// import { UploadManager } from './upload.lib'
import {
  UploadAddFolderButton,
  UploadAdvancedButton,
  UploadAlertDeleteAttachments,
  UploadAlertMoveAction,
  UploadAttachmentsTreeItem,
  UploadDownloadAttachments,
  UploadReloadButton,
  UploadSearchButton,
  UploadViewButton,
} from './upload-chunks'
import { format } from 'date-fns'
import { filesize } from 'filesize'
import { cn } from '@/lib'
import { CONTENT_WIDTH_PREVIEW_OPEN, PREVIEW_WIDTH, TREE_HEIGHT } from './upload.constants'
import { searchAttachmentsByKey } from './upload.lib'

const UploadAdvancedContext = React.createContext<UploadAdvancedContextType<FileType | FolderType> | null>(null)

/**
 * Hook for accessing the context of the UploadAdvancedProvider.
 *
 * @returns {UploadAdvancedContextType<FileType | FolderType> | null} The context object.
 * @throws {Error} If the hook is used outside of an UploadAdvancedProvider.
 */
export const useUploadAdvancedContext = (): UploadAdvancedContextType<FileType | FolderType> => {
  const context = React.useContext(UploadAdvancedContext)
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider')
  }
  return context
}

/**
 * The UploadAdvancedProvider component provides the context for all the other components in the
 * UploadAdvanced layout. It wraps the components in a context provider and provides the state and
 * functions to manage the attachments and folders.
 *
 * @param {UploadAdvancedProviderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const UploadAdvancedProvider = ({
  selectedFolder,
  attachments,
  className,
  currentBucket,
  children,
  ...props
}: UploadAdvancedProviderProps): JSX.Element => {
  const [_selectedFolder, setSelectedFolder] = React.useState<SelectedFolderType[]>(selectedFolder ?? [])
  const [_attachments, setAttachments] = React.useState<(FileType | FolderType)[]>(attachments ?? [])
  const [attachmentsState, setAttachmentsState] = React.useState<(FileType | FolderType)[]>([])
  const [previewFile, setPreviewFile] = React.useState<FileType | null>(null)
  const [uploadQuery, setUploadQuery] = React.useState<string>('')
  const [selectedAttachments, setSelectedAttachments] = React.useState<FileType[]>([])

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

/**
 * A component that renders the top bar of the advanced upload component.
 * Contains the upload actions and the multiple select layout.
 *
 * @returns A JSX.Element
 */
export const UploadAdvancedHeader = () => {
  return (
    <div className="w-full h-[45px] overflow-hidden relative">
      <UploadAdvancedActionsLayout />
      <UploadAdvancedMultiSelectLayout />
      <Separator />
    </div>
  )
}

/**
 * A component that renders the actions layout of the advanced upload component.
 * Contains the reload, view, upload file, add folder, and search buttons.
 *
 * @returns A JSX.Element
 */
export const UploadAdvancedActionsLayout = () => {
  const { selectedAttachments } = useUploadAdvancedContext()

  return (
    <>
      <div
        className={cn(
          'space-x-2 flex items-center place-content-end w-full m-0 p-2 transition-all duration-300 ease-in-out',
          selectedAttachments.length > 0 ? 'translate-y-[-42px]' : 'translate-y-0'
        )}
      >
        <UploadReloadButton />
        <UploadViewButton />
        <Separator
          orientation="vertical"
          className="h-6"
        />
        <UploadAdvancedButton />
        <UploadAddFolderButton />
        <Separator
          orientation="vertical"
          className="h-6"
        />
        <UploadSearchButton />
      </div>
    </>
  )
}

/**
 * A layout component for multi-select actions in the advanced upload interface.
 *
 * Displays a floating action bar when one or more attachments are selected,
 * providing options to download, move, or delete the selected attachments.
 *
 * The bar includes a close button to clear the selection and shows the count
 * of selected attachments. It appears with a smooth transition effect and hides
 * when no attachments are selected.
 */

export const UploadAdvancedMultiSelectLayout = () => {
  const { selectedAttachments, setSelectedAttachments } = useUploadAdvancedContext()

  return (
    <>
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 space-x-2 flex items-center w-full m-0 p-2 transition-all duration-300 ease-in-out bg-background pointer-events-all',
          selectedAttachments.length > 0 ? '' : 'opacity-0 t anslate-y-[-42px] pointer-events-none'
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
          <UploadDownloadAttachments itemsName={[...selectedAttachments.map(item => item.name)]} />
          <Separator
            orientation="vertical"
            className="h-6"
          />
          <UploadAlertMoveAction itemsName={[...selectedAttachments.map(item => item.name)]} />
          <UploadAlertDeleteAttachments
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

/**
 * Component that displays the advanced content for file upload, including a preview of the uploaded file,
 * a scrollable area containing the file/folder tree, and tree extender elements for enhanced interaction.
 *
 * @returns {React.Element} The rendered component containing the file preview, tree, and scrollable area.
 */
export const UploadAdnvacedContent = React.memo(() => {
  const { previewFile } = useUploadAdvancedContext() ?? {}
  return (
    <div className="h-full relative">
      <UploadFilePreview />
      <ScrollArea className={cn(TREE_HEIGHT, previewFile && CONTENT_WIDTH_PREVIEW_OPEN)}>
        <div className="flex items-center h-full rounded-md relative overflow-hidden">
          <UploadAttachmentsTreeItem />
          <UploadTreeExtender />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
})

/**
 * A component that extends the upload tree by rendering the contents of the selected folders.
 * It retrieves the folder content from the attachments and filters it based on the upload query.
 * Each folder's content is rendered as an UploadAttachmentsTreeItem component.
 *
 * @returns {JSX.Element | null} The rendered upload tree extender component, or null if no folders are selected.
 */

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
                <UploadAttachmentsTreeItem
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

/**
 * A component that renders a preview of the selected file.
 *
 * When a file is selected, the preview appears with a smooth transition effect and displays the file's name, type, size, created and updated at information.
 * The preview also includes a download button, a button to copy the file's URL to the clipboard, and a delete button.
 *
 * @returns {JSX.Element} The rendered file preview component.
 */
export const UploadFilePreview = (): JSX.Element => {
  const { previewFile, setPreviewFile } = useUploadAdvancedContext() ?? {}

  return (
    <>
      <div
        className={cn(
          PREVIEW_WIDTH,
          'absolute top-0 right-0 h-full duration-300 ease-in-out translate-x-[100%] z-10 dark:bg-[#121212] bg-card',
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
                // src={URL.createObjectURL((previewFile?.file as Blob) ?? new Blob())}
                src={previewFile?.url}
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
            <div className="flex flex-row gap-2 [&_button]:px-3 mt-4 mb-2 ">
              <UploadDownloadAttachments itemsName={[previewFile?.name ?? '']} />
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
              <UploadAlertDeleteAttachments
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
