'use client'

import { cn } from '@/lib'
import { CommentsContext, CommentsProvider, MDXProvider } from '@/registry/default/example/mdx-context-provider'
import {
  initData,
  KanbanColumnAddRowTemplate,
  KanbanColumnHeaderTemplate,
  KanbanColumnRowTemplate,
  Comment,
  CommentBottom,
  comments,
  users,
  CommentTitle,
  CommentClose,
  CommentTop,
  CommentInput,
} from '@/registry/default/example/SwapyMainDemo'
import { AvatarCustom, Kanban, MDXMinimalTextEditor } from '@/registry/default/ui'
import { Audio, AudioDataProvider, AudioDelete, AudioStart, AudioTimer } from '@/registry/default/ui/audio-record'
import {
  CommentExtraButton,
  CommentContent,
  CommentItem,
  CommentScrollTracker,
  CommentSendButton,
  CommentBottomButtons,
  CommentsPlaceholder,
  CommentsAttachments,
} from '@/registry/default/ui/comment'
import React from 'react'

export default function IndexPage() {
  // <AudioProvider></AudioProvider>
  return (
    <>
      <div className="flex items-start gap-4 p-4 justify-center select-none container mt-12  place-items-center">
        <MDXProvider>
          <CommentTest />
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
    <CommentsProvider>
      <AudioDataProvider>
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
                    mine={mine}
                    className={cn(mine && '')}
                    comment={comment}
                    showNestedShapes={comments.length === idx + 1 ? false : true}
                  />
                )
              })}
              <CommentsPlaceholder user={users[0]} />
            </div>
            <CommentScrollTracker />
          </CommentContent>
          <CommentBottom>
            <AvatarCustom
              className="w-8 h-8 border-none"
              avatar_image={{
                src: 'https://media.licdn.com/dms/image/v2/D4D03AQGLX-Gb_qm3Rw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725258661460?e=2147483647&v=beta&t=sajP4AdQ68WfKRPPirMnLXbn4J1oIOSDBfGnuwqZ6SQ',
              }}
              fallback={{
                className: 'w-8 h-8 bg-secondary/20',
              }}
            />
            <CommentInput>
              <CommentsAttachments />
            </CommentInput>
            <Audio>
              <CommentBottomButtons>
                <AudioTimer />
                <AudioDelete />
                <AudioStart />
                <CommentSendButton />
              </CommentBottomButtons>
            </Audio>
          </CommentBottom>
        </Comment>
      </AudioDataProvider>
    </CommentsProvider>
  )
}

// <CommentExtraButton />
{
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
}
