import { Button } from '@gentleduck/registry-ui/button'
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>

        <TooltipContent side="bottom" arrowPadding={12} className="rounded-xl px-4 py-2 font-semibold">
          <p>Inbox</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
