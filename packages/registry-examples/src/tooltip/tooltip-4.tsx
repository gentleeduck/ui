import { Toggle } from '@gentleduck/registry-ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { Bold } from 'lucide-react'

export default function Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild disableCloseOnClick>
          <Toggle aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent>
          <p>Toggle bold</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
