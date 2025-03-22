import { Button } from '@gentelduck/registry-ui-duckui/button'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@gentelduck/registry-ui-duckui/tooltip'

export default function Tooltip2Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline'>Hover</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip Content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
