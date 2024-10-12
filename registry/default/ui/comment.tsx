import React from 'react'
import { Attachment, CommentType, TaggedUserType } from './swapy'
import { differenceInDays, differenceInHours, format, formatDistance } from 'date-fns'
import { cn } from '@/lib'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { ScrollArea } from './scroll-area'
import { filesize } from 'filesize'
import { Button } from './button'
import {
  ArrowBigUp,
  BadgeCheck,
  Bug,
  CalendarDays,
  Check,
  Ellipsis,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  LucideIcon,
  Mic,
  Paperclip,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { uuidv7 } from 'uuidv7'
import { DropdownMenuOptionsDataType, DropdownMenuView } from './dropdown-menu'

import 'highlight.js/styles/tokyo-night-dark.css'
import { MDXContext } from '../example/mdx-context-provider'
import { AudioItem, useAudioDataProvider, useAudioProvider } from './audio-record'
import { LikeButton } from './custom-buttons'
import { Popover, PopoverContent, PopoverTrigger, PopoverWrapper } from './popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'
import { Input } from './input'
import { users } from '../example/SwapyMainDemo'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'
import { Label } from './ShadcnUI'
import { ContextMenu, ContextMenuTrigger } from './context-menu'
import { toast } from 'sonner'
import { AlertDialogCustom } from './alert-dialog'

// Comment
export interface CommentContextType {
  comments: CommentType[]
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>
  currentCommentContent: string
  setCurrentCommentContent: React.Dispatch<React.SetStateAction<string>>
  attachments: AttachmentType[]
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentType[]>>
}

export const CommentContext = React.createContext<CommentContextType>({} as CommentContextType)
export interface CommentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Comment = React.forwardRef<HTMLDivElement, CommentProps>(({ className, children, ...props }, ref) => {
  const [comments, setComments] = React.useState<CommentType[]>([])
  const [currentCommentContent, setCurrentCommentContent] = React.useState<string>('')
  const [attachments, setAttachments] = React.useState<AttachmentType[]>([])

  return (
    <CommentContext.Provider
      value={{
        currentCommentContent,
        setCurrentCommentContent,
        comments,
        setComments,
        attachments,
        setAttachments,
      }}
    >
      <div
        className={cn('max-w-[500px] border border-border border-solid rounded-lg', className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    </CommentContext.Provider>
  )
})

// Comment Top
export interface CommentTopProps extends React.HTMLProps<HTMLDivElement> {}

export const CommentTop = React.forwardRef<HTMLDivElement, CommentTopProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center justify-between pt-4 px-4', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// Comment Title
export interface CommentTitleProps extends React.HTMLProps<HTMLDivElement> {}

export const CommentTitle = React.forwardRef<HTMLDivElement, CommentTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        className={cn('text-lg font-medium leading-none tracking-tight', className)}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

// Comment Colse
export interface CommentCloseProps extends React.HTMLProps<HTMLDivElement> {}

export const CommentClose = React.forwardRef<HTMLDivElement, CommentCloseProps>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'size-4 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer',
        className
      )}
      ref={ref}
      {...props}
    >
      <X className="w-4 h-4" />
    </div>
  )
})

// Comment Content
export interface CommentContentProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {
  length: number
}

export const CommentContent = ({ length, children, ...props }: CommentContentProps) => {
  return (
    <ScrollArea
      className={cn('h-80 px-4 pt-2 pb-0', length > 2 && 'grid place-content-end')}
      {...props}
    >
      {children}
    </ScrollArea>
  )
}

// Comment Item
export interface CommentItemProps extends React.HTMLProps<HTMLDivElement> {}

export const CommentItem = React.forwardRef<HTMLDivElement, CommentItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <>
        <div
          className={cn('comment flex transition hover:bg-secondary/20 px-3 pt-3 rounded-[.5rem]', className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)

export interface CommentAvaterProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  avatar_image: React.ComponentPropsWithoutRef<typeof AvatarImage>
  fallback?: React.ComponentPropsWithoutRef<typeof AvatarFallback>
}

export const CommentAvater = React.forwardRef<HTMLDivElement, CommentAvaterProps>(
  ({ avatar_image, fallback, ...props }, ref) => {
    return (
      <Avatar
        {...props}
        ref={ref}
      >
        <AvatarImage {...avatar_image} />
        {fallback && <AvatarFallback {...fallback} />}
      </Avatar>
    )
  }
)

