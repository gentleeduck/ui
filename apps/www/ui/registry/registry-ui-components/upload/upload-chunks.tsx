'use client'

import * as React from 'react'

import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from '@/registry/default/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu'
import { Input } from '@/registry/default/ui/input'
import { ScrollArea } from '@/registry/default/ui/scroll-area'
import { Button, buttonVariants } from '../button'

import { AttachmentType, FolderType, SelectedFolderType, UploadAttachmentsTreeItemProps } from './upload.types'
import { CONTENT_POILERPLATE, FILE_TYPE_ICONS } from './upload.constants'
import { addFolderToPath, deleteFromFolderContent, folderOpen, getFileType, renameInFolderContent } from './upload.lib'
import { AlertDelete } from '../alert'
import { DuckDropdownMenuItem } from '../dropdown-menu'
import { useUploadAdvancedContext } from './upload-advanced'
import { UploadOrDragSvg } from './upload.assets'

import { cn } from '@/lib/utils'

import {
  X,
  Download,
  Ellipsis,
  Folder,
  FolderOpen,
  Rows2,
  Search,
  FolderPlusIcon,
  Trash,
  Clipboard,
  Pencil,
} from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/registry/default/ui'
import { filesize } from 'filesize'
import { format, formatDistanceToNow, formatRelative, subDays } from 'date-fns'

export const UploadSearch = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [uploadSearch, setUploadSearch] = React.useState<string>('')
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [open])

  return (
    <div className="flex items-center">
      <Button
        size={'xs'}
        variant={'muted'}
        border={'muted'}
        icon={{ children: Search }}
        className={cn('relative w-[1.625rem] flex', open && 'hidden')}
        onClick={() => {
          setOpen(true)
        }}
      >
        <span className="sr-only">search</span>
      </Button>
      <div
        className={cn(
          buttonVariants({
            variant: 'muted',
            border: 'muted',
            size: 'xs',
            className: 'relative h-[1.625rem] overflow-hidden w-[200px] hidden [&_svg]:pointer-events-auto',
          }),
          open && ' flex'
        )}
      >
        <Search className="absolute top-1/2 -translate-y-1/2 left-2 size-[0.875rem] z-10" />
        <Input
          value={uploadSearch}
          autoFocus={true}
          onChange={e => setUploadSearch(e.currentTarget.value)}
          className="pl-6 w-[200px] h-[1.625rem] text-xs text-accent-foreground/50 bg-transparent placeholder:text-xs placeholder:text-accent-foreground/50"
          placeholder="Search file or folder..."
          ref={inputRef}
        />
        <X
          className="absolute top-1/2 -translate-y-1/2 right-2 size-[0.875rem] stroke-[2px] cursor-pointer z-10 pointer-events-auto"
          onClick={() => {
            setUploadSearch('')
            setOpen(false)
          }}
        />
      </div>
    </div>
  )
}

export const FolderButton = () => {
  const { selectedFolder, setAttachments, setSelectedFolder } = useUploadAdvancedContext()
  return (
    <div>
      <Button
        className="relative w-[1.625rem]"
        size={'xs'}
        onClick={() => addFolderToPath({ selectedFolder, setAttachments, setSelectedFolder })}
        icon={{
          children: FolderPlusIcon,
        }}
      />
    </div>
  )
}

export const UploadAttachmentsTreeItem = ({ attachments }: UploadAttachmentsTreeItemProps) => {
  const { selectedFolder, setSelectedFolder, attachments: _attachments } = useUploadAdvancedContext()

  return attachments?.length > 0 ? (
    <div className="flex items-center h-full rounded-md">
      <ScrollArea className="h-full rounded-md w-[250px] p-2 bg-muted/10">
        <div className="flex flex-col gap-1 h-full">
          {attachments?.map(attachment => {
            if ((attachment as AttachmentType).file) {
              return (
                <UploadAttachmentFile
                  attachmentFile={attachment as AttachmentType}
                  key={attachment.id}
                />
              )
            }
            return (
              <UploadAttachmentFolder
                key={attachment.id}
                attachmentFolder={attachment as FolderType}
                selected={selectedFolder}
                setSelected={setSelectedFolder}
              />
            )
          })}
        </div>
      </ScrollArea>
      <Separator orientation="vertical" />
    </div>
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

export const UploadAttachmentFolder = React.memo(
  (props: {
    attachmentFolder: FolderType
    selected: SelectedFolderType[]
    setSelected: React.Dispatch<React.SetStateAction<SelectedFolderType[]>>
  }) => {
    const { attachmentFolder, selected, setSelected } = props
    const exist_in_tree = selected?.some(item => item.id === attachmentFolder.id)
    const { setAttachments } = useUploadAdvancedContext()

    return (
      <div className="relative">
        <div
          className={cn(
            'relative bg-card-foreground/5 rounded-md overflow-hidden w-full flex items-center justify-start gap-1 p-2 hover:bg-card-foreground/15 transition-all cursor-pointer [&_*]:select-none',
            exist_in_tree && 'bg-card-foreground/15'
          )}
          onClick={() => folderOpen({ attachmentFolder, setSelected, exist_in_tree })}
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
                  onContinue={() => setAttachments(old => deleteFromFolderContent(old, attachmentFolder.id))}
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
)

export const UploadAttachmentFile = React.memo(({ attachmentFile }: { attachmentFile: AttachmentType }) => {
  const fileType = getFileType(attachmentFile.file)
  const { setAttachments, setPreviewFile } = useUploadAdvancedContext()

  return (
    <div className="relative">
      <div
        className={cn(
          'relative bg-card-foreground/5 rounded-md overflow-hidden w-full flex items-center justify-start gap-1 p-2 hover:bg-card-foreground/15 transition-all cursor-pointer'
        )}
        onClick={() => setPreviewFile(attachmentFile)}
      >
        <div className="relative [&_svg]:size-4">{FILE_TYPE_ICONS[fileType]}</div>
        <h6 className="text-xs font-medium truncate max-w-[70%]">{attachmentFile.name} </h6>
      </div>

      <DropdownMenu modal={true}>
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
                onClick={() => setAttachments(old => renameInFolderContent(old, attachmentFile.id, 'New Name'))}
                icon={{ children: Pencil, className: 'h-4 w-4' }}
              >
                Rename
              </Button>
            </DropdownMenuItem>
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
                itemName={attachmentFile.name}
                command={{
                  label: 'Alt+D',
                  key: 'Alt+d',
                  variant: 'nothing',
                  className: 'text-accent-foreground/40 w-full ml-6',
                }}
                onCancel={() => {}}
                onContinue={() => setAttachments(old => deleteFromFolderContent(old, attachmentFile.id))}
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
})

export const UploadViewButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={'xs'}
          icon={{ children: Rows2 }}
        >
          View
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DuckDropdownMenuItem
          title="View"
          content={CONTENT_POILERPLATE.view}
        />
        <DuckDropdownMenuItem
          title="Sort By"
          subgroup={true}
          content={CONTENT_POILERPLATE.sort}
        />
        <DuckDropdownMenuItem
          title="Sort Order"
          subgroup={true}
          content={CONTENT_POILERPLATE.order}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
