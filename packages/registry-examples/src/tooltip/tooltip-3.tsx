import { Button } from '@gentleduck/registry-ui/button'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">{'تمرير'}</Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>{'أضف إلى المكتبة'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DirectionProvider>
  )
}