// Comment Profile
export interface CommentProfileProps extends React.ComponentPropsWithoutRef<typeof HoverCardTrigger> {
  user: TaggedUserType
  hoverContent?: React.ReactNode
}

export const CommentProfile = React.forwardRef<HTMLAnchorElement, CommentProfileProps>(
  ({ children, hoverContent, user, className, ...props }, ref) => {
    return (
      <HoverCard>
        <HoverCardTrigger
          className={cn('cursor-pointer', className)}
          ref={ref}
          {...props}
        >
          {children}
        </HoverCardTrigger>
        <HoverCardContent className={cn('w-80 p-4')}>
          {hoverContent ? (
            hoverContent
          ) : (
            <div className="flex items-start gap-4">
              <CommentAvater
                className="w-12 h-12 border-none"
                avatar_image={{
                  src: user.avatarUrl,
                  className: 'm-0 border-none object-cover curosor-pointer',
                }}
                fallback={{
                  className: 'bg-secondary/20',
                }}
              />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@{user.name}</h4>
                <p className="text-sm">I'am a Software Engineer from Egypt.</p>
                <div className="flex items-center pt-2">
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-muted-foreground">Joined May 2021</span>
                </div>
              </div>
            </div>
          )}
        </HoverCardContent>
      </HoverCard>
    )
  }
)

// Comment Item Side
export interface CommentItemSideProps {
  user: TaggedUserType
}

export const CommentItemSide = React.forwardRef<HTMLDivElement, CommentItemSideProps>(({ user }, ref) => {
  return (
    <div className={cn('flex flex-col flex-shrink-0 basis-8 flex-grow-0 items-center mr-2 ')}>
      <div className="top-shape w-[2px] max-h-2 bg-border flex-grow border-border border flex basis-auto flex-col items-stretch my-1"></div>
      <CommentProfile user={user}>
        <CommentAvater
          className="w-8 h-8 border-none"
          avatar_image={{
            src: user.avatarUrl,
            className: 'm-0 border-none object-cover curosor-pointer',
          }}
          fallback={{
            className: 'bg-secondary/20',
          }}
        />
      </CommentProfile>
      <div className="bottom-shape w-[2px] bg-border flex-grow border-border border flex basis-auto flex-col items-stretch mt-1"></div>
    </div>
  )
})

// Comment Item Body
export interface CommentItemBodyProps extends React.HTMLProps<HTMLDivElement> {}

export const CommentItemBody = React.forwardRef<HTMLDivElement, CommentItemBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn('flex flex-col items-start justify-start w-full', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// Comment Item Top
export interface CommentItemTopProps extends React.HTMLProps<HTMLDivElement> {}

export const CommentItemTop = React.forwardRef<HTMLDivElement, CommentItemTopProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center justify-start w-full gap-2 mb-2', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// Comment Item Date
export interface CommentItemDateProps extends React.HTMLProps<HTMLDivElement> {
  date: string
}

export const CommentItemDate = React.forwardRef<HTMLDivElement, CommentItemDateProps>(
  ({ date, className, children, ...props }, ref) => {
    const commentDate = new Date(date)
    const daysDifference = differenceInDays(new Date(), commentDate)
    const hoursDifference = differenceInHours(new Date(), commentDate)

    return (
      <p
        className={cn('text-xs text-muted-foreground', className)}
        ref={ref}
        {...props}
      >
        {daysDifference > 1
          ? format(commentDate, 'PP')
          : hoursDifference > 1
            ? format(commentDate, 'p')
            : formatDistance(commentDate, new Date(), { addSuffix: false, includeSeconds: true })}
      </p>
    )
  }
)

// Comment Item Top User
export interface CommentItemTopUserProps extends React.HTMLProps<HTMLDivElement> {
  user: TaggedUserType
}

export const CommentItemTopUser = React.forwardRef<HTMLDivElement, CommentItemTopUserProps>(
  ({ user, className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center justify-start gap', className)}
        ref={ref}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            <CommentProfile user={user}>
              <Button
                variant={'link'}
                className="text-sm font-medium h-fit p-0"
              >
                {user.name}
              </Button>
            </CommentProfile>

            <Button
              variant="ghost"
              size="icon"
              className="!size-5 !bg-transparent"
              label={{
                children: 'Verified',
                showLabel: true,
                className: 'text-sm',
                side: 'top',
              }}
            >
              <BadgeCheck className={cn('size-5', 'text-background fill-blue-400')} />
            </Button>
            {user.badge &&
              user.badge.map(item => (
                <Button
                  key={item.id}
                  variant="outline"
                  size="icon"
                  className="!size-5 !bg-transparent overflow-hidden"
                  label={{
                    children: '@' + item.title,
                    showLabel: true,
                    className: 'text-sm',
                    side: 'top',
                  }}
                >
                  <img
                    src={item.imgUrl}
                    className={cn('size-4')}
                  />
                </Button>
              ))}
          </>
        )}
      </div>
    )
  }
)

