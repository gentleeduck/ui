'use client'

import { cn } from '@/lib'
import { MDXProvider } from '@/registry/default/example/mdx-context-provider'
import { comments, users } from '@/registry/default/example/SwapyMainDemo'
import { AvatarCustom } from '@/registry/default/ui'
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
} from '@/registry/default/ui/comment'
import { LikeButton } from '@/registry/default/ui/custom-buttons'
import { UploadProvider } from '@/registry/default/ui/upload'
import React from 'react'

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
            const mine = users[0].id == comment.user.id
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
          <CommentPlaceholder user={users[0]} />
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
