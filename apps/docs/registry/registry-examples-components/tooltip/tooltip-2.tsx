import { Button } from '@/registry/registry-ui-components'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/registry/registry-ui-components/tooltip'

export default function Tooltip2Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip Content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
