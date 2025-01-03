'use client'

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
import { DropdownMenuGroup, DropdownMenuSubWrapper } from '@/registry/registry-ui-components/dropdown-menu'
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
  UploadAdnvacedContent,
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
import { FolderButton, UploadNavigation, UploadViewButton } from './refactor'

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
  return (
    <div className="space-x-2 flex items-center place-content-end w-full pb-1 p-2 ">
      <Button
        size={'xs'}
        icon={{ children: RefreshCw }}
      >
        Reload
      </Button>
      <UploadViewButton />
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
