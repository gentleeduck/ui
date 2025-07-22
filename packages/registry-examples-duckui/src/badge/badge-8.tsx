import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { Info } from 'lucide-react'

export default function Badge8Demo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge arial-label="Badge" variant={'outline'} size={'icon'} className="rounded-full">
          <Info />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>Info Badge</TooltipContent>
    </Tooltip>
  )
}
