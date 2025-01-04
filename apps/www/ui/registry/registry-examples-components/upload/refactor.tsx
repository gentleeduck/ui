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
  DuckDropdownMenuItem,
  DuckDropdownMenuRadio,
  DuckDropdownMenuRadioGroupProps,
  DuckDropdownMenuSubWrapper,
} from '@/registry/registry-ui-components/dropdown-menu'
import {
  AttachmentType,
  FILE_TYPE_ICONS,
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

export const UploadNavigation = () => {
  return <></>
}
