import { cn } from '@/lib'
import { DropdownMenuView, ScrollArea, ScrollBar, Separator } from '@/registry/default/ui'
import { downloadAttachment } from '@/registry/default/ui/comment'
import { Button } from '@/registry/registry-ui-components/button'
import {
  AttachmentType,
  fileTypeIcons,
  FolderType,
  getFileType,
  SelectedFolderType,
  UploadAdvancedProvider,
  UploadAdvancedButton,
  useUploadAdvancedContext,
} from '@/registry/registry-ui-components/upload'
import { Download, Ellipsis, Folder, FolderOpen, FolderPlusIcon, Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function Upload1Demo() {
  return (
    <>
      <UploadAdvancedProvider>
        <div className="flex flex-col w-full gap-1 p-2 rounded-md bg-muted/10 border-border border">
          <div className="space-x-2 flex items-center place-content-end w-full pb-1">
            <Separator
              orientation="vertical"
              className="h-6"
            />
            <UploadAdvancedButton />
            <FolderButton />
          </div>

          <Separator />
          <UploadAdnvacedContent />
        </div>
      </UploadAdvancedProvider>
    </>
  )
}

export const UploadAdnvacedContent = () => {
  const { selectedFolder, attachments } = useUploadAdvancedContext() ?? {}

  return (
    <ScrollArea>
      <div className="flex items-center h-full pt-1 rounded-md">
        <div className="flex items-center h-full rounded-md">
          <UploadAttachmentsTreeItem attachments={attachments} />
          <Separator
            orientation="vertical"
            className="h-[400px]"
          />
        </div>
        {selectedFolder.length > 0 &&
          selectedFolder.map((folderContent, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center h-full rounded-md"
              >
                <UploadAttachmentsTreeItem attachments={folderContent.content} />
                {idx !== selectedFolder.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="h-[400px]"
                  />
                )}
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
    <ScrollArea className="h-[400px] rounded-md w-[190px] p-2">
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
    <div className="border border-border bg-muted/10 flex items-center w-[180px] min-h-[400px] p-4 rounded-md">
      <p className="text-center w-full text-xs">There's no files.</p>
    </div>
  )
}

export const UploadAttachmentFolder = ({
  attachmentFolder,
  selected,
  setSelected,
}: {
  attachmentFolder: FolderType
  selected: SelectedFolderType[]
  setSelected: React.Dispatch<React.SetStateAction<SelectedFolderType[]>>
}) => {
  const exist_in_tree = selected?.some(item => item.id === attachmentFolder.id)

  return (
    <div
      className={cn(
        'relative bg-card-foreground/5 rounded-md overflow-hidden w-full flex items-center justify-start gap-1 p-2 hover:bg-card-foreground/15 transition-all cursor-pointer [&_*]:select-none',
        exist_in_tree && 'bg-card-foreground/15'
      )}
      onClick={() => {
        setSelected(old => {
          if (exist_in_tree) {
            return old.filter(item => {
              return item.treeLevel < attachmentFolder.treeLevel
            })
          } else {
            return [...old, attachmentFolder]
          }
        })
      }}
    >
      <div className="relative [&_svg]:size-4">
        {exist_in_tree ? <FolderOpen /> : <Folder className={cn(attachmentFolder.files > 0 && 'fill-white')} />}
      </div>
      <h6 className="text-xs font-medium truncate max-w-[70%]">{attachmentFolder.name} </h6>
      <DropdownMenuView
        trigger={{
          icon: { children: Ellipsis, className: 'h-4 w-4 rounded' },
          variant: 'ghost',
          size: 'icon',
          className: 'h-4 w-6 absolute top-1/2 right-2 -translate-y-1/2',
        }}
        content={{
          options: {
            itemType: 'label',
            optionsData: [
              {
                children: 'Delete',
                className: 'text-red-500 bg-red-500/10',
                icon: { children: Trash, className: 'h-4 w-4 rounded' },
                onClick: () => {},
              },
            ],
          },
        }}
      />
    </div>
  )
}

export const UploadAttachmentFile = ({ attachmentFile }: { attachmentFile: AttachmentType }) => {
  const fileType = getFileType(attachmentFile.file)
  return (
    <div
      className={cn(
        'relative bg-card-foreground/5 rounded-md overflow-hidden w-full flex items-center justify-start gap-1 p-2 hover:bg-card-foreground/15 transition-all cursor-pointer'
      )}
      onClick={() => {}}
    >
      <div className="relative [&_svg]:size-4">{fileTypeIcons[fileType]}</div>
      <h6 className="text-xs font-medium truncate max-w-[70%]">{attachmentFile.name} </h6>
      <DropdownMenuView
        trigger={{
          icon: { children: Ellipsis, className: 'h-4 w-4 rounded' },
          variant: 'ghost',
          size: 'icon',
          className: 'h-4 w-6 absolute top-1/2 right-2 -translate-y-1/2',
        }}
        content={{
          options: {
            itemType: 'label',
            optionsData: [
              {
                children: 'Download',
                icon: { children: Download, className: 'h-4 w-4 rounded' },
                onClick: () => {
                  downloadAttachment({ attachment: attachmentFile! })
                },
              },
              {
                children: 'Delete',
                className: 'text-red-500 bg-red-500/10',
                icon: { children: Trash, className: 'h-4 w-4 rounded' },
                onClick: () => {},
              },
            ],
          },
        }}
      />
    </div>
  )
}

export const FolderButton = () => {
  return (
    <div>
      <Button
        className="relative h-[35px]"
        // variant={'outline'}
        size={'sm'}
        onClick={() => {
          toast.info('Folder generated!')
        }}
        icon={{
          children: FolderPlusIcon,
        }}
      />
    </div>
  )
}