// Comment Bottom
export interface CommentBottom extends React.HTMLProps<HTMLFormElement> {}

export const CommentBottom = React.forwardRef<HTMLFormElement, CommentBottom>(
  ({ className, children, onSubmit, ...props }, ref) => {
    return (
      <form
        className={cn(
          'flex items-center justify-center border-t border-border border-solid gap-2 px-4 py-3 relative',
          className
        )}
        ref={ref}
        onSubmit={e => {
          e.preventDefault()
          onSubmit && onSubmit(e)
        }}
        {...props}
      >
        {children}
      </form>
    )
  }
)

// Comment Scroll Tracker
export const CommentScrollTracker = () => {
  const { comments } = React.useContext(CommentContext)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  const bottomRef = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={bottomRef}
      className="h-4"
    />
  )
}

// Comment Input
export interface CommentInputProps extends React.HTMLProps<HTMLDivElement> {
  showOriginal?: boolean
}

export const CommentInput = React.forwardRef<HTMLDivElement, CommentInputProps>(
  ({ className, children, showOriginal = true, ...props }, ref) => {
    const { currentCommentContent, setCurrentCommentContent } = React.useContext(CommentContext)
    const { recording } = useAudioDataProvider()

    return (
      <div
        className={cn('relative w-full', className)}
        ref={ref}
        {...props}
      >
        {showOriginal && (
          <Input
            disabled={recording}
            placeholder="Write a comment..."
            value={currentCommentContent}
            onChange={e => {
              setCurrentCommentContent(e.target.value)
            }}
            className={cn('font-medium resize-none py-1 h-8 w-full')}
            name=""
          />
        )}
        {children}
      </div>
    )
  }
)

// Comment Bottom Buttons
export interface CommentBottomButtonsProps extends React.HTMLProps<HTMLDivElement> {}

export const CommentBottomButtons = React.forwardRef<HTMLDivElement, CommentBottomButtonsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex tems-center justify-center')}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// Comment Attachments
export interface CommentsAttachmentsProps extends React.ComponentPropsWithoutRef<typeof Button> {}

