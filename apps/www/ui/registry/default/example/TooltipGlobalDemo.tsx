import { buttonVarieties } from '@/hooks/use-varieties'
import { Button } from '@/registry'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/registry/default/ui'
import { useAtom } from 'jotai'

export default function TooltipGlobalDemo() {
  //NOTE: that's a state in the example
  const [variety] = useAtom(buttonVarieties)
  //NOTE: you will use your own variables not this state in the example
  const { duration } = variety.default.variety!

  return (
    <TooltipProvider
      delayDuration={duration}
      skipDelayDuration={duration! - 500}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip Content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
