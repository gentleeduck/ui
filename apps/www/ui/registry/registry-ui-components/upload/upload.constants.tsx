import { Columns2, File, FileAudio, FileImage, FileText, FileVideo, Rows2 } from 'lucide-react'
import { DuckDropdownMenuRadioGroupProps } from '../dropdown-menu'

export enum FileType {
  Audio = 'audio',
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Pdf = 'pdf',
  Unknown = 'unknown',
}

export const FILE_TYPE_ICONS = {
  [FileType.Audio]: <FileAudio className="w-8 h-8" />,
  [FileType.Text]: <FileText className="w-8 h-8" />,
  [FileType.Image]: <FileImage className="w-8 h-8" />,
  [FileType.Video]: <FileVideo className="w-8 h-8" />,
  [FileType.Pdf]: <FileText className="w-8 h-8" />,
  [FileType.Unknown]: <File className="w-8 h-8" />,
}

// NOTE: 10MB
export const MAX_SIZE = 10 * 1024 * 1024

export const CONTENT_POILERPLATE: Record<string, DuckDropdownMenuRadioGroupProps['content']> = {
  view: [
    { children: 'As Columns', value: 'As duck', icon: { children: Columns2 } },
    { children: 'As Rows', value: 'duck', icon: { children: Rows2 } },
  ],
  sort: [
    { children: 'Name', value: 'name' },
    { children: 'Time created', value: 'time_created' },
    { children: 'Time modified', value: 'time_modified' },
    { children: 'Last time accessed', value: 'last_time_accessed' },
  ],
  order: [
    { children: 'Ascending', value: 'asc' },
    { children: 'Descending', value: 'desc' },
  ],
}