export const CommentsAttachments = React.forwardRef<HTMLDivElement, CommentBottomButtonsProps>(
  ({ className, children, ...props }, ref) => {
    const { recordings } = useAudioDataProvider()

    return (
      <div
        className={cn('absolute bottom-6 w-full', className)}
        ref={ref}
        {...props}
      >
        <Popover>
          <PopoverTrigger className={cn('')}>
            <Button
              size={'sm'}
              className={cn(
                'absolute left-0 gap-2 flex items-center h-fit py-1 transition-all duration-400 ease-out',
                recordings.length > 0
                  ? 'bottom-4 opacity-100 pointer-events-all'
                  : '-bottom-4 opacity-0 pointer-events-none'
              )}
              icon={{
                children: Paperclip as LucideIcon,
                className: '!size-[.8rem]',
              }}
              label={{
                children: recordings.length,
              }}
            >
              <span className="text-xs">Attachments</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="top"
            className={cn('p-2 mb-1 w-full')}
          >
            <ScrollArea>
              <div className="grid items justify-start gap-2 shrink-0 w-full grid-cols-2 max-h-[104px]">
                {children
                  ? children
                  : recordings.map((recording, index) => (
                      <CommentAttachmentItem
                        key={index}
                        blob={recording}
                      />
                    ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

// Comment Attachment Item
export interface CommentAttachmentItemProps extends React.HTMLProps<HTMLDivElement> {
  blob: Blob
}

export const CommentAttachmentItem = React.forwardRef<HTMLDivElement, CommentAttachmentItemProps>(
  ({ className, blob, key, children, ...props }, ref) => {
    const { setRecordings } = useAudioDataProvider()

    return (
      <div
        className={cn(
          'rounded-md bg-secondary/50 h-fit flex items-center justify-start gap-2 w-[152px] p-2 relative',
          className
        )}
        ref={ref}
        {...props}
      >
        <CommentClose
          className="absolute top-1/2 -translate-y-1/2 right-2"
          onClick={() => {
            setRecordings(prev => prev.filter(item => item !== blob))
          }}
        />
        {children ? (
          children
        ) : (
          <>
            <FileAudio />
            <div>
              <p className="text-xs text-muted-foreground truncate">{blob.type}</p>
              <p className="text-xs text-muted-foreground truncate">{filesize(+blob.size, { round: 0 })}</p>
            </div>
          </>
        )}
      </div>
    )
  }
)

// Comment Send Button
export interface CommentSendButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}

export const CommentSendButton = React.forwardRef<HTMLButtonElement, CommentSendButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { mention, editContent, setMdxContent } = React.useContext(MDXContext)
    const { setComments, currentCommentContent, setCurrentCommentContent } = React.useContext(CommentContext)
    const { recording } = useAudioProvider()
    const { recordings, setRecordings } = useAudioDataProvider()
    const attachments = recordings.map(r => ({
      id: uuidv7(),
      url: r,
      type: 'audio',
      filename: 'audio.mp3',
      size: r.size.toString(),
    }))

    const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const newComment: CommentType = {
        id: uuidv7(),
        user: users[1],
        attachments: attachments,
        content: currentCommentContent,
        likes: {
          amount: 0,
          users: [],
        },
        createdAt: new Date().toString(),
      }

      setComments &&
        setComments(prev => {
          return [...prev, newComment]
          //               if (currentCommentContent || recording) {
          // } else if (editContent) {
          //   return [editContent]
          // }

          return prev
        })

      setCurrentCommentContent('')
      setRecordings([])
      onClick && onClick(e)
    }

    return children ? (
      children
    ) : (
      <Button
        size={'icon'}
        variant={'outline'}
        className={cn(
          'rounded-full relative transition-all duration-300 origin-center w-8 h-8 m-auto bg-secondary/20',
          !recording
            ? 'scale-1 opacity-1 ml-2 translate-x-0'
            : '-translate-x-[126%] w-0 h-0 pointer-events-none opacity-0 invisible ml-0',
          className
        )}
        icon={{
          className: cn(recording ? 'scale-0 opacity-0' : 'scale-100 opacity-100'),
          children: editContent ? Check : ArrowBigUp,
        }}
        type="submit"
        disabled={recordings.length === 0}
        onClick={onClickHandler}
        ref={ref}
        {...props}
      />
    )
  }
)

//FIX: Comment Placeholder
export const CommentPlaceholder = ({ user }: { user: TaggedUserType }) => {
  const { comments: newComments } = React.useContext(CommentContext)

  return (
    <>
      {newComments.map((comment, idx) => {
        const mine = user.id == comment.user.id
        return (
          <CommentItem
            key={comment.id}
            className={cn(mine && '')}
          >
            <CommentItemSide user={comment.user} />
            <CommentItemBody>
              <CommentItemTop>
                <div className="flex items-center justify-start w-full gap-2">
                  <CommentItemTopUser user={comment.user} />
                  <CommentItemDate date={comment.createdAt} />
                </div>
                <LikeButton
                  onClick={({ e, state }) => {}}
                  likes={comment.likes}
                  user={comment.user}
                />
              </CommentItemTop>
              <CommentItemContent
                content={comment.content}
                attachments={comment.attachments}
              />
              <CommentItemBottom comment={comment} />
            </CommentItemBody>
          </CommentItem>
        )
      })}
    </>
  )
}

//FIX: Comment Item Content
export const CommentItemContent = ({ content, attachments }: { content: string; attachments: Attachment[] }) => {
  console.log(attachments)
  return (
    <div className="mdx__minimal__text__editor border-none flex flex-col gap-3 mb-2">
      {content && (
        <p
          className={cn('text-sm  tiptap ProseMirror')}
          dangerouslySetInnerHTML={{ __html: content }}
        ></p>
      )}
      {attachments &&
        attachments.map((item, idx) => {
          return item.type === 'audio' ? (
            <AudioItem
              key={idx}
              content={item.url as string}
            />
          ) : (
            item.type === 'image' && (
              <img
                className="w-1/2 rounded-md object-cover"
                key={idx}
                src={item.url as string}
              />
            )
          )
        })}
    </div>
  )
}

// FIX: Comment Item Bottom
export const CommentItemBottom = ({ comment }: { comment: CommentType }) => {
  const { mention, setMention } = React.useContext(MDXContext)

  return (
    <div className="flex items-center justify-center gap-2  mt-1 mb-1">
      <Button
        size={'sm'}
        variant={'ghost'}
        className="h-7 w-14 text-foreground/70 text-xs"
        onClick={() => {
          // setEditorFocus && setEditorFocus(prev => !prev)
          setMention(comment.user)
        }}
      >
        Reply
      </Button>

      <DropdownMenuView
        trigger={{
          icon: { children: Ellipsis, className: 'h-4 w-4 rounded' },
          variant: 'ghost',
          size: 'icon',
          className: 'h-4 w-6',
        }}
        content={{
          options: {
            itemType: 'label',
            optionsData: optionsData({ currentComment: comment }),
          },
        }}
      />
    </div>
  )
}

const optionsData = ({ currentComment }: { currentComment: CommentType }) => {
  const { setEditContent } = React.useContext(MDXContext)
  const { setComments } = React.useContext(CommentContext)

  return [
    {
      children: 'Edit',
      onClick: () => {
        setEditContent(currentComment)
      },
    },
    {
      children: 'Report',
      icon: {
        children: Bug,
      },
    },
    {
      children: 'Delete',
      command: { label: '⌘⌫', key: 'a' },
      icon: {
        children: Trash2,
      },
      className: '[&_span]:text-red-500 text-red-500 [&_span]:hover:text-primary',
      onClick: () => setComments(prev => prev.filter(c => c.id !== currentComment.id)),
    },
  ] as DropdownMenuOptionsDataType<string, true>[]
}

export interface CommentExtraButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}

export const CommentExtraButton = React.forwardRef<HTMLButtonElement, CommentExtraButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <PopoverWrapper
        trigger={{
          children: (
            <Button
              icon={{ children: Plus, className: 'h-4 w-4 rounded' }}
              className="rounded-full h-8 w-8 bg-secondary/20 mr-2"
              variant="outline"
              size="icon"
              ref={ref}
            />
          ),
        }}
        content={{
          side: 'top',
          align: 'center',
          className: 'w-fit p-2',
          children: <CommentAttachmentUpload />,
        }}
      />
    )
  }
)

