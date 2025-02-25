// //@ts-nocheck
// 'use client'
//
// import React from 'react'
// import { ScrollBar, Separator, Skeleton } from '@/registry/default/ui'
// import { ScrollArea } from '@/registry/default/ui'
// import { Button, buttonVariants } from '../button'
// import { Clipboard, X } from 'lucide-react'
// import {
//   SelectedFoldersType,
//   StateWithExtraFeatures,
//   UploadAdvancedContextType,
//   UploadAdvancedProviderProps,
//   UploadAttachmentsTreeItemProps,
// } from './upload.types'
// import {
//   UploadAdvancedNoAttachments,
//   UploadAdvancedAddFolderButton,
//   UploadAdvancedAttachmentFile,
//   UploadAdvancedAttachmentFolder,
//   UploadAdvancedButton,
//   UploadAdvancedAlertDeleteAttachments,
//   UploadAdvancedAlertMoveAction,
//   UploadAdvancedDownloadAttachments,
//   UploadAdvancedNavigationLayout,
//   UploadReloadButton,
//   UploadAdvancedSearchButton,
//   UploadAdvancedSelectAllLayout,
//   UploadAdvancedViewButton,
//   UploadAdvancedAttachmentsRowFile,
//   UploadAdvancedAttachmentsRowFolder,
// } from './upload-advanced-chunks'
//
// import { format } from 'date-fns'
// import { filesize } from 'filesize'
// import { cn } from '@/lib'
// import {
//   CONTENT_WIDTH_PREVIEW_OPEN,
//   PREVIEW_WIDTH,
//   TREE_HEIGHT,
//   TREE_WIDTH,
// } from './upload.constants'
// import { Table, TableBody, TableHead, TableHeader, TableRow } from '../table'
// import {
//   BucketFilesType,
//   BucketFoldersType,
// } from '../../../../upload-api/src/globals'
//
// const UploadAdvancedContext = React.createContext<UploadAdvancedContextType<
//   BucketFilesType | BucketFoldersType
// > | null>(null)
//
// export const useUploadAdvancedContext = (): UploadAdvancedContextType<
//   BucketFilesType | BucketFoldersType
// > => {
//   const context = React.useContext(UploadAdvancedContext)
//   if (!context) {
//     throw new Error('useUploadContext must be used within an UploadProvider')
//   }
//   return context
// }
//
// export const UploadAdvancedProvider = ({
//   selectedFolder,
//   attachments,
//   className,
//   currentBucket,
//   children,
//   actions,
//   ...props
// }: UploadAdvancedProviderProps): JSX.Element => {
//   const [_selectedFolder, setSelectedFolder] =
//     React.useState<SelectedFoldersType>(new Map())
//   const [_attachments, setAttachments] = React.useState<
//     StateWithExtraFeatures<(BucketFilesType | BucketFoldersType)[]>
//   >({
//     state: 'pending',
//     data: [],
//   })
//   const [attachmentsState, setAttachmentsState] = React.useState<
//     (BucketFilesType | BucketFoldersType)[]
//   >([])
//   const [previewFile, setPreviewFile] = React.useState<BucketFilesType | null>(
//     null,
//   )
//   const [uploadQuery, setUploadQuery] = React.useState<string>('')
//   const [selectedAttachments, setSelectedAttachments] = React.useState<
//     BucketFilesType[]
//   >([])
//   const [uploadView, setUploadView] = React.useState<'column' | 'row'>(
//     (localStorage.getItem('View') as 'column' | 'row') ?? 'column',
//   )
//
//   return (
//     <UploadAdvancedContext.Provider
//       value={{
//         attachments: _attachments,
//         setAttachments,
//         attachmentsState,
//         setAttachmentsState,
//         selectedFolder: _selectedFolder,
//         setSelectedFolder,
//         previewFile,
//         setPreviewFile,
//         uploadQuery,
//         setUploadQuery,
//         selectedAttachments,
//         setSelectedAttachments,
//         currentBucket,
//         uploadView,
//         setUploadView,
//         actions,
//       }}
//     >
//       <div
//         className={cn(
//           'flex flex-col w-full rounded-md bg-muted/10 border-border border overflow-hidden',
//           className,
//         )}
//         {...props}
//       >
//         {children}
//       </div>
//     </UploadAdvancedContext.Provider>
//   )
// }
//
// export const UploadAdvancedHeader = () => {
//   return (
//     <>
//       <div className="w-full h-[42px] relative">
//         <UploadAdvancedActionsLayout />
//         <UploadAdvancedMultiSelectLayout />
//       </div>
//       <Separator />
//     </>
//   )
// }
//
// export const UploadAdvancedActionsLayout = () => {
//   const ctx = useUploadAdvancedContext()
//   // console.log(ctx.selectedFolder)
//   return (
//     <div className="flex items-center justify-between">
//       <UploadAdvancedNavigationLayout />
//       <div
//         className={cn(
//           'space-x-2 flex items-center place-content-end w-full m-0 p-2 transition-all duration-300 ease-in-out',
//           ctx.selectedAttachments.length > 0
//             ? 'translate-y-[-42px]'
//             : 'translate-y-0',
//         )}
//       >
//         <UploadReloadButton />
//         <UploadAdvancedViewButton />
//         <Separator orientation="vertical" className="h-6" />
//         <UploadAdvancedButton />
//         <UploadAdvancedAddFolderButton />
//         <Separator orientation="vertical" className="h-6" />
//         <UploadAdvancedSearchButton />
//       </div>
//     </div>
//   )
// }
//
// export const UploadAdvancedMultiSelectLayout = () => {
//   const { selectedAttachments, setSelectedAttachments } =
//     useUploadAdvancedContext()
//
//   return (
//     <>
//       <div
//         className={cn(
//           'absolute top-1/2 -translate-y-1/2 space-x-2 flex items-center w-full m-0 p-2 transition-all duration-300 ease-in-out bg-background pointer-events-all',
//           selectedAttachments.length > 0 ? '' : 'opacity-0 pointer-events-none',
//         )}
//       >
//         <Button
//           size={'xs'}
//           variant={'ghost'}
//           className="p-1 h-auto"
//           onClick={() => setSelectedAttachments([])}
//           icon={{ children: X }}
//         />
//         <div className="flex items-center gap-3">
//           <span className="text-xs text-muted-foreground">
//             {selectedAttachments.length} Attachment
//             {selectedAttachments.length === 1 ? ' is' : 's are'} selected
//           </span>
//           <Separator orientation="vertical" className="h-6" />
//           <UploadAdvancedDownloadAttachments
//             itemsName={[...selectedAttachments.map((item) => item.name)]}
//           />
//           <Separator orientation="vertical" className="h-6" />
//           <UploadAdvancedAlertMoveAction
//             itemsName={[...selectedAttachments.map((item) => item.name)]}
//           />
//           <UploadAdvancedAlertDeleteAttachments
//             itemsName={[...selectedAttachments.map((item) => item.name)]}
//             className={cn(
//               buttonVariants({
//                 className: 'w-fit',
//                 size: 'xs',
//                 variant: 'destructive',
//                 border: 'destructive',
//               }),
//             )}
//             itemsToDelete={[...selectedAttachments.map((item) => item.id)]}
//           />
//         </div>
//       </div>
//     </>
//   )
// }
//
// export const UploadAdnvacedContent = React.memo(() => {
//   const Component = () => {
//     const { uploadView } = useUploadAdvancedContext()
//     return uploadView === 'column' ? (
//       <UploadAdvancedColumnView />
//     ) : (
//       <UploadAdvancedRowView />
//     )
//   }
//
//   return (
//     <div className="h-full relative">
//       <UploadFilePreview />
//       <Component />
//     </div>
//   )
// })
//
// export const UploadAdvancedColumnView = () => {
//   const ctx = useUploadAdvancedContext() ?? {}
//
//   return (
//     <ScrollArea
//       className={cn(
//         'transition-all duration-300 ease-in-out w-full [&>div>div]:h-full',
//         TREE_HEIGHT,
//         ctx.previewFile && CONTENT_WIDTH_PREVIEW_OPEN,
//       )}
//     >
//       <div className="flex items-center h-full rounded-md relative overflow-hidden">
//         <UploadAttachmentsTree
//           key={'main-tree'}
//           data={ctx.attachments}
//           uploadQuery={ctx.uploadQuery}
//         />
//         {Array.from(ctx.selectedFolder.entries()).map(
//           ([folderKey, folderContent], idx) => (
//             <UploadAttachmentsTree
//               key={`${idx}-${folderKey}`}
//               data={folderContent}
//               uploadQuery={ctx.uploadQuery}
//             />
//           ),
//         )}
//       </div>
//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//   )
// }
//
// export const UploadAttachmentsTree = React.memo(
//   ({ data, uploadQuery }: UploadAttachmentsTreeItemProps) => {
//     const { data: attachments, state } = data ?? {}
//
//     if (state === 'pending') {
//       return (
//         <div
//           className={cn(
//             'flex flex-col p-2 bg-muted/10 [&>div>div]:h-full border-r border-r-border gap-1 opacity-50',
//             TREE_WIDTH,
//             TREE_HEIGHT,
//           )}
//         >
//           {Array.from({
//             length:
//               Number.parseInt(TREE_HEIGHT.match(/\d+/)?.[0] ?? '', 10) / 30,
//           }).map((_, idx) => (
//             <Skeleton className="h-[28px] w-full rounded-md" key={idx} />
//           ))}
//         </div>
//       )
//       // <Loader className="animate-spin opacity-50" />
//     }
//
//     if (state === 'error') {
//       return (
//         <div className="w-full h-full flex items-center justify-center">
//           <X /> Error
//         </div>
//       )
//     }
//
//     const filteredItems = (
//       uploadQuery
//         ? attachments?.filter((item) =>
//             item?.name.toLowerCase().includes(uploadQuery.toLowerCase()),
//           )
//         : attachments
//     ) as (BucketFilesType | BucketFoldersType)[]
//
//     if (state === 'success') {
//       return filteredItems?.length ? (
//         <div className="flex flex-col h-full border-r border-r-border">
//           <UploadAdvancedSelectAllLayout attachments={filteredItems} />
//           <ScrollArea
//             className={cn(
//               'p-2 bg-muted/10 [&>div>div]:h-full',
//               TREE_WIDTH,
//               TREE_HEIGHT,
//             )}
//           >
//             <div className="flex flex-col gap-1 h-full ">
//               {filteredItems.map((attachment) => {
//                 if ((attachment as BucketFilesType).url) {
//                   return (
//                     <UploadAdvancedAttachmentFile
//                       key={attachment.id}
//                       attachmentFile={attachment as BucketFilesType}
//                     />
//                   )
//                 }
//                 return (
//                   <UploadAdvancedAttachmentFolder
//                     key={attachment.id}
//                     folder={attachment as BucketFoldersType}
//                   />
//                 )
//               })}
//             </div>
//           </ScrollArea>
//         </div>
//       ) : (
//         <UploadAdvancedNoAttachments />
//       )
//     }
//   },
// )
//
// export const UploadAdvancedRowView = () => {
//   const { previewFile } = useUploadAdvancedContext() ?? {}
//   return (
//     <ScrollArea
//       className={cn(
//         'transition-all duration-300 ease-in-out w-full',
//         TREE_HEIGHT,
//         previewFile && CONTENT_WIDTH_PREVIEW_OPEN,
//       )}
//     >
//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//   )
//   // <UploadAttachmentsRow />
// }
//
// export const UploadAttachmentsRow = () => {
//   const ctx = useUploadAdvancedContext()
//
//   const filteredItems = (
//     ctx.uploadQuery
//       ? ctx.attachments.data?.filter((item) =>
//           item.name.toLowerCase().includes(ctx.uploadQuery.toLowerCase()),
//         )
//       : ctx.attachments
//   ) as (BucketFilesType | BucketFoldersType)[]
//
//   return (
//     <div className="w-full h-full">
//       {filteredItems?.length > 0 ? (
//         <Table>
//           <TableHeader className="bg-muted/70 [&_th]:py-2 [&_th]:h-fit [&_th]:text-muted-foreground [&_th]:text-xs">
//             <TableRow>
//               <TableHead className="w-[400px]">Name</TableHead>
//               <TableHead className="w-[100px]">Size</TableHead>
//               <TableHead className="w-[100px]">Type</TableHead>
//               <TableHead className="w-[200px]">Created At</TableHead>
//               <TableHead className="w-[200px]">Updated At</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredItems.map((attachment) =>
//               (attachment as BucketFoldersType).files_count >= 0 ? (
//                 <UploadAdvancedAttachmentsRowFolder
//                   folder={attachment as BucketFoldersType}
//                 />
//               ) : (
//                 <UploadAdvancedAttachmentsRowFile
//                   attachmentFile={attachment as BucketFilesType}
//                 />
//               ),
//             )}
//           </TableBody>
//         </Table>
//       ) : (
//         <div className="[&>div]:border-none [&_>div]:w-full [&_div]:h-full h-full">
//           <UploadAdvancedNoAttachments />
//         </div>
//       )}
//     </div>
//   )
// }
//
// export const UploadFilePreview = (): JSX.Element => {
//   const ctx = useUploadAdvancedContext()
//
//   return (
//     <>
//       <div
//         className={cn(
//           PREVIEW_WIDTH,
//           'absolute top-0 right-0 h-full duration-300 ease-in-out translate-x-[100%] z-10 dark:bg-[#121212] bg-card',
//           ctx.previewFile && 'translate-x-0',
//         )}
//       >
//         <ScrollArea className="h-full">
//           <Button
//             size={'xs'}
//             variant={'nothing'}
//             className="absolute top-2 right-4 p-0"
//             icon={{ children: X }}
//             onClick={() => ctx.setPreviewFile(null)}
//           />
//           <div className="border-l border-l-border bg-muted/10 w-full h-full px-4 py-8">
//             <div className="border border-border w-full h-[180px] flex items-center justify-center rounded-md overflow-hidden">
//               <img
//                 src={ctx.previewFile?.url ?? ''}
//                 className="object-contain size-full"
//                 alt={ctx.previewFile?.name}
//               />
//             </div>
//             <div className="my-4 flex flex-col gap-1">
//               <h6 className="text-sm font-medium truncate max-w-[70%]">
//                 {ctx.previewFile?.name}
//               </h6>
//               <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
//                 <span>{ctx.previewFile?.type ?? 'not-specified'}</span>-
//                 <span>
//                   {filesize(ctx.previewFile?.size ?? 0, {
//                     round: 0,
//                   })}
//                 </span>
//               </p>
//             </div>
//             <div className="my-4 flex flex-col gap-1">
//               <h6 className="text-xs font-medium text-accent-foreground/90">
//                 Created at
//               </h6>
//               <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
//                 {ctx.previewFile
//                   ? format(
//                       new Date(ctx.previewFile?.created_at ?? Date.now()),
//                       'dd/MM/yyyy hh:mm:ss a',
//                     )
//                   : ''}
//               </p>
//             </div>
//             <div className="my-4 flex flex-col gap-1">
//               <h6 className="text-xs font-medium text-accent-foreground/90">
//                 Updated at
//               </h6>
//               <p className="text-accent-foreground/70 text-xs flex items-center gap-1 fno">
//                 {ctx.previewFile
//                   ? format(
//                       new Date(ctx.previewFile?.updated_at ?? Date.now()),
//                       'dd/MM/yyyy hh:mm:ss a',
//                     )
//                   : ''}
//               </p>
//             </div>
//             <div className="flex flex-row gap-2 [&_button]:px-3 mt-4 mb-2 ">
//               <UploadAdvancedDownloadAttachments
//                 itemsName={[ctx.previewFile?.name ?? '']}
//                 withinDropdown={false}
//               />
//               <Button
//                 size={'xs'}
//                 // variant={'secondary'}
//                 icon={{ children: Clipboard }}
//               >
//                 Get URL
//               </Button>
//             </div>
//             <Separator />
//             <div className="my-2 flex flex-row gap-2 [&_button]:px-3">
//               <UploadAdvancedAlertDeleteAttachments
//                 itemsName={[ctx.previewFile?.name ?? '']}
//                 className={cn(
//                   buttonVariants({
//                     className: 'w-fit',
//                     size: 'xs',
//                     variant: 'destructive',
//                     border: 'destructive',
//                   }),
//                 )}
//                 itemsToDelete={[ctx.previewFile?.id ?? '']}
//               />
//             </div>
//           </div>
//         </ScrollArea>
//       </div>
//     </>
//   )
// }
