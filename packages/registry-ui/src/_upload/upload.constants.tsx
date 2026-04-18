import { File, FileAudio, FileImage, FileText, FileVideo } from 'lucide-react'

export enum FileTypeEnum {
  Audio = 'audio',
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Pdf = 'pdf',
  Unknown = 'unknown',
}

export const FILE_TYPE_ICONS: Record<FileTypeEnum, React.JSX.Element> = {
  [FileTypeEnum.Audio]: <FileAudio aria-hidden="true" className="w-8 h-8" />,
  [FileTypeEnum.Text]: <FileText aria-hidden="true" className="w-8 h-8" />,
  [FileTypeEnum.Image]: <FileImage aria-hidden="true" className="w-8 h-8" />,
  [FileTypeEnum.Video]: <FileVideo aria-hidden="true" className="w-8 h-8" />,
  [FileTypeEnum.Pdf]: <FileText aria-hidden="true" className="w-8 h-8" />,
  [FileTypeEnum.Unknown]: <File aria-hidden="true" className="w-8 h-8" />,
}