const ExtraButtons = () => {
  const { setEditContent } = React.useContext(MDXContext)
  const { setComments } = React.useContext(CommentContext)

  return [
    {
      children: <CommentAttachmentUpload />,
    },
  ] as DropdownMenuOptionsDataType<string, true>[]
}
export type AttachmentType = {
  id: string
  file: File
  url?: string | undefined
  name: string
  type: string
  size: string
  progress: number
  status: string
}

// Define an enum for file types
enum FileType {
  Audio = 'audio',
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Unknown = 'unknown',
}

// Mapping file types to their corresponding Lucide icons
const fileTypeIcons = {
  [FileType.Audio]: <FileAudio className="w-8 h-8" />,
  [FileType.Text]: <FileText className="w-8 h-8" />,
  [FileType.Image]: <FileImage className="w-8 h-8" />,
  [FileType.Video]: <FileVideo className="w-8 h-8" />,
  [FileType.Unknown]: <File className="w-8 h-8" />,
}

// Function to determine the file type based on the file's MIME type
const getFileType = (file: File): FileType => {
  if (file.type.startsWith('audio/')) return FileType.Audio
  if (file.type.startsWith('text/')) return FileType.Text
  if (file.type.startsWith('image/')) return FileType.Image
  if (file.type.startsWith('video/')) return FileType.Video
  return FileType.Unknown
}

