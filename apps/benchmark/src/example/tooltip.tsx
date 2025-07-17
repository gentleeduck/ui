// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'

export default function TooltipDemo() {
  return (
    <div className="h-[2000px] mt-[400px]">
      <Tooltip>
        <TooltipTrigger className="bg-transparent p-0 shadow-none rounded-border">
          <Input />
        </TooltipTrigger>
        <TooltipContent side={'top'}>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </div>
    // <TooltipProvider delayDuration={0}>
    // </TooltipProvider>
  )
}
