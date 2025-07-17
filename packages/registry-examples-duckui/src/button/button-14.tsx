import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import React from 'react'

export default function Button14Demo() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Button aria-label="Inbox button with 23 notifications" type="button" role="button">
            Button
          </Button>
        </TooltipTrigger>
        <TooltipContent> Inbox has 23 message </TooltipContent>
      </Tooltip>
    </>
  )
}
