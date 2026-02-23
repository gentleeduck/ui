import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'

export default function TooltipRtlDemo() {
  return (
    <TooltipProvider>
      <Tooltip dir="rtl">
        <TooltipTrigger asChild>
          <Button variant="outline">{'\u062A\u0645\u0631\u064A\u0631'}</Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>{'\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0645\u0643\u062A\u0628\u0629'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
