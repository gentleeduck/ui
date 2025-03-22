// @ts-noCheck
// 'use client'
// import React from 'react'
// import { AttachmentType, CommentType, TaggedUserType } from './swapy'
// import { differenceInDays, differenceInHours, format, formatDistance } from 'date-fns'
// import { cn } from '@/lib'
// import { Avatar, AvatarFallback, AvatarImage } from './avatar'
// import { ScrollArea } from './scroll-area'
// import { filesize } from 'filesize'
// import { Button } from '@/registry/registry-ui-components'
// import {
//   ArrowBigUp,
//   BadgeCheck,
//   Bug,
//   CalendarDays,
//   Check,
//   Ellipsis,
//   LucideIcon,
//   Paperclip,
//   Plus,
//   Trash2,
//   Upload as UploadIcon,
//   X,
//   Trash,
//   Download,
// } from 'lucide-react'
// import { uuidv7 } from 'uuidv7'
// import { DropdownMenuOptionsDataType, DropdownMenuView } from './dropdown-menu'
//
// import 'highlight.js/styles/tokyo-night-dark.css'
// import { MDXContext } from '../example/mdx-context-provider'
// import { AudioItem, fetchAudioBlob, useAudioDataProvider, useAudioProvider } from './audio-record'
// import { LikeButton } from './custom-buttons'
// import { Popover, PopoverContent, PopoverTrigger, PopoverWrapper } from './popover'
// import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'
// import { Input } from './input'
// import { users } from '../example/SwapyMainDemo'
// import { toast } from 'sonner'
// import { DialogWrapper } from './ShadcnUI'
// import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
// import { fetchBlob, ImagePreview, ImagePreviewContent, ImagePreviewItem, ImagePreviewTrigger } from './image-preview'
// import { JsxElement } from 'ts-morph'
//
// // Comment
// export interface CommentContextType {
//   comments: CommentType[]
//   setComments: React.Dispatch<React.SetStateAction<CommentType[]>>
//   currentCommentContent: string
//   setCurrentCommentContent: React.Dispatch<React.SetStateAction<string>>
//   attachments: AttachmentType[]
//   setAttachments: React.Dispatch<React.SetStateAction<AttachmentType[]>>
// }
//
// export const CommentContext = React.createContext<CommentContextType>({} as CommentContextType)
// export interface CommentProps extends React.HTMLAttributes<HTMLDivElement> {}
//
// export const Comment = React.forwardRef<HTMLDivElement, CommentProps>(({ className, children, ...props }, ref) => {
//   const [comments, setComments] = React.useState<CommentType[]>([])
//   const [currentCommentContent, setCurrentCommentContent] = React.useState<string>('')
//   const { attachments, setAttachments } = useUploadContext()
//
//   return (
//     <CommentContext.Provider
//       value={{
//         currentCommentContent,
//         setCurrentCommentContent,
//         comments,
//         setComments,
//         attachments,
//         setAttachments,
//       }}
//     >
//       <div
//         className={cn('max-w-[500px] border border-border border-solid rounded-lg', className)}
//         {...props}
//         ref={ref}
//       >
//         {children}
//       </div>
//     </CommentContext.Provider>
//   )
// })
//
// // Comment Top
// export interface CommentTopProps extends React.HTMLProps<HTMLDivElement> {}
//
// export const CommentTop = React.forwardRef<HTMLDivElement, CommentTopProps>(
//   ({ className, children, ...props }, ref) => {
//     return (
//       <div
//         className={cn('flex items-center justify-between pt-4 px-4', className)}
//         ref={ref}
//         {...props}
//       >
//         {children}
//       </div>
//     )
//   }
// )
//
// // Comment Title
// export interface CommentTitleProps extends React.HTMLProps<HTMLDivElement> {}
//
// export const CommentTitle = React.forwardRef<HTMLDivElement, CommentTitleProps>(
//   ({ className, children, ...props }, ref) => {
//     return (
//       <h3
//         className={cn('text-lg font-medium leading-none tracking-tight', className)}
//         ref={ref}
//         {...props}
//       >
//         {children}
//       </h3>
//     )
//   }
// )
//
// // Comment Colse
// export interface CommentCloseProps extends React.HTMLProps<HTMLDivElement> {}
//
// export const CommentClose = React.forwardRef<HTMLDivElement, CommentCloseProps>(({ className, ...props }, ref) => {
//   return (
//     <div
//       className={cn(
//         'size-4 rounded-md focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer',
//         className
//       )}
//       ref={ref}
//       {...props}
//     >
//       <X className="w-4 h-4" />
//     </div>
//   )
// })
//
// // Comment Content
// export interface CommentContentProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {
//   length: number
// }
//
// export const CommentContent = ({ length, children, ...props }: CommentContentProps) => {
//   return (
//     <ScrollArea
//       className={cn('h-80 h-[30rem] px-4 pt-2 pb-0', length > 2 && 'grid place-content-end')}
//       {...props}
//     >
//       {children}
//     </ScrollArea>
//   )
// }
//
// // Comment Item
// export interface CommentItemProps extends React.HTMLProps<HTMLDivElement> {}
//
// export const CommentItem = React.forwardRef<HTMLDivElement, CommentItemProps>(
//   ({ children, className, ...props }, ref) => {
//     return (
//       <>
//         <div
//           className={cn('comment flex transition hover:bg-secondary/20 px-3 pt-3 rounded-[.5rem]', className)}
//           ref={ref}
//           {...props}
//         >
//           {children}
//         </div>
//       </>
//     )
//   }
// )
//
// export interface CommentAvaterProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
//   avatar_image: React.ComponentPropsWithoutRef<typeof AvatarImage>
//   fallback?: React.ComponentPropsWithoutRef<typeof AvatarFallback>
// }
//
// export const CommentAvater = React.forwardRef<HTMLDivElement, CommentAvaterProps>(
//   ({ avatar_image, fallback, ...props }, ref) => {
//     return (
//       <Avatar
//         {...props}
//         ref={ref}
//       >
//         <AvatarImage {...avatar_image} />
//         {fallback && <AvatarFallback {...fallback} />}
//       </Avatar>
//     )
//   }
// )
//
// // Comment Profile
// export interface CommentProfileProps extends React.ComponentPropsWithoutRef<typeof HoverCardTrigger> {
//   hoverContent?: React.ReactNode
// }
//
// export const CommentProfile = React.forwardRef<HTMLAnchorElement, CommentProfileProps>(
//   ({ children, hoverContent, className, ...props }, ref) => {
//     return (
//       <HoverCard>
//         <HoverCardTrigger
//           className={cn('cursor-pointer', className)}
//           ref={ref}
//           {...props}
//         >
//           {children}
//         </HoverCardTrigger>
//         <HoverCardContent className={cn('w-80 p-4')}>{hoverContent}</HoverCardContent>
//       </HoverCard>
//     )
//   }
// )
//
// // Comment Item Side
// export interface CommentItemSideProps extends React.HTMLProps<HTMLDivElement> {}
//
// export const CommentItemSide = React.forwardRef<HTMLDivElement, CommentItemSideProps>(
//   ({ children, className, ...props }, ref) => {
//     return (
//       <div
//         className={cn('flex flex-col shrink-0 basis-8 grow-0 items-center mr-2 ', className)}
//         ref={ref}
//         {...props}
//       >
//         <div className="top-shape w-[2px] max-h-2 bg-border flex-grow border-border border flex basis-auto flex-col items-stretch my-1"></div>
//         {children}
//         <div className="bottom-shape w-[2px] bg-border flex-grow border-border border flex basis-auto flex-col items-stretch mt-1"></div>
//       </div>
//     )
//   }
// )
//
// // Comment Item Body
// export interface CommentItemBodyProps extends React.HTMLProps<HTMLDivElement> {}
//
// export const CommentItemBody = React.forwardRef<HTMLDivElement, CommentItemBodyProps>(
//   ({ children, className, ...props }, ref) => {
//     return (
//       <div
//         className={cn('flex flex-col items-start justify-start w-full', className)}
//         ref={ref}
//         {...props}
//       >
//         {children}
//       </div>
//     )
//   }
// )
//
// // Comment Item Top
// export interface CommentItemTopProps extends React.HTMLProps<HTMLDivElement> {}
//
// export const CommentItemTop = React.forwardRef<HTMLDivElement, CommentItemTopProps>(
//   ({ className, children, ...props }, ref) => {
//     return (
//       <div
//         className={cn('flex items-center justify-start w-full gap-2 mb-2', className)}
//         ref={ref}
//         {...props}
//       >
//         {children}
//       </div>
//     )
//   }
// )
//
// // Comment Item Date
// export interface CommentItemDateProps extends React.HTMLProps<HTMLDivElement> {
//   date: string
// }
//
// export const CommentItemDate = React.forwardRef<HTMLDivElement, CommentItemDateProps>(
//   ({ date, className, children, ...props }, ref) => {
//     const commentDate = new Date(date)
//     const daysDifference = differenceInDays(new Date(), commentDate)
//     const hoursDifference = differenceInHours(new Date(), commentDate)
//
//     return (
//       <p
//         className={cn('text-xs text-muted-foreground', className)}
//         ref={ref}
//         {...props}
//       >
//         {daysDifference > 1
//           ? format(commentDate, 'PP')
//           : hoursDifference > 1
//             ? format(commentDate, 'p')
//             : formatDistance(commentDate, new Date(), { addSuffix: false, includeSeconds: true })}
//       </p>
//     )
//   }
// )
//
// // Comment Item Top User
// export interface CommentItemTopUserProps extends React.HTMLProps<HTMLDivElement> {
//   user: TaggedUserType
// }
//
// export const CommentItemTopUser = React.forwardRef<HTMLDivElement, CommentItemTopUserProps>(
//   ({ user, className, children, ...props }, ref) => {
//     return (
//       <div
//         className={cn('flex items-center justify-start gap', className)}
//         ref={ref}
//         {...props}
//       >
//         {children}
//       </div>
//     )
//   }
// )
//
// // Comment Bottom
// export interface CommentBottom extends React.HTMLProps<HTMLFormElement> {}
//
// export const CommentBottom = React.forwardRef<HTMLFormElement, CommentBottom>(
//   ({ className, children, onSubmit, ...props }, ref) => {
//     return (
//       <form
//         className={cn(
//           'flex items-center justify-center border-t border-border border-solid gap-2 px-4 py-3 relative',
//           className
//         )}
//         ref={ref}
//         onSubmit={e => {
//           e.preventDefault()
//           onSubmit && onSubmit(e)
//         }}
//         {...props}
//       >
//         {children}
//       </form>
//     )
//   }
// )
//
// // Comment Scroll Tracker
// export const CommentScrollTracker = () => {
//   const { comments } = React.useContext(CommentContext)
//
//   React.useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [comments])
//
//   const bottomRef = React.useRef<HTMLDivElement>(null)
//   return (
//     <div
//       ref={bottomRef}
//       className="h-4"
//     />
//   )
// }
//
// // Comment Input
// export interface CommentInputProps extends React.HTMLProps<HTMLDivElement> {
//   showOriginal?: boolean
// }
//
// export const CommentInput = React.forwardRef<HTMLDivElement, CommentInputProps>(
//   ({ className, children, showOriginal = true, ...props }, ref) => {
//     const { currentCommentContent, setCurrentCommentContent } = React.useContext(CommentContext)
//     const { recording } = useAudioDataProvider()
//
//     return (
//       <div
//         className={cn('relative w-full', className)}
//         ref={ref}
//         {...props}
//       >
//         {showOriginal && (
//           <Input
//             disabled={recording}
//             placeholder="Write a comment..."
//             value={currentCommentContent}
//             onChange={e => {
//               setCurrentCommentContent(e.target.value)
//             }}
//             className={cn('font-medium resize-none py-1 h-8 w-full')}
//             name=""
//           />
//         )}
//         {children}
//       </div>
//     )
//   }
// )
//
// // Comment Bottom Buttons
// export interface CommentBottomButtonsProps extends React.HTMLProps<HTMLDivElement> {}
//
// export const CommentBottomButtons = React.forwardRef<HTMLDivElement, CommentBottomButtonsProps>(
//   ({ className, children, ...props }, ref) => {
//     return (
//       <div
//         className={cn('flex tems-center justify-center')}
//         ref={ref}
//         {...props}
//       >
//         {children}
//       </div>
//     )
//   }
// )
//
// // Comment Attachments
// export interface CommentsAttachmentsProps extends React.ComponentPropsWithoutRef<typeof Button> {}
//
// export const CommentsAttachments = React.forwardRef<HTMLDivElement, CommentBottomButtonsProps>(
//   ({ className, children, ...props }, ref) => {
//     const { recordings } = useAudioDataProvider()
//     const { attachments } = React.useContext(CommentContext)
//
//     return (
//       <div
//         className={cn('absolute bottom-6 w-full', className)}
//         ref={ref}
//         {...props}
//       >
//         <Popover>
//           <PopoverTrigger className={cn('')}>
//             <Button
//               size={'sm'}
//               className={cn(
//                 'absolute left-0 gap-2 flex items-center h-fit py-1 transition-all duration-400 ease-out',
//                 [...recordings, ...attachments].length > 0
//                   ? 'bottom-4 opacity-100 pointer-events-all'
//                   : '-bottom-4 opacity-0 pointer-events-none'
//               )}
//               icon={{
//                 children: Paperclip as LucideIcon,
//                 className: '!size-[.8rem]',
//               }}
//               label={{
//                 children: [...recordings, ...attachments].length,
//               }}
//             >
//               <span className="text-xs">Attachments</span>
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent
//             align="start"
//             side="top"
//             className={cn('p-2 mb-1 w-full')}
//           >
//             <ScrollArea>
//               <div className="grid items justify-start gap-2 shrink-0 w-full grid-cols-2 max-h-[104px]">
//                 {children
//                   ? children
//                   : [...recordings, ...attachments].map((attachment, idx) => (
//                       <CommentAttachmentItem
//                         key={attachment.id ?? idx}
//                         attachment={attachment}
//                       />
//                     ))}
//               </div>
//             </ScrollArea>
//           </PopoverContent>
//         </Popover>
//       </div>
//     )
//   }
// )
//
// // Comment Attachment Item
// export interface CommentAttachmentItemProps extends React.HTMLProps<HTMLDivElement> {
//   attachment: AttachmentType
// }
//
// export const CommentAttachmentItem = React.forwardRef<HTMLDivElement, CommentAttachmentItemProps>(
//   ({ className, attachment, key, children, ...props }, ref) => {
//     const { setRecordings } = useAudioDataProvider()
//
//     const fileType = getFileType(attachment.file)
//     return (
//       <div
//         className={cn(
//           'rounded-md bg-secondary/50 h-fit flex items-center justify-start gap-2 w-[152px] p-2 relative',
//           className
//         )}
//         ref={ref}
//         {...props}
//       >
//         <CommentClose
//           className="absolute top-1/2 -translate-y-1/2 right-2"
//           onClick={() => {
//             setRecordings(prev => prev.filter(item => item !== attachment))
//           }}
//         />
//         {children ? (
//           children
//         ) : (
//           <>
//             <div className="relative">{fileTypeIcons[fileType]}</div>
//             <div>
//               <p className="text-xs text-muted-foreground truncate">{attachment.type}</p>
//               <p className="text-xs text-muted-foreground truncate">{filesize(+attachment.size, { round: 0 })}</p>
//             </div>
//           </>
//         )}
//       </div>
//     )
//   }
// )
//
// // Comment Attachment Item
// export interface CommentItemContentAttachmentProps extends React.HTMLProps<HTMLDivElement> {
//   attachment: AttachmentType
// }
//
// export const CommentItemContentAttachment = React.forwardRef<HTMLDivElement, CommentItemContentAttachmentProps>(
//   ({ className, attachment, key, children, ...props }, ref) => {
//     const fileType = getFileType(attachment.file)
//
//     return (
//       <div
//         className={cn(
//           'rounded-lg bg-secondary hover:bg-secondary/70 h-fit flex items-center gap-2 w-[152px] p-2 relative justify-between transition',
//           className
//         )}
//         ref={ref}
//         {...props}
//       >
//         {children ? (
//           children
//         ) : (
//           <>
//             <div className="flex items-center gap-2">
//               <div className="relative">{fileTypeIcons[fileType]}</div>
//               <div>
//                 <h5 className="text-xs text-muted-foreground truncate max-w-[150px]">{attachment.name}</h5>
//                 <p className="text-xs text-muted-foreground truncate">{filesize(+attachment.size, { round: 0 })}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {
//                 // <DropdownMenuView
//                 //                 trigger={{
//                 //                   icon: { children: Ellipsis, className: 'h-6 w-6 rounded-sm'  },
//                 //                   variant: 'ghost',
//                 //                   size: 'icon',
//                 //                   className: 'h-4 w-6',
//                 //                 }}
//                 //                 // content={{
//                 //                 //   options: {
//                 //                 //     itemType: 'label',
//                 //                 //     optionsData: [
//                 //                 //       {
//                 //                 //         children: 'Download',
//                 //                 //         onClick: () => downloadAttachment({ attachment }),
//                 //                 //         icon: { children: Download, className: 'h-4 w-4' },
//                 //                 //       },
//                 //                 //       {
//                 //                 //         className: 'bg-red-400/10 text-red-400',
//                 //                 //         onClick: () => {
//                 //                 //           // TODO :handle delete
//                 //                 //         },
//                 //                 //         children: 'Delete',
//                 //                 //         icon: { children: Trash, className: 'h-4 w-4' },
//                 //                 //       },
//                 //                 //     ],
//                 //                 //   },
//                 //                 // }}
//                 //               />
//               }
//             </div>
//           </>
//         )}
//       </div>
//     )
//   }
// )
//
// // Download Attachment
// export const downloadAttachment = async ({ attachment }: { attachment: AttachmentType }) => {
//   if (attachment.file) {
//     let file: Blob = attachment.file as Blob
//     return download(file, attachment.name ?? 'image.jpg')
//   }
//
//   if (attachment.url) {
//     const file = await fetchBlob({
//       url: 'https://cdn.dribbble.com/userupload/15140814/file/original-22eddfd50ce84be4acb8bbbd50cf7840.jpg?resize=1600x1200',
//     })
//     return download(file ?? new Blob([]), attachment.name ?? 'image.jpg')
//   }
// }
//
// function download(blob: Blob, name: string) {
//   const url = URL.createObjectURL(blob)
//   const a = document.createElement('a')
//
//   a.href = url
//   a.download = new Date().getTime() + '_' + name
//   document.body.appendChild(a)
//   a.click()
//   document.body.removeChild(a)
//   URL.revokeObjectURL(url)
// }
//
// // Comment Send Button
// export interface CommentSendButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}
//
// export const CommentSendButton = React.forwardRef<HTMLButtonElement, CommentSendButtonProps>(
//   ({ className, onClick, children, ...props }, ref) => {
//     const { mention, editContent, setMdxContent } = React.useContext(MDXContext)
//     const { setComments, currentCommentContent, setCurrentCommentContent, attachments, setAttachments } =
//       React.useContext(CommentContext)
//     const { recording } = useAudioProvider()
//     const { recordings, setRecordings } = useAudioDataProvider()
//
//     const audioAttachments = [...recordings, ...attachments]
//
//     const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
//       e.preventDefault()
//       const newComment: CommentType = {
//         id: uuidv7(),
//         user: users[1],
//         attachments: audioAttachments,
//         content: currentCommentContent,
//         likes: {
//           amount: 0,
//           users: [],
//         },
//         createdAt: new Date().toString(),
//       }
//
//       setComments &&
//         setComments(prev => {
//           return [...prev, newComment]
//           //               if (currentCommentContent || recording) {
//           // } else if (editContent) {
//           //   return [editContent]
//           // }
//
//           return prev
//         })
//
//       setCurrentCommentContent('')
//       setRecordings([])
//       setAttachments([])
//       onClick && onClick(e)
//     }
//
//     return children ? (
//       children
//     ) : (
//       <Button
//         size={'icon'}
//         variant={'outline'}
//         className={cn(
//           'rounded-full relative transition-all duration-300 origin-center w-8 h-8 m-auto bg-secondary/20',
//           !recording
//             ? 'scale-1 opacity-1 ml-2 translate-x-0'
//             : '-translate-x-[126%] w-0 h-0 pointer-events-none opacity-0 invisible ml-0',
//           className
//         )}
//         icon={{
//           className: cn(recording ? 'scale-0 opacity-0' : 'scale-100 opacity-100'),
//           children: editContent ? Check : ArrowBigUp,
//         }}
//         type="submit"
//         disabled={audioAttachments.length === 0}
//         onClick={onClickHandler}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
//
// //FIX: Comment Placeholder
//
// export interface CommentPlaceholderProps {
//   children: ({ comment }: { comment: CommentType }) => React.ReactNode
// }
//
// export const CommentPlaceholder = ({ children: CommentItem }: CommentPlaceholderProps) => {
//   const { comments: newComments } = React.useContext(CommentContext)
//
//   return (
//     <>
//       {newComments.map((comment, idx) => {
//         return (
//           <CommentItem
//             comment={comment}
//             key={idx}
//           />
//         )
//       })}
//     </>
//   )
// }
//
// function groupByTypePrefix(attachments: AttachmentType[]): AttachmentType[][] {
//   if (!attachments.length) return []
//
//   const groupedAttachments = []
//   let currentGroup: AttachmentType[] = []
//   let currentType = ''
//
//   for (const attachment of attachments) {
//     // Extract the type prefix (e.g., 'image' from 'image/png')
//     const typePrefix = attachment.type.split('/')[0]
//
//     // If we are starting a new group
//     if (currentType !== typePrefix) {
//       // If there is a current group, push it to the result
//       if (currentGroup.length) {
//         groupedAttachments.push(currentGroup)
//       }
//       // Start a new group and set the current type
//       currentGroup = [attachment]
//       currentType = typePrefix
//     } else {
//       // If it's the same type, add it to the current group
//       currentGroup.push(attachment)
//     }
//   }
//
//   // Push the last group if it exists
//   if (currentGroup.length) {
//     groupedAttachments.push(currentGroup)
//   }
//
//   return groupedAttachments
// }
//
// //FIX: Comment Item Content
// export const CommentItemContent = ({ content, attachments }: { content: string; attachments: AttachmentType[] }) => {
//   const groupedAttachments = groupByTypePrefix(attachments)
//   return (
//     <div className="mdx__minimal__text__editor border-none flex flex-col gap-3 mb-2 w-full">
//       {content && (
//         <p
//           className={cn('text-sm  tiptap ProseMirror')}
//           dangerouslySetInnerHTML={{ __html: content }}
//         ></p>
//       )}
//       {groupedAttachments &&
//         groupedAttachments.map((group, idx) => {
//           if (group[0].type.includes('image')) {
//             return (
//               <ImagePreview key={idx}>
//                 {group.map((attachment: AttachmentType, idx) => {
//                   return (
//                     <ImagePreviewItem
//                       attachment={attachment}
//                       key={idx}
//                     >
//                       <ImagePreviewTrigger attachment={attachment} />
//                       <ImagePreviewContent attachment={attachment} />
//                     </ImagePreviewItem>
//                   )
//                 })}
//               </ImagePreview>
//             )
//           }
//           return group.map((item, idx) => {
//             if (item.type.includes('audio')) {
//               return (
//                 <AudioItem
//                   key={idx}
//                   attachment={item}
//                 />
//               )
//             }
//
//             // if( item.type.includes('video')){
//             //     return <VideoItem
//             //     key={idx}
//             //     attachment={item}
//             //   />
//             // }
//
//             if (!item.type.includes('audio')) {
//               return (
//                 <CommentItemContentAttachment
//                   key={idx}
//                   className="w-full max-w-[260px] p-3"
//                   attachment={item}
//                 />
//               )
//             }
//           })
//         })}
//     </div>
//   )
// }
//
// // FIX: Comment Item Bottom
// export const CommentItemBottom = ({ comment }: { comment: CommentType }) => {
//   const { mention, setMention } = React.useContext(MDXContext)
//
//   return (
//     <div className="flex items-center justify-center gap-2  mt-1 mb-1">
//       <Button
//         size={'sm'}
//         variant={'ghost'}
//         className="h-7 w-14 text-foreground/70 text-xs"
//         onClick={() => {
//           // setEditorFocus && setEditorFocus(prev => !prev)
//           setMention(comment.user)
//         }}
//       >
//         Reply
//       </Button>
//
//       <DropdownMenuView
//         trigger={{
//           icon: { children: Ellipsis, className: 'h-4 w-4 rounded-sm'  },
//           variant: 'ghost',
//           size: 'icon',
//           className: 'h-4 w-6',
//         }}
//         content={{
//           options: {
//             itemType: 'label',
//             optionsData: optionsData({ currentComment: comment }),
//           },
//         }}
//       />
//     </div>
//   )
// }
//
// const optionsData = ({ currentComment }: { currentComment: CommentType }) => {
//   const { setEditContent } = React.useContext(MDXContext)
//   const { setComments } = React.useContext(CommentContext)
//
//   return [
//     {
//       children: 'Edit',
//       onClick: () => {
//         setEditContent(currentComment)
//       },
//     },
//     {
//       children: 'Report',
//       icon: {
//         children: Bug,
//       },
//     },
//     {
//       children: 'Delete',
//       command: { label: '⌘⌫', key: 'a' },
//       icon: {
//         children: Trash2,
//       },
//       className: '[&_span]:text-red-500 text-red-500 [&_span]:hover:text-primary',
//       onClick: () => setComments(prev => prev.filter(c => c.id !== currentComment.id)),
//     },
//   ] as DropdownMenuOptionsDataType<string, true>[]
// }
//
// export interface CommentExtraButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}
//
// export const CommentExtraButton = React.forwardRef<HTMLButtonElement, CommentExtraButtonProps>(
//   ({ className, children, ...props }, ref) => {
//     return (
//       <PopoverWrapper
//         trigger={{
//           children: (
//             <Button
//               icon={{ children: Plus, className: 'h-4 w-4 rounded-sm'  }}
//               className="rounded-full h-8 w-8 bg-secondary/20 mr-2"
//               variant="outline"
//               size="icon"
//               ref={ref}
//             />
//           ),
//         }}
//         content={{
//           side: 'top',
//           align: 'center',
//           className: 'w-fit p-2',
//           children: (
//             <>
//               <Upload
//                 trigger={
//                   <UploadTrigger>
//                     <Button
//                       variant="outline"
//                       className="h-8 w-8 bg-secondary/20"
//                     >
//                       <UploadIcon className="h-4 w-4" />
//                     </Button>
//                   </UploadTrigger>
//                 }
//                 content={
//                   <div className="flex flex-col h-full gap-4">
//                     <UploadInput />
//                     <UploadContent />
//                   </div>
//                 }
//               />
//             </>
//           ),
//         }}
//       />
//     )
//   }
// )
//
// const ExtraButtons = () => {
//   const { setEditContent } = React.useContext(MDXContext)
//   const { setComments } = React.useContext(CommentContext)
//
//   return [
//     {
//       children: (
//         <Upload
//           trigger={
//             <UploadTrigger>
//               <Button
//                 variant="outline"
//                 className="h-8 w-8 bg-secondary/20"
//               >
//                 <UploadIcon className="h-4 w-4" />
//               </Button>
//             </UploadTrigger>
//           }
//           content={
//             <div className="flex flex-col h-full gap-4">
//               <UploadInput />
//               <UploadContent />
//             </div>
//           }
//         />
//       ),
//     },
//   ] as DropdownMenuOptionsDataType<string, true>[]
// }
