import { Button } from '@/registry/registry-ui-components'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/registry/registry-ui-components/tooltip'

export default function Tooltip1Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
