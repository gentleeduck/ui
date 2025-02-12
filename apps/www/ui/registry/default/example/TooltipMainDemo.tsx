import { buttonVarieties } from '@/hooks/use-varieties'
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/'
import { useAtom } from 'jotai'

export default function TooltipDemo() {
  //NOTE: that's a state in the example
  const [variety] = useAtom(buttonVarieties)
  //NOTE: you will use your own variables not this state in the example
  const { duration } = variety.default.variety!

  return (
    <TooltipProvider>
      <Tooltip delayDuration={duration}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
