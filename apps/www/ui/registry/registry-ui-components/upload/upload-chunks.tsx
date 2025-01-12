'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu'
import { Input } from '@/registry/default/ui/input'
import { ScrollArea } from '@/registry/default/ui/scroll-area'
import { Button, buttonVariants } from '../button'
import {
  FileType,
  FolderType,
  SelectedFolderType,
  UploadAddFolderButtonProps,
  UploadAdvancedButtonType,
  UploadAlertDeleteActionProps,
  UploadAlertMoveActionProps,
  UploadAttachmentsTreeItemProps,
  UploadDownloadActionsProps,
  UploadReloadButtonProps,
  UploadSearchButtonProps,
  UploadViewButtonType,
} from './upload.types'
import { CONTENT_POILERPLATE, FILE_TYPE_ICONS, TREE_HEIGHT, TREE_WIDTH } from './upload.constants'
import { UploadManager } from './upload.lib'
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@/registry/default/ui'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/registry/default/ui'
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
  Pencil,
  AlertCircle,
  Trash,
  Move,
  RefreshCw,
  UploadIcon,
} from 'lucide-react'
import { Checkbox, Separator } from '@/registry/default/ui'
import { debounceCallback } from '@/hooks'

// 1- Upload Reload Button
/**
 * Button component to reload the upload area.
 * @param {UploadReloadButtonProps} _props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadReloadButton = (_props: UploadReloadButtonProps): JSX.Element => {
  // TODO: Implement reload functionality.
  return (
    <Button
      size={'xs'}
      icon={{ children: RefreshCw }}
    >
      Reload
    </Button>
  )
}

// 2- Upload View Button
/**
 * Button component to view options for the upload area.
 * @param {UploadViewButtonType} _props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadViewButton = (_props: UploadViewButtonType): JSX.Element => {
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

// 3- Upload Advanced Button
/**
 * Button component to upload files.
 * @param {UploadAdvancedButtonType} _props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadAdvancedButton = (_props: UploadAdvancedButtonType): JSX.Element => {
  const { setAttachments, selectedFolder, setSelectedFolder } = useUploadAdvancedContext() ?? {}

  const memoizedUploadFiles = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      UploadManager.advancedUploadAttachments({ e, selectedFolder, setSelectedFolder, setAttachments })
    },
    [selectedFolder, setSelectedFolder, setAttachments]
  )

  return (
    <Button
      className="relative"
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
  )
}

// 4- Upload Add Folder Button
/**
 * Button component to add a new folder.
 * @param {UploadAddFolderButtonProps} _props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadAddFolderButton = (_props: UploadAddFolderButtonProps): JSX.Element => {
  const { selectedFolder, setAttachments, setSelectedFolder } = useUploadAdvancedContext()
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="relative w-[1.625rem]"
          size={'xs'}
          icon={{ children: FolderPlusIcon }}
        />
      </DialogTrigger>
      <DialogContent>
        <div>
          <DialogHeader className="p-2">
            <DialogTitle className="text-lg font-medium pb-0">Create a new folder</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Enter the name of the folder you'd like to create.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter folder name..."
            defaultValue={'New_folder' + Math.random().toString(36).slice(2)}
            className="h-[30px]"
            ref={inputRef}
          />
        </div>
        <DialogFooter>
          <DialogClose
            className={cn(buttonVariants({ className: 'px-8', size: 'sm', variant: 'outline' }))}
            onClick={() => inputRef.current && (inputRef.current.value = '')}
          >
            Cancel
          </DialogClose>
          <DialogClose
            className={cn(buttonVariants({ className: 'px-8', size: 'sm' }))}
            onClick={() =>
              UploadManager.addFolderToPath({
                selectedFolder,
                setAttachments,
                setSelectedFolder,
                folderName: inputRef.current?.value ?? 'New_Folder' + Math.random().toString(36).slice(2),
              })
            }
          >
            Submit
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 5- Upload Search Button
/**
 * Button component to search for files or folders.
 * @param {UploadSearchButtonProps} _props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadSearchButton = (_props: UploadSearchButtonProps): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false)
  const { setUploadQuery } = useUploadAdvancedContext()
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [open])

  const debounceSearch = debounceCallback(() => {
    inputRef.current?.value ? setUploadQuery(inputRef.current?.value) : setUploadQuery('')
  }, 1000)

  return (
    <div className="flex items-center">
      <Button
        size={'xs'}
        variant={'secondary'}
        border={'secondary'}
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
            variant: 'secondary',
            border: 'secondary',
            size: 'xs',
            className: 'relative h-[1.625rem] overflow-hidden w-[200px] hidden [&_svg]:pointer-events-auto',
          }),
          open && 'flex'
        )}
      >
        <Search className="absolute top-1/2 -translate-y-1/2 left-2 size-[0.875rem] z-10" />
        <Input
          autoFocus={true}
          onChange={_ => debounceSearch()}
          className="pl-6 w-[200px] h-[1.625rem] text-xs text-accent-foreground/50 bg-transparent placeholder:text-xs placeholder:text-accent-foreground/50"
          placeholder="Search file or folder..."
          ref={inputRef}
        />
        <X
          className="absolute top-1/2 -translate-y-1/2 right-2 size-[0.875rem] stroke-[2px] cursor-pointer z-10 pointer-events-auto"
          onClick={() => {
            setUploadQuery('')
            inputRef.current && (inputRef.current.value = '')
            setOpen(false)
          }}
        />
      </div>
    </div>
  )
}

// 6- Upload Download Actions
/**
 * Component for download actions related to uploaded files.
 * @param {UploadDownloadActionsProps} _props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadDownloadActions = (_props: UploadDownloadActionsProps): JSX.Element => {
  return (
    <Button
      size={'xs'}
      icon={{ children: Download }}
    >
      Download
    </Button>
  )
}

// 7- Upload Alert Move Action
/**
 * Component for moving files or folders with an alert dialog.
 * @param {UploadAlertMoveActionProps} _props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadAlertMoveAction = (_props: UploadAlertMoveActionProps): JSX.Element => {
  const { itemName, className, command, onCancel, onContinue } = _props
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={'xs'}
          className={cn(className)}
          command={command}
          icon={{ children: Move }}
        >
          Move
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0">
        <AlertDialogHeader>
          <h5 className="text-lg font-medium p-4 pb-0">
            Moving 2 items within{' '}
            <span className="font-mono italic underline underline-offset-4">{itemName.split(' ')[0]}</span>
          </h5>
          <p className="text-sm text-muted-foreground px-4 !mt-0">
            Enter the path to where you'd like to move the files to.
          </p>

          <Separator />
          <div className="p-4">
            <Alert
              variant={'default'}
              className="space-y-2 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-12 bg-muted/50"
            >
              <AlertTitle className="text-accent-foreground/70">
                Path to new directory in{' '}
                <span className="font-mono italic underline underline-offset-4">{itemName}</span>
              </AlertTitle>
              <Input
                className="bg-transparent h-[30px] border-muted-foreground/20"
                placeholder="Enter path here..."
                ref={inputRef}
              />
              <AlertDescription className="text-muted-foreground/70">
                Leave blank to move items to the root of the bucket.
              </AlertDescription>
            </Alert>
          </div>
          <Separator />
        </AlertDialogHeader>

        <AlertDialogFooter className="px-4 pb-4">
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: 'outline', className: 'px-8', size: 'sm' }))}
            onClick={e => onCancel?.(e, inputRef.current?.value ?? '')}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ className: 'px-8', size: 'sm' }))}
            onClick={e => onContinue?.(e, inputRef.current?.value ?? '')}
          >
            Move
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// 8- Upload Alert Delete Action
/**
 * Component for deleting files or folders with an alert dialog.
 * @param {UploadAlertDeleteActionProps} _props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadAlertDeleteAction = (_props: UploadAlertDeleteActionProps): JSX.Element => {
  const { itemName, className, command, onCancel, onContinue } = _props

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="xs"
          className={cn('justify-between w-full rounded-sm', className)}
          variant="ghost"
          command={command}
          icon={{ children: Trash }}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0">
        <AlertDialogHeader>
          <AlertDialogTitle className="p-4 pb-0">
            Confirm deletion of{' '}
            <span className="font-mono italic underline underline-offset-4">{itemName.split(' ')[0]}</span>{' '}
            {itemName.split(' ').slice(1).join(' ')}
          </AlertDialogTitle>
          <Separator />
        </AlertDialogHeader>

        <div className="p-4">
          <Alert
            variant="destructive"
            className="space-y-2 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-12"
          >
            <AlertCircle />
            <AlertTitle>This action cannot be undone.</AlertTitle>
            <AlertDescription>Are you sure you want to delete the selected items?</AlertDescription>
          </Alert>
        </div>

        <Separator />

        <AlertDialogFooter className="px-4 pb-4">
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: 'outline', className: 'px-8', size: 'sm' }))}
            onClick={onCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: 'destructive', className: 'px-8', size: 'sm' }))}
            onClick={onContinue}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * Component for rendering the upload attachments tree item.
 * @param {UploadAttachmentsTreeItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
export const UploadAttachmentsTreeItem = React.memo(({ attachments }: UploadAttachmentsTreeItemProps) => {
  const { selectedFolder, setSelectedFolder, attachments: _attachments, uploadQuery } = useUploadAdvancedContext()

  const filtered = (
    uploadQuery
      ? (attachments ?? _attachments)?.filter(item => item.name.toLowerCase().includes(uploadQuery.toLowerCase()))
      : (attachments ?? _attachments)
  ) as (FileType | FolderType)[]

  return (filtered ?? _attachments)?.length > 0 ? (
    <div className="flex items-start h-full rounded-md">
      <div className="flex flex-col h-full rounded-md">
        <UploadSelectAll attachments={attachments ?? _attachments} />
        <ScrollArea className={cn('rounded-md p-2 bg-muted/10', TREE_WIDTH, TREE_HEIGHT)}>
          <div className="flex flex-col gap-1 h-full">
            {filtered.map(attachment => {
              if ((attachment as FileType).file) {
                return (
                  <UploadAttachmentFile
                    attachmentFile={attachment as FileType}
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
      </div>
      <Separator orientation="vertical" />
    </div>
  ) : (
    <EmptyFolder />
  )
})

/**
 * Component for selecting all attachments in the current tree.
 * @param {Object} props - The props for the component.
 * @param {(FileType | FolderType)[]} props.attachments - The list of attachments.
 * @returns {JSX.Element}
 */
