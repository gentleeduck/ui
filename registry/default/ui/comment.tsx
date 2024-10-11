import React from 'react'
import { Attachment, CommentType, TaggedUserType } from './swapy'
import { differenceInDays, differenceInHours, format, formatDistance } from 'date-fns'
import { cn } from '@/lib'
import { AvatarCustom } from './avatar'
import { ScrollArea } from './scroll-area'
import { Button } from './button'
import {
  ArrowBigUp,
  Bug,
  Check,
  Ellipsis,
  FileAudio,
  LucideIcon,
  Mic,
  Paperclip,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import { uuidv7 } from 'uuidv7'
import { DropdownMenuOptionsDataType, DropdownMenuView } from './dropdown-menu'

import 'highlight.js/styles/tokyo-night-dark.css'
import { MDXContext, CommentsContext } from '../example/mdx-context-provider'
import { AudioItem, useAudioDataProvider, useAudioProvider } from './audio-record'
import { LikeButton } from './custom-buttons'
import { CommentClose, users } from '../example/SwapyMainDemo'
import { PopoverWrapper } from './popover'

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

export interface CommentItemProps extends React.HTMLProps<HTMLDivElement> {
  mine: boolean
  comment: CommentType
  showNestedShapes?: boolean
}

export const CommentItem: React.FC<CommentItemProps> = ({ showNestedShapes, mine, comment, className, ...props }) => {
  return (
    <>
      <div
        className={cn('comment flex mt-1', className)}
        {...props}
      >
        <CommentAvatar user={comment.user} />
        <div className="flex flex-col items-start justify-start w-full">
          <CommentTop comment={comment} />
          <CommentItemContent
            content={comment.content}
            attachments={comment.attachments}
          />
          <CommentBottom comment={comment} />
        </div>
      </div>
    </>
  )
}

export const CommentTop = ({ comment }: { comment: CommentType }) => {
  const commentDate = new Date(comment.createdAt!)
  const daysDifference = differenceInDays(new Date(), commentDate)
  const hoursDifference = differenceInHours(new Date(), commentDate)

  return (
    <div className="flex items-center justify-start w-full gap-2 mb-2">
      <div className="flex items-center justify-start w-full gap-2">
        <p className="text-sm font-medium">{comment.user.name}</p>
        <p className="text-xs text-muted-foreground">
          {daysDifference > 1
            ? format(commentDate, 'PP')
            : hoursDifference > 1
              ? format(commentDate, 'p')
              : formatDistance(commentDate, new Date(), { addSuffix: false, includeSeconds: true })}
        </p>
      </div>
      <LikeButton
        onClick={({ e, state }) => {}}
        likes={comment.likes}
        user={comment.user}
      />
    </div>
  )
}
export const CommentItemContent = ({ content, attachments }: { content: string; attachments: Attachment[] }) => {
  console.log(attachments)
  return (
    <div className="mdx__minimal__text__editor border-none flex flex-col gap-3">
      <p
        className={cn('text-sm  tiptap ProseMirror')}
        dangerouslySetInnerHTML={{ __html: content }}
      ></p>
      {attachments &&
        attachments.map((item, idx) => {
          return item.type === 'audio' ? (
            <AudioItem
              key={idx}
              content={item.url}
            />
          ) : (
            item.type === 'image' && (
              <img
                className="w-1/2 rounded-md object-cover"
                key={idx}
                src={item.url}
              />
            )
          )
        })}
    </div>
  )
}

export const CommentAvatar = ({ user }: { user: TaggedUserType }) => {
  return (
    <div className={cn('flex flex-col flex-shrink-0 basis-8 flex-grow-0 items-center mr-2')}>
      <div className="top-shape w-[2px] max-h-2 bg-border flex-grow border-border border flex basis-auto flex-col items-stretch my-1"></div>
      <AvatarCustom
        className="w-8 h-8"
        hover_card={user}
        avatar_image={{
          src: user.avatarUrl,
        }}
        fallback={{
          className: 'w-8 h-8',
        }}
      />
      <div className="bottom-shape w-[2px] bg-border flex-grow border-border border flex basis-auto flex-col items-stretch mt-1"></div>
    </div>
  )
}

export const CommentScrollTracker = () => {
  const { comments } = React.useContext(CommentsContext)

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

const CommentItemMemo = React.memo(CommentItem)
export const CommentsPlaceholder = ({ user }: { user: TaggedUserType }) => {
  const { comments: newComments } = React.useContext(CommentsContext)

  return (
    <>
      {newComments.map((comment, idx) => {
        const mine = user.id == comment.user.id
        return (
          <CommentItemMemo
            key={comment.id}
            mine={mine}
            className={cn(mine && '')}
            comment={comment}
            showNestedShapes={newComments.length === idx + 1 ? false : true}
          />
        )
      })}
    </>
  )
}

export const CommentBottom = ({ comment }: { comment: CommentType }) => {
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
  const { setComments } = React.useContext(CommentsContext)

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

export interface CommentSendButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}
export const CommentSendButton = React.forwardRef<HTMLButtonElement, CommentSendButtonProps>(
  ({ className, onClick, ...props }, ref) => {
    const { mention, editContent, setMdxContent } = React.useContext(MDXContext)
    const { setComments, currentCommentContent, setCurrentCommentContent } = React.useContext(CommentsContext)
    const { recording } = useAudioProvider()
    const { recordings, setRecordings } = useAudioDataProvider()
    const attachments = recordings.map(r => ({
      id: uuidv7(),
      url: r,
      type: 'audio',
      filename: 'audio.mp3',
      size: r.size.toString(),
    }))

    return (
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
        onClick={e => {
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
        }}
        ref={ref}
        {...props}
      />
    )
  }
)

export interface CommentsAttachmentsProps extends React.ComponentPropsWithoutRef<typeof Button> {}
export const CommentsAttachments = React.forwardRef<HTMLDivElement, CommentBottomButtonsProps>(
  ({ className, children, ...props }, ref) => {
    const { recordings } = useAudioDataProvider()

    return (
      <div className={cn('absolute bottom-6 w-full', className)}>
        <PopoverWrapper
          wrapper={
            {
              // open: open,
            }
          }
          trigger={{
            children: (
              <Button
                size={'sm'}
                className={cn(
                  'absolute left-0 gap-2 flex items-center h-fit py-1 transition-all duration-400 ease-out',
                  recordings.length > 0 ? 'bottom-4 opacity-100' : '-bottom-4 opacity-0'
                )}
                icon={{
                  icon: Paperclip as LucideIcon,
                  className: '!size-[.8rem]',
                }}
                label={{
                  children: recordings.length,
                }}
              >
                <Paperclip className="!size-[.8rem]" /> <span className="text-xs">Attachments</span>{' '}
              </Button>
            ),
          }}
          content={{
            className: 'w-fit p-2 mb-1 w-full',
            align: 'start',
            side: 'top',
            children: (
              <ScrollArea className="">
                <div className="grid items justify-start gap-2 shrink-0 w-full grid-cols-2 max-h-[104px]">
                  {recordings.map((recording, index) => (
                    <CommentAttachmentItem
                      key={index}
                      blob={recording}
                    />
                  ))}
                </div>
              </ScrollArea>
            ),
          }}
        />
      </div>
    )
  }
)

export interface CommentAttachmentItemProps extends React.HTMLProps<HTMLDivElement> {
  blob: Blob
}

export const CommentAttachmentItem = React.forwardRef<HTMLDivElement, CommentAttachmentItemProps>(
  ({ className, blob, key, ...props }, ref) => {
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
          className="absolute top-2 right-2"
          onClick={() => {
            setRecordings(prev => prev.filter(item => item !== blob))
          }}
        />
        <FileAudio />
        <div>
          <p className="text-xs text-muted-foreground truncate">{blob.type}</p>
          <p className="text-xs text-muted-foreground">{blob.size}</p>
        </div>
      </div>
    )
  }
)

export interface CommentExtraButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}
export const CommentExtraButton = React.forwardRef<HTMLButtonElement, CommentExtraButtonProps>(
  ({ className, ...props }, ref) => {
    const firstFocusableElement = React.useRef<HTMLDivElement>(null)
    return (
      <PopoverWrapper
        trigger={{
          children: (
            <Button
              type="button"
              label={{
                children: 'Extra',
                showLabel: true,
                side: 'top',
              }}
              icon={{ children: Plus }}
              variant="outline"
              className="rounded-full h-8 w-8 bg-secondary/20"
            />
          ),
        }}
        content={{
          className: 'w-fit p-2',
          children: (
            <div className="flex items justify-start gap-1 shrink-0">
              <button onFocusCapture={event => event.preventDefault()} />
              <CommentRecordButton />

              <Button
                variant="ghost"
                className={cn('editor_button p-0', 'aictive')}
                label={{
                  children: 'Upload Attachment',
                  showLabel: true,
                  side: 'top',
                }}
                icon={{ children: Upload }}
              />
            </div>
          ),
        }}
      />
    )
  }
)

export const CommentRecordButton = () => {
  return (
    <>
      <PopoverWrapper
        trigger={{
          children: (
            <Button
              variant="ghost"
              className={cn('editor_button p-0', 'aictive')}
              label={{
                children: 'Record Audio',
                showLabel: true,
                side: 'top',
              }}
              icon={{ children: Mic }}
            />
          ),
        }}
        content={{
          className: 'w-fit p-2',
          children: (
            <div className="flex items justify-start gap-1 shrink-0">
              <AudioRecorder />
            </div>
          ),
        }}
      />
    </>
  )
}

export interface CommentBottomButtonsProps extends React.HTMLProps<HTMLFormElement> {}
export const CommentBottomButtons = React.forwardRef<HTMLFormElement, CommentBottomButtonsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form
        className={cn('flex tems-center justify-center')}
        {...props}
        ref={ref}
      >
        {children}
      </form>
    )
  }
)
