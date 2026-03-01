import { Button } from '@gentleduck/registry-ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function TooltipRtlDemo() {
  return (
    <TooltipProvider dir="rtl">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">{'تمرير'}</Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>{'أضف إلى المكتبة'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
