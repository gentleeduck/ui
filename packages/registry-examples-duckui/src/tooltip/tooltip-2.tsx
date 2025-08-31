import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'

export default function Tooltip2Demo() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip Content</TooltipContent>
    </Tooltip>
  )
}
