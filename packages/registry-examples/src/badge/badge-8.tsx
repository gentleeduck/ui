import { Badge } from '@gentleduck/registry-ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { Info } from 'lucide-react'

export default function Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge aria-label="Badge" className="rounded-full" size="icon" variant="outline">
            <Info aria-hidden="true" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Info Badge</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