export interface CommentAttachmentUploadProps extends React.ComponentPropsWithoutRef<typeof Button> {}
export const CommentAttachmentUpload = React.forwardRef<HTMLButtonElement, CommentAttachmentUploadProps>(
  ({ className, children, ...props }, ref) => {
    const { attachments, setAttachments } = React.useContext(CommentContext)
    const [attachmentsState, setAttachmentsState] = React.useState<AttachmentType[]>([])

    const handleAttachment = ({
      e,
      setAttachmentsState,
    }: {
      e: React.ChangeEvent<HTMLInputElement>
      setAttachmentsState: React.Dispatch<React.SetStateAction<AttachmentType[]>>
    }) => {
      const files = e.currentTarget.files

      if (!files) return toast.error('Please select a file')

      // Optional: Uncomment to limit to 5 files
      if (files.length + files.length > 10) return toast.error('You can not upload more than 5 files at once')

      const newAttachments: AttachmentType[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check for unacceptable file types
        // if (!supportedFileTypes.includes(file.type)) {
        //   return toast.error(`File type not supported: ${file.type}`);
        // }

        // Check if file size exceeds limit
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File has exceeded the max size: ${file.name.slice(0, 15)}...`)
          continue // Skip this file and continue with the next
        }

        const attachment: AttachmentType = {
          id: uuidv7(),
          file: file,
          name: file.name,
          type: file.type,
          size: file.size.toString(),
          progress: 0,
          status: 'pending',
        }

        newAttachments.push(attachment)
      }

      // Update state with new attachments
      setAttachmentsState(prev => [...prev, ...newAttachments])
      e.currentTarget.value = ''
    }

    return (
      <AlertDialogCustom<typeof attachmentsState.length>
        type="sheet"
        drawerData={attachmentsState.length > 0}
        header={{
          head: 'Upload File',
          description: 'Set your daily calorie goal',
        }}
        actions={
          {
            // cancel: () => {
            //   setAttachmentsState([])
            // },
            // continue: () => {
            //   setAttachments(prev => [...prev, ...attachmentsState])
            // },
          }
        }
        footer={{
          className: 'Upload an attachment to your comment.',
          // submit: (
          //   <Button
          //     variant="default"
          //     onClick={() => {
          //       setAttachments(prev => [...prev, ...attachmentsState])
          //       setAttachmentsState([])
          //     }}
          //   >
          //     Submit
          //   </Button>
          // ),
          // cancel: <Button variant="outline">Cancel</Button>,
        }}
        state={attachmentsState.length}
        trigger={{
          children: (
            <Button
              variant="outline"
              className="h-8 w-8 bg-secondary/20"
              {...props}
            >
              <Upload className="h-4 w-4" />
            </Button>
          ),
        }}
        content={{
          children: (
            <div className="flex flex-col h-full gap-4">
              <div>
                <ContextMenu>
                  <ContextMenuTrigger className="relative flex flex-col items-center justify-center w-full h-64 rounded-md border-2 border-dashed border-current dashed-border text-sm leading-5 transition-colors duration-100 ease-in-out hover:bg-muted/10">
                    <div className="grid place-items-center gap-4">
                      <Upload className="size-[30px]" />
                      <span>Click to upload</span>
                    </div>
                    <Input
                      placeholder="Filter emails..."
                      type="file"
                      value={''}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                      multiple={true}
                      onChange={e => handleAttachment({ e, setAttachmentsState })}
                      // accept={supportedFileTypes.join('')}
                    />
                  </ContextMenuTrigger>
                </ContextMenu>
                <p className="mt-2 text-muted-foreground text-[.9rem]"> Supports all file types.</p>
              </div>

              <ScrollArea className="flex flex-col gap-2 max-h-[600px]">
                <div className="flex flex-col gap-2">
                  {attachmentsState.map((attachment, index) => {
                    const fileType = getFileType(attachment.file)
                    return (
                      <div
                        className="relative flex items-center gap-4 bg-secondary/20 rounded-md p-2"
                        key={attachment.id}
                      >
                        <CommentClose
                          className="absolute top-1/2 -translate-y-1/2 right-2"
                          onClick={() => {
                            setAttachmentsState(prev => prev.filter(item => item.id !== attachment.id))
                          }}
                        />

                        <div className="flex items-center gap-4">
                          <div className="relative">{fileTypeIcons[fileType]}</div>
                          <div className="grid items-start">
                            <h3 className="inline-block text-[.9rem] truncate max-w-[300px]">{attachment.file.name}</h3>
                            <p className="inline-block truncate text-semibold text-[.8rem] max-w-[300px]">
                              {filesize(+attachment.file.size, { round: 0 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          ),
        }}
      />
    )
  }
)
