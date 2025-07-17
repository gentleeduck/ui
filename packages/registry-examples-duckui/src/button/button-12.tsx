import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import React from 'react'

export default function Button12Demo() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Button aria-label="Inbox button with 23 notifications" type="button" role="button">
            Button
          </Button>
        </TooltipTrigger>
        <TooltipContent side={'right'}>
          <Badge className="rounded-md">23</Badge>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
