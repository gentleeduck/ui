import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@gentleduck/registry-ui-duckui/tooltip'

export default function Tooltip1Demo() {
  return (
    <Tooltip>
      <TooltipTrigger>Hover</TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}
