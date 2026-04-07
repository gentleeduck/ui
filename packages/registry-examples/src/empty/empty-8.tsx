'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  EmptyHeader,
  MotionEmpty,
  MotionEmptyContent,
  MotionEmptyDescription,
  MotionEmptyMedia,
  MotionEmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconInbox } from '@tabler/icons-react'

export default function Demo() {
  return (
    <MotionEmpty>
      <EmptyHeader>
        <MotionEmptyMedia variant="icon">
          <IconInbox />
        </MotionEmptyMedia>
        <MotionEmptyTitle>Your Inbox is Empty</MotionEmptyTitle>
        <MotionEmptyDescription>
          No messages waiting for you. New conversations will show up here when someone reaches out.
        </MotionEmptyDescription>
      </EmptyHeader>
      <MotionEmptyContent>
        <div className="flex gap-2">
          <MotionButton>Compose Message</MotionButton>
          <MotionButton variant="outline">View Archived</MotionButton>
        </div>
      </MotionEmptyContent>
    </MotionEmpty>
  )
}
