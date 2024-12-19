import { cn } from '@/lib'
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuView,
  ScrollArea,
  ScrollBar,
  Separator,
} from '@/registry/default/ui'
import { downloadAttachment } from '@/registry/default/ui/comment'
import { Button, buttonVariants } from '@/registry/registry-ui-components/button'
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
  AlertCircle,
  Download,
  Ellipsis,
  Folder,
  FolderOpen,
  FolderPlusIcon,
  RefreshCw,
  Search,
  Trash,
  View,
} from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export const DropdownMenuRadioGroupContent = ({
  radioGroup,
  content,
}: {
  radioGroup: Partial<React.ComponentPropsWithoutRef<typeof DropdownMenuRadioGroup>>
  content: (React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem> &
    React.ComponentPropsWithoutRef<typeof Button>)[]
}) => {
  return (
    <>
      <DropdownMenuRadioGroup {...radioGroup}>
        {content.map((item, idx) => {
          const { children: itemChildren, value, size = 'sm', variant = 'ghost', ...itemProps } = item ?? {}
          return (
            <DropdownMenuRadioItem
              key={idx}
              className="py-0 px-4"
              value={value}
            >
              <Button
                variant={'nothing'}
                size={size}
                {...itemProps}
              >
                {itemChildren}
              </Button>
            </DropdownMenuRadioItem>
          )
        })}
      </DropdownMenuRadioGroup>
    </>
  )
}

export const DropdownMenuSubWrapper = ({
  itemSub,
  trigger,
  content,
}: {
  itemSub?: React.ComponentPropsWithoutRef<typeof DropdownMenuSub>
  trigger?: React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>
  content?: React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent>
}) => {
  return (
    <DropdownMenuSub {...itemSub}>
      <DropdownMenuSubTrigger {...trigger} />
      <DropdownMenuSubContent {...content} />
    </DropdownMenuSub>
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
            icon={{ children: RefreshCw }}
          >
            View
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <DropdownMenuSubWrapper
              trigger={{ children: 'Sort By' }}
              content={{
                children: (
                  <DropdownMenuRadioGroupContent
                    radioGroup={{
                      value: radioState,
                      onValueChange: setRadioState,
                    }}
                    content={[
                      { children: 'As duck', value: 'As duck', icon: { children: View } },
                      { children: 'As list', value: 'duck', icon: { children: View } },
                      { children: 'As list', value: 'duckk', icon: { children: View } },
                    ]}
                  />
                ),
              }}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {
        // <DropdownMenuView
        //   wrapper={{
        //     modal: true,
        //   }}
        //   trigger={{
        //     size: 'xs',
        //     variant: 'default',
        //     icon: { children: View },
        //     children: 'View',
        //   }}
        //   content={{
        //     className: 'max-w-[150px] [&_div]:w-full p-2 [&_*]:text-xs',
        //     defaultValue: 'duck',
        //     options: {
        //       itemType: 'radio',
        //       optionsData: [
        //         { children: 'As duck', value: 'As duck', icon: { children: View } },
        //         { children: 'As list', value: 'duck', icon: { children: View } },
        //         { children: 'As list', value: 'duckk', icon: { children: View } },
        //         // { children: 'As Column', icon: { children: View } },
        //         // { children: 'As list', icon: { children: View } },
        //         // {
        //         //   children: 'As Column',
        //         //   icon: { children: View },
        //         //   value: 'duck',
        //         //   nestedData: {
        //         //     itemType: 'radio',
        //         //     // defaultChecked: true,
        //         //     optionsData: [
        //         //       { children: 'As duck', value: 'As duck', icon: { children: View } },
        //         //       { children: 'As list', value: 'duck', icon: { children: View } },
        //         //       { children: 'As list', value: 'duckk', icon: { children: View } },
        //         //     ],
        //         //   },
        //         // },
        //         // {
        //         //   children: 'As Column',
        //         //   icon: { children: View },
        //         //   nestedData: {
        //         //     itemType: 'radio',
        //         //     optionsData: [
        //         //       { children: 'As list', icon: { children: View } },
        //         //       { children: 'As list', icon: { children: View } },
        //         //       { children: 'As list', icon: { children: View } },
        //         //     ],
        //         //   },
        //         // },
        //       ],
        //     },
        //   }}
        // />
      }

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
      <Button
        size={'xs'}
        variant={'muted'}
        border={'muted'}
        className="relative w-[1.625rem]"
        icon={{ children: Search }}
      ></Button>
    </div>
  )
}
const UploadDemoHeaderMemo = React.memo(UploadDemoHeader)

export const UploadNavigation = () => {
  return <></>
}

export default function Upload1Demo() {
  return (
    <>
      <UploadAdvancedProvider>
        <div className="flex flex-col w-full gap-1 rounded-md bg-muted/10 border-border border">
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
    <ScrollArea>
      <div className="flex items-center h-full rounded-md">
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
    <ScrollArea className="h-[400px] rounded-md w-[250px] p-2">
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
    <div className="border-r border-r-border bg-muted/10 w-[250px] min-h-[400px] p-4 flex items-center flex-col space-y-2 justify-center">
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
export const AlertDelete = ({
  itemName,
  onCancel,
  onContinue,
}: {
  itemName: string
  onCancel: () => void
  onContinue: () => void
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={'xs'}
          className="w-full rounded-sm"
          variant={'ghost'}
          icon={{ children: Trash }}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0">
        <AlertDialogHeader>
          <h5 className="text-lg font-medium p-4 pb-0"> Confirt deletion of {itemName}</h5>
          <Separator />
          <div className="p-4">
            <Alert
              variant={'destructive'}
              className="space-y-2 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-12"
            >
              <AlertCircle />
              <AlertTitle>This action cannot be undone.</AlertTitle>
              <AlertDescription>Are you sure you want to delete the selected file?</AlertDescription>
            </Alert>
          </div>
          <Separator />
        </AlertDialogHeader>

        <AlertDialogFooter className="px-4 pb-4">
          <AlertDialogCancel className={cn(buttonVariants({ variant: 'outline', className: 'px-8', size: 'sm' }))}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              buttonVariants({ variant: 'destructive', border: 'destructive', className: 'px-8', size: 'sm' })
            )}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
