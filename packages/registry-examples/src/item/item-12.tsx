'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  MotionItem,
  MotionItemGroup,
} from '@gentleduck/registry-ui/item'
import { FileTextIcon, InboxIcon, StarIcon } from 'lucide-react'

export default function Demo() {
  return (
    <MotionItemGroup className="w-full max-w-md">
      <MotionItem variant="outline" index={0}>
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Inbox</ItemTitle>
          <ItemDescription>3 unread messages waiting for review.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <MotionButton size="sm" variant="outline">Open</MotionButton>
        </ItemActions>
      </MotionItem>
      <MotionItem variant="outline" index={1}>
        <ItemMedia variant="icon">
          <StarIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Starred</ItemTitle>
          <ItemDescription>Items you have marked as important.</ItemDescription>
        </ItemContent>
      </MotionItem>
      <MotionItem variant="outline" index={2}>
        <ItemMedia variant="icon">
          <FileTextIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Drafts</ItemTitle>
          <ItemDescription>2 drafts saved for later.</ItemDescription>
        </ItemContent>
      </MotionItem>
    </MotionItemGroup>
  )
}
