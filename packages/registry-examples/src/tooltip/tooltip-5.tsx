'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { MotionTooltip, MotionTooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <TooltipProvider>
      <MotionTooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>

        <MotionTooltipContent>
          <p>Add to library</p>
        </MotionTooltipContent>
      </MotionTooltip>
    </TooltipProvider>
  )
}
