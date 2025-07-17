import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import React from 'react'

export default function Button13Demo() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Button aria-label="Inbox button with 23 notifications" type="button" role="button">
            Button
          </Button>
        </TooltipTrigger>
        <TooltipContent side={'left'}>23 Notifications</TooltipContent>
      </Tooltip>
    </>
  )
}