export const UploadSelectAll = React.memo((props: { attachments: (FileType | FolderType)[] }) => {
  const { attachments } = props
  const { setSelectedAttachments: setSelectedAttachment, selectedAttachments: selecttedAttachment } =
    useUploadAdvancedContext()
  const currentTreeLevel = attachments?.[0]?.treeLevel

  // Get all selected folders in the current tree
  const selectedInCurrentTree = selecttedAttachment.filter(attachment => attachment.treeLevel === currentTreeLevel)
  const filesInCurrentTree = attachments.filter(item => !(item as FolderType)?.content)

  // Determine the `isChecked` state
  const isChecked =
    selectedInCurrentTree.length === filesInCurrentTree?.length
      ? true // All selected
      : selectedInCurrentTree.length > 0
        ? 'indeterminate' // Some selected
        : false // None selected

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 bg-muted rounded-md mx-2 mt-2 -mb-1 transition-all duration-300 ease-in-out',
        (selecttedAttachment.length === 0 || filesInCurrentTree?.length === 0) && '-mt-10 mb-2'
      )}
    >
      <Checkbox
        className="w-[15px] h-[15px] border-muted-foreground/80"
        onCheckedChange={_ =>
          UploadManager.selectAttachmentFromFolderContent({
            filesInCurrentTree,
            setSelectedAttachment,
          })
        }
        checked={isChecked}
      />
      <span className="text-xs font-medium text-muted-foreground/80">
        {isChecked === true
          ? `All ${filesInCurrentTree?.length} file${selectedInCurrentTree.length === 1 ? ' is' : 's are'} selected`
          : isChecked === 'indeterminate'
            ? `${selectedInCurrentTree.length} file${selectedInCurrentTree.length === 1 ? ' is' : 's are'} selected`
            : `Select all ${filesInCurrentTree?.length} file${filesInCurrentTree.length === 1 ? '' : 's'}`}
      </span>
    </div>
  )
})

