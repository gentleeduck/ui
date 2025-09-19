import { File, FileAudio, FileImage, FileText, FileVideo } from 'lucide-react'

export enum FileTypeEnum {
  Audio = 'audio',
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Pdf = 'pdf',
  Unknown = 'unknown',
}

export const FILE_TYPE_ICONS: Record<FileTypeEnum, JSX.Element> = {
  [FileTypeEnum.Audio]: <FileAudio className="w-8 h-8" />,
  [FileTypeEnum.Text]: <FileText className="w-8 h-8" />,
  [FileTypeEnum.Image]: <FileImage className="w-8 h-8" />,
  [FileTypeEnum.Video]: <FileVideo className="w-8 h-8" />,
  [FileTypeEnum.Pdf]: <FileText className="w-8 h-8" />,
  [FileTypeEnum.Unknown]: <File className="w-8 h-8" />,
}
