// //@ts-nocheck
// import {
//   Columns2,
//   File,
//   FileAudio,
//   FileImage,
//   FileText,
//   FileVideo,
//   Rows2,
// } from 'lucide-react'
// import { DuckDropdownMenuRadioGroupProps } from '../dropdown-menu'
//
// /**
//  * Enum representing different file types.
//  * @enum {string}
//  */
// export enum FileTypeEnum {
//   Audio = 'audio',
//   Text = 'text',
//   Image = 'image',
//   Video = 'video',
//   Pdf = 'pdf',
//   Unknown = 'unknown',
// }
//
// /**
//  * Mapping of file types to their corresponding icons.
//  * @type {Record<FileTypeEnum, JSX.Element>}
//  */
// export const FILE_TYPE_ICONS: Record<FileTypeEnum, JSX.Element> = {
//   [FileTypeEnum.Audio]: <FileAudio className="w-8 h-8" />,
//   [FileTypeEnum.Text]: <FileText className="w-8 h-8" />,
//   [FileTypeEnum.Image]: <FileImage className="w-8 h-8" />,
//   [FileTypeEnum.Video]: <FileVideo className="w-8 h-8" />,
//   [FileTypeEnum.Pdf]: <FileText className="w-8 h-8" />,
//   [FileTypeEnum.Unknown]: <File className="w-8 h-8" />,
// }
//
// // Maximum file size allowed for uploads (10MB).
// export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
//
// // CSS class for tree height.
// export const TREE_HEIGHT = `h-[510px]`
//
// // CSS class for tree width.
// export const TREE_WIDTH = `w-[250px]`
// export const PREVIEW_WIDTH = `w-[400px]`
// export const CONTENT_WIDTH_PREVIEW_OPEN = `w-[calc(100%-400px)]`
//
// // Items to display in the breadcrumb.
// export const ITEMS_TO_DISPLAY_BREADCRUMB = 4
//
// /**
//  * Content options for dropdown menus.
//  * @type {Record<string, DuckDropdownMenuRadioGroupProps['content']>}
//  */
// export const CONTENT_POILERPLATE: Record<
//   string,
//   DuckDropdownMenuRadioGroupProps['content']
// > = {
//   view: [
//     { children: 'As Columns', value: 'column', icon: { children: Columns2 } },
//     { children: 'As Rows', value: 'row', icon: { children: Rows2 } },
//   ],
//   sort: [
//     { children: 'Name', value: 'name' },
//     { children: 'Time created', value: 'time_created' },
//     { children: 'Time modified', value: 'time_modified' },
//     { children: 'Last time accessed', value: 'last_time_accessed' },
//   ],
//   order: [
//     { children: 'Ascending', value: 'asc' },
//     { children: 'Descending', value: 'desc' },
//   ],
// }
