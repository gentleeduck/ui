//
// import { cn } from '@gentleduck/libs/cn'
// import React from 'react'
// import { AsyncImage } from 'loadable-image'
// import { AttachmentType } from './upload'
// import { CircleX, Download, Ellipsis, Trash } from 'lucide-react'
// import {
//   DialogContentResponsive,
//   DialogDescriptionResponsive,
//   DialogHeaderResponsive,
//   DialogResponsive,
//   DialogTitleResponsive,
//   DialogTriggerResponsive,
// } from '@gentleduck/registry-ui-duckui/dialog'
// import { ScrollArea } from './scroll-area'
// import { filesize } from 'filesize'
// import { useMediaQuery } from '@gentleduck/hooks/'
//
// export interface ImagePreviewContextType {
//   isDesktop: boolean
//   open: boolean
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>
// }
//
// export const ImagePreviewContext = React.createContext<ImagePreviewContextType>(
//   {} as ImagePreviewContextType,
// )
//
// export const useImagePreview = () => {
//   if (!ImagePreviewContext) {
//     throw new Error('useImagePreview must be used within a <ImagePreview>')
//   }
//   return React.useContext(ImagePreviewContext)
// }
//
// export interface ImagePreviewProps extends React.HTMLProps<HTMLImageElement> {}
//
// export const ImagePreview = React.forwardRef<
//   HTMLImageElement,
//   ImagePreviewProps
// >(({ children, className, ...props }, ref) => {
//   return (
//     <div
//       className={cn(
//         'grid grid-cols-2 md:grid-cols-3 gap-2 max-w-[90%]',
//         className,
//       )}
//       ref={ref}
//       {...props}
//     >
//       {children}
//     </div>
//   )
// })
//
// export interface ImagePreviewItemProps
//   extends React.ComponentPropsWithoutRef<typeof DialogResponsive> {
//   attachment?: AttachmentType
// }
//
// export const ImagePreviewItem: React.FC<ImagePreviewItemProps> = ({
//   attachment,
//   children,
//   ...props
// }) => {
//   const [open, setOpen] = React.useState(false)
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   return (
//     <ImagePreviewContext.Provider
//       value={{
//         isDesktop,
//         open,
//         setOpen,
//       }}
//     >
//       <DialogResponsive open={open} onOpenChange={setOpen} {...props}>
//         {children}
//       </DialogResponsive>
//     </ImagePreviewContext.Provider>
//   )
// }
//
// export interface ImagePreviewTriggerProps
//   extends React.ComponentPropsWithoutRef<typeof DialogTriggerResponsive> {
//   attachment?: AttachmentType
// }
// export const ImagePreviewTrigger: React.FC<ImagePreviewTriggerProps> = ({
//   className,
//   attachment,
//   onClick,
//   children,
//   ...props
// }) => {
//   const url = attachment
//     ? attachment.url
//       ? attachment.url
//       : URL.createObjectURL(attachment.file as Blob)
//     : null
//   const [error, setError] = React.useState<boolean>(false)
//   const { setOpen } = useImagePreview()
//
//   const Content = () => (
//     <>
//       {children ? (
//         children
//       ) : (
//         <>
//           <picture className="w-full h-[100px] rounded-lg overflow-hidden cursor-pointer relative">
//             <DropdownMenuView
//               trigger={{
//                 icon: { children: Ellipsis, className: 'h-4 w-4 rounded-sm  },
//                 variant: 'ghost',
//                 size: 'icon',
//                 className: 'h-4 w-6 absolute bottom-2 right-2',
//               }}
//               content={{
//                 options: {
//                   itemType: 'label',
//                   optionsData: [
//                     {
//                       children: 'Download',
//                       icon: {
//                         children: Download,
//                         className: 'h-4 w-4 rounded-sm ,
//                       },
//                       onClick: () => {
//                         downloadAttachment({ attachment: attachment! })
//                       },
//                     },
//                     {
//                       children: 'Delete',
//                       className: 'text-red-500 bg-red-500/10',
//                       icon: { children: Trash, className: 'h-4 w-4 rounded-sm'  },
//                       onClick: () => {
//                         setOpen(false)
//                       },
//                     },
//                   ],
//                 },
//               }}
//             />
//             <img
//               src={url ?? ''}
//               // loading="lazy"
//               // style={{ width: 115.35, height: 116.4 }}
//               // loader={<Skeleton className="w-full h-[100px] rounded-lg object-cover object-center" />}
//               // onError={() => {
//               //   setError(true)
//               // }}
//               // error={
//               //   <div className="w-full h-[100px] rounded-lg object-cover object-center items-center flex flex-col gap-2 place-content-center bg-red-800/40 text-red-400">
//               //     <CircleX className="size-5 mx-auto" />
//               //     <span className="text-sm text-center">Failed</span>
//               //   </div>
//               // }
//               className="w-full h-[100px] rounded-lg object-cover object-center"
//               alt={attachment?.name ?? ''}
//             />
//             <div className="flex items-center gap-2 absolute bottom-2 right-2"></div>
//           </picture>
//         </>
//       )}
//     </>
//   )
//
//   return (
//     <DialogTriggerResponsive
//       className={cn(
//         'relative',
//         error && 'pointer-events-none opacity-70',
//         className,
//       )}
//       onClick={(e) => {
//         setOpen((open) => !open)
//         onClick && onClick(e)
//       }}
//       {...props}
//     >
//       <Content />
//     </DialogTriggerResponsive>
//   )
// }
//
// export interface FetchAudioBlobParams {
//   url: string
// }
//
// export const fetchBlob = async ({
//   url,
// }: FetchAudioBlobParams): Promise<Blob | null> => {
//   try {
//     const response = await fetch(url)
//
//     if (!response.ok) {
//       throw new Error(
//         `Failed to fetch audio: ${response.statusText} (status: ${response.status})`,
//       )
//     }
//
//     const blob = await response.blob()
//     return blob
//   } catch (error) {
//     console.error('Error fetching audio:', error)
//     return null
//   }
// }
//
// export interface ImagePreviewContentProps
//   extends React.HTMLProps<HTMLDivElement> {
//   attachment?: AttachmentType
// }
//
// export const ImagePreviewContent = React.forwardRef<
//   HTMLDivElement,
//   ImagePreviewContentProps
// >(({ className, attachment, children, ...props }, ref) => {
//   const url = attachment
//     ? attachment.url
//       ? attachment.url
//       : URL.createObjectURL(attachment.file as Blob)
//     : null
//
//   return (
//     <DialogContentResponsive
//       className={cn(
//         'max-w-full md:max-w-[90vw] xl:max-w-[900px] w-full lg:h-[600px] p-4 rounded-lg',
//         className,
//       )}
//       // ref={ref}
//       {...props}
//     >
//       {children ? (
//         children
//       ) : (
//         <>
//           <DialogHeaderResponsive className="px-0">
//             <DialogTitleResponsive className="text-xl font-bold max-w-[85%] text-start">
//               {attachment?.name ?? ''}
//             </DialogTitleResponsive>
//             <DialogDescriptionResponsive className="text-sm flex items-start text-accent-foreground/80">
//               Size:
//               <span className="text-muted-foreground truncate">
//                 {filesize(attachment?.size ?? 0, { round: 0 })}
//               </span>
//             </DialogDescriptionResponsive>
//           </DialogHeaderResponsive>
//           <ScrollArea className="h-full w-full rounded-lg relative">
//             <Button
//               className="absolute top-4 right-4 hover:bg-primary"
//               icon={{ children: Download }}
//               onClick={() => {
//                 downloadAttachment({ attachment: attachment! })
//               }}
//               label={{ className: 'hidden md:inline', children: 'Download' }}
//             />
//             <img
//               className="w-full h-full object-cover object-center cursor-pointer"
//               src={url ?? ''}
//             />
//           </ScrollArea>
//         </>
//       )}
//     </DialogContentResponsive>
//   )
// })
