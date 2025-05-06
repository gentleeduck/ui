'use client'

import { cn } from '@/lib'
import { MDXProvider } from '@/registry/default/example/mdx-context-provider'
import { comments, users } from '@/registry/default/example/SwapyMainDemo'
import { AvatarCustom, CommentType } from '@/registry/default/ui'
import { Audio, AudioDataProvider, AudioDelete, AudioStart, AudioTimer } from '@/registry/default/ui/audio-record'
import {
  CommentExtraButton,
  CommentContent,
  CommentItem,
  CommentScrollTracker,
  CommentSendButton,
  CommentBottomButtons,
  CommentPlaceholder,
  CommentsAttachments,
  CommentItemContent,
  CommentItemBottom,
  CommentItemTop,
  CommentItemBody,
  CommentInput,
  Comment,
  CommentTop,
  CommentTitle,
  CommentClose,
  CommentItemSide,
  CommentItemTopUser,
  CommentItemDate,
  CommentAvater,
  CommentBottom,
  CommentProfile,
} from '@/registry/default/ui/comment'
import { LikeButton } from '@/registry/default/ui/custom-buttons'
import { UploadProvider } from '@/registry/default/ui/upload'
import { BadgeCheck, CalendarDays } from 'lucide-react'
import React from 'react'
import { Button } from '@/registry/registry-ui-components/button'

export default function IndexPage() {
  // <AudioProvider></AudioProvider>
  return (
    <>
      <div className="flex items-start gap-4 p-4 justify-center select-none container mt-12  place-items-center">
        <MDXProvider>
          <UploadProvider>
            <AudioDataProvider>
              <CommentTest />
            </AudioDataProvider>
          </UploadProvider>
        </MDXProvider>
      </div>
    </>
  )
}
// <MDXMinimalTextEditor
//     className={cn('w-full font-medium h-42')}
//     name="comment"
//     valid={true}
// /
// >

const CommentTest = () => {
  return (
    <Comment>
      <CommentTop>
        <CommentTitle>Comments</CommentTitle>
        <CommentClose />
      </CommentTop>
      <CommentContent length={comments.length}>
        <div className="comments flex flex-col justify-end">
          {comments.map((comment, idx) => {
            return <CommentItemDemo key={comment.id} comment={comment} />
          })}
          <CommentPlaceholder>
            {({ comment }: { comment: CommentType }) => <CommentItemDemo comment={comment} />}
          </CommentPlaceholder>
        </div>
        <CommentScrollTracker />
      </CommentContent>
      <CommentBottom>
        <CommentAvater
          className="w-8 h-8 border-none"
          avatar_image={{
            src: users[1].avatarUrl,
          }}
          fallback={{
            children: users[1].name?.[0],
            className: 'w-8 h-8 bg-secondary/20',
          }}
        />
        <CommentInput>
          <CommentsAttachments />
        </CommentInput>
        <Audio>
          <CommentBottomButtons>
            <AudioTimer />
            <CommentExtraButton />
            <AudioDelete />
            <AudioStart />
            <CommentSendButton />
          </CommentBottomButtons>
        </Audio>
      </CommentBottom>
    </Comment>
  )
}

const CommentItemDemo = ({ comment }: { comment: CommentType }) => {
  const mine = users[0].id == comment.user.id
  return (
    <>
      <CommentItem className={cn(mine && '')}>
        <CommentItemSide>
          <CommentProfileDemo comment={comment} type="avatar" />
        </CommentItemSide>
        <CommentItemBody>
          <CommentItemTop>
            <div className="flex items-center justify-start w-full gap-2">
              <CommentItemTopUser user={comment.user}>
                <CommentProfileDemo comment={comment} type="name" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="!size-5 !bg-transparent"
                  label={{
                    children: 'Verified',
                    showLabel: true,
                    className: 'text-sm',
                    side: 'top',
                  }}>
                  <BadgeCheck className={cn('size-5', 'text-background fill-blue-400')} />
                </Button>
                {comment.user.badge &&
                  comment.user.badge.map((item) => (
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
                      }}>
                      <img src={item.imgUrl} className={cn('size-4')} />
                    </Button>
                  ))}
              </CommentItemTopUser>
              <CommentItemDate date={comment.createdAt} />
            </div>
            <LikeButton onClick={({ e, state }) => {}} likes={comment.likes} user={comment.user} />
          </CommentItemTop>
          {/*FIX: MAKE THIS CONTENT DYNAMIC */}{' '}
          <CommentItemContent content={comment.content} attachments={comment.attachments} />
          <CommentItemBottom comment={comment} />
        </CommentItemBody>
      </CommentItem>
    </>
  )
}

const CommentProfileDemo = ({ comment, type = 'avatar' }: { comment: CommentType; type: 'avatar' | 'name' }) => {
  return (
    <>
      <CommentProfile
        children={
          type === 'avatar' ? (
            <CommentAvater
              className="w-8 h-8 border-none"
              avatar_image={{
                src: comment.user.avatarUrl,
                className: 'm-0 border-none object-cover curosor-pointer',
              }}
              fallback={{
                className: 'bg-secondary/20',
              }}
            />
          ) : (
            <Button variant={'link'} className="text-sm font-medium h-fit p-0">
              {comment.user.name}
            </Button>
          )
        }
        hoverContent={
          <div className="flex items-start gap-4">
            <CommentAvater
              className="w-12 h-12 border-none"
              avatar_image={{
                src: comment.user.avatarUrl,
                className: 'm-0 border-none object-cover curosor-pointer',
              }}
              fallback={{
                className: 'bg-secondary/20',
              }}
            />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@{comment.user.name}</h4>
              <p className="text-sm">I'am a Software Engineer from Egypt.</p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">Joined May 2021</span>
              </div>
            </div>
          </div>
        }
      />
    </>
  )
}

// <CommentExtraButton />
// {
// <Kanban
//   initData={initData}
//   kanbanColumnHeader={{
//     children: KanbanColumnHeaderTemplate,
//     // className: 'bg-red-500'
//   }}
//   kanbanColumnAddRow={{ children: KanbanColumnAddRowTemplate }}
//   kanbanColumnRow={{
//     children: KanbanColumnRowTemplate,
//
//     options: {
//       // draggingOnOriginStyle: 'bg-red-500',
//       // draggingOutStyle: 'bg-green-500',
//       // draggingOverNoColumnStyle: 'bg-purple-500',
//     },
//   }}
// />
// }
