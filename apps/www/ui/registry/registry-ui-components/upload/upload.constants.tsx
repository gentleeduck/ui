import { File, FileAudio, FileImage, FileText, FileVideo } from 'lucide-react'

export enum FileType {
  Audio = 'audio',
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Pdf = 'pdf',
  Unknown = 'unknown',
}

export const fileTypeIcons = {
  [FileType.Audio]: <FileAudio className="w-8 h-8" />,
  [FileType.Text]: <FileText className="w-8 h-8" />,
  [FileType.Image]: <FileImage className="w-8 h-8" />,
  [FileType.Video]: <FileVideo className="w-8 h-8" />,
  [FileType.Pdf]: <FileText className="w-8 h-8" />,
  [FileType.Unknown]: <File className="w-8 h-8" />,
}

// NOTE: 10MB
export const MAX_SIZE = 10 * 1024 * 1024