/**
 * Component to display when there are no files in the folder.
 * @returns {JSX.Element}
 */
export const EmptyFolder = (): JSX.Element => {
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

/**
 * Component for rendering an upload attachment folder.
 * @param {Object} props - The props for the component.
 * @param {FolderType} props.attachmentFolder - The folder to render.
 * @param {SelectedFolderType[]} props.selected - The currently selected folders.
 * @param {React.Dispatch<React.SetStateAction<SelectedFolderType[]>>} props.setSelected - Function to set selected folders.
 * @returns {JSX.Element}
 */
export const UploadAttachmentFolder = React.memo(
  (props: {
    attachmentFolder: FolderType
    selected: SelectedFolderType[]
    setSelected: React.Dispatch<React.SetStateAction<SelectedFolderType[]>>
  }) => {
    const { attachmentFolder, selected, setSelected } = props
    const { setAttachments } = useUploadAdvancedContext()
    const exist_in_tree = selected?.some(item => item.id === attachmentFolder.id)

    return (
      <div className="relative">
        <div
          className={cn(
            'relative bg-card-foreground/5 rounded-md overflow-hidden w-full flex items-center justify-start gap-2 p-2 hover:bg-card-foreground/15 transition-all cursor-pointer [&_*]:select-none',
            exist_in_tree && 'bg-card-foreground/15'
          )}
          onClick={() => UploadManager.folderOpen({ attachmentFolder, setSelected, exist_in_tree })}
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
                <UploadAlertDeleteAction
                  itemName={attachmentFolder.name + ' folder'}
                  command={{
                    label: 'Alt+D',
                    key: 'Alt+d',
                    variant: 'nothing',
                    className: 'text-accent-foreground/40 w-full ml-6',
                  }}
                  onCancel={() => {}}
                  onContinue={() =>
                    setAttachments(old => UploadManager.deleteAttachmentById(old, [attachmentFolder.id]))
                  }
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
)

/**
 * Component for rendering an upload attachment file.
 * @param {Object} props - The props for the component.
 * @param {FileType} props.attachmentFile - The file to render.
 * @returns {JSX.Element}
 */
export const UploadAttachmentFile = React.memo(({ attachmentFile }: { attachmentFile: FileType }) => {
  const fileType = UploadManager.getFileType(attachmentFile.file)
  const {
    setAttachments,
    setPreviewFile,
    selectedAttachments: selecttedAttachment,
    setSelectedAttachments: setSelectedAttachment,
  } = useUploadAdvancedContext()
  const exist_in_selected = selecttedAttachment.some(attachment => attachment.id === attachmentFile.id)

  return (
    <div className="relative group/file">
      <div
        className={cn(
          'relative bg-card-foreground/5 rounded-md overflow-hidden w-full flex items-center justify-start gap-2 p-2 hover:bg-card-foreground/15 transition-all cursor-pointer'
        )}
        onClick={() => setPreviewFile(attachmentFile)}
      >
        <div
          className={cn(
            'relative [&_svg]:size-4 group-hover/file:opacity-0 opacity-100',
            exist_in_selected && 'opacity-0'
          )}
        >
          {FILE_TYPE_ICONS[fileType]}
        </div>
        <h6 className="text-xs font-medium truncate max-w-[70%]">{attachmentFile.name}</h6>
      </div>

      <Checkbox
        className={cn(
          'absolute top-1/2 left-2 -translate-y-1/2 group-hover/file:opacity-100 opacity-0 w-[15px] h-[15px]',
          exist_in_selected && '!opacity-100'
        )}
        checked={exist_in_selected}
        onCheckedChange={e => {
          if (e) return setSelectedAttachment(prev => [...prev, attachmentFile])
          setSelectedAttachment(prev => prev.filter(attachment => attachment.id !== attachmentFile.id))
        }}
      />
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
                onClick={() =>
                  setAttachments(old => UploadManager.renameAttachmentById(old, [attachmentFile.id], 'New Name'))
                }
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
              <UploadAlertDeleteAction
                itemName={attachmentFile.name}
                command={{
                  label: 'Alt+D',
                  key: 'Alt+d',
                  variant: 'nothing',
                  className: 'text-accent-foreground/40 w-full ml-6',
                }}
                onCancel={() => {}}
                onContinue={() => setAttachments(old => UploadManager.deleteAttachmentById(old, [attachmentFile.id]))}
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
})
