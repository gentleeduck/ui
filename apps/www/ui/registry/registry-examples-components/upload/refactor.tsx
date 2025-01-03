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
import {
  DuckDropdownMenuRadio,
  DuckDropdownMenuRadioGroupProps,
  DuckDropdownMenuSubWrapper,
} from '@/registry/registry-ui-components/dropdown-menu'
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

export const UploadNavigation = () => {
  return <></>
}

export const UploadViewButton = () => {
  const [radioState, setRadioState] = React.useState<string>('duck')
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
        <DuckDropdownMenu
          title="View"
          content={[
            { children: 'As Columns', value: 'As duck', icon: { children: Columns2 } },
            { children: 'As Rows', value: 'duck', icon: { children: Rows2 } },
          ]}
        />
        <DuckDropdownMenu
          title="Sort By"
          subgroup={true}
          content={[
            { children: 'Name', value: 'name' },
            { children: 'Time created', value: 'time_created' },
            { children: 'Time modified', value: 'time_modified' },
            { children: 'Last time accessed', value: 'last_time_accessed' },
          ]}
        />
        <DuckDropdownMenu
          title="Sort Order"
          subgroup={true}
          content={[
            { children: 'Ascending', value: 'Asc', icon: { children: ArrowUp } },
            { children: 'Descending', value: 'Des', icon: { children: ArrowDown } },
          ]}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const DuckDropdownMenu = ({
  title,
  content,
  subgroup = false,
}: {
  title: string
  content: DuckDropdownMenuRadioGroupProps['content']
  subgroup?: boolean
}) => {
  const active = localStorage.getItem(title) || content[0].value

  const Content = () => {
    return (
      <DuckDropdownMenuRadio
        radioGroup={{
          value: active,
          onValueChange: value => {
            localStorage.setItem(title, value)
          },
        }}
        content={content}
      />
    )
  }

  if (!subgroup) return <Content />

  return (
    <>
      <DropdownMenuItem asChild>
        <DuckDropdownMenuSubWrapper
          trigger={{ children: title }}
          content={{ children: <Content /> }}
        />
      </DropdownMenuItem>
    </>
  )
}
