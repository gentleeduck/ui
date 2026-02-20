import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { Info } from 'lucide-react'

export default function Badge8Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge arial-label="Badge" className="rounded-full" size="icon" variant="outline">
            <Info />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Info Badge</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
