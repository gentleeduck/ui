import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@gentleduck/registry-ui-duckui/tooltip'

export default function Tooltip1Demo() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}
