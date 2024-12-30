import { cn } from '@/lib'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuView,
  Input,
  ScrollArea,
  ScrollBar,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/default/ui'
import { downloadAttachment } from '@/registry/default/ui/comment'
import { AlertDelete } from '@/registry/registry-ui-components/alert'
import { Button, buttonVariants } from '@/registry/registry-ui-components/button'
import { DropdownMenuRadioGroupContent, DropdownMenuSubWrapper } from '@/registry/registry-ui-components/dropdown-menu'
import {
  AttachmentType,
  fileTypeIcons,
  FolderType,
  getFileType,
  SelectedFolderType,
  UploadAdvancedProvider,
  UploadAdvancedButton,
  useUploadAdvancedContext,
  UploadOrDragSvg,
} from '@/registry/registry-ui-components/upload'
import {
  ArrowDown,
  ArrowUp,
  Columns2,
  Download,
  Ellipsis,
  Folder,
  FolderOpen,
  FolderPlusIcon,
  RefreshCw,
  Rows2,
  Search,
  Trash,
  X,
} from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

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

export const UploadDemoHeader = () => {
  const [radioState, setRadioState] = React.useState<string>('duck')

  return (
    <div className="space-x-2 flex items-center place-content-end w-full pb-1 p-2 ">
      <Button
        size={'xs'}
        icon={{ children: RefreshCw }}
      >
        Reload
      </Button>
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
          <DropdownMenuRadioGroupContent
            radioGroup={{
              value: radioState,
              onValueChange: setRadioState,
            }}
            content={[
              { children: 'As Columns', value: 'As duck', icon: { children: Columns2 } },
              { children: 'As Rows', value: 'duck', icon: { children: Rows2 } },
            ]}
          />
          <DropdownMenuItem asChild>
            <DropdownMenuSubWrapper
              trigger={{ children: 'Sort By' }}
              content={{
                children: (
                  <DropdownMenuRadioGroupContent
                    radioGroup={{
                      value: 'time_created',
                      onValueChange: setRadioState,
                    }}
                    content={[
                      { children: 'Name', value: 'name' },
                      { children: 'Time created', value: 'time_created' },
                      { children: 'Time modified', value: 'time_modified' },
                      { children: 'Last time accessed', value: 'last_time_accessed' },
                    ]}
                  />
                ),
              }}
            />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DropdownMenuSubWrapper
              trigger={{ children: 'Sort Order' }}
              content={{
                children: (
                  <DropdownMenuRadioGroupContent
                    radioGroup={{
                      value: 'Asc',
                      onValueChange: setRadioState,
                    }}
                    content={[
                      { children: 'Ascending', value: 'Asc', icon: { children: ArrowUp } },
                      { children: 'Descending', value: 'Des', icon: { children: ArrowDown } },
                    ]}
                  />
                ),
              }}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator
        orientation="vertical"
        className="h-6"
      />
      <UploadAdvancedButton />
      <FolderButton />
      <Separator
        orientation="vertical"
        className="h-6"
      />
      <UploadSearch />
    </div>
  )
}

export const UploadNavigation = () => {
  return <></>
}

export default function Upload1Demo() {
  return (
    <>
      <UploadAdvancedProvider>
        <div className="flex flex-col w-full gap-1 rounded-md bg-muted/10 border-border border h-[80vh]">
          <div className="flex items-center gap-4 justify-between">
            <UploadNavigation />
            <UploadDemoHeader />
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
    <div className="border-r border-r-border bg-muted/10 w-[250px] h-full p-4 flex items-center flex-col space-y-2 justify-center">
      <UploadOrDragSvg className="size-[100px]" />
      <p className="text-center w-full text-sm font-medium">Drop your files here</p>
      <p className="text-accent-foreground/70 text-center w-full text-xs max-w-[150px]">
        Or upload them via the "Upload file" button above
      </p>
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

export const FolderButton = () => {
  return (
    <div>
      <Button
        className="relative w-[1.625rem]"
        size={'xs'}
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
